import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];
const warnings = [];
const pages = [];

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

function isLegacySvg(src = '') {
  return /^\/obrazky\/.*\.svg(?:[?#].*)?$/iu.test(src);
}

const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const relativePath = relative(file);
  const html = await readFile(file, 'utf8');
  const $ = cheerio.load(html);
  const cards = $('.heritage-directory__card');
  const restoredCards = $('.restored-directory .illustrated-directory-card--photo');
  const cardSet = cards.length ? cards : restoredCards;
  if (!cardSet.length) continue;

  const route = routeFromFile(relativePath);
  const imageSources = [];
  cardSet.each((index, element) => {
    const card = $(element);
    const image = card.find('img').first();
    const src = (image.attr('src') || '').trim();
    const alt = image.attr('alt');
    if (!src) errors.push(`${route}: obrazová karta ${index + 1} nemá obrázek`);
    else imageSources.push(src);
    if (alt === undefined || !alt.trim()) errors.push(`${route}: obrazová karta ${index + 1} nemá smysluplný alt`);
    if (isLegacySvg(src)) errors.push(`${route}: obrazová karta ${index + 1} stále používá starý SVG placeholder ${src}`);
  });

  const hero = $('.heritage-hub-hero > img, .visual-section-hero > img').first();
  const heroSrc = (hero.attr('src') || '').trim();
  if (hero.length && isLegacySvg(heroSrc)) errors.push(`${route}: hlavní hero stále používá starý SVG placeholder ${heroSrc}`);

  const uniqueImages = new Set(imageSources);
  if (imageSources.length >= 6 && uniqueImages.size < Math.ceil(imageSources.length * 0.5)) {
    warnings.push(`${route}: ${imageSources.length} obrazových karet používá jen ${uniqueImages.size} různých podkladů`);
  }

  pages.push({
    route,
    cards: cardSet.length,
    uniqueImages: uniqueImages.size,
    hero: heroSrc || null,
    legacySvgCards: imageSources.filter(isLegacySvg),
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  auditedHubPages: pages.length,
  errors,
  warnings,
  pages,
};
await writeFile(path.join(DIST, 'hub-visual-audit.json'), JSON.stringify(report, null, 2), 'utf8');
await writeFile(
  path.join(DIST, 'hub-visual-audit.md'),
  [
    '# Audit obrazových rozcestníků',
    '',
    `- Rozcestníků: ${pages.length}`,
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

console.log(`Hub visual audit: ${pages.length} hub pages, ${errors.length} errors, ${warnings.length} warnings.`);
if (errors.length) {
  errors.slice(0, 200).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
