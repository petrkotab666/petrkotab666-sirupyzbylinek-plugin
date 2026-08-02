import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/articles');
const MEDIA_DIR = path.join(ROOT, 'public/media/imported');
const REPORT_FILE = path.join(ROOT, 'import-report.json');
const BASE = new URL(process.env.WP_BASE_URL || 'https://www.sirupyzbylinek.cz/');
const MAX_PAGES = Number(process.env.MAX_PAGES || 1200);
const IMPORT_IMAGES = process.env.IMPORT_IMAGES !== 'false';
const USER_AGENT = 'SirupyZBylinek migration bot/1.1 (+https://www.sirupyzbylinek.cz/)';

const skipPrefixes = [
  '/wp-admin',
  '/wp-login',
  '/wp-json',
  '/xmlrpc',
  '/feed',
  '/comments',
  '/author/',
  '/tag/',
  '/category/',
  '/search/',
];
const skipExtensions = /\.(?:jpe?g|png|gif|webp|avif|svg|pdf|zip|xml|json|css|js|ico|mp4|mp3|webm|woff2?|ttf)$/i;
const fetched = new Map();
const errors = [];
const downloadedImages = new Map();

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function normalizeUrl(value, parent = BASE) {
  try {
    const url = new URL(value, parent);
    if (url.hostname.replace(/^www\./, '') !== BASE.hostname.replace(/^www\./, '')) return null;
    url.protocol = BASE.protocol;
    url.hostname = BASE.hostname;
    url.hash = '';
    url.search = '';
    url.pathname = url.pathname.replace(/\/+/g, '/');
    if (skipPrefixes.some((prefix) => url.pathname.startsWith(prefix)) || skipExtensions.test(url.pathname)) return null;
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url.href;
  } catch {
    return null;
  }
}

async function fetchText(url, timeoutMs = 25000) {
  if (fetched.has(url)) return fetched.get(url);
  const promise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return {
        text: await response.text(),
        contentType: response.headers.get('content-type') || '',
        finalUrl: response.url,
      };
    } finally {
      clearTimeout(timer);
    }
  })();
  fetched.set(url, promise);
  return promise;
}

async function discoverSitemapUrls() {
  const candidates = new Set([
    new URL('/wp-sitemap.xml', BASE).href,
    new URL('/sitemap_index.xml', BASE).href,
    new URL('/sitemap.xml', BASE).href,
    new URL('/post-sitemap.xml', BASE).href,
    new URL('/page-sitemap.xml', BASE).href,
  ]);

  try {
    const robots = await fetchText(new URL('/robots.txt', BASE).href);
    for (const match of robots.text.matchAll(/^\s*Sitemap:\s*(\S+)/gim)) candidates.add(match[1]);
  } catch (error) {
    errors.push({ type: 'robots', url: new URL('/robots.txt', BASE).href, error: String(error) });
  }

  const pageUrls = new Set();
  const seenMaps = new Set();

  async function readMap(url) {
    if (seenMaps.has(url) || seenMaps.size > 40) return;
    seenMaps.add(url);
    try {
      const result = await fetchText(url);
      if (!/xml/i.test(result.contentType) && !result.text.trimStart().startsWith('<?xml')) return;
      const locs = [...result.text.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => decodeXml(match[1].trim()));
      for (const loc of locs) {
        if (/\.xml(?:$|\?)/i.test(loc)) await readMap(loc);
        else {
          const normalized = normalizeUrl(loc);
          if (normalized) pageUrls.add(normalized);
        }
      }
    } catch (error) {
      errors.push({ type: 'sitemap', url, error: String(error) });
    }
  }

  for (const candidate of candidates) await readMap(candidate);
  return pageUrls;
}

async function crawlInternalLinks(seedUrls) {
  const queue = [...new Set([BASE.href, ...seedUrls])];
  const visited = new Set();

  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);
    try {
      const result = await fetchText(url);
      if (!/html/i.test(result.contentType)) continue;
      const $ = cheerio.load(result.text);
      $('a[href]').each((_, element) => {
        const next = normalizeUrl($(element).attr('href'), url);
        if (next && !visited.has(next) && !queue.includes(next) && visited.size + queue.length < MAX_PAGES * 1.5) {
          queue.push(next);
        }
      });
    } catch (error) {
      errors.push({ type: 'crawl', url, error: String(error) });
    }
  }

  return visited;
}

