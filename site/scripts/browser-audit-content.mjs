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

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

async function preparePage(page) {
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (url.startsWith(BASE_URL) || url.startsWith('data:') || url.startsWith('blob:')) request.continue();
    else request.abort();
  });
}

async function auditRoute(route, viewport = { width: 1280, height: 900 }, mode = 'desktop') {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await preparePage(page);
  const pageErrors = [];
  const consoleErrors = [];
  const requestFailures = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(BASE_URL)) {
      requestFailures.push(`${request.url()}: ${request.failure()?.errorText || 'failed'}`);
    }
  });

  let status = 0;
  let metrics;
  try {
    const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    status = response?.status() || 0;
    await new Promise((resolve) => setTimeout(resolve, 180));
    metrics = await page.evaluate(() => {
      const heritageCards = [...document.querySelectorAll('.heritage-directory__card')];
      const illustratedCards = [...document.querySelectorAll('.illustrated-directory-card')];
      const headerRect = document.querySelector('.site-header')?.getBoundingClientRect();
      const h1Rect = document.querySelector('h1')?.getBoundingClientRect();
      const visible = (node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 90 && rect.height > 90 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const copyAlignment = (card, selector) => {
        const node = card.querySelector(selector);
        return node ? getComputedStyle(node).textAlign : '';
      };
      const h1OverHeader = Boolean(
        headerRect && h1Rect
        && h1Rect.top < headerRect.bottom - 1
        && h1Rect.bottom > headerRect.top + 1,
      );
      const generatedCardImages = heritageCards.flatMap((card) =>
        [...card.querySelectorAll('img')]
          .map((image) => image.getAttribute('src') || '')
          .filter((src) => /^\/obrazky\/.*\.svg(?:[?#].*)?$/iu.test(src)),
      );
      const cardSvgText = heritageCards.reduce(
        (sum, card) => sum + card.querySelectorAll('.heritage-directory__image svg text').length,
        0,
      );
      return {
        h1: document.querySelectorAll('h1').length,
        bodyText: document.body.innerText.trim().length,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.getAttribute('src')),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth,
        h1OverHeader,
        headerHeight: Math.round(headerRect?.height || 0),
        heritage: heritageCards.length ? {
          cards: heritageCards.length,
          visible: heritageCards.filter(visible).length,
          buttons: heritageCards.filter((card) => card.querySelector('.heritage-directory__copy>b')).length,
          leftAligned: heritageCards.filter((card) => ['left', 'start'].includes(copyAlignment(card, '.heritage-directory__copy'))).length,
          generatedCardImages,
          svgTextNodes: cardSvgText,
        } : null,
        illustrated: illustratedCards.length ? {
          cards: illustratedCards.length,
          visible: illustratedCards.filter(visible).length,
          centered: illustratedCards.filter((card) => copyAlignment(card, '.illustrated-directory-copy') === 'center').length,
        } : null,
      };
    });
  } catch (error) {
    pageErrors.push(String(error));
  }

  const prefix = `${route} [${mode} ${viewport.width}px]`;
  if (![200, 304].includes(status)) errors.push(`${prefix}: HTTP ${status}`);
  if (!metrics || metrics.bodyText < 30) errors.push(`${prefix}: stránka je prázdná nebo se nevykreslila`);
  if (metrics?.h1 !== 1) errors.push(`${prefix}: nalezeno ${metrics?.h1 ?? 0} nadpisů H1`);
  if (metrics?.h1OverHeader) errors.push(`${prefix}: hlavní H1 je překrytý sticky hlavičkou`);
  if (metrics?.brokenImages.length) errors.push(`${prefix}: rozbité obrázky ${metrics.brokenImages.join(', ')}`);
  if ((metrics?.overflow || 0) > 4) errors.push(`${prefix}: vodorovné přetékání ${metrics.overflow}px`);

  if (metrics?.heritage) {
    const hub = metrics.heritage;
    if (hub.visible !== hub.cards) errors.push(`${prefix}: viditelných je jen ${hub.visible}/${hub.cards} heritage karet`);
    if (hub.buttons !== hub.cards) errors.push(`${prefix}: CTA má jen ${hub.buttons}/${hub.cards} heritage karet`);
    if (hub.leftAligned !== hub.cards) errors.push(`${prefix}: vlevo je zarovnáno jen ${hub.leftAligned}/${hub.cards} heritage karet`);
    if (hub.generatedCardImages.length) {
      errors.push(`${prefix}: staré textové SVG zůstalo v kartách: ${hub.generatedCardImages.join(', ')}`);
    }
    if (hub.svgTextNodes) errors.push(`${prefix}: čistá ilustrace obsahuje ${hub.svgTextNodes} SVG textových uzlů`);
  }
  if (metrics?.illustrated) {
    const hub = metrics.illustrated;
    if (hub.visible !== hub.cards) errors.push(`${prefix}: viditelných je jen ${hub.visible}/${hub.cards} ilustrovaných karet`);
    if (hub.centered !== hub.cards) errors.push(`${prefix}: na střed je zarovnáno jen ${hub.centered}/${hub.cards} ilustrovaných karet`);
  }

  pageErrors.forEach((error) => errors.push(`${prefix}: JavaScript ${error}`));
  consoleErrors
    .filter((error) => !/favicon|ERR_FAILED|blocked/iu.test(error))
    .forEach((error) => errors.push(`${prefix}: console.error ${error}`));
  requestFailures.forEach((error) => errors.push(`${prefix}: lokální požadavek selhal ${error}`));
  results.push({ route, mode, viewport, status, metrics, pageErrors, consoleErrors, requestFailures });
  await page.close();
  return metrics;
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

const hubRoutes = [...new Set(
  results
    .filter((result) => result.mode === 'desktop' && (result.metrics?.heritage?.cards || result.metrics?.illustrated?.cards))
    .map((result) => result.route),
)];
const essentialMobileRoutes = [
  '/', '/magazin/', '/osvedcene-recepty/', '/domu/sber-bylinek/', '/domu/co-sbirat/',
  '/domaci-sirupy/', '/tinktury/', '/recepty-na-domaci-limonady/', '/sirupy-a-recepty-pro-zvirata/',
  '/tinktury-pro-zvirata-2/', '/domu/prirodni-lekarna/', '/bylinkova-herna/', '/bylinkove-pexeso/',
  '/poznej-bylinku/', '/bylinkovy-mistr/', '/aktualni-slevy-a-vyhodne-nabidky-pro-bylinkare/',
  '/nejcastejsi-chyby-pri-pestovani-bylinek/',
];
const mobileRoutes = [...new Set([...hubRoutes, ...essentialMobileRoutes])].filter((route) => routes.includes(route));
for (const route of mobileRoutes) await auditRoute(route, { width: 390, height: 844 }, 'mobile');

async function interaction(name, route, test, viewport = { width: 390, height: 844 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await preparePage(page);
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise((resolve) => setTimeout(resolve, 180));
    await test(page);
  } catch (error) {
    errors.push(`${name}: ${String(error)}`);
  } finally {
    await page.close();
  }
}

await interaction('Mobilní menu', '/', async (page) => {
  await page.click('.menu-button');
  const valid = await page.evaluate(() =>
    document.querySelector('.menu-button')?.getAttribute('aria-expanded') === 'true'
    && document.querySelector('#main-menu')?.classList.contains('is-open'));
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

await interaction('Úvodní karta Bylinkové herny', '/', async (page) => {
  const image = await page.$eval('a[href="/bylinkova-herna/"] img', (node) => ({ src: node.getAttribute('src'), width: node.naturalWidth }));
  if (!image.src?.includes('/media/generated/prirodni-lekarna/bylinkova-herna-photo.webp') || image.width < 100) {
    throw new Error(`fotografický obrázek se nenačetl: ${JSON.stringify(image)}`);
  }
}, { width: 1440, height: 1000 });

async function checkRestoredGrid(name, route, selector, expectedCount, expectedRows) {
  await interaction(name, route, async (page) => {
    const geometry = await page.$$eval(selector, (cards) => cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
    }));
    if (geometry.length !== expectedCount) throw new Error(`očekáváno ${expectedCount} karet, nalezeno ${geometry.length}`);
    const heights = geometry.map((card) => card.height);
    if (Math.max(...heights) - Math.min(...heights) > 3) throw new Error(`karty nemají stejnou výšku: ${heights.join(', ')}`);
    const rows = [...new Set(geometry.map((card) => card.y))].map((y) => geometry.filter((card) => card.y === y).length);
    if (rows.join(',') !== expectedRows.join(',')) throw new Error(`neočekávané rozložení řádků: ${rows.join(',')}`);
  }, { width: 1440, height: 1200 });
}

await checkRestoredGrid('Zarovnání Přírodní lékárny', '/domu/prirodni-lekarna/', '.restored-directory--health .illustrated-directory-card', 9, [3, 3, 3]);
await checkRestoredGrid('Zarovnání receptových kategorií', '/osvedcene-recepty/', '.restored-directory--recipes .illustrated-directory-card', 10, [4, 4, 2]);

await interaction('Monetizace dlouhého článku', '/nejcastejsi-chyby-pri-pestovani-bylinek/', async (page) => {
  const result = await page.evaluate(() => ({
    textLength: Number(document.querySelector('.article-shell')?.dataset.articleTextLength || 0),
    critical: document.querySelectorAll('.critical-recipe-notice').length,
    inlineInsideContent: document.querySelectorAll('.article-content .article-inline-ad').length,
    contextAds: document.querySelectorAll('.context-ads').length,
    productFeeds: document.querySelectorAll('.product-feed').length,
  }));
  if (result.contextAds < 1 || result.productFeeds < 1) throw new Error(`neúplná monetizace: ${JSON.stringify(result)}`);
  if (result.textLength >= 600 && result.critical === 0 && result.inlineInsideContent < 1) {
    throw new Error(`dlouhý článek nemá vloženou reklamu: ${JSON.stringify(result)}`);
  }
}, { width: 1280, height: 1000 });

const screenshotDir = path.join(DIST, 'browser-audit-screenshots');
await mkdir(screenshotDir, { recursive: true });
const screenshots = [
  ['home-desktop', '/', { width: 1440, height: 1000 }],
  ['co-sbirat-desktop', '/domu/co-sbirat/', { width: 1440, height: 1100 }],
  ['etika-desktop', '/etika-sberu/', { width: 1440, height: 1100 }],
  ['syrups-desktop', '/domaci-sirupy/', { width: 1440, height: 1100 }],
  ['tinctures-desktop', '/tinktury/', { width: 1440, height: 1100 }],
  ['natural-pharmacy-desktop', '/domu/prirodni-lekarna/', { width: 1440, height: 1100 }],
  ['co-sbirat-mobile', '/domu/co-sbirat/', { width: 390, height: 844 }],
  ['syrups-mobile', '/domaci-sirupy/', { width: 390, height: 844 }],
];
for (const [name, route, viewport] of screenshots) {
  if (!routes.includes(route)) continue;
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await preparePage(page);
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((resolve) => setTimeout(resolve, 180));
  await page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: false });
  await page.close();
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  contentRoutes: routes.length,
  redirectPagesStaticallyChecked: redirectPages,
  desktopRoutes: routes.length,
  mobileRoutes: mobileRoutes.length,
  totalChecks: results.length,
  errors,
  warnings,
  results,
};
await writeFile(path.join(DIST, 'browser-audit.json'), JSON.stringify(report, null, 2), 'utf8');
await writeFile(
  path.join(DIST, 'browser-audit.md'),
  [
    '# Prohlížečový audit skutečných obsahových stránek',
    '',
    `- Desktopových obsahových tras: ${routes.length}`,
    `- Mobilních tras: ${mobileRoutes.length}`,
    `- Přesměrovacích adres ověřených statickým auditem: ${redirectPages}`,
    `- Celkem prohlížečových kontrol: ${results.length}`,
    `- Chyb: ${errors.length}`,
    '',
    '## Chyby',
    ...(errors.length ? errors.map((error) => `- ${error}`) : ['- Žádné']),
  ].join('\n'),
  'utf8',
);
console.log(`Browser audit: ${routes.length} desktop routes, ${mobileRoutes.length} mobile routes, ${results.length} browser checks, ${errors.length} errors.`);
if (errors.length) {
  errors.slice(0, 220).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
