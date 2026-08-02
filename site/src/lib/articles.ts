import { getCollection, type CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;

const NON_ARTICLE_PATHS = new Set([
  '/bylinkovy-magazin-rady-tipy-inspirace-bylinkovy-magazin/',
  '/bylinkovy-magazin/',
  '/novinky/',
]);

const NON_ARTICLE_TITLES = [
  /^kam pokračovat dál$/iu,
  /^další články(?:,| a|$)/iu,
  /^další témata(?:,| a|$)/iu,
  /^související (?:články|témata)$/iu,
  /^číst dál$/iu,
  /^reklama$/iu,
];

const NON_ARTICLE_DESCRIPTIONS = [
  /další články,? recepty a témata ze stejné oblasti/iu,
  /pokračujte na další související články/iu,
  /rozcestník dalších článků/iu,
];

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

const TOPIC_TESTS: Array<[string, RegExp]> = [
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

const TOPIC_LABELS: Record<string, string> = {
  repelenty: 'Přírodní repelenty',
  pestovani: 'Pěstování bylinek',
  zvirata: 'Bylinky a zvířata',
  sber: 'Sběr a zpracování bylinek',
  zavarovani: 'Zavařování a skladování',
  napoje: 'Bylinkové nápoje',
  recepty: 'Recepty a domácí výroba',
  krasa: 'Přírodní péče',
  vyziva: 'Výživa a doplňky',
  zdravi: 'Přírodní lékárna',
  bylinky: 'Bylinkový magazín',
};

const STOP_WORDS = new Set([
  'a', 'i', 'jak', 'na', 'o', 'od', 'po', 'pro', 'pri', 's', 'se', 'u', 'v', 've', 'z', 'ze',
  'co', 'ktere', 'ktery', 'nejlepsi', 'prirodni', 'domaci', 'recept', 'navod', 'pruvodce',
]);

const GENERIC_IMAGE_NAMES = /(?:^|[-_.])(logo|logotyp|favicon|avatar|placeholder|brand|kampan|banner|reklama)(?:[-_.]|$)|\b(?:300x250|570x240|728x90|970x250|970x310)\b/iu;

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

function words(value = '') {
  return new Set(
    normalize(value)
      .split(/[^a-z0-9]+/u)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );
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

export function isAuxiliaryPage(entry: ArticleEntry) {
  const title = entry.data.title?.trim() || '';
  const description = entry.data.description?.trim() || '';
  if (entry.data.draft || NON_ARTICLE_PATHS.has(entry.data.path)) return true;
  if (/\/page\/\d+\/$/u.test(entry.data.path)) return true;
  if (NON_ARTICLE_TITLES.some((pattern) => pattern.test(title))) return true;
  if (NON_ARTICLE_DESCRIPTIONS.some((pattern) => pattern.test(description))) return true;
  return false;
}

export function isEditorialArticle(entry: ArticleEntry) {
  if (isAuxiliaryPage(entry) || isLegalPage(entry)) return false;
  return wordCount(entry) >= 120;
}

export async function getPublishedArticles() {
  return (await getCollection('articles', ({ data }) => !data.draft))
    .filter(isEditorialArticle)
    .sort((a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0));
}

export function topicKey(entry: ArticleEntry) {
  const haystack = normalize(`${entry.data.title} ${entry.data.path}`);
  return TOPIC_TESTS.find(([, pattern]) => pattern.test(haystack))?.[0] || 'bylinky';
}

export function topicLabel(entry: ArticleEntry) {
  return TOPIC_LABELS[topicKey(entry)] || TOPIC_LABELS.bylinky;
}

export function topicImage(entry: ArticleEntry) {
  return `/obrazky/${topicKey(entry)}.svg`;
}

export function bodyImages(entry: ArticleEntry) {
  const matches = [...(entry.body || '').matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/gu)];
  return matches.map((match) => match[1]).filter(Boolean);
}

export function firstBodyImage(entry: ArticleEntry) {
  return bodyImages(entry).find((image) => !GENERIC_IMAGE_NAMES.test(image));
}

function imageMatchesArticle(entry: ArticleEntry, image?: string) {
  if (!image || GENERIC_IMAGE_NAMES.test(image)) return false;

  if (image.startsWith('/obrazky/')) {
    return image === topicImage(entry);
  }

  if (!image.startsWith('/media/imported/')) return true;

  const imageGroup = image.split('/').filter(Boolean)[2] || '';
  const slug = entry.data.path.split('/').filter(Boolean).at(-1) || '';
  if (imageGroup === slug) return true;

  const imageWords = words(imageGroup);
  const slugWords = words(slug);
  let matches = 0;
  for (const word of imageWords) if (slugWords.has(word)) matches += 1;
  return matches >= 2;
}

export function articleImage(entry: ArticleEntry) {
  const frontmatterImage = entry.data.image?.trim();
  if (imageMatchesArticle(entry, frontmatterImage)) return frontmatterImage as string;

  const bodyImage = bodyImages(entry).find((image) => imageMatchesArticle(entry, image));
  if (bodyImage) return bodyImage;

  return topicImage(entry);
}

export function isMonetizable(entry: ArticleEntry) {
  return !isLegalPage(entry) && !isAuxiliaryPage(entry);
}

export function articleUrl(entry: ArticleEntry, site: URL | string) {
  return new URL(entry.data.path, site).href;
}
