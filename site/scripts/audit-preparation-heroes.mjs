import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const errors = [];

const categoryPaths = [
  'bylinne-caje',
  'bylinne-koupele',
  'bylinne-masti-a-balzamy',
  'bylinne-oleje-a-maceraty',
  'bylinne-octy-a-oxymely',
  'bylinne-obklady-a-kloktadla',
  'bylinky-v-kuchyni-recepty',
];

function isGeneratedPhoto(src = '') {
  return /^\/media\/generated\/prirodni-lekarna\/[^?#]+\.webp(?:[?#].*)?$/iu.test(src);
}

async function loadHtml(relativePath) {
  const target = path.join(dist, relativePath, 'index.html');
  try {
    return cheerio.load(await readFile(target, 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: stránku nelze načíst (${error})`);
    return null;
  }
}

for (const relativePath of categoryPaths) {
  const $ = await loadHtml(relativePath);
  if (!$) continue;
  const src = $('.preparation-category-hero > img').attr('src') || '';
  if (!isGeneratedPhoto(src)) errors.push(`${relativePath}: hero nepoužívá fotografický WebP, nalezeno "${src}"`);

  const cardSources = $('.preparation-card img').map((_, image) => $(image).attr('src') || '').get();
  if (!cardSources.length) errors.push(`${relativePath}: nebyly nalezeny žádné receptové karty`);
  for (const cardSrc of cardSources) {
    if (!isGeneratedPhoto(cardSrc)) errors.push(`${relativePath}: receptová karta nepoužívá fotografický WebP "${cardSrc}"`);
  }
}

const directory = await loadHtml('bylinne-pripravky');
if (directory) {
  const heroSrc = directory('.preparations-hero > img').attr('src') || '';
  if (!isGeneratedPhoto(heroSrc)) errors.push(`bylinne-pripravky: hlavní hero nepoužívá fotografický WebP "${heroSrc}"`);

  const sources = directory('.preparation-category-card > img').map((_, image) => directory(image).attr('src') || '').get();
  if (sources.length !== categoryPaths.length) errors.push(`bylinne-pripravky: očekáváno ${categoryPaths.length} kategorií, nalezeno ${sources.length}`);
  for (const src of sources) {
    if (!isGeneratedPhoto(src)) errors.push(`bylinne-pripravky: kategorie nepoužívá fotografický WebP "${src}"`);
  }

  const featuredSources = directory('.preparation-card img').map((_, image) => directory(image).attr('src') || '').get();
  for (const src of featuredSources) {
    if (!isGeneratedPhoto(src)) errors.push(`bylinne-pripravky: doporučená receptová karta nepoužívá fotografický WebP "${src}"`);
  }
}

const recipeRoot = path.join(dist, 'bylinne-pripravky');
let recipeDirectories = [];
try {
  recipeDirectories = (await readdir(recipeRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
} catch (error) {
  errors.push(`bylinne-pripravky: nelze načíst detailní recepty (${error})`);
}

for (const slug of recipeDirectories) {
  const $ = await loadHtml(path.join('bylinne-pripravky', slug));
  if (!$) continue;
  const src = $('.recipe-hero > img').attr('src') || '';
  if (!isGeneratedPhoto(src)) errors.push(`bylinne-pripravky/${slug}: detailní hero nepoužívá fotografický WebP "${src}"`);

  const relatedSources = $('.related-preparations .preparation-card img').map((_, image) => $(image).attr('src') || '').get();
  for (const relatedSrc of relatedSources) {
    if (!isGeneratedPhoto(relatedSrc)) errors.push(`bylinne-pripravky/${slug}: související karta nepoužívá fotografický WebP "${relatedSrc}"`);
  }
}

if (errors.length) {
  console.error('\nAudit hero obrázků bylinných přípravků selhal:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Audit bylinných přípravků prošel: ${categoryPaths.length} kategorií, všechny karty i ${recipeDirectories.length} detailů používají fotografické WebP bez SVG ilustrací.`);
