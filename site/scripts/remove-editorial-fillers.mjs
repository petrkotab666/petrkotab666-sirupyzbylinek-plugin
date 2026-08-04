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
  'jak z clanku vytezit maximum',
  'seo a uzivatelska hodnota clanku',
  'rychla kontrola pred publikaci',
  'souvisejici clanek z teto davky',
  'lepsi pro ctenare i pro seo',
  'prakticky clanek ma nejvetsi hodnotu tehdy',
  'upozorneni tento clanek ma informacni charakter',
  'kvalitni suroviny jednoduchy postup ciste skladovani interni propojeni',
];

const TEMPLATE_FINGERPRINTS = [
  'rychle shrnuti clanku',
  'seo 90+',
  'produktovy xml feed',
  'jak z clanku vytezit maximum',
  'seo a uzivatelska hodnota clanku',
  'rychla kontrola pred publikaci',
  'rozsiruje puvodni kratky clanek',
  'text postaveny jako bezpecny pruvodce',
  'prakticky zaklad pro tema',
];

const TEMPLATE_SECTION_MARKERS = [
  'prakticky zaklad pro tema',
  'postup krok za krokem',
  'nejcastejsi chyby',
  'vybaveni a skladovani',
  'kdy byt opatrny',
  'jak z clanku vytezit maximum',
  'seo a uzivatelska hodnota clanku',
  'rychla kontrola pred publikaci',
  'shrnuti',
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

function blocksOf(body) {
  return body
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/u)
    .map((block) => block.trim())
    .filter(Boolean);
}

