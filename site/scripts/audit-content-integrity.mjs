import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];
const warnings = [];

const BANNED_VISIBLE_PATTERNS = [
  /rychlé shrnutí článku/iu,
  /hlavní klíčové slovo/iu,
  /seo 90\+/iu,
  /produktový xml feed/iu,
  /xml produktový feed/iu,
  /affiliate doporučení/iu,
  /interní odkazy/iu,
  /rozšiřuje původní krátký článek/iu,
  /text (?:je|byl) postavený jako bezpečný průvodce/iu,
  /praktický základ pro téma/iu,
  /jak z článku vytěžit maximum/iu,
  /seo a uživatelská hodnota článku/iu,
  /rychlá kontrola před publikací/iu,
  /související článek z této dávky/iu,
  /lepší pro čtenáře i pro seo/iu,
  /přehnaná očekávání/iu,
  /příliš mnoho kombinací/iu,
  /označeno tagem/iu,
  /vybavení a suroviny pro další domácí recept/iu,
];

const EXEMPT_PATHS = /(?:^|\/)(?:404|admin|kontakt|o-projektu|ochrana-osobnich-udaju|zasady-cookies|vylouceni-odpovednosti|obchodni-podminky)(?:\/|\.html|$)/iu;
const NON_EDITORIAL_SELECTOR = '.context-ads, .product-feed, .article-inline-ad, script, style, noscript';

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

function relative(file) {
  return path.relative(DIST, file).replaceAll(path.sep, '/');
}

function routeFromFile(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return `/${relativePath.slice(0, -'index.html'.length)}`;
  return `/${relativePath}`;
}

