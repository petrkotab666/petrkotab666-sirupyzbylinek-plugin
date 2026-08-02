import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/articles');

const STOP_WORDS = new Set([
  'a', 'i', 'jak', 'na', 'o', 'od', 'po', 'pro', 'pri', 's', 'se', 'u', 'v', 've', 'z', 'ze',
  'co', 'ktere', 'ktery', 'nejlepsi', 'prirodni', 'domaci', 'recept', 'navod', 'pruvodce',
]);

const TOPICS = [
  ['repelenty', /komar|klist|repelent|hmyz/u],
  ['zvirata', /pes|kock|slep|kurat|drubez|zvirat|kun|kralik/u],
  ['pestovani', /pestov|zahrad|sazen|kvetinac|substrat|zalev/u],
  ['sber', /sber|sbirat|susit|skladovat|herbar/u],
  ['zavarovani', /zavar|sklenic|lahv|vick|marmelad|dzem/u],
  ['napoje', /limonad|koktejl|napoj|caj|smoothie/u],
  ['recepty', /recept|sirup|tinktur|bonbon|kuchyn|med/u],
  ['krasa', /plet|vlasy|kosmetik|mast|balzam|koupel/u],
  ['vyziva', /vitamin|mineral|kolagen|probiot|protein|omega|horcik/u],
  ['zdravi', /zdravi|imunit|spanek|traven|kasel|bolest|lekarna/u],
];

const JUNK_PATTERNS = [
  /přepsaný článek se seo strukturou/iu,
  /praktický přehled:\s*postup/iu,
  /rozšiřuje původní krátký článek/iu,
  /do podrobnější a lépe propojené podoby/iu,
  /interní odkazy/iu,
  /affiliate doporučení/iu,
  /affiliate odkazy/iu,
  /produktový xml feed/iu,
  /xml produktový feed/iu,
  /hlavní klíčové slovo:/iu,
  /typ článku:/iu,
  /cíl:\s*lepší čitelnost/iu,
  /obsah:\s*postup,?\s*chyby/iu,
  /seo 90\+/iu,
  /dobře napsaný článek má čtenáři ukázat/iu,
  /proto je tento text postavený jako bezpečný průvodce/iu,
  /neříká, že jedna bylina nebo jeden recept vyřeší všechno/iu,
  /nejdříve si ujasněte, jestli hledáte běžnou kuchyňskou inspiraci/iu,
  /jednoduchost je v domácí bylinkové praxi často výhoda/iu,
  /co se může hodit k tomuto receptu/iu,
];

const GENERIC_SECTION_MARKERS = [
  'vyberte jednu hlavni surovinu nebo jedno hlavni pravidlo',
  'overte si, ze je bezpecne pro vas ucel',
  'nekombinujte nekolik novinek najednou',
  'kazdou domaci smes nebo vyrobek si oznacte',
  'u zvirat nikdy nepouzivejte alkohol',
];

