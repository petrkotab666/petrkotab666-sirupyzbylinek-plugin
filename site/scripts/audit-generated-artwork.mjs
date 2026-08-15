import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ARTWORK_ROOT = path.join(DIST, 'obrazky');
const errors = [];
let checked = 0;

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

for (const file of await walk(ARTWORK_ROOT)) {
  if (!file.endsWith('.svg')) continue;
  checked += 1;
  const svg = await readFile(file, 'utf8');
  const visibleText = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/giu)]
    .map((match) => match[1].replace(/<[^>]+>/gu, '').trim())
    .filter(Boolean);
  if (visibleText.length) {
    errors.push(`${path.relative(DIST, file)}: viditelný text v SVG: ${visibleText.slice(0, 3).join(' | ')}`);
  }
}

console.log(`Generated artwork audit: ${checked} SVG souborů, ${errors.length} chyb.`);
if (errors.length) {
  errors.slice(0, 100).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
