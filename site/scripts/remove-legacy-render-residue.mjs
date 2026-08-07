import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/articles');

const BANNED_RESIDUE = [
  'oznaceno tagem',
  'vybaveni a suroviny pro dalsi domaci recept',
];

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

function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/gu, ' ')
    .trim();
}

function stripMarkdown(value = '') {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gmu, '')
    .replace(/^\s{0,3}(?:[-+*]|\d+[.)])\s+/gmu, '')
    .replace(/^>\s?/gmu, '')
    .replace(/[|*_`~]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function isRawAffiliate(value = '') {
  return /ehub\.cz\/system\/scripts\/click\.php|[?&]a_box=/iu.test(value);
}

function isStandalonePrice(value = '') {
  const plain = normalize(stripMarkdown(value));
  return /^\d[\d\s.,]*\s*kc$/u.test(plain);
}

function isBannedResidue(value = '') {
  const plain = normalize(stripMarkdown(value));
  return BANNED_RESIDUE.some((marker) => plain.includes(marker));
}

function cleanBlock(block) {
  if (isRawAffiliate(block) || isBannedResidue(block)) return '';

  const cleanedLines = block
    .split('\n')
    .filter((line) => {
      const plain = normalize(stripMarkdown(line));
      if (!plain) return true;
      if (/^\d[\d\s.,]*\s*kc$/u.test(plain)) return false;
      if (plain === 'zobrazit nabidku') return false;
      if (BANNED_RESIDUE.some((marker) => plain.includes(marker))) return false;
      return true;
    });

  return cleanedLines.join('\n').trim();
}

function cleanBody(body) {
  return body
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/u)
    .map((block) => cleanBlock(block.trim()))
    .filter(Boolean)
    .join('\n\n')
    .replace(/\n{3,}/gu, '\n\n')
    .trim();
}

const files = await filesIn(CONTENT_DIR);
let changed = 0;
let removedCharacters = 0;
const remainingErrors = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const { frontmatter, body: originalBody } = splitDocument(source);
  if (!frontmatter) continue;

  const body = cleanBody(originalBody);
  const output = `---\n${frontmatter.trim()}\n---\n\n${body}\n`;

  if (output !== source) {
    await writeFile(file, output, 'utf8');
    changed += 1;
    removedCharacters += Math.max(0, source.length - output.length);
  }

  const blocks = body.replace(/\r\n/g, '\n').split(/\n\s*\n/u).filter(Boolean);
  const hasAffiliate = isRawAffiliate(body);
  const hasPrice = blocks.some(isStandalonePrice) || body.split('\n').some(isStandalonePrice);
  const residue = BANNED_RESIDUE.filter((marker) => normalize(stripMarkdown(body)).includes(marker));
  if (hasAffiliate || hasPrice || residue.length) {
    remainingErrors.push(`${path.relative(ROOT, file)}: ${[
      ...(hasAffiliate ? ['raw affiliate link'] : []),
      ...(hasPrice ? ['standalone price'] : []),
      ...residue,
    ].join(', ')}`);
  }
}

console.log(`Legacy render residue cleanup: ${changed}/${files.length} Markdown files changed; removed ${removedCharacters} characters.`);
if (remainingErrors.length) {
  console.error('Legacy render residue remains in:');
  for (const error of remainingErrors.slice(0, 100)) console.error(`- ${error}`);
  process.exitCode = 1;
}
