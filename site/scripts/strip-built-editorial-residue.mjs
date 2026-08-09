import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

const RESIDUE_PATTERNS = [
  /\s*souvisej[ií]c[ií]\s+[cč]l[aá]nek\s+z\s+t[eé]to\s+d[aá]vky\s*/giu,
  /\s*ozna[cč]eno\s+tagem\s*/giu,
  /\s*vybaven[ií]\s+a\s+suroviny\s+pro\s+dal[sš][ií]\s+dom[aá]c[ií]\s+recept\s*/giu,
];

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

function cleanText(value = '') {
  let output = value;
  for (const pattern of RESIDUE_PATTERNS) output = output.replace(pattern, ' ');
  return output.replace(/[ \t]{2,}/gu, ' ');
}

function hasResidue(value = '') {
  return RESIDUE_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(value);
  });
}

const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
let changedPages = 0;
let replacements = 0;
const remaining = [];

for (const file of htmlFiles) {
  const source = await readFile(file, 'utf8');
  const $ = cheerio.load(source);
  const main = $('main').first();
  if (!main.length) continue;

  let changed = false;
  main.find('*').addBack().each((_, element) => {
    const tag = String(element.tagName || '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;

    $(element).contents().each((__, node) => {
      if (node.type !== 'text' || !node.data) return;
      const before = node.data;
      const after = cleanText(before);
      if (after !== before) {
        node.data = after;
        replacements += 1;
        changed = true;
      }
    });
  });

  if (changed) {
    await writeFile(file, $.html(), 'utf8');
    changedPages += 1;
  }

  const visible = main.text().replace(/\s+/gu, ' ').trim();
  if (hasResidue(visible)) {
    remaining.push(path.relative(DIST, file).replaceAll(path.sep, '/'));
  }
}

console.log(`Built editorial residue cleanup: ${changedPages} HTML pages changed; ${replacements} text nodes repaired.`);
if (remaining.length) {
  console.error('Built editorial residue remains in:');
  for (const file of remaining.slice(0, 100)) console.error(`- ${file}`);
  process.exitCode = 1;
}
