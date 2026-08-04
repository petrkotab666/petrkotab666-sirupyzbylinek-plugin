import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(siteRoot, 'public/media/generated/prirodni-lekarna');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const sources = [
  'public/media/imported/prirodni-sila-pro-imunitu-a-obranyschopnost/3obr-07cd0380.png',
  'public/media/imported/jak-kombinovat-bylinky/byliny-6083d43d.png',
  'public/media/imported/medunkovy-sirup/sirupyuvod-78eb30cb.png',
  'public/media/original/home/bylinkova-herna-photo.svg',
  'public/media/imported/sklenice-na-sirupy-a-zavarovani/sklenice-na-sirupy-a-zavarovani-4b170c4d.webp',
  'public/media/imported/nejlepsi-susicka-na-bylinky/byliny-300x300-eca005d2.png',
  'public/media/imported/bylinkovy-magazin-rady-tipy-inspirace-bylinkovy-magazin/bylinkovymagazin-58281674.png',
  'public/media/imported/kontryhel-obecny/kontryhel-obecny-caj-sber-suseni-40c765ff.png',
];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const relativeSource of sources) {
  const input = path.join(siteRoot, relativeSource);
  if (!fs.existsSync(input)) {
    throw new Error(`Chybí zdrojový obrázek: ${relativeSource}`);
  }

  const result = spawnSync(
    npx,
    [
      '--yes',
      '--package=sharp-cli@5.2.0',
      'sharp',
      '--input',
      input,
      '--output',
      outputDir,
      '--format',
      'webp',
      '--quality',
      '84',
    ],
    { cwd: siteRoot, stdio: 'inherit' },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Převod obrázku selhal: ${relativeSource} (kód ${result.status})`);
  }
}

const expected = sources.map((source) => `${path.basename(source, path.extname(source))}.webp`);
for (const filename of expected) {
  const output = path.join(outputDir, filename);
  if (!fs.existsSync(output)) throw new Error(`Nevznikl očekávaný WebP soubor: ${filename}`);
  const header = fs.readFileSync(output).subarray(0, 12);
  if (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`Soubor nemá formát WebP: ${filename}`);
  }
}

console.log(`Vygenerováno ${expected.length} obrázků WebP pro Přírodní lékárnu.`);
