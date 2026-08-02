import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

async function walk(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const target = path.join(directory, name);
    const info = await stat(target);
    if (info.isDirectory()) result.push(...await walk(target));
    else result.push(target);
  }
  return result;
}

function relative(file) {
  return path.relative(DIST, file).replaceAll(path.sep, '/');
}

function outputForPath(pathname) {
  const clean = decodeURIComponent(pathname || '/').replace(/\/+/gu, '/');
  if (clean === '/') return 'index.html';
  if (/\.[a-z0-9]{1,8}$/iu.test(clean)) return clean.replace(/^\//u, '');
  return `${clean.replace(/^\//u, '').replace(/\/$/u, '')}/index.html`;
}

function routeForOutput(output) {
  if (output === 'index.html') return '/';
  if (output.endsWith('/index.html')) return `/${output.slice(0, -'index.html'.length)}`;
  return `/${output}`;
}

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const aliases = new Map([
  ['/bylinkovy-magazin/', '/magazin/'],
  ['/bylinkovy-magazin-rady-tipy-inspirace-bylinkovy-magazin/', '/magazin/'],
  ['/bylinne-sirupy/', '/domaci-sirupy/'],
  ['/bylinne-tinktury/', '/tinktury/'],
  ['/sirupy-pro-zvirata/', '/sirupy-a-recepty-pro-zvirata/'],
  ['/domaci-limonady/', '/recepty-na-domaci-limonady/'],
  ['/domaci-napoje/', '/recepty-na-domaci-limonady/'],
  ['/fresh-limonada/', '/recepty-na-domaci-limonady/fresh-limonady/'],
  ['/letni-napoje/', '/recepty-na-domaci-limonady/'],
  ['/osvezeni/', '/recepty-na-domaci-limonady/'],
  ['/domu/osvedcene-recepty-na-sirupy/', '/osvedcene-recepty/'],
  ['/domu/sber-bylinek/zpracovani-bylin/sirupy-za-studena/', '/bezovy-sirup-za-studena/'],
  ['/zasady-ochrany-osobnich-udaju/', '/zasady-cookies/'],
]);

function targetFor(pathname) {
  const normalized = pathname.toLowerCase();
  if (aliases.has(normalized)) return aliases.get(normalized);
  if (/vylouceni-odpovednosti|ochrana-osobnich|privacy|cookies|gdpr/u.test(normalized)) return '/zasady-cookies/';
  if (/tinktur|kapky|lihov/u.test(normalized)) return '/tinktury/';
  if (/limonad|napoj|smoothie|koktejl|osvezeni/u.test(normalized)) return '/recepty-na-domaci-limonady/';
  if (/sirup/u.test(normalized)) return '/domaci-sirupy/';
  if (/caj|nalev/u.test(normalized)) return '/bylinne-caje/';
  if (/koupel|lazen/u.test(normalized)) return '/bylinne-koupele/';
  if (/mast|balzam|krem|pomada/u.test(normalized)) return '/bylinne-masti-a-balzamy/';
  if (/olej|macerat/u.test(normalized)) return '/bylinne-oleje-a-maceraty/';
  if (/ocet|oxymel/u.test(normalized)) return '/bylinne-octy-a-oxymely/';
  if (/obklad|klokt|para/u.test(normalized)) return '/bylinne-obklady-a-kloktadla/';
  if (/recept|vareni|kuchyn/u.test(normalized)) return '/osvedcene-recepty/';
  if (/zvir|pes|kock|slep|kurat|drubez|kun|kralik/u.test(normalized)) return '/sirupy-a-recepty-pro-zvirata/';
  if (/sber|sbirat|susit|herbar|louka|les/u.test(normalized)) return '/domu/sber-bylinek/';
  if (/pestov|zahon|substrat|sazen|zahrad/u.test(normalized)) return '/jake-bylinky-pestovat-doma/';
  if (/hra|pexeso|kviz|poznej/u.test(normalized)) return '/bylinkova-herna/';
  if (/sleva|nabidk|produkt/u.test(normalized)) return '/aktualni-slevy-a-vyhodne-nabidky-pro-bylinkare/';
  return '/magazin/';
}

function labelFor(pathname) {
  const segment = pathname.split('/').filter(Boolean).at(-1) || 'téma';
  return segment
    .replace(/-/gu, ' ')
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function redirectDocument(pathname, target) {
  const label = labelFor(pathname);
  const title = `${label} – přesunuto | Sirupy z bylinek`;
  const description = `Původní adresa tématu ${label} byla po modernizaci webu přesunuta. Pokračujte do odpovídající části webu Sirupy z bylinek.`;
  return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${escapeHtml(target)}">
<meta http-equiv="refresh" content="0;url=${escapeHtml(target)}">
<style>body{margin:0;font-family:system-ui,sans-serif;background:#fbf8ed;color:#173f25;display:grid;min-height:100vh;place-items:center}.box{width:min(620px,calc(100% - 2rem));padding:2.5rem;border:1px solid #dce5cf;border-radius:26px;background:#fff;text-align:center;box-shadow:0 20px 55px rgba(31,69,38,.12)}h1{font-family:Georgia,serif;font-size:clamp(2rem,6vw,3.5rem);margin:.4rem 0 1rem}p{line-height:1.7;color:#5d6b60}a{display:inline-block;margin-top:1rem;padding:.8rem 1.15rem;border-radius:999px;background:#174c2b;color:white;text-decoration:none;font-weight:800}</style>
</head>
<body><main class="box"><span>Původní adresa byla přesunuta</span><h1>${escapeHtml(label)}</h1><p>${escapeHtml(description)}</p><a href="${escapeHtml(target)}">Pokračovat na správnou stránku →</a></main></body>
</html>`;
}

const initialFiles = await walk(DIST);
const known = new Set(initialFiles.map(relative));
const htmlFiles = initialFiles.filter((file) => file.endsWith('.html'));
const missing = new Map();

for (const file of htmlFiles) {
  const route = routeForOutput(relative(file));
  const html = await readFile(file, 'utf8');
  const $ = cheerio.load(html);
  $('a[href]').each((_, element) => {
    const href = ($(element).attr('href') || '').trim();
    if (!href || href.startsWith('#') || /^(?:https?:|mailto:|tel:|sms:|javascript:)/iu.test(href)) return;
    let url;
    try { url = new URL(href, `https://local.invalid${route}`); } catch { return; }
    if (url.origin !== 'https://local.invalid') return;
    const output = outputForPath(url.pathname);
    if (known.has(output)) return;
    if (/\.[a-z0-9]{1,8}$/iu.test(url.pathname)) return;
    missing.set(url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`, targetFor(url.pathname));
  });
}

let generated = 0;
for (const [pathname, target] of missing) {
  const output = outputForPath(pathname);
  if (known.has(output)) continue;
  const absolute = path.join(DIST, output);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, redirectDocument(pathname, target), 'utf8');
  known.add(output);
  generated += 1;
}

// Interní administrační náhled není indexovatelný, ale pro technickou konzistenci dostane canonical.
const adminFile = path.join(DIST, 'admin/index.html');
try {
  let admin = await readFile(adminFile, 'utf8');
  if (!/<link\b[^>]*rel=["']canonical["']/iu.test(admin)) {
    admin = admin.replace(/<\/head>/iu, '<link rel="canonical" href="/admin/">\n<meta name="robots" content="noindex,nofollow">\n</head>');
    await writeFile(adminFile, admin, 'utf8');
  }
} catch {
  // Admin stránka není povinná.
}

console.log(`Legacy link repair generated ${generated} noindex redirect pages for retired WordPress routes.`);
