import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

const BANNED_VISIBLE_PATTERNS = [
  /rychlé shrnutí článku/iu,
  /hlavní klíčové slovo/iu,
  /seo 90\+/iu,
  /produktový xml feed/iu,
  /xml produktový feed/iu,
  /affiliate doporučení/iu,
  /interní odkazy/iu,
  /rozšiřuje původní krátký článek/iu,
  /text (?:je|byl) postavený jako bezpečný průvodce/iu,
  /praktický základ pro téma/iu,
  /jak z článku vytěžit maximum/iu,
  /seo a uživatelská hodnota článku/iu,
  /rychlá kontrola před publikací/iu,
  /související článek z této dávky/iu,
  /lepší pro čtenáře i pro seo/iu,
  /přehnaná očekávání/iu,
  /příliš mnoho kombinací/iu,
  /označeno tagem/iu,
  /vybavení a suroviny pro další domácí recept/iu,
];

const INLINE_LABEL_REWRITES = [
  [/\s+související článek z této dávky/giu, ''],
];

const BLOCK_SELECTOR = [
  '.article-content p',
  '.article-content li',
  '.article-content h1',
  '.article-content h2',
  '.article-content h3',
  '.article-content h4',
  '.article-content h5',
  '.article-content h6',
  '.article-content blockquote',
  '.article-lead',
  '.heritage-original-content p',
  '.heritage-original-content li',
  '.heritage-original-content h1',
  '.heritage-original-content h2',
  '.heritage-original-content h3',
  '.heritage-original-content h4',
  '.heritage-original-content h5',
  '.heritage-original-content h6',
].join(',');

async function walk(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) result.push(...await walk(target));
    else if (target.endsWith('.html')) result.push(target);
  }
  return result;
}

function normalizeWhitespace(value = '') {
  return value.replace(/\s+/gu, ' ').trim();
}

function rewriteInlineLabels($, root) {
  let rewrites = 0;
  root.find('a, span, strong, em').each((_, element) => {
    const node = $(element);
    if (node.closest('.context-ads, .product-feed, [data-inline-article-ad], .article-inline-ad').length) return;
    node.contents().each((__, child) => {
      if (child.type !== 'text') return;
      let value = child.data || '';
      const original = value;
      for (const [pattern, replacement] of INLINE_LABEL_REWRITES) value = value.replace(pattern, replacement);
      if (value !== original) {
        child.data = value;
        rewrites += 1;
      }
    });
  });
  return rewrites;
}

function removeEditorialBlocks($, root) {
  let removed = 0;
  root.find(BLOCK_SELECTOR).each((_, element) => {
    const node = $(element);
    if (node.closest('.context-ads, .product-feed, [data-inline-article-ad], .article-inline-ad').length) return;
    const text = normalizeWhitespace(node.text());
    if (!text) return;
    if (BANNED_VISIBLE_PATTERNS.some((pattern) => pattern.test(text))) {
      node.remove();
      removed += 1;
    }
  });
  return removed;
}

function stripResidualTextNodes($, root) {
  let rewrites = 0;
  root.find('*').addBack().each((_, element) => {
    const node = $(element);
    if (node.closest('.context-ads, .product-feed, [data-inline-article-ad], .article-inline-ad').length) return;
    node.contents().each((__, child) => {
      if (child.type !== 'text') return;
      let value = child.data || '';
      const original = value;
      for (const pattern of BANNED_VISIBLE_PATTERNS) {
        const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
        value = value.replace(new RegExp(pattern.source, flags), '');
      }
      if (value !== original) {
        child.data = value;
        rewrites += 1;
      }
    });
  });
  return rewrites;
}

function removeEmptyBlocks($, root) {
  let removed = 0;
  root.find('.article-content p, .article-content li, .article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6, .article-lead, .heritage-original-content p, .heritage-original-content li, .heritage-original-content h1, .heritage-original-content h2, .heritage-original-content h3, .heritage-original-content h4, .heritage-original-content h5, .heritage-original-content h6').each((_, element) => {
    const node = $(element);
    if (normalizeWhitespace(node.text()) || node.find('img, video, audio, iframe').length) return;
    node.remove();
    removed += 1;
  });
  return removed;
}

const files = await walk(DIST);
let changedFiles = 0;
let removedBlocks = 0;
let rewrittenNodes = 0;
const remaining = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const $ = cheerio.load(source, { decodeEntities: false });
  const main = $('main');
  if (!main.length) continue;

  rewrittenNodes += rewriteInlineLabels($, main);
  removedBlocks += removeEditorialBlocks($, main);
  rewrittenNodes += stripResidualTextNodes($, main);
  removedBlocks += removeEmptyBlocks($, main);

  const visible = normalizeWhitespace(main.clone().find('.context-ads, .product-feed, [data-inline-article-ad], .article-inline-ad').remove().end().text());
  const found = BANNED_VISIBLE_PATTERNS.filter((pattern) => pattern.test(visible));
  if (found.length) {
    remaining.push(`${path.relative(DIST, file).replaceAll(path.sep, '/')}: ${found.map((pattern) => pattern.toString()).join(', ')}`);
  }

  const output = $.html();
  if (output !== source) {
    await writeFile(file, output, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Built editorial cleanup: ${changedFiles}/${files.length} HTML files changed; ${removedBlocks} blocks removed; ${rewrittenNodes} text nodes rewritten.`);
if (remaining.length) {
  console.error('Visible editorial residue remains after built cleanup:');
  for (const item of remaining.slice(0, 100)) console.error(`- ${item}`);
  process.exitCode = 1;
}
