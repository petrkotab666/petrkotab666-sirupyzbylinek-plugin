import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const outputDir = path.resolve('recovered-original-assets');
await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 1 });
await page.goto('https://www.sirupyzbylinek.cz/domu/sber-bylinek/', {
  waitUntil: 'networkidle2',
  timeout: 120000,
});
await new Promise((resolve) => setTimeout(resolve, 3000));

const manifest = await page.evaluate(() => {
  const absolute = (value) => {
    try { return new URL(value, location.href).href; } catch { return value; }
  };
  const rectOf = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.x),
      y: Math.round(rect.y + scrollY),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  };
  const images = [...document.querySelectorAll('img')]
    .map((img) => ({
      type: 'img',
      url: absolute(img.currentSrc || img.src),
      alt: img.alt || '',
      classes: img.className || '',
      rect: rectOf(img),
      link: img.closest('a')?.href || '',
      nearbyText: img.closest('article,section,.elementor-element,div')?.innerText?.trim().slice(0, 240) || '',
    }))
    .filter((item) => item.url);

  const backgrounds = [...document.querySelectorAll('body *')]
    .map((element) => {
      const bg = getComputedStyle(element).backgroundImage;
      if (!bg || bg === 'none') return null;
      const urls = [...bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => absolute(match[1]));
      if (!urls.length) return null;
      return {
        type: 'background',
        urls,
        tag: element.tagName,
        classes: element.className || '',
        id: element.id || '',
        rect: rectOf(element),
        link: element.closest('a')?.href || '',
        text: element.innerText?.trim().slice(0, 240) || '',
      };
    })
    .filter(Boolean);

  return {
    title: document.title,
    url: location.href,
    images,
    backgrounds,
  };
});

await writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
await writeFile(path.join(outputDir, 'rendered.html'), await page.content(), 'utf8');
await page.screenshot({ path: path.join(outputDir, 'old-sber-full.png'), fullPage: true });

const urls = new Set();
for (const item of manifest.images) urls.add(item.url);
for (const item of manifest.backgrounds) for (const url of item.urls) urls.add(url);

let index = 0;
for (const url of urls) {
  if (!/^https?:\/\//i.test(url)) continue;
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 original-asset-recovery',
        accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
    if (!response.ok) continue;
    const type = response.headers.get('content-type') || '';
    if (!type.startsWith('image/')) continue;
    const extension = type.includes('png') ? '.png'
      : type.includes('webp') ? '.webp'
      : type.includes('svg') ? '.svg'
      : type.includes('gif') ? '.gif'
      : '.jpg';
    const base = path.basename(new URL(url).pathname).replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 100) || `asset-${index}`;
    const stem = base.replace(/\.[^.]+$/, '');
    const fileName = `${String(index).padStart(3, '0')}-${stem}${extension}`;
    await writeFile(path.join(outputDir, fileName), Buffer.from(await response.arrayBuffer()));
    index += 1;
  } catch {
    // Manifest contains the URL even when a remote asset cannot be downloaded.
  }
}

await browser.close();
console.log(`Recovered manifest with ${manifest.images.length} img elements, ${manifest.backgrounds.length} background elements and ${index} downloaded images.`);
