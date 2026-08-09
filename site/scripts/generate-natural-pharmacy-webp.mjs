import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(siteRoot, 'public/media/generated/prirodni-lekarna');
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

console.log(`Vygenerováno ${outputs.length} čistě fotografických WebP variant pro obrazové karty a rozcestníky.`);