function normalizeText(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function targetFromUrl(value, route) {
  try {
    const url = new URL(value, `https://audit.invalid${route}`);
    if (url.origin !== 'https://audit.invalid') return null;
    return decodeURIComponent(url.pathname).replace(/^\//u, '');
  } catch {
    return undefined;
  }
}

function hasRel(element, token) {
  return (element.attr('rel') || '').split(/\s+/u).includes(token);
}

function isRedirectPage($) {
  return $('meta[http-equiv="refresh" i]').length > 0;
}

function isSubstantivePage($, relativePath) {
  if (EXEMPT_PATHS.test(relativePath) || isRedirectPage($)) return false;
  const mainText = $('main').text().replace(/\s+/gu, ' ').trim();
  if (mainText.length < 180) return false;
  return $('article.article-shell, main .section-wrap, main .heritage-hub-hero, main .visual-section-hero, main [data-game], main .game-launch-card').length > 0;
}

function editorialClone($, selector) {
  const root = $(selector).clone();
  root.find(NON_EDITORIAL_SELECTOR).remove();
  return root;
}

function verifyMagic(relativePath, bytes) {
  const extension = path.extname(relativePath).toLowerCase();
  if (extension === '.webp') return bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if (extension === '.png') return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (extension === '.jpg' || extension === '.jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (extension === '.gif') return ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString('ascii'));
  if (extension === '.svg') return /<svg\b/iu.test(bytes.toString('utf8'));
  if (extension === '.avif') return bytes.subarray(4, 12).toString('ascii').includes('ftypavif') || bytes.subarray(4, 12).toString('ascii').includes('ftypavis');
  return true;
}

const files = await walk(DIST);
const generated = new Set(files.map(relative));
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const checkedImages = new Set();
const repeatedParagraphs = new Map();
let monetizedPages = 0;
let checkedPages = 0;
let imageCount = 0;

for (const file of htmlFiles) {
  const relativePath = relative(file);
  const route = routeFromFile(relativePath);
  const html = await readFile(file, 'utf8');
  const $ = cheerio.load(html);
  const visible = editorialClone($, 'main').text().replace(/\s+/gu, ' ').trim();
  checkedPages += 1;

  for (const pattern of BANNED_VISIBLE_PATTERNS) {
    if (pattern.test(visible)) errors.push(`${relativePath}: viditelný redakční balast ${pattern}`);
  }

  const articleContent = $('.article-body').length
    ? editorialClone($, '.article-body')
    : editorialClone($, '.article-content');
  if (articleContent.length) {
    if (articleContent.find('a[href*="ehub.cz"], a[href*="a_box="]').length) {
      errors.push(`${relativePath}: affiliate odkaz je vložen přímo do textu článku místo reklamního modulu`);
    }
    articleContent.find('p, li').each((_, element) => {
      const paragraph = $(element).text().replace(/\s+/gu, ' ').trim();
      if (/^\d[\d\s.,]*\s*kč$/iu.test(paragraph)) errors.push(`${relativePath}: samostatná cena z původního feedu zůstala v textu článku`);
      if (paragraph.length < 130) return;
      const key = normalizeText(paragraph);
      if (!key) return;
      if (!repeatedParagraphs.has(key)) repeatedParagraphs.set(key, { text: paragraph, pages: new Set() });
      repeatedParagraphs.get(key).pages.add(relativePath);
    });
  }

  $('img').each((_, element) => {
    imageCount += 1;
    const image = $(element);
    const src = (image.attr('src') || '').trim();
    if (!src) {
      errors.push(`${relativePath}: obrázek bez src`);
      return;
    }
    if (image.attr('alt') === undefined) errors.push(`${relativePath}: obrázek ${src} nemá alt`);
    const local = targetFromUrl(src, route);
    if (local === undefined) {
      errors.push(`${relativePath}: neplatná adresa obrázku ${src}`);
      return;
    }
    if (local === null) {
      if (image.closest('.product-card').length && !(image.attr('onerror') || '').includes('/media/generated/prirodni-lekarna/byliny-6083d43d.webp')) {
        errors.push(`${relativePath}: vzdálený produktový obrázek ${src} nemá lokální záložní obrázek`);
      }
      return;
    }
    const clean = local.split('?')[0].split('#')[0];
    if (!generated.has(clean)) {
      errors.push(`${relativePath}: chybí lokální obrázek ${src}`);
      return;
    }
    if (checkedImages.has(clean)) return;
    checkedImages.add(clean);
  });

  if (isSubstantivePage($, relativePath)) {
    const ads = $('.context-ads a[href]');
    const products = $('.product-feed a[href]');
    if (!$('.context-ads').length || ads.length < 3) errors.push(`${relativePath}: chybí plnohodnotný reklamní blok se třemi prokliky`);
    if (!$('.product-feed').length || products.length < 1) errors.push(`${relativePath}: chybí produktový feed s proklikem`);
    ads.each((_, element) => {
      const link = $(element);
      if (!hasRel(link, 'sponsored') || !hasRel(link, 'nofollow')) errors.push(`${relativePath}: reklamní proklik nemá rel="nofollow sponsored"`);
    });
    products.each((_, element) => {
      const link = $(element);
      if (!hasRel(link, 'sponsored') || !hasRel(link, 'nofollow')) errors.push(`${relativePath}: produktový proklik nemá rel="nofollow sponsored"`);
    });
    if ($('.context-ads').length && $('.product-feed').length) monetizedPages += 1;
  }
}

for (const relativePath of checkedImages) {
  const absolute = path.join(DIST, relativePath);
  const bytes = await readFile(absolute);
  if (bytes.length < 12) {
    errors.push(`${relativePath}: obrázek je prázdný nebo poškozený`);
    continue;
  }
  if (!verifyMagic(relativePath, bytes.subarray(0, Math.min(bytes.length, 512)))) {
    errors.push(`${relativePath}: obsah souboru neodpovídá příponě obrázku`);
  }
}

for (const { text, pages } of repeatedParagraphs.values()) {
  if (pages.size >= 4) {
    errors.push(`Stejný dlouhý odstavec se opakuje na ${pages.size} článcích: ${JSON.stringify(text.slice(0, 180))}`);
  }
}

const home = cheerio.load(await readFile(path.join(DIST, 'index.html'), 'utf8'));
const gameCard = home('a[href="/bylinkova-herna/"]');
const gameImage = gameCard.find('img').attr('src') || '';
if (gameImage !== '/media/generated/prirodni-lekarna/bylinkova-herna-photo.webp') {
  errors.push(`Úvodní dlaždice Bylinková herna používá chybný obrázek ${JSON.stringify(gameImage)}`);
}

console.log(`Integrity audit: ${checkedPages} HTML pages, ${imageCount} image uses, ${checkedImages.size} unique local images, ${monetizedPages} monetized substantive pages, ${errors.length} errors, ${warnings.length} warnings.`);
if (warnings.length) warnings.forEach((warning) => console.warn(`WARN ${warning}`));
if (errors.length) {
  errors.slice(0, 200).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
