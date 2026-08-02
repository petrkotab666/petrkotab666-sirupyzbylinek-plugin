import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUTPUT = path.join(ROOT, 'src/data/affiliate-products.json');
const FEED_URL = 'https://www.brainmarket.cz/google/export/products.xml';
const CLICK_BASE = 'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e9a1924a';

function clean(value = '') {
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function field($, item, names) {
  const accepted = new Set(names.map((name) => name.toLowerCase()));
  let value = '';
  $(item).find('*').each((_, element) => {
    if (value) return;
    const rawName = element.tagName || element.name || '';
    const name = rawName.split(':').pop().toLowerCase();
    if (accepted.has(name)) value = clean($(element).text());
  });
  return value;
}

function price(value = '') {
  const normalized = value.replace(/[^0-9,.]/g, '').replace(',', '.');
  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return '';
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(amount) + ' Kč';
}

async function main() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);
  try {
    const response = await fetch(FEED_URL, {
      headers: {
        accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
        'user-agent': 'SirupyZBylinek.cz static feed builder/1.0',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const items = $('item,entry,SHOPITEM,PRODUCT').toArray();
    const seen = new Set();
    const products = [];

    for (const item of items.slice(0, 6000)) {
      const title = field($, item, ['title', 'productname']);
      const brand = field($, item, ['brand', 'manufacturer']);
      const category = field($, item, ['product_type', 'categorytext', 'category']);
      const link = field($, item, ['link', 'url']);
      const image = field($, item, ['image_link', 'imgurl', 'image']);
      const availability = field($, item, ['availability', 'delivery_date']).toLowerCase();
      const rawPrice = field($, item, ['price', 'price_vat']);
      const haystack = clean(`${title} ${brand} ${category}`).toLowerCase();

      if (!title || !link || !image || !haystack.includes('brainmax')) continue;
      if (availability.includes('out of stock') || availability.includes('není skladem')) continue;

      const key = `${title.toLowerCase()}|${link}`;
      if (seen.has(key)) continue;
      seen.add(key);

      products.push({
        title,
        brand,
        category,
        image,
        price: price(rawPrice),
        link: `${CLICK_BASE}&desturl=${encodeURIComponent(link)}`,
        search: clean(`${title} ${brand} ${category}`).toLowerCase(),
      });
    }

    products.sort((a, b) => a.title.localeCompare(b.title, 'cs'));
    await mkdir(path.dirname(OUTPUT), { recursive: true });
    await writeFile(OUTPUT, JSON.stringify(products.slice(0, 120), null, 2) + '\n', 'utf8');
    console.log(`Affiliate feed: ${products.length} products, saved ${Math.min(products.length, 120)}.`);
  } catch (error) {
    console.warn(`Affiliate feed was not refreshed: ${error instanceof Error ? error.message : String(error)}`);
    console.warn('The build continues with the last committed feed snapshot.');
  } finally {
    clearTimeout(timeout);
  }
}

await main();
