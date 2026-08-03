import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/articles');

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
  if (!match) return null;
  return { frontmatter: match[1], body: source.slice(match[0].length) };
}

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'mu'));
  if (!match) return '';
  const raw = match[1].trim();
  try { return JSON.parse(raw); } catch { return raw.replace(/^['"]|['"]$/g, ''); }
}

function standaloneImageSource(block) {
  const trimmed = block.trim();
  const linked = trimmed.match(/^\[\s*!\[[^\]]*\]\(([^\s)]+)(?:\s+["'][^"']*["'])?\)\s*\]\([^)]*\)\s*$/u);
  if (linked) return linked[1];
  const direct = trimmed.match(/^!\[[^\]]*\]\(([^\s)]+)(?:\s+["'][^"']*["'])?\)\s*$/u);
  return direct?.[1] || '';
}

const files = await filesIn(CONTENT_DIR);
let changedFiles = 0;
let removedHeroCopies = 0;
let removedRepeatedImages = 0;

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const parsed = splitDocument(source);
  if (!parsed) continue;
  const hero = field(parsed.frontmatter, 'image');
  const blocks = parsed.body.replace(/\r\n/g, '\n').split(/\n\s*\n/u);
  const seen = new Set();
  const output = [];

  for (const block of blocks) {
    const image = standaloneImageSource(block);
    if (!image) {
      output.push(block.trim());
      continue;
    }
    if (hero && image === hero) {
      removedHeroCopies += 1;
      continue;
    }
    if (seen.has(image)) {
      removedRepeatedImages += 1;
      continue;
    }
    seen.add(image);
    output.push(block.trim());
  }

  const body = output.filter(Boolean).join('\n\n').trim();
  const next = `---\n${parsed.frontmatter.trim()}\n---\n\n${body}\n`;
  if (next !== source) {
    await writeFile(file, next, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Duplicate article image cleanup: ${changedFiles} files changed, ${removedHeroCopies} hero copies and ${removedRepeatedImages} repeated image blocks removed.`);
