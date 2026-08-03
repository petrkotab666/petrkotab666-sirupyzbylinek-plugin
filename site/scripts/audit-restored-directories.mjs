import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];
const warnings = [];

const restoredHubs = {
  'domu/sber-bylinek/index.html': {
    minCards: 6,
    requiredLinks: [
      '/domu/sber-bylinek/kdy-sbirat-bylinky/',
      '/domu/co-sbirat/',
      '/etika-sberu/',
      '/sber-bylinek/co-nesbirat/',
      '/kde-a-kam-sbirat-bylinky/',
      '/domu/sber-bylinek/zpracovani-bylin/',
    ],
  },
  'domu/sber-bylinek/kdy-sbirat-bylinky/index.html': { minCards: 8 },
  'domu/co-sbirat/index.html': { minCards: 8 },
  'etika-sberu/index.html': { minCards: 6 },
  'sber-bylinek/co-nesbirat/index.html': { minCards: 6 },
  'kde-a-kam-sbirat-bylinky/index.html': { minCards: 6 },
  'domu/sber-bylinek/zpracovani-bylin/index.html': { minCards: 8 },
  'osvedcene-recepty/index.html': {
    minCards: 11,
    requiredLinks: [
      '/domaci-sirupy/', '/tinktury/', '/recepty-na-domaci-limonady/', '/bylinne-caje/',
      '/bylinne-koupele/', '/bylinne-masti-a-balzamy/', '/bylinne-oleje-a-maceraty/',
      '/bylinne-octy-a-oxymely/', '/bylinne-obklady-a-kloktadla/', '/bylinky-v-kuchyni-recepty/',
      '/sirupy-a-recepty-pro-zvirata/',
    ],
  },
  'domaci-sirupy/index.html': { minCards: 8 },
  'tinktury/index.html': { minCards: 9 },
  'recepty-na-domaci-limonady/index.html': { minCards: 8 },
  'sirupy-a-recepty-pro-zvirata/index.html': { minCards: 8 },
  'domu/prirodni-lekarna/index.html': { minCards: 9 },
};

const legalParts = ['ochrana-osobnich-udaju', 'zasady-cookies', 'vylouceni-odpovednosti', 'obchodni-podminky'];

