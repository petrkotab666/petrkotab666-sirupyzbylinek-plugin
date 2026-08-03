import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

async function walk(directory) {
  const files = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

function cleanPath(value = '') {
  try {
    return new URL(value, 'https://www.sirupyzbylinek.cz').pathname;
  } catch {
    return value.split('?')[0].split('#')[0];
  }
}

let articlePages = 0;
let duplicateImagesRemoved = 0;
let changedPages = 0;

for (const file of (await walk(DIST)).filter((target) => target.endsWith('.html'))) {
  const source = await readFile(file, 'utf8');
  if (!source.includes('class="article-shell')) continue;
  articlePages += 1;

  const $ = load(source, { decodeEntities: false });
  const hero = $('.article-shell .hero-image').first();
  if (!hero.length) continue;
  const heroPath = cleanPath(hero.attr('src') || '');
  if (!heroPath) continue;

  let changed = false;
  $('.article-shell .article-content img').each((_, node) => {
    const image = $(node);
    const contentPath = cleanPath(image.attr('src') || '');
    if (!contentPath || contentPath !== heroPath) return;

    const figure = image.closest('figure');
    const paragraph = image.closest('p');
    const wrapper = figure.length ? figure : (paragraph.length ? paragraph : image);
    wrapper.remove();
    duplicateImagesRemoved += 1;
    changed = true;
  });

  if (changed) {
    await writeFile(file, $.html(), 'utf8');
    changedPages += 1;
  }
}

console.log(`Article image deduplication: ${articlePages} article pages checked, ${duplicateImagesRemoved} repeated hero images removed from ${changedPages} pages.`);
