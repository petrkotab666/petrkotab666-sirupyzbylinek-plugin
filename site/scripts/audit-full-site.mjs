import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];
const warnings = [];
const stats = {
  htmlPages: 0,
  internalLinks: 0,
  externalLinks: 0,
  images: 0,
  articleHeroes: 0,
  recipePages: 0,
  recipeCards: 0,
  adLinks: 0,
  productLinks: 0,
};

async function walk(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) result.push(...await walk(target));
    else result.push(target);
  }
  return result;
}

function normalizeFile(file) {
  return path.relative(DIST, file).replaceAll(path.sep, '/');
}

function routeFromFile(relative) {
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function targetFileFromPath(pathname) {
  const clean = decodeURIComponent(pathname || '/').replace(/\/+/g, '/');
  if (clean === '/') return 'index.html';
  if (/\.[a-z0-9]{1,8}$/iu.test(clean)) return clean.replace(/^\//u, '');
  return `${clean.replace(/^\//u, '').replace(/\/$/u, '')}/index.html`;
}

function localUrl(href, currentRoute) {
  try {
    const url = new URL(href, `https://audit.invalid${currentRoute}`);
    if (url.origin !== 'https://audit.invalid') return null;
    return url;
  } catch {
    return undefined;
  }
}

function text(value = '') {
  return value.replace(/\s+/gu, ' ').trim();
}

function hasRel($element, token) {
  return ($element.attr('rel') || '').split(/\s+/u).includes(token);
}

const generated = await walk(DIST);
const generatedSet = new Set(generated.map(normalizeFile));
const htmlFiles = generated.filter((file) => file.endsWith('.html'));
const pages = new Map();
for (const file of htmlFiles) {
  const relative = normalizeFile(file);
  pages.set(routeFromFile(relative), { file, relative, html: await readFile(file, 'utf8') });
}
stats.htmlPages = htmlFiles.length;

const imageUsage = new Map();
const heroUsage = new Map();
const pageIds = new Map();

for (const [route, page] of pages) {
  const $ = cheerio.load(page.html);
  const is404 = page.relative === '404.html';
  const titleCount = $('title').length;
  const h1Count = $('h1').length;
  const description = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';

  if (!is404 && titleCount !== 1) errors.push(`${page.relative}: očekáván právě jeden <title>, nalezeno ${titleCount}`);
  if (!is404 && h1Count !== 1) errors.push(`${page.relative}: očekáván právě jeden nadpis H1, nalezeno ${h1Count}`);
  if (!is404 && text(description).length < 60) warnings.push(`${page.relative}: meta description je kratší než 60 znaků`);
  if (!is404 && !canonical) errors.push(`${page.relative}: chybí canonical URL`);

  const ids = new Set();
  const duplicateIds = new Set();
  $('[id]').each((_, element) => {
    const id = $(element).attr('id');
    if (!id) return;
    if (ids.has(id)) duplicateIds.add(id);
    ids.add(id);
  });
  pageIds.set(route, ids);
  for (const id of duplicateIds) errors.push(`${page.relative}: duplicitní id="${id}"`);

  $('img').each((_, element) => {
    stats.images += 1;
    const $img = $(element);
    const src = $img.attr('src') || '';
    if (!src) {
      errors.push(`${page.relative}: obrázek bez src`);
      return;
    }
    if ($img.attr('alt') === undefined) errors.push(`${page.relative}: obrázek ${src} nemá atribut alt`);
    imageUsage.set(src, (imageUsage.get(src) || 0) + 1);

    const url = localUrl(src, route);
    if (url) {
      const file = targetFileFromPath(url.pathname);
      if (!generatedSet.has(file)) errors.push(`${page.relative}: obrázek ${src} odkazuje na chybějící soubor ${file}`);
    }

    if ($img.hasClass('hero-image')) {
      stats.articleHeroes += 1;
      heroUsage.set(src, (heroUsage.get(src) || 0) + 1);
      if (/(?:logo|banner|placeholder|kampan)/iu.test(src)) errors.push(`${page.relative}: jako hlavní obrázek je použit logo/banner ${src}`);
    }
  });

  $('a[href]').each((_, element) => {
    const $link = $(element);
    const href = ($link.attr('href') || '').trim();
    if (!href || href === '#' || /^javascript:/iu.test(href)) {
      errors.push(`${page.relative}: nefunkční odkaz ${JSON.stringify(href)}`);
      return;
    }
    if (/^(?:mailto:|tel:|sms:)/iu.test(href)) return;
    const url = localUrl(href, route);
    if (url === undefined) {
      errors.push(`${page.relative}: neplatná URL ${href}`);
      return;
    }
    if (url === null) {
      stats.externalLinks += 1;
      return;
    }
    stats.internalLinks += 1;
    const targetFile = targetFileFromPath(url.pathname);
    if (!generatedSet.has(targetFile)) {
      errors.push(`${page.relative}: interní odkaz ${href} míří na chybějící ${targetFile}`);
      return;
    }
    if (url.hash) {
      const targetRoute = routeFromFile(targetFile);
      const targetIds = pageIds.get(targetRoute);
      if (targetIds && !targetIds.has(decodeURIComponent(url.hash.slice(1)))) {
        errors.push(`${page.relative}: odkaz ${href} míří na neexistující kotvu`);
      }
    }
  });

  $('button').each((_, element) => {
    if (!$(element).attr('type')) warnings.push(`${page.relative}: tlačítko bez type`);
  });

  $('.context-ads a[href]').each((_, element) => {
    stats.adLinks += 1;
    const $link = $(element);
    if (!hasRel($link, 'sponsored')) errors.push(`${page.relative}: reklamní odkaz nemá rel=sponsored`);
    if (!hasRel($link, 'nofollow')) warnings.push(`${page.relative}: reklamní odkaz nemá rel=nofollow`);
  });
  $('.product-feed a[href], .deal-card a[href]').each((_, element) => {
    stats.productLinks += 1;
    const $link = $(element);
    if (!hasRel($link, 'sponsored')) errors.push(`${page.relative}: produktový odkaz nemá rel=sponsored`);
  });

  const recipePage = $('[data-recipe-page]');
  if (recipePage.length) {
    stats.recipePages += 1;
    if (!page.html.includes('"@type":"Recipe"') && !page.html.includes('"@type": "Recipe"')) errors.push(`${page.relative}: recept nemá Recipe schema`);
    if (!$('.ingredient-list li').length) errors.push(`${page.relative}: recept nemá suroviny`);
    if (!$('.method-list li').length) errors.push(`${page.relative}: recept nemá kroky postupu`);
    if (!$('.recipe-safety li').length) errors.push(`${page.relative}: recept nemá bezpečnostní upozornění`);
    if (!$('.context-ads').length || !$('.product-feed').length) errors.push(`${page.relative}: recept nemá reklamu i produktový feed`);
  }

  stats.recipeCards += $('.preparation-card').length;
}

// Kotvy se kontrolují až ve druhém průchodu, kdy už známe id ze všech stránek.
for (const [route, page] of pages) {
  const $ = cheerio.load(page.html);
  $('a[href*="#"]').each((_, element) => {
    const href = ($(element).attr('href') || '').trim();
    const url = localUrl(href, route);
    if (!url || !url.hash) return;
    const targetFile = targetFileFromPath(url.pathname);
    if (!generatedSet.has(targetFile)) return;
    const targetRoute = routeFromFile(targetFile);
    const targetIds = pageIds.get(targetRoute);
    const id = decodeURIComponent(url.hash.slice(1));
    if (targetIds && !targetIds.has(id)) errors.push(`${page.relative}: kotva ${href} neexistuje na cílové stránce`);
  });
}

if (stats.recipePages !== 42) errors.push(`Nový receptář: očekáváno 42 detailů receptů, vygenerováno ${stats.recipePages}`);
if (stats.recipeCards < 42) warnings.push(`Nový receptář: napříč rozcestníky je jen ${stats.recipeCards} karet`);

for (const [src, count] of heroUsage) {
  if (count > 12 && src.startsWith('/obrazky/') && !src.startsWith('/obrazky/clanky/')) {
    errors.push(`Obrázek ${src} se opakuje jako hero na ${count} článcích`);
  }
}

const genericHeroes = [...heroUsage].filter(([src]) => /^\/obrazky\/(?:bylinky|recepty|napoje|zdravi|sber|pestovani|krasa|zvirata|repelenty|zavarovani)\.svg$/u.test(src));
if (genericHeroes.length) errors.push(`Stále se používají obecné opakované hero obrázky: ${genericHeroes.map(([src, count]) => `${src} (${count}×)`).join(', ')}`);

const report = {
  generatedAt: new Date().toISOString(),
  stats,
  errors,
  warnings,
  mostUsedImages: [...imageUsage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([src, count]) => ({ src, count })),
  mostUsedHeroImages: [...heroUsage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([src, count]) => ({ src, count })),
};

await mkdir(DIST, { recursive: true });
await writeFile(path.join(DIST, 'site-audit.json'), JSON.stringify(report, null, 2), 'utf8');
const markdown = [
  '# Kompletní audit webu Sirupy z bylinek',
  '',
  `- HTML stránek: ${stats.htmlPages}`,
  `- Interních odkazů: ${stats.internalLinks}`,
  `- Externích odkazů: ${stats.externalLinks}`,
  `- Obrázků: ${stats.images}`,
  `- Hlavních obrázků článků: ${stats.articleHeroes}`,
  `- Nových detailů receptů: ${stats.recipePages}`,
  `- Reklamních odkazů: ${stats.adLinks}`,
  `- Produktových odkazů: ${stats.productLinks}`,
  '',
  `## Chyby (${errors.length})`,
  ...(errors.length ? errors.map((item) => `- ${item}`) : ['- Žádné']),
  '',
  `## Upozornění (${warnings.length})`,
  ...(warnings.length ? warnings.map((item) => `- ${item}`) : ['- Žádná']),
  '',
].join('\n');
await writeFile(path.join(DIST, 'site-audit.md'), markdown, 'utf8');

console.log(`Full site audit: ${stats.htmlPages} pages, ${stats.internalLinks} internal links, ${stats.images} images, ${stats.recipePages} new recipes, ${errors.length} errors, ${warnings.length} warnings.`);
if (warnings.length) warnings.slice(0, 30).forEach((warning) => console.warn(`WARN ${warning}`));
if (errors.length) {
  errors.slice(0, 100).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
