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
      '/domu/sber-bylinek/kdy-sbirat-bylinky/', '/domu/co-sbirat/', '/etika-sberu/',
      '/sber-bylinek/co-nesbirat/', '/kde-a-kam-sbirat-bylinky/', '/domu/sber-bylinek/zpracovani-bylin/',
    ],
  },
  'domu/sber-bylinek/kdy-sbirat-bylinky/index.html': { minCards: 8 },
  'domu/co-sbirat/index.html': { minCards: 8 },
  'etika-sberu/index.html': { minCards: 6 },
  'sber-bylinek/co-nesbirat/index.html': { minCards: 6 },
  'kde-a-kam-sbirat-bylinky/index.html': { minCards: 6 },
  'domu/sber-bylinek/zpracovani-bylin/index.html': { minCards: 8 },
  'osvedcene-recepty/index.html': {
    minCards: 10,
    requiredLinks: [
      '/domaci-sirupy/', '/tinktury/', '/recepty-na-domaci-limonady/', '/bylinne-caje/',
      '/bylinne-koupele/', '/bylinne-masti-a-balzamy/', '/bylinne-oleje-a-maceraty/',
      '/bylinne-octy-a-oxymely/', '/bylinne-obklady-a-kloktadla/', '/bylinky-v-kuchyni-recepty/',
      '/sirupy-a-recepty-pro-zvirata/',
    ],
  },
  'domaci-sirupy/index.html': {
    minCards: 8,
    requiredLinks: [
      '/domaci-sirupy/sirupy-na-dychani/', '/domaci-sirupy/traveni-a-zazivani/',
      '/domaci-sirupy/imunita-a-vitalita/', '/domaci-sirupy/uklidneni-a-spanek/',
      '/domaci-sirupy/mocove-cesty-a-ledviny/', '/domaci-sirupy/pohybovy-aparat-a-kuze/',
    ],
  },
  'tinktury/index.html': {
    minCards: 9,
    requiredLinks: [
      '/tinktury/dychaci-cesty-a-nachlazeni/', '/tinktury/tinktury-imunita-dychani/',
      '/tinktury/tinktury-traveni-metabolismus/', '/tinktury/tinktury-spanek-nervy/',
      '/tinktury/tinktury-srdce-krevni-obeh/', '/tinktury/tinktury-klouby-svaly/',
      '/tinktury/tinktury-mocove-cesty-ledviny/', '/tinktury/tinktury-zeny-muzi/',
      '/tinktury/tinktury-detoxikace-ocista/',
    ],
  },
  'recepty-na-domaci-limonady/index.html': {
    minCards: 8,
    requiredLinks: [
      '/recepty-na-domaci-limonady/limonady-ze-sirupu/',
      '/recepty-na-domaci-limonady/limonady-z-bylinneho-vyluhu/',
      '/recepty-na-domaci-limonady/fresh-limonady/',
      '/recepty-na-domaci-limonady/macerovane-limonady/',
      '/recepty-na-domaci-limonady/fermentovane-limonady/',
    ],
  },
  'sirupy-a-recepty-pro-zvirata/index.html': {
    minCards: 8,
    requiredLinks: [
      '/sirupy-a-recepty-pro-zvirata/dychaci-ustroji-zvirat/',
      '/sirupy-a-recepty-pro-zvirata/imunitni-system-zvirat/',
      '/sirupy-a-recepty-pro-zvirata/klid-a-psychika-zvirat/',
      '/sirupy-a-recepty-pro-zvirata/kuze-a-srst-zvirat/',
      '/sirupy-a-recepty-pro-zvirata/pohybovy-aparat-zvirat/',
      '/sirupy-a-recepty-pro-zvirata/zazivani-zvirat/',
      '/sirupy-a-recepty-pro-zvirata/prirodni-lekarna-pro-zvirata/',
    ],
  },
  'tinktury-pro-zvirata-2/index.html': {
    minCards: 6,
    requiredLinks: [
      '/tinktury-pro-zvirata-2/t-dychaci-ustroji-zvirat/',
      '/tinktury-pro-zvirata-2/t-imunitni-system-zvirat/',
      '/tinktury-pro-zvirata-2/t-klid-a-psychika-zvirat/',
      '/tinktury-pro-zvirata-2/t-kuze-a-srst-zvirat/',
      '/tinktury-pro-zvirata-2/t-pohybovy-aparat-zvirat/',
      '/tinktury-pro-zvirata-2/t-zazivani-zvirat/',
    ],
  },
  'domu/prirodni-lekarna/index.html': {
    minCards: 9,
    requiredLinks: [
      '/prirodni-pomocnici-pro-imunitu/',
      '/nejlepsi-bylinky-na-kasel-a-prudusky-prirodni-pomoc-pri-nachlazeni/',
      '/prirodni-pomocnici-pro-traveni-a-zazivani/',
      '/nejlepsi-bylinky-na-spanek-a-uklidneni-prirodni-pomoc-pri-nespavosti-a-stresu/',
      '/bylinne-tinktury-na-srdce/',
      '/prirodni-pomocnici-pro-mocove-cesty/',
      '/prirodni-pomocnici-pro-pohybovy-aparat-a-kuzi/',
      '/nejlepsi-bylinky-pro-zeny/',
      '/prirodni-sila-pro-detoxikaci-a-ocistu/',
      '/tinktury/tinktury-imunita-dychani/',
      '/sirupy-a-recepty-pro-zvirata/prirodni-lekarna-pro-zvirata/',
    ],
  },
};

