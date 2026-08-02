import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];

async function filesIn(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) result.push(...await filesIn(target));
    else result.push(target);
  }
  return result;
}

const htmlFiles = (await filesIn(DIST)).filter((file) => file.endsWith('.html'));
const banned = [
  /přepsaný článek se seo strukturou/iu,
  /hlavní klíčové slovo:/iu,
  /produktový xml feed/iu,
  /xml produktový feed/iu,
  /cíl:\s*lepší čitelnost/iu,
  /seo 90\+/iu,
  /rychlé shrnutí článku/iu,
  /rozšiřuje původní krátký článek/iu,
  /affiliate doporučení/iu,
  /interní odkazy/iu,
];

let articlePages = 0;
let monetizedPages = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(DIST, file);

  for (const pattern of banned) {
    if (pattern.test(html)) errors.push(`${relative}: contains banned editorial text ${pattern}`);
  }

  if (html.includes('class="article-shell')) {
    articlePages += 1;
    const heroCount = (html.match(/class="hero-image"/g) || []).length;
    if (heroCount !== 1) errors.push(`${relative}: expected one hero image, found ${heroCount}`);
    if (!html.includes('property="og:image"')) errors.push(`${relative}: missing Open Graph image`);
    if (!html.includes('application/ld+json')) errors.push(`${relative}: missing structured data`);
    if (html.includes('class="context-ads"') || html.includes('class="product-feed"')) monetizedPages += 1;
  }
}

const magazinePath = path.join(DIST, 'magazin', 'index.html');
const magazine = await readFile(magazinePath, 'utf8');
const cards = (magazine.match(/class="article-card"/g) || []).length;
if (cards > 12) errors.push(`magazin/index.html: expected at most 12 article cards, found ${cards}`);
if (cards === 0) errors.push('magazin/index.html: no article cards found');

const cultivationPath = path.join(DIST, 'nejcastejsi-chyby-pri-pestovani-bylinek', 'index.html');
const cultivation = await readFile(cultivationPath, 'utf8');
if (!cultivation.includes('Pěstování bylinek')) errors.push('cultivation article: missing inferred Pěstování bylinek category');
if (!cultivation.includes('/obrazky/pestovani.svg')) errors.push('cultivation article: missing thematic cultivation image');
if (!cultivation.includes('class="context-ads"') || !cultivation.includes('class="product-feed"')) {
  errors.push('cultivation article: missing centralized advertising or product module');
}
for (const pattern of banned) {
  if (pattern.test(cultivation)) errors.push(`cultivation article: contains banned text ${pattern}`);
}

if (monetizedPages === 0) errors.push('site: no article contains centralized monetization modules');

if (errors.length) {
  console.error('\nContent quality audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Content quality audit passed: ${htmlFiles.length} HTML pages, ${articlePages} article pages, ${monetizedPages} monetized pages, ${cards} cards on magazine page 1.`);
}
