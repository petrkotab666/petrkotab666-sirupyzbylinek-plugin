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
  return decodeEntities(value.replace(/<script\b[\s\S]*?<\/script>/giu, ' ').replace(/<style\b[\s\S]*?<\/style>/giu, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
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

const htmlFiles = (await filesIn(DIST)).filter((file) => file.endsWith('.html'));
const allFiles = new Set((await filesIn(DIST)).map((file) => path.relative(DIST, file).replaceAll(path.sep, '/')));
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

  if (html.includes('class="article-shell')) {
    articlePages += 1;
    const heroCount = (html.match(/class="hero-image"/g) || []).length;
    if (heroCount !== 1) errors.push(`${relative}: expected one hero image, found ${heroCount}`);
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

for (const [relative, html] of [
  ['index.html', home],
  ['magazin/index.html', magazine],
  ['osvedcene-recepty/index.html', recipesLanding],
  ['domu/prirodni-lekarna/index.html', healthLanding],
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

const cultivation = await readRequired('nejcastejsi-chyby-pri-pestovani-bylinek/index.html');
const cultivationText = plainText(cultivation);
const kickerRaw = cultivation.match(/class="article-kicker"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
const heroTag = cultivation.match(/<img\b[^>]*class="hero-image"[^>]*>/i)?.[0]
  || cultivation.match(/<img\b[^>]*class=["'][^"']*hero-image[^"']*["'][^>]*>/i)?.[0]
  || '';
const heroSrc = heroTag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
const kicker = plainText(kickerRaw);

console.log(`Cultivation render check: kicker=${JSON.stringify(kicker)}; heroSrc=${JSON.stringify(heroSrc)}; contextAds=${hasContextAds(cultivation)}; productFeed=${hasProductFeed(cultivation)}`);

if (kicker !== 'Pěstování bylinek') errors.push(`cultivation article: expected category Pěstování bylinek, rendered ${JSON.stringify(kicker)}`);
if (!heroSrc.includes('/obrazky/pestovani.svg')) errors.push(`cultivation article: expected thematic cultivation image, rendered ${JSON.stringify(heroSrc)}`);
requireMonetization('nejcastejsi-chyby-pri-pestovani-bylinek/index.html', cultivation);
for (const pattern of banned) {
  if (pattern.test(cultivationText)) errors.push(`cultivation article: contains banned text ${pattern}`);
}

const repellent = await readRequired('prirodni-repelenty-proti-komarum-a-klistatum/index.html');
const repellentHeroTag = repellent.match(/<img\b[^>]*class="hero-image"[^>]*>/i)?.[0]
  || repellent.match(/<img\b[^>]*class=["'][^"']*hero-image[^"']*["'][^>]*>/i)?.[0]
  || '';
const repellentHeroSrc = repellentHeroTag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
console.log(`Repellent render check: heroSrc=${JSON.stringify(repellentHeroSrc)}; contextAds=${hasContextAds(repellent)}; productFeed=${hasProductFeed(repellent)}`);
if (!repellentHeroSrc) errors.push('repellent article: missing hero image');
if (/(?:logo|logotyp|brand|kampan|banner|placeholder)/iu.test(repellentHeroSrc)) errors.push(`repellent article: generic or advertising image used as hero: ${JSON.stringify(repellentHeroSrc)}`);
if (!repellentHeroSrc.includes('/obrazky/repelenty.svg') && !repellentHeroSrc.includes('/prirodni-repelenty-proti-komarum-a-klistatum/')) {
  errors.push(`repellent article: hero is not tied to the article topic: ${JSON.stringify(repellentHeroSrc)}`);
}
requireMonetization('prirodni-repelenty-proti-komarum-a-klistatum/index.html', repellent);

if (articlePages > 0 && fullyMonetizedArticlePages === 0) errors.push('site: no nonlegal article contains both monetization modules');

if (errors.length) {
  console.error('\nContent quality audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Content quality audit passed: ${htmlFiles.length} HTML pages, ${articlePages} article pages, ${fullyMonetizedArticlePages} fully monetized nonlegal article pages, ${cards} cards on magazine page 1.`);
}