for (const relative of [
  'domaci-sirupy/sirupy-na-dychani/index.html',
  'domaci-sirupy/traveni-a-zazivani/index.html',
  'domaci-sirupy/imunita-a-vitalita/index.html',
  'domaci-sirupy/uklidneni-a-spanek/index.html',
  'domaci-sirupy/mocove-cesty-a-ledviny/index.html',
  'domaci-sirupy/pohybovy-aparat-a-kuze/index.html',
  'tinktury/dychaci-cesty-a-nachlazeni/index.html',
  'tinktury/tinktury-imunita-dychani/index.html',
  'tinktury/tinktury-traveni-metabolismus/index.html',
  'tinktury/tinktury-spanek-nervy/index.html',
  'tinktury/tinktury-srdce-krevni-obeh/index.html',
  'tinktury/tinktury-klouby-svaly/index.html',
  'tinktury/tinktury-mocove-cesty-ledviny/index.html',
  'tinktury/tinktury-zeny-muzi/index.html',
  'tinktury/tinktury-detoxikace-ocista/index.html',
  'recepty-na-domaci-limonady/limonady-ze-sirupu/index.html',
  'recepty-na-domaci-limonady/limonady-z-bylinneho-vyluhu/index.html',
  'recepty-na-domaci-limonady/fresh-limonady/index.html',
  'recepty-na-domaci-limonady/macerovane-limonady/index.html',
  'recepty-na-domaci-limonady/fermentovane-limonady/index.html',
  'sirupy-a-recepty-pro-zvirata/dychaci-ustroji-zvirat/index.html',
  'sirupy-a-recepty-pro-zvirata/imunitni-system-zvirat/index.html',
  'sirupy-a-recepty-pro-zvirata/klid-a-psychika-zvirat/index.html',
  'sirupy-a-recepty-pro-zvirata/kuze-a-srst-zvirat/index.html',
  'sirupy-a-recepty-pro-zvirata/pohybovy-aparat-zvirat/index.html',
  'sirupy-a-recepty-pro-zvirata/zazivani-zvirat/index.html',
  'sirupy-a-recepty-pro-zvirata/prirodni-lekarna-pro-zvirata/index.html',
  'tinktury-pro-zvirata-2/t-dychaci-ustroji-zvirat/index.html',
  'tinktury-pro-zvirata-2/t-imunitni-system-zvirat/index.html',
  'tinktury-pro-zvirata-2/t-klid-a-psychika-zvirat/index.html',
  'tinktury-pro-zvirata-2/t-kuze-a-srst-zvirat/index.html',
  'tinktury-pro-zvirata-2/t-pohybovy-aparat-zvirat/index.html',
  'tinktury-pro-zvirata-2/t-zazivani-zvirat/index.html',
]) {
  restoredHubs[relative] = { minCards: 1 };
}

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

function directoryCards($) {
  const illustrated = $('.illustrated-directory-card');
  return illustrated.length ? illustrated : $('.heritage-directory__card');
}

function cardImage(card) {
  return card.find('.illustrated-directory-art img, .heritage-directory__image img').first().attr('src') || '';
}

function cardTitle(card) {
  return card.find('.illustrated-directory-copy > strong, .heritage-directory__copy > strong').first().text().trim();
}

function cardButton(card) {
  return card.find('.illustrated-directory-copy > b, .heritage-directory__copy > b').first().text().trim();
}

let restoredCardCount = 0;
for (const [relative, requirement] of Object.entries(restoredHubs)) {
  const html = await requiredHtml(relative);
  if (!html) continue;
  const $ = load(html);
  const cards = directoryCards($);
  restoredCardCount += cards.length;

  if ($('.article-shell').length) errors.push(`${relative}: obnovený rozcestník se stále vykresluje jako běžný článek`);
  if ($('h1').length !== 1) errors.push(`${relative}: očekáván právě jeden H1, nalezeno ${$('h1').length}`);
  if (!$('.heritage-hub-hero__copy, .visual-section-hero-copy').length) {
    errors.push(`${relative}: chybí jednotná centrovaná hlavička rozcestníku`);
  }
  if (!$('.heritage-directory .section-heading.centered-heading, .restored-hub-section .section-heading.centered-heading').length) {
    errors.push(`${relative}: chybí centrovaný nadpis obrazového rozcestníku`);
  }
  if (cards.length < requirement.minCards) {
    errors.push(`${relative}: očekáváno nejméně ${requirement.minCards} obrazových karet, nalezeno ${cards.length}`);
  }

  cards.each((index, node) => {
    const card = $(node);
    if (!card.attr('href')) errors.push(`${relative}: karta ${index + 1} nemá odkaz`);
    if (!cardImage(card)) errors.push(`${relative}: karta ${index + 1} nemá obrázek`);
    if (!cardTitle(card)) errors.push(`${relative}: karta ${index + 1} nemá nadpis`);
    if (!cardButton(card)) errors.push(`${relative}: karta ${index + 1} nemá tlačítko`);
  });

  for (const href of requirement.requiredLinks || []) {
    if (!$(`a[href="${href}"]`).length) errors.push(`${relative}: chybí povinný proklik ${href}`);
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
  const adLinks = $('.article-shell .context-ads a[rel*="sponsored"]');
  const productFeeds = $('.article-shell .product-feed');

  if (adBlocks.length < 1) errors.push(`${relative}: chybí tematický reklamní blok`);
  if (adLinks.length < 3) errors.push(`${relative}: v tematické reklamě jsou jen ${adLinks.length} prokliky, požadovány jsou nejméně 3`);
  if (productFeeds.length < 1) errors.push(`${relative}: chybí produktový feed`);
  if (adBlocks.length >= 1 && adLinks.length >= 3 && productFeeds.length >= 1) monetizedArticles += 1;
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
  errors.slice(0, 180).forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
