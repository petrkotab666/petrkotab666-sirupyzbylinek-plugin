import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/articles');

const BANNED_PHRASES = [
  'označeno tagem',
  'vybavení a suroviny pro další domácí recept',
  'související článek z této dávky',
  'ceny a dostupnost se mohou průběžně měnit',
  'rozhodující jsou údaje v e-shopu',
];

function normalize(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/\u00a0/gu, ' ')
    .toLowerCase()
    .replace(/\s+/gu, ' ')
    .trim();
}

async function filesIn(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) result.push(...await filesIn(target));
    else if (target.endsWith('.md')) result.push(target);
  }
  return result;
}

function splitDocument(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) return { frontmatter: '', body: source };
  return { frontmatter: match[1], body: source.slice(match[0].length) };
}

function blocksOf(body) {
  return body
    .replace(/\r\n/gu, '\n')
    .split(/\n\s*\n/gu)
    .map((block) => block.trim())
    .filter(Boolean);
}

function stripMarkdown(value = '') {
  return String(value)
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/^[#>*_`~+\-\d.\s]+/gmu, '')
    .replace(/[|*_`~]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function isBarePrice(block) {
  const plain = normalize(
    String(block)
      .replace(/<[^>]+>/gu, ' ')
      .replace(/[|*_`~]/gu, ' ')
      .replace(/\s+/gu, ' ')
      .trim(),
  );
  return /^\d[\d\s.,]*\s*kc$/u.test(plain);
}

function cleanRelatedLabels(block) {
  return block
    .replace(/\s+související článek z této dávky(?=\])/giu, '')
    .replace(/\s+další praktické články(?=\])/giu, '')
    .replace(/\s+další podobný recept(?=\])/giu, '')
    .replace(/\s+hlavní rozcestník(?:\s+pro[^\\\]]*)?(?=\])/giu, '')
    .replace(/^##\s+Kam pokračovat dál\s*$/gimu, '## Související články');
}

function isStalePromotion(block) {
  const plain = normalize(stripMarkdown(block));
  const raw = String(block);

  if (/ehub\.cz\/system\/scripts\/click\.php|[?&]a_box=/iu.test(raw)) return true;
  if (isBarePrice(block)) return true;

  if (
    plain === 'reklama'
    || plain === 'zobrazit nabidku'
    || plain === 'dalsi vhodne vybaveni'
    || plain === 'co se muze hodit k tomuto receptu'
    || plain === 'prakticky tip pro domaci pripravu'
    || plain === 'vybaveni a suroviny pro dalsi domaci recept'
    || plain.startsWith('oznaceno tagem')
    || plain.startsWith('ceny a dostupnost se mohou prubezne menit')
    || plain.startsWith('rozhodujici jsou udaje v e shopu')
    || /^prohlednete si .* u partnera\b/u.test(plain)
  ) {
    return true;
  }

  return false;
}

function cleanBody(body) {
  const cleaned = [];
  for (const original of blocksOf(body)) {
    const block = cleanRelatedLabels(original);
    if (isStalePromotion(block)) continue;
    cleaned.push(block);
  }

  return cleaned
    .join('\n\n')
    .replace(/\n{3,}/gu, '\n\n')
    .trim();
}

function remainingProblems(body) {
  const problems = [];
  const normalized = normalize(stripMarkdown(body));

  if (/ehub\.cz\/system\/scripts\/click\.php|[?&]a_box=/iu.test(body)) {
    problems.push('raw affiliate link');
  }
  for (const phrase of BANNED_PHRASES) {
    if (normalized.includes(normalize(phrase))) problems.push(phrase);
  }
  if (blocksOf(body).some(isBarePrice)) problems.push('standalone price');
  return problems;
}

const files = await filesIn(CONTENT_DIR);
let changed = 0;
let removedBlocks = 0;
const errors = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const { frontmatter, body: originalBody } = splitDocument(source);
  if (!frontmatter) continue;

  const before = blocksOf(originalBody).length;
  const body = cleanBody(originalBody);
  const after = blocksOf(body).length;
  removedBlocks += Math.max(0, before - after);

  const output = `---\n${frontmatter.trim()}\n---\n\n${body}\n`;
  if (output !== source) {
    await writeFile(file, output, 'utf8');
    changed += 1;
  }

  const problems = remainingProblems(body);
  if (problems.length) {
    errors.push(`${path.relative(ROOT, file)}: ${[...new Set(problems)].join(', ')}`);
  }
}

console.log(
  `Legacy inline promotion cleanup: ${changed}/${files.length} Markdown files changed; `
  + `${removedBlocks} stale blocks removed.`,
);

if (errors.length) {
  console.error('Legacy inline promotions or editorial labels remain:');
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
  process.exitCode = 1;
}
