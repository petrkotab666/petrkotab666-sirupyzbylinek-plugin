import { getCollection, type CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;

const NON_ARTICLE_PATHS = new Set([
  '/bylinkovy-magazin-rady-tipy-inspirace-bylinkovy-magazin/',
  '/bylinkovy-magazin/',
  '/novinky/',
]);

const LEGAL_PATH_PARTS = [
  'ochrana-osobnich-udaju',
  'zasady-cookies',
  'vylouceni-odpovednosti',
  'obchodni-podminky',
];

const EDITORIAL_JUNK = [
  /přepsaný článek se seo strukturou[^.]*\.?/giu,
  /praktický přehled:\s*postup,?\s*bezpečnost,?\s*interní odkazy,?\s*affiliate odkazy a xml produktový feed\.?/giu,
  /interní odkazy,?\s*affiliate doporučení a produktový xml feed[^.]*\.?/giu,
  /hlavní klíčové slovo:[^\n]*/giu,
  /typ článku:[^\n]*/giu,
  /cíl:\s*lepší čitelnost[^\n]*/giu,
  /obsah:\s*postup,?\s*chyby,?\s*bezpečnost,?\s*interní odkazy a affiliate[^\n]*/giu,
  /produktový xml feed:[^\n]*/giu,
];

function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function stripMarkdown(value = '') {
  return value
    .replace(/^---[\s\S]*?---/u, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/^[#>*_`~\-+\d.\s]+/gmu, '')
    .replace(/[|*_`~]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

export function cleanDescription(description = '', body = '') {
  let cleaned = description;
  for (const pattern of EDITORIAL_JUNK) cleaned = cleaned.replace(pattern, ' ');
  cleaned = cleaned
    .replace(/\b(?:seo|xml feed|affiliate odkazy?|interní odkazy?)\b[^.]*\.?/giu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();

  if (cleaned.length < 80) {
    const paragraphs = body
      .replace(/^---[\s\S]*?---/u, '')
      .split(/\n\s*\n/gu)
      .map(stripMarkdown)
      .filter((paragraph) => {
        const text = normalize(paragraph);
        return paragraph.length >= 90
          && !text.includes('rychle shrnuti clanku')
          && !text.includes('produktovy xml feed')
          && !text.includes('affiliate')
          && !text.includes('puvodni kratky clanek');
      });
    cleaned = paragraphs[0] || stripMarkdown(body).slice(0, 220);
  }

  if (cleaned.length > 170) {
    const shortened = cleaned.slice(0, 168);
    cleaned = shortened.replace(/\s+\S*$/u, '').trim();
  }

  cleaned = cleaned.replace(/[,:;\-–—\s]+$/u, '').trim();
  if (!cleaned) return '';
  return /[.!?]$/u.test(cleaned) ? cleaned : `${cleaned}.`;
}

export function wordCount(entry: ArticleEntry) {
  return (entry.body || '').split(/\s+/u).filter(Boolean).length;
}

export function isLegalPage(entry: ArticleEntry) {
  const path = normalize(entry.data.path);
  return LEGAL_PATH_PARTS.some((part) => path.includes(part));
}

export function isEditorialArticle(entry: ArticleEntry) {
  if (entry.data.draft || NON_ARTICLE_PATHS.has(entry.data.path)) return false;
  if (/\/page\/\d+\/$/u.test(entry.data.path) || isLegalPage(entry)) return false;
  return wordCount(entry) >= 120;
}

export async function getPublishedArticles() {
  return (await getCollection('articles', ({ data }) => !data.draft))
    .filter(isEditorialArticle)
    .sort((a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0));
}

export function topicKey(entry: ArticleEntry) {
  const haystack = normalize(`${entry.data.title} ${entry.data.category} ${entry.data.path}`);
  const tests: Array<[string, RegExp]> = [
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
  return tests.find(([, pattern]) => pattern.test(haystack))?.[0] || 'bylinky';
}

export function topicImage(entry: ArticleEntry) {
  return `/obrazky/${topicKey(entry)}.svg`;
}

export function firstBodyImage(entry: ArticleEntry) {
  const match = (entry.body || '').match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/u);
  return match?.[1];
}

export function articleImage(entry: ArticleEntry) {
  return entry.data.image?.trim() || firstBodyImage(entry) || topicImage(entry);
}

export function isMonetizable(entry: ArticleEntry) {
  return !isLegalPage(entry) && wordCount(entry) >= 220;
}

export function articleUrl(entry: ArticleEntry, site: URL | string) {
  return new URL(entry.data.path, site).href;
}