function cleanText(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function safeSegment(value) {
  return decodeURIComponent(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'stranka';
}

function contentFileFor(pathname) {
  const segments = pathname.split('/').filter(Boolean).map(safeSegment);
  if (!segments.length) return path.join(CONTENT_DIR, 'domu.md');
  return path.join(CONTENT_DIR, ...segments.slice(0, -1), `${segments.at(-1)}.md`);
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function dateOnly(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10);
}

function extensionFrom(contentType, sourceUrl) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/avif': '.avif',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
  };
  const normalizedType = contentType?.split(';')[0]?.toLowerCase();
  if (map[normalizedType]) return map[normalizedType];
  const ext = path.extname(new URL(sourceUrl).pathname).toLowerCase();
  return /^\.(jpe?g|png|webp|avif|gif|svg)$/.test(ext) ? ext.replace('.jpeg', '.jpg') : '.jpg';
}

async function downloadImage(source, pageKey) {
  if (!IMPORT_IMAGES) return source;
  let absolute;
  try {
    absolute = new URL(source, BASE).href;
  } catch {
    return source;
  }

  if (downloadedImages.has(absolute)) return downloadedImages.get(absolute);

  try {
    const response = await fetch(absolute, {
      headers: { 'user-agent': USER_AGENT, accept: 'image/*' },
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > 8 * 1024 * 1024) throw new Error('image larger than 8 MB');

    const ext = extensionFrom(response.headers.get('content-type'), response.url);
    const urlPath = new URL(response.url).pathname;
    const original = safeSegment(path.basename(urlPath, path.extname(urlPath)));
    const hash = crypto.createHash('sha1').update(absolute).digest('hex').slice(0, 8);
    const fileName = `${original}-${hash}${ext}`;
    const targetDir = path.join(MEDIA_DIR, pageKey);
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, fileName), buffer);

    const publicPath = `/media/imported/${pageKey}/${fileName}`;
    downloadedImages.set(absolute, publicPath);
    return publicPath;
  } catch (error) {
    errors.push({ type: 'image', url: absolute, error: String(error) });
    return absolute;
  }
}

function selectBestContent($) {
  const selectors = [
    '[data-elementor-type="single-post"] .elementor-widget-theme-post-content',
    'main article',
    'article',
    'main .page-content',
    '.elementor-widget-theme-post-content',
    '.entry-content',
    'main',
  ];
  const candidates = [];

  selectors.forEach((selector, selectorIndex) => {
    $(selector).each((_, element) => {
      const node = $(element);
      const textLength = cleanText(node.text()).length;
      if (textLength < 120) return;
      const headings = node.find('h1,h2,h3').length;
      const paragraphs = node.find('p').length;
      const lists = node.find('ul,ol').length;
      const priority = (selectors.length - selectorIndex) * 500;
      const score = textLength + headings * 250 + paragraphs * 80 + lists * 100 + priority;
      candidates.push({ selector, element, score, textLength });
    });
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] || null;
}

function removePageChrome(content) {
  content.find([
    'script',
    'style',
    'noscript',
    'iframe',
    'form',
    'button',
    'svg',
    'nav',
    'footer',
    'header',
    '.comments-area',
    '.post-navigation',
    '.sharedaddy',
    '.jp-relatedposts',
    '.cookie',
    '.cky-consent-container',
    '.cmplz-cookiebanner',
    '[class*="cookie"]',
    '[id*="cookie"]',
    '[class*="consent"]',
    '[id*="consent"]',
    '.sidebar',
    '.widget-area',
  ].join(',')).remove();
  content.find('h1').first().remove();
}

async function extractPage(url) {
  const result = await fetchText(url);
  if (!/html/i.test(result.contentType)) return null;

  const $ = cheerio.load(result.text);
  const canonicalRaw = $('link[rel="canonical"]').attr('href');
  const canonical = canonicalRaw ? normalizeUrl(canonicalRaw, url) : url;
  if (canonical && canonical !== url && normalizeUrl(canonical) !== normalizeUrl(url)) return null;

  const selected = selectBestContent($);
  if (!selected) {
    errors.push({ type: 'content-not-found', url, error: 'No content candidate longer than 120 characters.' });
    return null;
  }

  const content = $(selected.element).clone();
  removePageChrome(content);

  const title = cleanText(
    $('h1').first().text()
      || $('meta[property="og:title"]').attr('content')
      || $('title').text().split('|')[0],
  );
  if (!title || title.length < 3) return null;

  const firstParagraph = cleanText(
    content.find('p').filter((_, element) => cleanText($(element).text()).length > 60).first().text(),
  );
  const description = cleanText(
    $('meta[name="description"]').attr('content')
      || $('meta[property="og:description"]').attr('content')
      || firstParagraph,
  ).slice(0, 320);
  const published = dateOnly(
    $('meta[property="article:published_time"]').attr('content')
      || $('time[datetime]').first().attr('datetime'),
  );
  const updated = dateOnly($('meta[property="article:modified_time"]').attr('content'));
  const category = cleanText(
    $('meta[property="article:section"]').attr('content')
      || $('.cat-links a,.category a').first().text()
      || 'Bylinky',
  );

  let image = $('meta[property="og:image"]').attr('content') || content.find('img').first().attr('src');
  const pathname = new URL(url).pathname;
  const pageKey = safeSegment(pathname.split('/').filter(Boolean).join('-') || 'domu');

  const images = content.find('img').toArray().slice(0, 30);
  for (const element of images) {
    const source = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy-src');
    if (!source) continue;
    const local = await downloadImage(source, pageKey);
    $(element)
      .attr('src', local)
      .removeAttr('srcset data-src data-lazy-src sizes loading');
  }
  if (image) image = await downloadImage(image, pageKey);

  content.find('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href) return;
    try {
      const target = new URL(href, url);
      if (target.hostname.replace(/^www\./, '') === BASE.hostname.replace(/^www\./, '')) {
        $(element).attr('href', target.pathname + target.search + target.hash);
      }
    } catch {
      // Invalid legacy links remain untouched for manual review.
    }
  });

  const turndown = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
  });
  turndown.addRule('removeEmptyLinks', {
    filter: (node) => node.nodeName === 'A' && !node.textContent.trim() && !node.querySelector('img'),
    replacement: () => '',
  });

  const markdown = turndown
    .turndown(content.html() || '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const affiliateLinks = (markdown.match(/ehub\.cz/gi) || []).length;

  if (markdown.length < 120 || wordCount < 25) {
    errors.push({
      type: 'content-too-short',
      url,
      selector: selected.selector,
      characters: markdown.length,
      words: wordCount,
      error: 'Selected content was too short after cleanup.',
    });
    return null;
  }

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `path: ${yamlString(pathname.endsWith('/') ? pathname : `${pathname}/`)}`,
    published ? `date: ${yamlString(published)}` : null,
    updated ? `updated: ${yamlString(updated)}` : null,
    image ? `image: ${yamlString(image)}` : null,
    `category: ${yamlString(category || 'Bylinky')}`,
    'featured: false',
    'legacy: true',
    'draft: false',
    `sourceUrl: ${yamlString(url)}`,
    '---',
  ].filter(Boolean).join('\n');

  return {
    pathname,
    file: contentFileFor(pathname),
    body: `${frontmatter}\n\n${markdown}\n`,
    title,
    selector: selected.selector,
    characters: markdown.length,
    words: wordCount,
    affiliateLinks,
  };
}

