import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4321';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const errors = [];
const warnings = [];
const results = [];

async function walk(directory) {
  const output = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) output.push(...await walk(target));
    else output.push(target);
  }
  return output;
}

function routeFromFile(file) {
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404.html';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
const contentFiles = [];
let redirectPages = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (/<meta\b[^>]*http-equiv=["']refresh["']/iu.test(html)) {
    redirectPages += 1;
    continue;
  }
  contentFiles.push(file);
}
const routes = contentFiles.map(routeFromFile).filter((route) => route !== '/404.html');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });

async function preparePage(page) {
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (url.startsWith(BASE_URL) || url.startsWith('data:') || url.startsWith('blob:')) request.continue();
    else request.abort();
  });
}

async function auditRoute(route, viewport = { width: 1280, height: 900 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await preparePage(page);
  const pageErrors = [];
  const consoleErrors = [];
  const requestFailures = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(BASE_URL)) requestFailures.push(`${request.url()}: ${request.failure()?.errorText || 'failed'}`);
  });
  let status = 0;
  let metrics;
  try {
    const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    status = response?.status() || 0;
    await new Promise((resolve) => setTimeout(resolve, 140));
    metrics = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      bodyText: document.body.innerText.trim().length,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.getAttribute('src')),
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth,
    }));
  } catch (error) {
    pageErrors.push(String(error));
  }
  if (![200, 304].includes(status)) errors.push(`${route}: HTTP ${status}`);
  if (!metrics || metrics.bodyText < 30) errors.push(`${route}: stránka je prázdná nebo se nevykreslila`);
  if (metrics?.h1 !== 1) errors.push(`${route}: nalezeno ${metrics?.h1 ?? 0} nadpisů H1`);
  if (metrics?.brokenImages.length) errors.push(`${route}: rozbité obrázky ${metrics.brokenImages.join(', ')}`);
  if ((metrics?.overflow || 0) > 4) errors.push(`${route}: vodorovné přetékání ${metrics.overflow}px při šířce ${viewport.width}px`);
  pageErrors.forEach((error) => errors.push(`${route}: JavaScript ${error}`));
  consoleErrors.filter((error) => !/favicon|ERR_FAILED|blocked/iu.test(error)).forEach((error) => errors.push(`${route}: console.error ${error}`));
  requestFailures.forEach((error) => errors.push(`${route}: lokální požadavek selhal ${error}`));
  results.push({ route, viewport, status, metrics, pageErrors, consoleErrors, requestFailures });
  await page.close();
}

async function pool(items, concurrency, worker) {
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  }));
}

await pool(routes, 12, (route) => auditRoute(route));

const mobileRoutes = [
  '/', '/magazin/', '/osvedcene-recepty/', '/bylinne-pripravky/', '/bylinne-caje/', '/bylinne-koupele/',
  '/bylinne-masti-a-balzamy/', '/bylinkova-herna/', '/bylinkove-pexeso/', '/poznej-bylinku/', '/bylinkovy-mistr/',
  '/aktualni-slevy-a-vyhodne-nabidky-pro-bylinkare/', '/bylinne-pripravky/mesickova-mast/',
];
for (const route of mobileRoutes) await auditRoute(route, { width: 390, height: 844 });

async function interaction(name, route, test) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await preparePage(page);
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await test(page);
  } catch (error) {
    errors.push(`${name}: ${String(error)}`);
  } finally {
    await page.close();
  }
}

await interaction('Mobilní menu', '/', async (page) => {
  await page.click('.menu-button');
  const valid = await page.evaluate(() => document.querySelector('.menu-button')?.getAttribute('aria-expanded') === 'true' && document.querySelector('#main-menu')?.classList.contains('is-open'));
  if (!valid) throw new Error('menu se neotevřelo');
});
await interaction('Bylinkové pexeso', '/bylinkove-pexeso/', async (page) => {
  await page.waitForSelector('.memory-card');
  await page.click('.memory-card');
  if ((await page.$$eval('.memory-card.is-flipped', (items) => items.length)) < 1) throw new Error('karta se neotočila');
});
await interaction('Poznej bylinku', '/poznej-bylinku/', async (page) => {
  await page.waitForSelector('.quiz-options button');
  await page.click('.quiz-options button');
  if (!(await page.$eval('[data-next]', (button) => !button.hidden))) throw new Error('nezobrazila se další otázka');
});
await interaction('Bylinkový mistr', '/bylinkovy-mistr/', async (page) => {
  await page.waitForSelector('[data-herb-master-canvas]');
  if ((await page.$eval('[data-game="herb-master"]', (node) => node.dataset.ready)) !== 'true') throw new Error('engine se neinicializoval');
  const dimensions = await page.$eval('[data-herb-master-canvas]', (canvas) => ({ width: canvas.width, height: canvas.height }));
  if (dimensions.width !== 600 || dimensions.height !== 500) throw new Error('plátno nemá rozměr 600 × 500');
});

const screenshotDir = path.join(DIST, 'browser-audit-screenshots');
await mkdir(screenshotDir, { recursive: true });
for (const [name, route, viewport] of [
  ['home-desktop', '/', { width: 1440, height: 1000 }],
  ['magazine-desktop', '/magazin/', { width: 1440, height: 1000 }],
  ['recipes-desktop', '/osvedcene-recepty/', { width: 1440, height: 1000 }],
  ['preparations-desktop', '/bylinne-pripravky/', { width: 1440, height: 1000 }],
  ['recipe-mobile', '/bylinne-pripravky/mesickova-mast/', { width: 390, height: 844 }],
]) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await preparePage(page);
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((resolve) => setTimeout(resolve, 140));
  await page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: false });
  await page.close();
}
await browser.close();

const report = { generatedAt: new Date().toISOString(), contentRoutes: routes.length, redirectPagesStaticallyChecked: redirectPages, totalChecks: results.length, errors, warnings, results };
await writeFile(path.join(DIST, 'browser-audit.json'), JSON.stringify(report, null, 2), 'utf8');
await writeFile(path.join(DIST, 'browser-audit.md'), [
  '# Prohlížečový audit skutečných obsahových stránek', '',
  `- Obsahových tras otevřených v Chrome: ${routes.length}`,
  `- Přesměrovacích adres ověřených statickým auditem: ${redirectPages}`,
  `- Celkem prohlížečových kontrol včetně mobilních: ${results.length}`,
  `- Chyb: ${errors.length}`, '', '## Chyby',
  ...(errors.length ? errors.map((error) => `- ${error}`) : ['- Žádné']),
].join('\n'), 'utf8');
console.log(`Browser audit: ${routes.length} content routes, ${redirectPages} redirects statically checked, ${results.length} browser checks, ${errors.length} errors.`);
if (errors.length) {
  errors.slice(0, 120).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
