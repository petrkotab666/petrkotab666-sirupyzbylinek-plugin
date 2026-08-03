import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];
const stats = {
  articlePages: 0,
  longArticles: 0,
  veryLongArticles: 0,
  inlineAdModules: 0,
  duplicateHeroImages: 0,
  repeatedBodyImages: 0,
};

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

async function required(relativePath) {
  try { return await readFile(path.join(DIST, relativePath), 'utf8'); }
  catch { errors.push(`${relativePath}: stránka se nevygenerovala`); return ''; }
}

function requireLinks(relativePath, html, links) {
  for (const link of links) {
    if (!html.includes(`href="${link}"`)) errors.push(`${relativePath}: chybí obnovený odkaz ${link}`);
  }
}

const home = await required('index.html');
const health = await required('domu/prirodni-lekarna/index.html');
const recipes = await required('osvedcene-recepty/index.html');

if (!home.includes('/media/ui/bylinkova-herna-photo.svg')) errors.push('index.html: karta Bylinkové herny nepoužívá nový fotografický obrázek');
if ((home.match(/illustrated-directory-card--photo/g) || []).length < 6) errors.push('index.html: všech šest hlavních karet nemá obrazovou grafiku');

const healthCards = (health.match(/illustrated-directory-card--photo/g) || []).length;
if (healthCards !== 9) errors.push(`Přírodní lékárna: očekáváno 9 hlavních obrazových karet, nalezeno ${healthCards}`);
requireLinks('domu/prirodni-lekarna/index.html', health, [
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
  '/tinktury/tinktury-spanek-nervy/',
  '/tinktury/tinktury-srdce-krevni-obeh/',
  '/sirupy-a-recepty-pro-zvirata/prirodni-lekarna-pro-zvirata/',
]);

const recipeCards = (recipes.match(/illustrated-directory-card--photo/g) || []).length;
if (recipeCards !== 10) errors.push(`Recepty: očekáváno 10 hlavních obrazových karet, nalezeno ${recipeCards}`);
requireLinks('osvedcene-recepty/index.html', recipes, [
  '/domaci-sirupy/', '/tinktury/', '/recepty-na-domaci-limonady/', '/bylinne-caje/', '/bylinne-koupele/',
  '/bylinne-masti-a-balzamy/', '/bylinne-oleje-a-maceraty/', '/bylinne-octy-a-oxymely/',
  '/bylinne-obklady-a-kloktadla/', '/bylinky-v-kuchyni-recepty/',
  '/domaci-sirupy/sirupy-na-dychani/', '/domaci-sirupy/imunita-a-vitalita/',
  '/tinktury/tinktury-klouby-svaly/', '/recepty-na-domaci-limonady/fermentovane-limonady/',
]);

const allFiles = await filesIn(DIST);
for (const file of allFiles.filter((target) => target.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('class="article-shell')) continue;
  const relative = path.relative(DIST, file).replaceAll(path.sep, '/');
  const $ = cheerio.load(html);
  const article = $('.article-shell').first();
  const monetizable = $('.context-ads').length > 0 || $('.product-feed').length > 0;
  if (!monetizable) continue;
  stats.articlePages += 1;

  if ($('.context-ads').length < 1) errors.push(`${relative}: chybí tematický reklamní blok pod úvodem`);
  if ($('.product-feed').length < 1) errors.push(`${relative}: chybí produktový feed na konci článku`);

  const length = Number(article.attr('data-article-text-length') || 0);
  const inlineAds = $('.article-inline-ad').length;
  stats.inlineAdModules += inlineAds;
  if (length >= 1800) {
    stats.longArticles += 1;
    if (inlineAds < 1) errors.push(`${relative}: dlouhý článek nemá reklamu uvnitř obsahu`);
  }
  if (length >= 7000) {
    stats.veryLongArticles += 1;
    if (inlineAds < 2) errors.push(`${relative}: velmi dlouhý článek nemá druhou reklamu v nižší části`);
  }

  const hero = $('.hero-image').first().attr('src');
  const bodyImages = $('.article-content img').map((_, element) => $(element).attr('src')).get().filter(Boolean);
  if (hero && bodyImages.includes(hero)) {
    stats.duplicateHeroImages += 1;
    errors.push(`${relative}: hlavní obrázek se opakuje v těle článku`);
  }
  const seen = new Set();
  for (const src of bodyImages) {
    if (seen.has(src)) {
      stats.repeatedBodyImages += 1;
      errors.push(`${relative}: obrázek ${src} se v těle článku opakuje`);
      break;
    }
    seen.add(src);
  }
}

console.log(`Restoration audit: health cards=${healthCards}, recipe cards=${recipeCards}, articles=${stats.articlePages}, long=${stats.longArticles}, very long=${stats.veryLongArticles}, inline ads=${stats.inlineAdModules}, duplicate heroes=${stats.duplicateHeroImages}, repeated body images=${stats.repeatedBodyImages}.`);
if (errors.length) {
  console.error('Restoration audit failed:');
  errors.slice(0, 160).forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('Restoration audit passed: původní rozcestníky, obrazová karta herny, reklamy a obrázky článků jsou v pořádku.');
}
