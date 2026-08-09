import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];
const warnings = [];
const pages = [];

const GRID_SELECTORS = [
  '.heritage-directory__grid',
  '.illustrated-directory',
  '.preparation-grid',
  '.preparation-category-grid',
  '.articles-grid',
];
const CARD_SELECTOR = '.heritage-directory__card, .illustrated-directory-card, .preparation-card, .preparation-category-card, .article-card';
const HERO_SELECTOR = [
  '.heritage-hub-hero > img',
  '.visual-section-hero .visual-section-hero-art > img',
  '.preparation-category-hero > img',
  '.preparations-hero > img',
  '.recipe-hero > img',
  '.article-header > .hero-image',
  '.legacy-home-hero > .home-hero-original-image',
].join(', ');

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

function relative(file) {
  return path.relative(DIST, file).replaceAll(path.sep, '/');
}

function routeFromFile(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return `/${relativePath.slice(0, -'index.html'.length)}`;
  return `/${relativePath}`;
}

function isSvg(src = '') {
  return /\.svg(?:[?#].*)?$/iu.test(src);
}

function cleanSrc(src = '') {
  return src.split(/[?#]/u)[0] || '';
}

const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const relativePath = relative(file);
  const html = await readFile(file, 'utf8');
  const $ = cheerio.load(html);
  const route = routeFromFile(relativePath);
  const pageGrids = [];

  for (const selector of GRID_SELECTORS) {
    $(selector).each((gridIndex, gridElement) => {
      const grid = $(gridElement);
      const cards = grid.find(CARD_SELECTOR);
      if (!cards.length) return;

      const imageSources = [];
      cards.each((cardIndex, cardElement) => {
        const card = $(cardElement);
        const image = card.find('img').first();
        const src = cleanSrc((image.attr('src') || '').trim());
        const alt = image.attr('alt');
        const isArticleCard = card.hasClass('article-card');

        if (!src) errors.push(`${route}: ${selector} #${gridIndex + 1}, karta ${cardIndex + 1} nemá obrázek`);
        else imageSources.push(src);
        if (!isArticleCard && (alt === undefined || !alt.trim())) {
          errors.push(`${route}: ${selector} #${gridIndex + 1}, karta ${cardIndex + 1} nemá smysluplný alt`);
        }
        if (isSvg(src)) errors.push(`${route}: ${selector} #${gridIndex + 1}, karta ${cardIndex + 1} používá SVG místo fotografie ${src}`);
      });

      const uniqueImages = new Set(imageSources);
      const duplicates = imageSources.filter((src, index) => imageSources.indexOf(src) !== index);
      if (duplicates.length) {
        errors.push(`${route}: ${selector} #${gridIndex + 1} opakuje fotografii: ${[...new Set(duplicates)].join(', ')}`);
      }
      if (cards.length <= 14 && uniqueImages.size !== imageSources.length) {
        errors.push(`${route}: ${selector} #${gridIndex + 1} má ${imageSources.length} karet, ale jen ${uniqueImages.size} různých fotografií`);
      }

      pageGrids.push({ selector, index: gridIndex + 1, cards: cards.length, uniqueImages: uniqueImages.size });
    });
  }

  const heroes = [];
  $(HERO_SELECTOR).each((index, element) => {
    const src = cleanSrc(($(element).attr('src') || '').trim());
    if (!src) errors.push(`${route}: hero ${index + 1} nemá obrázek`);
    else heroes.push(src);
    if (isSvg(src)) errors.push(`${route}: hero ${index + 1} používá SVG místo fotografie ${src}`);
  });

  if (pageGrids.length || heroes.length) pages.push({ route, grids: pageGrids, heroes });
}

const report = {
  generatedAt: new Date().toISOString(),
  auditedPages: pages.length,
  errors,
  warnings,
  pages,
};
await writeFile(path.join(DIST, 'hub-visual-audit.json'), JSON.stringify(report, null, 2), 'utf8');
await writeFile(
  path.join(DIST, 'hub-visual-audit.md'),
  [
    '# Audit fotografických karet a rozcestníků',
    '',
    `- Kontrolovaných stránek: ${pages.length}`,
    `- Chyb: ${errors.length}`,
    `- Varování: ${warnings.length}`,
    '',
    '## Chyby',
    ...(errors.length ? errors.map((error) => `- ${error}`) : ['- Žádné']),
    '',
    '## Varování',
    ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ['- Žádná']),
  ].join('\n'),
  'utf8',
);

console.log(`Hub visual audit: ${pages.length} pages, ${errors.length} errors, ${warnings.length} warnings; SVG na kartách a opakované fotografie v jedné mřížce jsou zakázané.`);
if (errors.length) {
  errors.slice(0, 300).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