async function main() {
  await mkdir(CONTENT_DIR, { recursive: true });
  await mkdir(MEDIA_DIR, { recursive: true });

  const sitemapUrls = await discoverSitemapUrls();
  const urls = await crawlInternalLinks(sitemapUrls);
  const pages = [];
  let index = 0;

  for (const url of urls) {
    index += 1;
    if (new URL(url).pathname === '/') continue;
    process.stdout.write(`[${index}/${urls.size}] ${url}\n`);
    try {
      const page = await extractPage(url);
      if (!page) continue;
      await mkdir(path.dirname(page.file), { recursive: true });
      await writeFile(page.file, page.body, 'utf8');
      pages.push({
        url,
        path: page.pathname,
        file: path.relative(ROOT, page.file),
        title: page.title,
        selector: page.selector,
        characters: page.characters,
        words: page.words,
        affiliateLinks: page.affiliateLinks,
      });
    } catch (error) {
      errors.push({ type: 'page', url, error: String(error) });
    }
  }

  const shortPages = pages
    .filter((page) => page.words < 100)
    .map(({ url, path: pagePath, title, selector, words, characters, affiliateLinks }) => ({
      url,
      path: pagePath,
      title,
      selector,
      words,
      characters,
      affiliateLinks,
    }));
  const affiliateHeavyPages = pages
    .filter((page) => page.affiliateLinks >= 4 && page.words < 250)
    .map(({ url, path: pagePath, title, selector, words, affiliateLinks }) => ({
      url,
      path: pagePath,
      title,
      selector,
      words,
      affiliateLinks,
    }));

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE.href,
    sitemapUrls: sitemapUrls.size,
    crawledUrls: urls.size,
    importedPages: pages.length,
    downloadedImages: downloadedImages.size,
    errorCount: errors.length,
    shortPageCount: shortPages.length,
    affiliateHeavyPageCount: affiliateHeavyPages.length,
    shortPages,
    affiliateHeavyPages,
    pages,
    errors,
  };
  await writeFile(REPORT_FILE, JSON.stringify(report, null, 2) + '\n');

  console.log(JSON.stringify({
    importedPages: pages.length,
    downloadedImages: downloadedImages.size,
    errorCount: errors.length,
    shortPageCount: shortPages.length,
    affiliateHeavyPageCount: affiliateHeavyPages.length,
  }));

  if (pages.length < 5) {
    throw new Error('Import found fewer than five usable pages. Review site access and selectors.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
