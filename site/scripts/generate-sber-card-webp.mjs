import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(siteRoot, 'scripts/assets/co-sbirat-card.svg');
const outputDir = path.join(siteRoot, 'public/media/generated/sber');
const output = path.join(outputDir, 'co-sbirat.webp');
const tempDir = path.join(outputDir, '.tmp-co-sbirat');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

if (!fs.existsSync(source)) throw new Error('Chybí zdrojová ilustrace Co sbírat.');
fs.mkdirSync(outputDir, { recursive: true });
fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempDir, { recursive: true });

const result = spawnSync(
  npx,
  [
    '--yes',
    '--package=sharp-cli@5.2.0',
    'sharp',
    '--input', source,
    '--output', tempDir,
    '--format', 'webp',
    '--quality', '90',
  ],
  { cwd: siteRoot, stdio: 'inherit' },
);
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`Převod ilustrace Co sbírat selhal (kód ${result.status}).`);

const generated = path.join(tempDir, 'co-sbirat-card.webp');
if (!fs.existsSync(generated)) throw new Error('Nevznikl dočasný WebP pro Co sbírat.');
fs.rmSync(output, { force: true });
fs.renameSync(generated, output);
fs.rmSync(tempDir, { recursive: true, force: true });

const header = fs.readFileSync(output).subarray(0, 12);
if (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP') {
  throw new Error('Vygenerovaný obrázek Co sbírat není platný WebP.');
}
console.log('Vygenerován tematický WebP pro kartu Co sbírat.');
