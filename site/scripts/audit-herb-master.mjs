import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const target = path.join(root, 'dist', 'bylinkovy-mistr', 'index.html');
const errors = [];

let html = '';
try {
  html = await readFile(target, 'utf8');
} catch (error) {
  console.error(`Bylinkový mistr audit: generated page is missing: ${error}`);
  process.exit(1);
}

const requirements = [
  ['arkádový herní kořen', 'data-game="herb-master"'],
  ['herní plátno', 'data-herb-master-canvas'],
  ['výrazné varování po ztrátě života', 'data-life-warning'],
  ['levé dotykové ovládání', 'data-move="left"'],
  ['pravé dotykové ovládání', 'data-move="right"'],
  ['pauza', 'data-pause'],
  ['ovládání zvuku', 'data-sound'],
  ['závěrečný boss', 'Černý kotel'],
  ['desátá úroveň', 'Úroveň 10'],
  ['produktový feed', 'class="product-feed"'],
  ['reklamní blok', 'class="context-ads"'],
];

for (const [label, marker] of requirements) {
  if (!html.includes(marker)) errors.push(`chybí ${label}: ${marker}`);
}

if (!/<canvas\b[^>]*width="600"[^>]*height="500"/iu.test(html)) {
  errors.push('herní plátno nemá zachovaný logický rozměr 600 × 500');
}
if (/Osm otázek|vědomostní kvíz/iu.test(html)) {
  errors.push('na stránce zůstal text chybné kvízové náhrady');
}
if (!/bezpečná ingredience nikdy neubere život/iu.test(html)) {
  errors.push('chybí veřejně popsané pravidlo, že bezpečné ingredience neubírají život');
}

if (errors.length) {
  console.error('\nAudit Bylinkového mistra selhal:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit Bylinkového mistra prošel: arkáda 600 × 500, ovládání, životy, bonusy, boss i monetizace jsou přítomné.');