function headingInfo(block) {
  const match = block.match(/^(#{1,6})\s+(.+)$/u);
  return match ? { level: match[1].length, text: match[2].trim(), normalized: normalize(match[2]) } : null;
}

function stripMarkdown(value = '') {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/^[#>*_`~\-+\d.\s]+/gmu, '')
    .replace(/[|*_`~]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function templateScore(body) {
  const normalized = normalize(body);
  return TEMPLATE_FINGERPRINTS.reduce((score, marker) => score + (normalized.includes(marker) ? 1 : 0), 0);
}

function cleanRelatedLabels(block) {
  return block
    .replace(/\[([^\]]+?)\s+související článek z této dávky\]/giu, '[$1]')
    .replace(/\[Bylinkový magazín další praktické články\]/giu, '[Další články v bylinkovém magazínu]')
    .replace(/\[([^\]]+?)\s+hlavní rozcestník(?:\s+pro[^\]]*)?\]/giu, '[$1]')
    .replace(/\[([^\]]+?)\s+další podobný recept\]/giu, '[$1]')
    .replace(/\[([^\]]+?)\s+další praktické články\]/giu, '[$1]');
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

function removeTemplateSections(blocks, isTemplate) {
  if (!isTemplate) return blocks;
  const result = [];
  let skippedLevel = 0;
  for (const block of blocks) {
    const heading = headingInfo(block);
    if (skippedLevel) {
      if (!heading || heading.level > skippedLevel) continue;
      skippedLevel = 0;
    }
    if (heading) {
      const remove = TEMPLATE_SECTION_MARKERS.some((marker) => heading.normalized.includes(marker))
        || heading.normalized.endsWith('co si pohlidat');
      if (remove) {
        skippedLevel = heading.level;
        continue;
      }
    }
    result.push(block);
  }
  return result;
}

function removeRawPromotions(blocks) {
  const result = [];
  let rawFeed = false;
  for (const original of blocks) {
    const block = cleanRelatedLabels(original);
    const normalized = normalize(block);
    const heading = headingInfo(block);

    if (rawFeed) {
      if (heading && heading.level <= 2) {
        rawFeed = false;
      } else {
        continue;
      }
    }

    if (normalized === 'reklama' || /ehub\.cz\/system\/scripts\/click\.php[^\s)]*desturl=/iu.test(block)) {
      rawFeed = true;
      continue;
    }
    if (/ehub\.cz\/system\/scripts\/click\.php/iu.test(block)) continue;
    if (/^\d[\d\s.,]*\s*kč$/iu.test(stripMarkdown(block))) continue;
    if (/^zobrazit nabídku$/iu.test(stripMarkdown(block))) continue;
    if (/^ceny a dostupnost se mohou průběžně měnit/iu.test(stripMarkdown(block))) continue;
    if (/^reklama\s*[·.:–—-]/iu.test(stripMarkdown(block))) continue;
    result.push(block);
  }
  return result;
}

function isRepeatedJunk(block, frequency) {
  const text = stripMarkdown(block);
  if (text.length < 110) return false;
  if (headingInfo(block)) return false;
  if (/^!\[/u.test(block) && text.length < 180) return false;
  const normalized = normalize(text);
  return (frequency.get(normalized) || 0) >= 4;
}

function cleanBody(body, blockFrequency) {
  const isTemplate = templateScore(body) >= 2;
  let blocks = blocksOf(body);
  blocks = removeRawPromotions(blocks);
  blocks = removeTemplateSections(blocks, isTemplate);
  blocks = blocks.filter((block) => {
    const normalized = normalize(block);
    if (EDITORIAL_MARKERS.some((marker) => normalized.includes(marker))) return false;
    if (isRepeatedJunk(block, blockFrequency)) return false;
    return true;
  });
  blocks = removeBrokenFeatureClusters(blocks);
  return blocks
    .map(cleanRelatedLabels)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function meaningfulParagraphs(body) {
  return blocksOf(body)
    .filter((block) => !headingInfo(block))
    .map(stripMarkdown)
    .filter((text) => text.length >= 80)
    .filter((text) => !/^kam pokračovat dál$/iu.test(text))
    .filter((text) => !/^(?:reklama|označeno tagem)/iu.test(text));
}

function cleanDescription(description, title, body) {
  let value = String(description || '')
    .replace(/praktický přehled:\s*postup,?\s*bezpečnost,?\s*interní odkazy,?\s*affiliate odkazy a xml produktový feed\.?/giu, ' ')
    .replace(/domácí recept:\s*suroviny,?\s*postup,?\s*skladování,?\s*bezpečnostní upozornění,?\s*affiliate odkazy a xml produktový feed\.?/giu, ' ')
    .replace(/recept na domácí[^.]*affiliate odkazy a xml feed\.?/giu, ' ')
    .replace(/\b(?:seo 90\+|produktový xml feed|xml produktový feed|affiliate odkazy?|interní odkazy?)\b[^.]*\.?/giu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();

  const normalizedTitle = normalize(title);
  const normalizedValue = normalize(value);
  if (value.length < 70 || normalizedValue === normalizedTitle || normalizedValue.startsWith(`${normalizedTitle} prakticky`)) {
    value = meaningfulParagraphs(body)[0] || '';
  }
  if (!value) value = `Přehled k tématu ${title} s praktickými odkazy a ověřenými informacemi.`;
  if (value.length > 170) {
    value = value.slice(0, 168).replace(/\s+\S*$/u, '').trim();
  }
  value = value.replace(/[,:;\-–—\s]+$/u, '').trim();
  return /[.!?]$/u.test(value) ? value : `${value}.`;
}

const files = await filesIn(CONTENT_DIR);
const documents = [];
const blockFrequency = new Map();

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const parts = splitDocument(source);
  documents.push({ file, source, ...parts });
  const seen = new Set();
  for (const block of blocksOf(parts.body)) {
    const text = stripMarkdown(block);
    if (text.length < 110 || headingInfo(block)) continue;
    const key = normalize(text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    blockFrequency.set(key, (blockFrequency.get(key) || 0) + 1);
  }
}

let changed = 0;
let removedBlocks = 0;
let correctedFallbackImages = 0;
let correctedDescriptions = 0;
const remainingErrors = [];

for (const document of documents) {
  const { file, source, frontmatter: originalFrontmatter, body: originalBody } = document;
  if (!originalFrontmatter) continue;

  const originalBlockCount = blocksOf(originalBody).length;
  const body = cleanBody(originalBody, blockFrequency);
  removedBlocks += Math.max(0, originalBlockCount - blocksOf(body).length);

  let frontmatter = originalFrontmatter;
  const title = field(frontmatter, 'title');
  const pagePath = field(frontmatter, 'path');
  const expectedImage = `/obrazky/${topicKey(title, pagePath)}.svg`;
  const currentImage = field(frontmatter, 'image');

  if (/^\/obrazky\/[^/]+\.svg$/u.test(currentImage) && currentImage !== expectedImage) {
    frontmatter = setField(frontmatter, 'image', expectedImage);
    correctedFallbackImages += 1;
  }

  const oldDescription = field(frontmatter, 'description');
  const newDescription = cleanDescription(oldDescription, title, body);
  if (newDescription !== oldDescription) {
    frontmatter = setField(frontmatter, 'description', newDescription);
    correctedDescriptions += 1;
  }

  const output = `---\n${frontmatter.trim()}\n---\n\n${body}\n`;
  if (output !== source) {
    await writeFile(file, output, 'utf8');
    changed += 1;
  }

  const normalizedBody = normalize(body);
  const remaining = EDITORIAL_MARKERS.filter((marker) => normalizedBody.includes(marker));
  const rawAffiliate = /ehub\.cz\/system\/scripts\/click\.php/iu.test(body);
  const barePrice = blocksOf(body).some((block) => /^\d[\d\s.,]*\s*kč$/iu.test(stripMarkdown(block)));
  if (remaining.length || rawAffiliate || barePrice) {
    const details = [
      ...remaining,
      ...(rawAffiliate ? ['raw affiliate link in article body'] : []),
      ...(barePrice ? ['standalone product price in article body'] : []),
    ];
    remainingErrors.push(`${path.relative(ROOT, file)}: ${details.join(', ')}`);
  }
}

console.log(
  `Editorial cleanup: ${changed}/${files.length} Markdown files changed; `
  + `${removedBlocks} blocks removed; ${correctedDescriptions} descriptions corrected; `
  + `${correctedFallbackImages} fallback images corrected.`,
);

if (remainingErrors.length) {
  console.error('Editorial or raw affiliate filler remains in:');
  for (const error of remainingErrors.slice(0, 100)) console.error(`- ${error}`);
  process.exitCode = 1;
}
