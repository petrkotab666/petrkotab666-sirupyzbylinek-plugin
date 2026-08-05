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
  if (!src.startsWith('/obrazky/recepty-sceny/')) {
    errors.push(`${relativePath}: hero používá nevhodný kartový obrázek "${src}"`);
  }
}

const directory = await loadHtml('bylinne-pripravky');
if (directory) {
  const sources = directory('.preparation-category-card > img').map((_, image) => directory(image).attr('src') || '').get();
  if (sources.length !== categoryPaths.length) {
    errors.push(`bylinne-pripravky: očekáváno ${categoryPaths.length} kategorií, nalezeno ${sources.length}`);
  }
  for (const src of sources) {
    if (!src.startsWith('/obrazky/recepty-sceny/')) {
      errors.push(`bylinne-pripravky: kategorie používá nevhodný kartový obrázek "${src}"`);
    }
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
  if (src !== `/obrazky/recepty-sceny/${slug}.svg`) {
    errors.push(`bylinne-pripravky/${slug}: hero používá "${src}"`);
  }
}

const sceneRoot = path.join(dist, 'obrazky', 'recepty-sceny');
let sceneFiles = [];
try {
  sceneFiles = (await readdir(sceneRoot)).filter((name) => name.endsWith('.svg'));
} catch (error) {
  errors.push(`recepty-sceny: adresář nelze načíst (${error})`);
}

if (sceneFiles.length !== recipeDirectories.length) {
  errors.push(`recepty-sceny: vygenerováno ${sceneFiles.length} ilustrací pro ${recipeDirectories.length} detailů`);
}

for (const file of sceneFiles) {
  const svg = await readFile(path.join(sceneRoot, file), 'utf8');
  if (/<text\b/iu.test(svg)) errors.push(`recepty-sceny/${file}: ilustrace stále obsahuje viditelný text`);
  if (!/<svg\b[^>]*viewBox="0 0 1200 675"/iu.test(svg)) errors.push(`recepty-sceny/${file}: chybný rozměr nebo viewBox`);
}

if (errors.length) {
  console.error('\nAudit hero obrázků bylinných přípravků selhal:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Audit hero obrázků prošel: ${categoryPaths.length} kategorií, ${recipeDirectories.length} detailů a ${sceneFiles.length} čistých ilustrací bez textu.`);
