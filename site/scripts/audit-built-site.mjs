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
];

let articlePages = 0;
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
  }
}

const magazinePath = path.join(DIST, 'magazin', 'index.html');
const magazine = await readFile(magazinePath, 'utf8');
const cards = (magazine.match(/class="article-card"/g) || []).length;
if (cards > 12) errors.push(`magazin/index.html: expected at most 12 article cards, found ${cards}`);
if (cards === 0) errors.push('magazin/index.html: no article cards found');

if (errors.length) {
  console.error('\nContent quality audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Content quality audit passed: ${htmlFiles.length} HTML pages, ${articlePages} article pages, ${cards} cards on magazine page 1.`);
}
