import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(HERE, '..', 'src', 'components', 'HerbMasterArcade.astro');
let source = await readFile(target, 'utf8');

const oldCollision = `        const playerY = HEIGHT - 48;
        for (const object of objects) {`;
const newCollision = `        const playerY = HEIGHT - 60;
        for (const object of objects) {`;

const oldHitbox = `          if (Math.abs(dx) < 38 && Math.abs(dy) < 36) catchObject(object, now);`;
const newHitbox = `          if (Math.abs(dx) < 44 && Math.abs(dy) < 42) catchObject(object, now);`;

const oldPlayer = `      function drawPlayer(now) {
        ctx.save();
        ctx.translate(playerX, HEIGHT - 46);
        const bounce = screen === 'playing' && !paused ? Math.sin(now / 120) * 1.5 : 0;
        ctx.translate(0, bounce);
        ctx.fillStyle = 'rgba(0,0,0,.22)';
        ctx.beginPath(); ctx.ellipse(0, 25, 31, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.font = '48px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👩‍🌾', 0, 17);
        ctx.restore();
      }`;

const newPlayer = `      function drawPlayer(now) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.translate(playerX, HEIGHT - 60);
        const bounce = screen === 'playing' && !paused ? Math.sin(now / 120) * 2 : 0;
        ctx.translate(0, bounce);

        const spotlight = ctx.createRadialGradient(0, 3, 5, 0, 3, 58);
        spotlight.addColorStop(0, 'rgba(255,253,218,.98)');
        spotlight.addColorStop(0.58, 'rgba(255,230,123,.68)');
        spotlight.addColorStop(1, 'rgba(255,230,123,0)');
        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(0, 3, 58, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(8,31,14,.42)';
        ctx.beginPath();
        ctx.ellipse(0, 34, 38, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,250,219,.94)';
        ctx.strokeStyle = '#efa12b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 2, 39, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'rgba(255,255,255,.98)';
        ctx.shadowBlur = 15;
        ctx.font = '62px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('👩‍🌾', 0, 23);
        ctx.shadowBlur = 0;
        ctx.restore();
      }`;

if (source.includes(newPlayer)) {
  console.log('Postava Bylinkového mistra už je zvýrazněná.');
  process.exit(0);
}

for (const [needle, replacement, label] of [
  [oldCollision, newCollision, 'kolizní výška'],
  [oldHitbox, newHitbox, 'kolizní oblast'],
  [oldPlayer, newPlayer, 'kreslení postavy'],
]) {
  if (!source.includes(needle)) {
    throw new Error(`Nelze bezpečně upravit ${label}: očekávaný blok nebyl nalezen.`);
  }
  source = source.replace(needle, replacement);
}

await writeFile(target, source, 'utf8');
console.log('Postava Bylinkového mistra byla zvětšena, zesvětlena a posunuta výš.');
