import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
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

const routes = (await walk(DIST)).filter((file) => file.endsWith('.html')).map(routeFromFile).filter((route) => route !== '/404.html');
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });

async function auditRoute(route, viewport = { width: 1280, height: 900 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const pageErrors = [];
  const consoleErrors = [];
  const requestFailures = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (url.startsWith(BASE_URL)) requestFailures.push(`${url}: ${request.failure()?.errorText || 'failed'}`);
  });

  let status = 0;
  let metrics = null;
  try {
    const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    status = response?.status() || 0;
    await new Promise((resolve) => setTimeout(resolve, 80));
    metrics = await page.evaluate(() => {
      const brokenImages = [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.getAttribute('src'));
      const viewportWidth = document.documentElement.clientWidth;
      const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - viewportWidth;
      return {
        title: document.title,
        h1: document.querySelectorAll('h1').length,
        images: document.images.length,
        brokenImages,
        overflow,
        bodyText: document.body.innerText.trim().length,
      };
    });
  } catch (error) {
    pageErrors.push(String(error));
  }

  if (status !== 200) errors.push(`${route}: HTTP ${status}`);
  if (!metrics || metrics.bodyText < 30) errors.push(`${route}: stránka se nevykreslila nebo je prázdná`);
  if (metrics?.h1 !== 1) errors.push(`${route}: v prohlížeči nalezeno ${metrics?.h1 ?? 0} nadpisů H1`);
  if (metrics?.brokenImages.length) errors.push(`${route}: rozbité obrázky ${metrics.brokenImages.join(', ')}`);
  if ((metrics?.overflow || 0) > 4) errors.push(`${route}: vodorovné přetékání o ${metrics.overflow}px při šířce ${viewport.width}px`);
  pageErrors.forEach((error) => errors.push(`${route}: JavaScript pageerror ${error}`));
  consoleErrors.filter((error) => !/favicon|third-party|blocked by client/iu.test(error)).forEach((error) => errors.push(`${route}: console.error ${error}`));
  requestFailures.forEach((error) => errors.push(`${route}: lokální požadavek selhal ${error}`));

  const result = { route, viewport, status, metrics, pageErrors, consoleErrors, requestFailures };
  results.push(result);
  await page.close();
  return result;
}

async function runPool(items, concurrency, worker) {
  let index = 0;
  const runners = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      await worker(current);
    }
  });
  await Promise.all(runners);
}

await runPool(routes, 5, (route) => auditRoute(route));

const mobileRoutes = [
  '/', '/magazin/', '/osvedcene-recepty/', '/bylinne-pripravky/', '/bylinne-caje/', '/bylinne-koupele/',
  '/bylinne-masti-a-balzamy/', '/bylinkova-herna/', '/bylinkove-pexeso/', '/poznej-bylinku/', '/bylinkovy-mistr/',
  '/aktualni-slevy-a-vyhodne-nabidky-pro-bylinkare/', '/bylinne-pripravky/mesickova-mast/',
];
for (const route of mobileRoutes) await auditRoute(route, { width: 390, height: 844 });

async function interaction(name, route, test) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await test(page);
  } catch (error) {
    errors.push(`${name}: ${String(error)}`);
  } finally {
    await page.close();
  }
}

await interaction('Mobilní menu', '/', async (page) => {
  await page.click('.menu-button');
  const state = await page.$eval('.menu-button', (button) => button.getAttribute('aria-expanded'));
  const open = await page.$eval('#main-menu', (menu) => menu.classList.contains('is-open'));
  if (state !== 'true' || !open) throw new Error('menu se po kliknutí neotevřelo');
});

await interaction('Bylinkové pexeso', '/bylinkove-pexeso/', async (page) => {
  await page.waitForSelector('.memory-card');
  await page.click('.memory-card');
  const flipped = await page.$$eval('.memory-card.is-flipped', (items) => items.length);
  if (flipped < 1) throw new Error('karta se po kliknutí neotočila');
  await page.click('.game-reset');
  const moves = await page.$eval('[data-moves]', (node) => node.textContent?.trim());
  if (moves !== '0') throw new Error('reset neobnovil počet tahů');
});

await interaction('Poznej bylinku', '/poznej-bylinku/', async (page) => {
  await page.waitForSelector('.quiz-options button');
  await page.click('.quiz-options button');
  const nextVisible = await page.$eval('[data-next]', (button) => !button.hidden);
  if (!nextVisible) throw new Error('po odpovědi se nezobrazilo tlačítko další otázky');
});

await interaction('Bylinkový mistr', '/bylinkovy-mistr/', async (page) => {
  await page.waitForSelector('[data-herb-master-canvas]');
  const ready = await page.$eval('[data-game="herb-master"]', (node) => node.dataset.ready);
  if (ready !== 'true') throw new Error('herní engine se neinicializoval');
  await page.click('[data-action]');
  await new Promise((resolve) => setTimeout(resolve, 250));
  const dimensions = await page.$eval('[data-herb-master-canvas]', (canvas) => ({ width: canvas.width, height: canvas.height }));
  if (dimensions.width !== 600 || dimensions.height !== 500) throw new Error('herní plátno nemá rozměr 600 × 500');
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
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: false });
  await page.close();
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  pageChecks: results.length,
  uniqueHtmlRoutes: routes.length,
  errors,
  warnings,
  results,
};
await writeFile(path.join(DIST, 'browser-audit.json'), JSON.stringify(report, null, 2), 'utf8');
await writeFile(path.join(DIST, 'browser-audit.md'), [
  '# Prohlížečový audit webu',
  '',
  `- Jedinečných HTML tras: ${routes.length}`,
  `- Celkem kontrol včetně mobilních: ${results.length}`,
  `- Chyb: ${errors.length}`,
  '',
  '## Chyby',
  ...(errors.length ? errors.map((error) => `- ${error}`) : ['- Žádné']),
].join('\n'), 'utf8');

console.log(`Browser audit completed: ${routes.length} routes, ${results.length} checks, ${errors.length} errors.`);
if (errors.length) {
  errors.slice(0, 100).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
