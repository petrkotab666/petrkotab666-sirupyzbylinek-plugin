import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(HERE, 'audit-built-site.mjs');
const source = await readFile(target, 'utf8');

const requiredMarkers = [
  'requirePhotographicHero',
  'illustrated-directory-card',
  'SVG is forbidden as hero',
  'hero duplicates cultivation article hero',
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`Hlavní audit není v očekávané fotografické verzi: chybí marker ${marker}`);
  }
}

console.log('Hlavní audit je nativně ve fotografické verzi; žádné runtime přepisování už není potřeba.');