async function walk(directory) {
  const files = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

async function requiredHtml(relative) {
  try {
    return await readFile(path.join(DIST, relative), 'utf8');
  } catch {
    errors.push(`${relative}: obnovená stránka se nevygenerovala`);
    return '';
  }
}

function normalizedSrc(value = '') {
  try {
    return new URL(value, 'https://www.sirupyzbylinek.cz').pathname;
  } catch {
    return value.split('?')[0].split('#')[0];
  }
}

let restoredCardCount = 0;
for (const [relative, requirement] of Object.entries(restoredHubs)) {
  const html = await requiredHtml(relative);
  if (!html) continue;
  const $ = load(html);
  const h1 = $('h1').length;
  const cards = $('.heritage-directory__card');
  restoredCardCount += cards.length;

  if (h1 !== 1) errors.push(`${relative}: očekáván právě jeden H1, nalezeno ${h1}`);
  if (!$('.heritage-hub-hero__copy').length) errors.push(`${relative}: chybí jednotná centrovaná hlavička rozcestníku`);
  if (!$('.heritage-directory .section-heading.centered-heading').length) errors.push(`${relative}: chybí centrovaný nadpis obrazového rozcestníku`);
  if (cards.length < requirement.minCards) errors.push(`${relative}: očekáváno nejméně ${requirement.minCards} obrazových karet, nalezeno ${cards.length}`);

  cards.each((index, node) => {
    const card = $(node);
    if (!card.attr('href')) errors.push(`${relative}: karta ${index + 1} nemá odkaz`);
    if (!card.find('.heritage-directory__image img').attr('src')) errors.push(`${relative}: karta ${index + 1} nemá obrázek`);
    if (!card.find('.heritage-directory__copy > strong').text().trim()) errors.push(`${relative}: karta ${index + 1} nemá nadpis`);
    if (!card.find('.heritage-directory__copy > b').text().trim()) errors.push(`${relative}: karta ${index + 1} nemá tlačítko`);
  });

  for (const href of requirement.requiredLinks || []) {
    if (!cards.filter(`[href="${href}"]`).length) errors.push(`${relative}: chybí povinný proklik ${href}`);
  }

  if (!$('.context-ads').length) errors.push(`${relative}: obnovený rozcestník nemá reklamní blok`);
  if (!$('.product-feed').length) errors.push(`${relative}: obnovený rozcestník nemá produktový feed`);
}

const home = await requiredHtml('index.html');
if (home) {
  const $ = load(home);
  const gameCard = $('.illustrated-directory-card[href="/bylinkova-herna/"]');
  const gameImage = gameCard.find('img').attr('src') || '';
  if (!gameCard.length) errors.push('index.html: chybí karta Bylinková herna');
  if (gameImage !== '/media/original/home/bylinkova-herna-photo.svg') {
    errors.push(`index.html: Bylinková herna nepoužívá sjednocenou fotografii, nalezeno ${JSON.stringify(gameImage)}`);
  }
}

const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
let articlePages = 0;
let monetizedArticles = 0;
let duplicateHeroImages = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('class="article-shell')) continue;
  articlePages += 1;
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');
  const $ = load(html);
  const isLegal = legalParts.some((part) => relative.includes(part));

  const heroSrc = normalizedSrc($('.article-shell .hero-image').first().attr('src') || '');
  $('.article-shell .article-content img').each((_, node) => {
    const src = normalizedSrc($(node).attr('src') || '');
    if (heroSrc && src === heroSrc) {
      duplicateHeroImages += 1;
      errors.push(`${relative}: hlavní obrázek se opakuje uvnitř textu (${src})`);
    }
  });

  if (isLegal) continue;
  const adBlocks = $('.article-shell .context-ads');
  const primaryAds = $('.article-shell .context-ads[data-ad-placement="primary"]');
  const secondaryAds = $('.article-shell .context-ads[data-ad-placement="secondary"]');
  const adLinks = $('.article-shell .context-ads a[rel*="sponsored"]');
  const productFeeds = $('.article-shell .product-feed');

  if (adBlocks.length < 2) errors.push(`${relative}: článek má jen ${adBlocks.length} reklamní blok(y), požadovány jsou 2`);
  if (primaryAds.length !== 1) errors.push(`${relative}: chybí nebo se opakuje primární reklamní sada`);
  if (secondaryAds.length !== 1) errors.push(`${relative}: chybí nebo se opakuje druhá reklamní sada`);
  if (adLinks.length < 6) errors.push(`${relative}: v tematických reklamách je jen ${adLinks.length} prokliků, požadováno nejméně 6`);
  if (productFeeds.length < 1) errors.push(`${relative}: chybí produktový feed`);
  if (adBlocks.length >= 2 && adLinks.length >= 6 && productFeeds.length >= 1) monetizedArticles += 1;
}

const report = {
  generatedAt: new Date().toISOString(),
  restoredHubPages: Object.keys(restoredHubs).length,
  restoredDirectoryCards: restoredCardCount,
  articlePages,
  fullyMonetizedNonlegalArticles: monetizedArticles,
  duplicateHeroImages,
  errors,
  warnings,
};

await writeFile(path.join(DIST, 'restored-directories-audit.json'), JSON.stringify(report, null, 2), 'utf8');
await writeFile(path.join(DIST, 'restored-directories-audit.md'), [
  '# Audit obnovených rozcestníků a monetizace',
  '',
  `- Obnovených hlavních a podřízených rozcestníků: ${report.restoredHubPages}`,
  `- Obrazových karet v obnovených rozcestnících: ${restoredCardCount}`,
  `- Článků zkontrolovaných na reklamy a obrázky: ${articlePages}`,
  `- Plně monetizovaných neprávních článků: ${monetizedArticles}`,
  `- Opakovaných hlavních obrázků v textu: ${duplicateHeroImages}`,
  `- Chyb: ${errors.length}`,
  '',
  '## Chyby',
  ...(errors.length ? errors.map((error) => `- ${error}`) : ['- Žádné']),
].join('\n'), 'utf8');

console.log(`Restoration audit: ${Object.keys(restoredHubs).length} hub pages, ${restoredCardCount} cards, ${articlePages} articles, ${monetizedArticles} monetized, ${duplicateHeroImages} duplicate hero images, ${errors.length} errors.`);
if (errors.length) {
  errors.slice(0, 150).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