function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
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
  try { return JSON.parse(raw); } catch { return raw.replace(/^['"]|['"]$/g, ''); }
}

function setField(frontmatter, name, value) {
  const line = `${name}: ${JSON.stringify(value)}`;
  const pattern = new RegExp(`^${name}:\\s*.*$`, 'mu');
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, line);
  return `${frontmatter.trimEnd()}\n${line}`;
}

function stripMarkdown(value = '') {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/^[#>*_`~\-+\d.\s]+/gmu, '')
    .replace(/[|*_`~]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function slugWords(value = '') {
  return new Set(normalize(value).split(/[^a-z0-9]+/u).filter((word) => word.length > 2 && !STOP_WORDS.has(word)));
}

function imageRelevant(image, pagePath) {
  if (!image || !image.startsWith('/media/imported/')) return Boolean(image);
  const parts = image.split('/').filter(Boolean);
  const imageGroup = parts[2] || '';
  const slug = pagePath.split('/').filter(Boolean).at(-1) || '';
  const imageWords = slugWords(imageGroup);
  const slugSet = slugWords(slug);
  let matches = 0;
  for (const word of imageWords) if (slugSet.has(word)) matches += 1;
  return imageGroup === slug || matches >= 2;
}

function topicKey(title, pagePath) {
  const haystack = normalize(`${title} ${pagePath}`);
  return TOPICS.find(([, pattern]) => pattern.test(haystack))?.[0] || 'bylinky';
}

function isAffiliateBlock(block) {
  const normalized = normalize(stripMarkdown(block));
  return /ehub\.cz\/system\/scripts\/click\.php/iu.test(block)
    || normalized === 'reklama'
    || /^\d[\d\s.,]*\s*kč$/iu.test(normalized)
    || normalized === 'zobrazit nabidku'
    || /^(lahve|sklenice|vicka|knihy|doplnky stravy)$/iu.test(normalized);
}

function isJunkBlock(block) {
  const text = stripMarkdown(block);
  if (!text) return false;
  return JUNK_PATTERNS.some((pattern) => pattern.test(text));
}

function removeGenericSections(blocks) {
  const sections = [];
  let current = [];
  for (const block of blocks) {
    if (/^##\s+/u.test(block.trim()) && current.length) {
      sections.push(current);
      current = [block];
    } else {
      current.push(block);
    }
  }
  if (current.length) sections.push(current);

  return sections.flatMap((section) => {
    const heading = normalize(stripMarkdown(section[0] || ''));
    const text = normalize(stripMarkdown(section.join('\n\n')));
    const markerCount = GENERIC_SECTION_MARKERS.filter((marker) => text.includes(marker)).length;

    if (heading.startsWith('prakticky zaklad pro tema')) return [];
    if (heading === 'kdy byt opatrny' && /u zvirat nikdy nepouzivejte alkohol|rizikovych skupin/u.test(text)) return [];
    if (heading === 'vybaveni a skladovani' && text.includes('pro domaci vyrobu se hodi ciste sklenice')) return [];
    if (heading === 'postup krok za krokem' && markerCount >= 2) return [];
    return section;
  });
}

function sanitizeBody(body, frontmatter) {
  const category = normalize(field(frontmatter, 'category'));
  const title = normalize(field(frontmatter, 'title'));
  const rawBlocks = body.replace(/\r\n/g, '\n').split(/\n\s*\n/u).map((block) => block.trim()).filter(Boolean);
  const cleaned = [];
  let skipSummaryList = false;
  let firstContentSeen = false;

  for (const block of rawBlocks) {
    const plain = normalize(stripMarkdown(block));

    if (plain === 'rychle shrnuti clanku' || plain === 'rychle shrnuti clanku:') {
      skipSummaryList = true;
      continue;
    }
    if (skipSummaryList && /^[-*+]\s+/u.test(block.trim())) continue;
    skipSummaryList = false;

    if (isAffiliateBlock(block) || isJunkBlock(block)) continue;
    if (plain && (plain === category || plain === title)) continue;

    if (!firstContentSeen && !/^!\[/u.test(block) && !/^#/u.test(block)) {
      firstContentSeen = true;
      if (plain.length <= 45 && !/[.!?]/u.test(plain)) continue;
    }

    cleaned.push(block);
  }

  return removeGenericSections(cleaned).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

function deriveDescription(current, body, title) {
  let cleaned = current || '';
  for (const pattern of JUNK_PATTERNS) cleaned = cleaned.replace(pattern, ' ');
  cleaned = cleaned.replace(/\s+/gu, ' ').trim();

  if (cleaned.length < 80 || /seo|xml feed|affiliate|interní odkazy/iu.test(cleaned)) {
    const paragraphs = body.split(/\n\s*\n/u)
      .filter((block) => !/^#/u.test(block.trim()) && !/^[-*+]\s+/u.test(block.trim()) && !/^!\[/u.test(block.trim()))
      .map(stripMarkdown)
      .filter((paragraph) => paragraph.length >= 90 && !JUNK_PATTERNS.some((pattern) => pattern.test(paragraph)));
    cleaned = paragraphs[0] || `${title} – praktický přehled s jasnými doporučeními a upozorněním na nejčastější chyby.`;
  }

  if (cleaned.length > 165) cleaned = cleaned.slice(0, 163).replace(/\s+\S*$/u, '').trim();
  cleaned = cleaned.replace(/[,:;\-–—\s]+$/u, '').trim();
  return /[.!?]$/u.test(cleaned) ? cleaned : `${cleaned}.`;
}

const files = await filesIn(CONTENT_DIR);
let changed = 0;
let fallbackImages = 0;
let removedCharacters = 0;
const remainingErrors = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const { frontmatter: originalFrontmatter, body: originalBody } = splitDocument(source);
  if (!originalFrontmatter) continue;

  const title = field(originalFrontmatter, 'title');
  const pagePath = field(originalFrontmatter, 'path');
  let frontmatter = originalFrontmatter;
  const body = sanitizeBody(originalBody, frontmatter);
  const description = deriveDescription(field(frontmatter, 'description'), body, title);
  frontmatter = setField(frontmatter, 'description', description);

  const image = field(frontmatter, 'image');
  if (!imageRelevant(image, pagePath)) {
    frontmatter = setField(frontmatter, 'image', `/obrazky/${topicKey(title, pagePath)}.svg`);
    fallbackImages += 1;
  }

  const output = `---\n${frontmatter.trim()}\n---\n\n${body}\n`;
  if (output !== source) {
    await writeFile(file, output, 'utf8');
    changed += 1;
    removedCharacters += Math.max(0, source.length - output.length);
  }

  if (/hlavní klíčové slovo:|produktový xml feed|xml produktový feed|seo 90\+|affiliate doporučení|interní odkazy/iu.test(body)) {
    remainingErrors.push(path.relative(ROOT, file));
  }
}

console.log(`Sanitized ${changed}/${files.length} Markdown files; removed ${removedCharacters} characters; assigned ${fallbackImages} thematic fallback images.`);
if (remainingErrors.length) {
  console.error('Editorial junk remains in:');
  for (const file of remainingErrors.slice(0, 30)) console.error(`- ${file}`);
  process.exitCode = 1;
}
