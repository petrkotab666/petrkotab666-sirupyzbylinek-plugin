import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(siteRoot, 'public');
const sourcePhotoRoots = [
  path.join(publicRoot, 'media/imported'),
  path.join(publicRoot, 'media/original'),
];
const outputDir = path.join(publicRoot, 'media/generated/prirodni-lekarna');
const generatedPoolFile = path.join(siteRoot, 'src/lib/hub-photo-pool.generated.ts');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const photoSources = [
  {
    key: '3obr-07cd0380',
    source: 'public/media/imported/prirodni-sila-pro-imunitu-a-obranyschopnost/3obr-07cd0380.png',
  },
  {
    key: 'byliny-6083d43d',
    source: 'public/media/imported/jak-kombinovat-bylinky/byliny-6083d43d.png',
  },
  {
    key: 'sirupyuvod-78eb30cb',
    source: 'public/media/imported/medunkovy-sirup/sirupyuvod-78eb30cb.png',
  },
  {
    key: 'sklenice-na-sirupy-a-zavarovani-4b170c4d',
    source: 'public/media/imported/sklenice-na-sirupy-a-zavarovani/sklenice-na-sirupy-a-zavarovani-4b170c4d.webp',
  },
  {
    key: 'byliny-300x300-eca005d2',
    source: 'public/media/imported/nejlepsi-susicka-na-bylinky/byliny-300x300-eca005d2.png',
  },
  {
    key: 'bylinkovymagazin-58281674',
    source: 'public/media/imported/bylinkovy-magazin-rady-tipy-inspirace-bylinkovy-magazin/bylinkovymagazin-58281674.png',
  },
  {
    key: 'kontryhel-obecny-caj-sber-suseni-40c765ff',
    source: 'public/media/imported/kontryhel-obecny/kontryhel-obecny-caj-sber-suseni-40c765ff.png',
  },
];

const outputs = [
  ...photoSources.map((item) => ({ ...item, filename: `${item.key}.webp`, commands: [] })),
  ...photoSources.map((item) => ({ ...item, filename: `${item.key}-mirror.webp`, commands: ['flop'] })),
  {
    ...photoSources.find((item) => item.key === 'bylinkovymagazin-58281674'),
    filename: 'bylinkova-herna-photo.webp',
    commands: ['flop'],
  },
  {
    ...photoSources.find((item) => item.key === 'kontryhel-obecny-caj-sber-suseni-40c765ff'),
    filename: 'masti-a-balzamy-v2.webp',
    commands: ['flop'],
  },
];

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(target));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

function publicUrl(file) {
  return `/${path.relative(publicRoot, file).split(path.sep).join('/')}`;
}

function buildSourcePhotoPool() {
  for (const root of sourcePhotoRoots) {
    if (!fs.existsSync(root)) throw new Error(`Chybí zdrojový adresář pro fotografický pool: ${path.relative(siteRoot, root)}`);
  }

  const rasterPattern = /\.(?:avif|jpe?g|png|webp)$/iu;
  const strongExcludePattern = /(?:logo|logotyp|favicon|avatar|placeholder|brand|banner|reklam|advert|screenshot|screen-shot|qr-code|qrcode)|(?:^|[-_])(?:300x250|570x240|728x90|970x250|970x310)(?:[-_.]|$)/iu;
  const seenHashes = new Set();
  const photos = [];

  const candidates = sourcePhotoRoots
    .flatMap((root) => walk(root))
    .sort((a, b) => a.localeCompare(b, 'cs'));

  for (const file of candidates) {
    if (!rasterPattern.test(file)) continue;
    const relative = path.relative(publicRoot, file).split(path.sep).join('/');
    if (strongExcludePattern.test(relative)) continue;

    const stats = fs.statSync(file);
    if (stats.size < 1024) continue;

    const bytes = fs.readFileSync(file);
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);
    photos.push(publicUrl(file));
  }

  if (photos.length < 73) {
    throw new Error(`Pro fotografické rozcestníky bylo nalezeno jen ${photos.length} unikátních zdrojových fotografií; známá největší mřížka potřebuje nejméně 73.`);
  }

  const generatedSource = [
    '// AUTO-GENERATED FILE. Do not edit manually.',
    '// Vzniká při prebuild z unikátních rastrových fotografií v public/media/imported a public/media/original.',
    `export const IMPORTED_HUB_PHOTOS = ${JSON.stringify(photos, null, 2)} as const;`,
    '',
  ].join('\n');
  fs.writeFileSync(generatedPoolFile, generatedSource, 'utf8');
  return photos.length;
}

const sourcePoolSize = buildSourcePhotoPool();

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const [index, item] of outputs.entries()) {
  const input = path.join(siteRoot, item.source);
  if (!fs.existsSync(input)) throw new Error(`Chybí zdrojový fotoobrázek: ${item.source}`);

  const tempDir = path.join(outputDir, `.tmp-${index}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const args = [
    '--yes',
    '--package=sharp-cli@5.2.0',
    'sharp',
    '--input',
    input,
    '--output',
    tempDir,
    '--format',
    'webp',
    '--quality',
    '84',
    ...item.commands,
  ];
  const result = spawnSync(npx, args, { cwd: siteRoot, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Převod fotoobrázku selhal: ${item.source} (kód ${result.status})`);

  const generated = path.join(tempDir, `${path.basename(item.source, path.extname(item.source))}.webp`);
  if (!fs.existsSync(generated)) throw new Error(`Nevznikl dočasný WebP soubor pro ${item.filename}`);
  fs.renameSync(generated, path.join(outputDir, item.filename));
  fs.rmSync(tempDir, { recursive: true, force: true });
}

for (const item of outputs) {
  const output = path.join(outputDir, item.filename);
  if (!fs.existsSync(output)) throw new Error(`Nevznikl očekávaný WebP soubor: ${item.filename}`);
  const header = fs.readFileSync(output).subarray(0, 12);
  if (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`Soubor nemá formát WebP: ${item.filename}`);
  }
}

console.log(`Fotografický pool rozcestníků: ${sourcePoolSize} unikátních zdrojových fotografií bez zrcadlených kopií.`);
console.log(`Vygenerováno ${outputs.length} čistě fotografických WebP variant pro speciální obrazové karty a rozcestníky.`);
