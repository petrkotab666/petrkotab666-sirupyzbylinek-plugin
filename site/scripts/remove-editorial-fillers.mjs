import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/articles');

const EDITORIAL_MARKERS = [
  'text byl doplneny tak aby neposobil jako kratka poznamka',
  'obsahuje jasny uvod hlavni klicove slovo prakticky postup',
  'hlavni klicove slovo',
  'rychle shrnuti clanku',
  'seo 90+',
  'produktovy xml feed',
  'xml produktovy feed',
  'affiliate doporuceni',
  'affiliate odkazy',
  'interni odkazy',
  'rozsiruje puvodni kratky clanek',
  'do podrobnejsi a lepe propojene podoby',
  'dobre napsany clanek ma ctenari ukazat',
  'proto je tento text postaveny jako bezpecny pruvodce',
  'nejdrive si ujasnete jestli hledate beznou kuchynskou inspiraci',
  'jednoduchost je v domaci bylinkove praxi casto vyhoda',
];

const BROKEN_FEATURE_MARKERS = [
  'jednoduche recepty',
  'bezpecne pouziti',
  'vhodne i pro deti',
];

const TOPICS = [
  ['repelenty', /komar|klist|repelent|hmyz/u],
  ['pestovani', /pestov|zahrad|sazen|kvetinac|substrat|zalev/u],
  ['zvirata', /\b(?:pes|psi|psa|psu|kocka|kocky|kocku|slepice|slepic|kurata|kurat|drubez|zvire|zvirata|zvirat|kun|kone|kralik|kralici)\b/u],
  ['sber', /sber|sbirat|susit|skladovat|herbar/u],
  ['zavarovani', /zavar|sklenic|lahv|vick|marmelad|dzem/u],
  ['napoje', /limonad|koktejl|napoj|caj|smoothie/u],
  ['recepty', /recept|sirup|tinktur|bonbon|kuchyn|med/u],
  ['krasa', /plet|vlasy|kosmetik|mast|balzam|koupel/u],
  ['vyziva', /vitamin|mineral|kolagen|probiot|protein|omega|horcik/u],
  ['zdravi', /zdravi|imunit|spanek|traven|kasel|bolest|lekarna/u],
];

function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
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

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'mu'));
  if (!match) return '';
  const raw = match[1].trim();
  try {
    return JSON.parse(raw);
  } catch {
    return raw.replace(/^['"]|['"]$/g, '');
  }
}

function setField(frontmatter, name, value) {
  const line = `${name}: ${JSON.stringify(value)}`;
  const pattern = new RegExp(`^${name}:\\s*.*$`, 'mu');
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, line);
  return `${frontmatter.trimEnd()}\n${line}`;
}

function topicKey(title, pagePath) {
  const haystack = normalize(`${title} ${pagePath}`);
  return TOPICS.find(([, pattern]) => pattern.test(haystack))?.[0] || 'bylinky';
}

function removeBrokenFeatureClusters(blocks) {
  const result = [...blocks];
  while (result.length) {
    const normalized = result.map((block) => normalize(block));
    const indexes = BROKEN_FEATURE_MARKERS.map((marker) => normalized.findIndex((block) => block.includes(marker)));
    if (indexes.some((index) => index < 0)) break;

    const first = Math.min(...indexes);
    const last = Math.max(...indexes);
    if (last - first > 12) break;

    const start = Math.max(0, first - 3);
    const end = Math.min(result.length, last + 4);
    result.splice(start, end - start);
  }
  return result;
}

function cleanBody(body) {
  const blocks = body
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/u)
    .map((block) => block.trim())
    .filter(Boolean);

  const withoutEditorialFillers = blocks.filter((block) => {
    const normalized = normalize(block);
    return !EDITORIAL_MARKERS.some((marker) => normalized.includes(marker));
  });

  return removeBrokenFeatureClusters(withoutEditorialFillers)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const files = await filesIn(CONTENT_DIR);
let changed = 0;
let removedBlocks = 0;
let correctedFallbackImages = 0;
const remainingErrors = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const { frontmatter: originalFrontmatter, body: originalBody } = splitDocument(source);
  if (!originalFrontmatter) continue;

  const originalBlockCount = originalBody.split(/\n\s*\n/u).filter((block) => block.trim()).length;
  const body = cleanBody(originalBody);
  const cleanedBlockCount = body.split(/\n\s*\n/u).filter((block) => block.trim()).length;
  removedBlocks += Math.max(0, originalBlockCount - cleanedBlockCount);

  let frontmatter = originalFrontmatter;
  const title = field(frontmatter, 'title');
  const pagePath = field(frontmatter, 'path');
  const expectedImage = `/obrazky/${topicKey(title, pagePath)}.svg`;
  const currentImage = field(frontmatter, 'image');

  if (/^\/obrazky\/[^/]+\.svg$/u.test(currentImage) && currentImage !== expectedImage) {
    frontmatter = setField(frontmatter, 'image', expectedImage);
    correctedFallbackImages += 1;
  }

  const output = `---\n${frontmatter.trim()}\n---\n\n${body}\n`;
  if (output !== source) {
    await writeFile(file, output, 'utf8');
    changed += 1;
  }

  const normalizedBody = normalize(body);
  const remaining = EDITORIAL_MARKERS.filter((marker) => normalizedBody.includes(marker));
  const brokenFeatureBlockRemains = BROKEN_FEATURE_MARKERS.every((marker) => normalizedBody.includes(marker));
  if (remaining.length || brokenFeatureBlockRemains) {
    const details = [...remaining, ...(brokenFeatureBlockRemains ? ['broken feature block'] : [])];
    remainingErrors.push(`${path.relative(ROOT, file)}: ${details.join(', ')}`);
  }
}

console.log(
  `Removed editorial fillers from ${changed}/${files.length} Markdown files; `
  + `${removedBlocks} blocks removed; ${correctedFallbackImages} fallback images corrected.`,
);

if (remainingErrors.length) {
  console.error('Editorial filler remains in:');
  for (const error of remainingErrors.slice(0, 50)) console.error(`- ${error}`);
  process.exitCode = 1;
}
