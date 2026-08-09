import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];

const LEGAL_PATH_PARTS = [
  'ochrana-osobnich-udaju',
  'zasady-cookies',
  'vylouceni-odpovednosti',
  'obchodni-podminky',
];

const BROKEN_FEATURE_MARKERS = [
  /jednoduché recepty/iu,
  /bezpečné použití/iu,
  /vhodné i pro děti/iu,
];

const PHOTO_EXT = /\.(?:avif|jpe?g|png|webp)(?:[?#].*)?$/iu;
const SVG_EXT = /\.svg(?:[?#].*)?$/iu;

async function filesIn(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) result.push(...await filesIn(target));
    else result.push(target);
  }
  return result;
}

async function readRequired(relativePath) {
  const target = path.join(DIST, relativePath);
  try {
    return await readFile(target, 'utf8');
  } catch {
    errors.push(`${relativePath}: required generated page is missing`);
    return '';
  }
}

function decodeEntities(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function plainText(value = '') {
  return decodeEntities(
    value
      .replace(/<script\b[\s\S]*?<\/script>/giu, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/giu, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function isLegalPath(relativePath) {
  const normalized = relativePath.toLowerCase();
  return LEGAL_PATH_PARTS.some((part) => normalized.includes(part));
}

function hasContextAds(html) {
  return html.includes('class="context-ads"');
}

function hasProductFeed(html) {
  return html.includes('class="product-feed"');
}

function requireMonetization(relativePath, html) {
  if (!html) return;
  if (!hasContextAds(html)) errors.push(`${relativePath}: missing clickable contextual advertising module`);
  if (!hasProductFeed(html)) errors.push(`${relativePath}: missing affiliate product feed module`);
}

function htmlPathForHref(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return 'index.html';
  if (/^https?:\/\//iu.test(clean) || clean.startsWith('mailto:') || clean.startsWith('tel:')) return null;
  if (clean.endsWith('.xml')) return clean.replace(/^\//u, '');
  return `${clean.replace(/^\//u, '').replace(/\/$/u, '')}/index.html`;
}

function heroSrcFrom(html) {
  const heroTag = html.match(/<img\b[^>]*class=["'][^"']*hero-image[^"']*["'][^>]*>/iu)?.[0] || '';
  return heroTag.match(/\bsrc=["']([^"']+)["']/iu)?.[1] || '';
}

function requirePhotographicHero(label, src) {
  if (!src) {
    errors.push(`${label}: missing hero image`);
    return;
  }
  if (SVG_EXT.test(src)) errors.push(`${label}: SVG is forbidden as hero: ${JSON.stringify(src)}`);
  if (!PHOTO_EXT.test(src)) errors.push(`${label}: hero is not a supported photographic raster image: ${JSON.stringify(src)}`);
  if (/(?:logo|logotyp|brand|kampan|banner|placeholder)/iu.test(src)) {
    errors.push(`${label}: generic, logo or advertising image used as hero: ${JSON.stringify(src)}`);
  }
}

const allGeneratedFiles = await filesIn(DIST);
const htmlFiles = allGeneratedFiles.filter((file) => file.endsWith('.html'));
const allFiles = new Set(allGeneratedFiles.map((file) => path.relative(DIST, file).replaceAll(path.sep, '/')));
const banned = [
  /přepsaný článek se seo strukturou/iu,
  /hlavní klíčové slovo:/iu,
  /produktový xml feed/iu,
  /xml produktový feed/iu,
  /cíl:\s*lepší čitelnost/iu,
  /seo 90\+/iu,
  /rychlé shrnutí článku/iu,
  /rozšiřuje původní krátký článek/iu,
  /affiliate doporučení/iu,
  /interní odkazy/iu,
];

let articlePages = 0;
let fullyMonetizedArticlePages = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const visibleText = plainText(html);
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');

  for (const pattern of banned) {
    if (pattern.test(visibleText)) errors.push(`${relative}: contains banned editorial text ${pattern}`);
  }

  if (BROKEN_FEATURE_MARKERS.every((pattern) => pattern.test(visibleText))) {
    errors.push(`${relative}: contains the broken three-column legacy feature block`);
  }

  if (html.includes('class="article-shell')) {
    articlePages += 1;
    const heroCount = (html.match(/class="hero-image"/g) || []).length;
    if (heroCount !== 1) errors.push(`${relative}: expected one hero image, found ${heroCount}`);
    const articleHero = heroSrcFrom(html);
    if (articleHero) requirePhotographicHero(relative, articleHero);
    if (!html.includes('property="og:image"')) errors.push(`${relative}: missing Open Graph image`);
    if (!html.includes('application/ld+json')) errors.push(`${relative}: missing structured data`);

    if (!isLegalPath(relative)) {
      requireMonetization(relative, html);
      if (hasContextAds(html) && hasProductFeed(html)) fullyMonetizedArticlePages += 1;
    }
  }
}

const home = await readRequired('index.html');
const magazine = await readRequired('magazin/index.html');
const recipesLanding = await readRequired('osvedcene-recepty/index.html');
const healthLanding = await readRequired('domu/prirodni-lekarna/index.html');
const gamesLanding = await readRequired('bylinkova-herna/index.html');
const memoryGame = await readRequired('bylinkove-pexeso/index.html');
const identifyGame = await readRequired('poznej-bylinku/index.html');
const quizGame = await readRequired('bylinkovy-mistr/index.html');
const dealsLanding = await readRequired('aktualni-slevy-a-vyhodne-nabidky-pro-bylinkare/index.html');

for (const [relative, html] of [
  ['index.html', home],
  ['magazin/index.html', magazine],
  ['osvedcene-recepty/index.html', recipesLanding],
  ['domu/prirodni-lekarna/index.html', healthLanding],
  ['bylinkova-herna/index.html', gamesLanding],
  ['bylinkove-pexeso/index.html', memoryGame],
  ['poznej-bylinku/index.html', identifyGame],
  ['bylinkovy-mistr/index.html', quizGame],
  ['aktualni-slevy-a-vyhodne-nabidky-pro-bylinkare/index.html', dealsLanding],
]) {
  requireMonetization(relative, html);
}

for (const file of htmlFiles) {
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');
  if (!/^magazin\/(?:\d+\/)?index\.html$/u.test(relative)) continue;
  const html = await readFile(file, 'utf8');
  requireMonetization(relative, html);
}

const cards = (magazine.match(/class="article-card"/g) || []).length;
if (cards > 12) errors.push(`magazin/index.html: expected at most 12 article cards, found ${cards}`);
if (cards === 0) errors.push('magazin/index.html: no article cards found');
const magazineText = plainText(magazine);
if (/kam pokračovat dál/iu.test(magazineText)) errors.push('magazin/index.html: auxiliary block “Kam pokračovat dál” is rendered as an article');
if (/další články,? recepty a témata ze stejné oblasti/iu.test(magazineText)) errors.push('magazin/index.html: auxiliary related-content description is rendered as an article');
for (const oldUtilityTitle of ['Bylinkové pexeso: praktický bezpečný průvodce', 'Poznej bylinku: praktický bezpečný průvodce', 'Bylinkový mistr: praktický bezpečný průvodce', 'Slevy a výhodné nabídky pro bylinkáře']) {
  if (magazineText.includes(oldUtilityTitle)) errors.push(`magazin/index.html: dedicated utility page is still rendered as an article: ${oldUtilityTitle}`);
}

const navMatch = home.match(/<nav\b[^>]*id="main-menu"[^>]*>([\s\S]*?)<\/nav>/iu);
if (!navMatch) {
  errors.push('index.html: main navigation was not rendered');
} else {
  const hrefs = [...navMatch[1].matchAll(/href=["']([^"']+)["']/giu)].map((match) => match[1]);
  const requiredLabels = ['Úvod', 'Sběr bylinek', 'Magazín', 'Herna', 'Recepty', 'Přírodní lékárna', 'Slevy'];
  const navText = plainText(navMatch[1]);
  for (const label of requiredLabels) {
    if (!navText.includes(label)) errors.push(`index.html: navigation is missing ${label}`);
  }
  for (const href of hrefs) {
    const generated = htmlPathForHref(href);
    if (generated && !allFiles.has(generated)) errors.push(`index.html: navigation target ${href} does not generate ${generated}`);
  }
}

const gameRoutes = ['/bylinkove-pexeso/', '/poznej-bylinku/', '/bylinkovy-mistr/'];
const gameLaunchCount = gameRoutes.filter((route) => gamesLanding.includes(`href="${route}"`)).length;
const directoryCards = (gamesLanding.match(/class="[^"]*illustrated-directory-card[^"]*"/gu) || []).length;
if (gameLaunchCount !== 3) errors.push(`bylinkova-herna/index.html: expected 3 playable game links, found ${gameLaunchCount}`);
if (directoryCards !== 3) errors.push(`bylinkova-herna/index.html: expected 3 photographic game cards, found ${directoryCards}`);
for (const route of gameRoutes) {
  if (!gamesLanding.includes(`href="${route}"`)) errors.push(`bylinkova-herna/index.html: missing game link ${route}`);
}
if (!memoryGame.includes('data-game="memory"')) errors.push('bylinkove-pexeso/index.html: memory game interface is missing');
if (!identifyGame.includes('data-game="identify"')) errors.push('poznej-bylinku/index.html: identification game interface is missing');
if (!quizGame.includes('data-game="quiz"')) errors.push('bylinkovy-mistr/index.html: quiz interface is missing');

const dealCards = (dealsLanding.match(/class="deal-card"/g) || []).length;
const dealImages = (dealsLanding.match(/class="deal-image"/g) || []).length;
const dealPrices = (dealsLanding.match(/class="deal-price"/g) || []).length;
const dealButtons = (dealsLanding.match(/class="product-button"/g) || []).length;
if (dealCards < 8) errors.push(`deals page: expected at least 8 functional product cards, found ${dealCards}`);
if (dealImages !== dealCards) errors.push(`deals page: expected one image link per card, found ${dealImages}/${dealCards}`);
if (dealPrices !== dealCards) errors.push(`deals page: expected one current price per card, found ${dealPrices}/${dealCards}`);
if (dealButtons < dealCards) errors.push(`deals page: expected a clickable button on every card, found ${dealButtons}/${dealCards}`);
const dealsText = plainText(dealsLanding);
if (/načítáme další výhodné nabídky/iu.test(dealsText)) errors.push('deals page: old loading placeholder is still visible');

const cultivation = await readRequired('nejcastejsi-chyby-pri-pestovani-bylinek/index.html');
const cultivationText = plainText(cultivation);
const kickerRaw = cultivation.match(/class="article-kicker"[^>]*>([\s\S]*?)<\/div>/iu)?.[1] || '';
const cultivationHeroSrc = heroSrcFrom(cultivation);
const kicker = plainText(kickerRaw);
console.log(`Cultivation render check: kicker=${JSON.stringify(kicker)}; heroSrc=${JSON.stringify(cultivationHeroSrc)}; contextAds=${hasContextAds(cultivation)}; productFeed=${hasProductFeed(cultivation)}`);
if (kicker !== 'Pěstování bylinek') errors.push(`cultivation article: expected category Pěstování bylinek, rendered ${JSON.stringify(kicker)}`);
requirePhotographicHero('cultivation article', cultivationHeroSrc);
requireMonetization('nejcastejsi-chyby-pri-pestovani-bylinek/index.html', cultivation);
for (const pattern of banned) {
  if (pattern.test(cultivationText)) errors.push(`cultivation article: contains banned text ${pattern}`);
}

const repellent = await readRequired('prirodni-repelenty-proti-komarum-a-klistatum/index.html');
const repellentHeroSrc = heroSrcFrom(repellent);
console.log(`Repellent render check: heroSrc=${JSON.stringify(repellentHeroSrc)}; contextAds=${hasContextAds(repellent)}; productFeed=${hasProductFeed(repellent)}`);
requirePhotographicHero('repellent article', repellentHeroSrc);
if (repellentHeroSrc && cultivationHeroSrc && repellentHeroSrc === cultivationHeroSrc) {
  errors.push(`repellent article: hero duplicates cultivation article hero ${JSON.stringify(repellentHeroSrc)}`);
}
requireMonetization('prirodni-repelenty-proti-komarum-a-klistatum/index.html', repellent);

if (articlePages > 0 && fullyMonetizedArticlePages === 0) errors.push('site: no nonlegal article contains both monetization modules');

if (errors.length) {
  console.error('\nContent quality audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Content quality audit passed: ${htmlFiles.length} HTML pages, ${articlePages} article pages, ${fullyMonetizedArticlePages} fully monetized nonlegal article pages, ${cards} cards on magazine page 1, ${gameLaunchCount} games and ${dealCards} deal cards.`);
}
