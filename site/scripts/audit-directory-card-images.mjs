import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PAGE = path.join(DIST, 'osvedcene-recepty', 'index.html');
const EXPECTED_SALVE_IMAGE = '/media/original/cards/masti-a-balzamy-v2.webp';
const errors = [];

const html = await readFile(PAGE, 'utf8');
const $ = cheerio.load(html);
const cards = $('.illustrated-directory-card');
const imageSources = cards.find('img').map((_, image) => ($(image).attr('src') || '').trim()).get();

if (cards.length !== 10) {
  errors.push(`receptář má ${cards.length} hlavních karet místo 10`);
}

for (const src of imageSources) {
  if (!src.endsWith('.webp')) {
    errors.push(`hlavní karta používá jiný formát než WebP: ${JSON.stringify(src)}`);
  }
}

const salveCard = $('a.illustrated-directory-card[href="/bylinne-masti-a-balzamy/"]');
const salveSrc = salveCard.find('img').attr('src') || '';

if (salveCard.length !== 1) {
  errors.push(`karta Masti a balzámy nebyla nalezena přesně jednou`);
}
if (salveSrc !== EXPECTED_SALVE_IMAGE) {
  errors.push(`karta Masti a balzámy používá ${JSON.stringify(salveSrc)} místo ${EXPECTED_SALVE_IMAGE}`);
}

if (salveSrc === EXPECTED_SALVE_IMAGE) {
  const file = path.join(DIST, salveSrc.replace(/^\//u, ''));
  const bytes = await readFile(file);
  const validWebp = bytes.length >= 12
    && bytes.subarray(0, 4).toString('ascii') === 'RIFF'
    && bytes.subarray(8, 12).toString('ascii') === 'WEBP';

  if (!validWebp) errors.push(`soubor pro kartu Masti a balzámy není skutečný WebP`);
  if (bytes.length < 20_000) errors.push(`soubor pro kartu Masti a balzámy je podezřele malý (${bytes.length} B)`);
}

if (errors.length) {
  console.error('Audit obrázků hlavního receptáře selhal:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Audit obrázků hlavního receptáře prošel: ${cards.length} karet, všechny ve WebP, karta Mastí používá samostatný obraz.`);
