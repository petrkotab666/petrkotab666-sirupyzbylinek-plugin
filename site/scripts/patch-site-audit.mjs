import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(HERE, 'audit-built-site.mjs');
let source = await readFile(target, 'utf8');

const replacements = [
  [
    `const gameLaunchCount = (gamesLanding.match(/class="game-launch-card"/g) || []).length;`,
    `const gameLaunchCount = (gamesLanding.match(/class="illustrated-directory-card"/g) || []).length;`,
    'počet obrazových herních karet',
  ],
  [
    `if (!quizGame.includes('data-game="quiz"')) errors.push('bylinkovy-mistr/index.html: quiz interface is missing');`,
    `if (!quizGame.includes('data-game="herb-master"')) errors.push('bylinkovy-mistr/index.html: arcade interface is missing');`,
    'kontrola arkádového Bylinkového mistra',
  ],
  [
    `if (!heroSrc.includes('/obrazky/pestovani.svg')) errors.push(\`cultivation article: expected thematic cultivation image, rendered \${JSON.stringify(heroSrc)}\`);`,
    `if (!heroSrc.includes('/obrazky/clanky/nejcastejsi-chyby-pri-pestovani-bylinek.svg') && !heroSrc.includes('/obrazky/pestovani.svg')) errors.push(\`cultivation article: expected unique thematic cultivation image, rendered \${JSON.stringify(heroSrc)}\`);`,
    'jedinečný obrázek článku o pěstování',
  ],
  [
    `if (!repellentHeroSrc.includes('/obrazky/repelenty.svg') && !repellentHeroSrc.includes('/prirodni-repelenty-proti-komarum-a-klistatum/')) {\n  errors.push(\`repellent article: hero is not tied to the article topic: \${JSON.stringify(repellentHeroSrc)}\`);\n}`,
    `if (!repellentHeroSrc.includes('/obrazky/clanky/prirodni-repelenty-proti-komarum-a-klistatum.svg') && !repellentHeroSrc.includes('/obrazky/repelenty.svg') && !repellentHeroSrc.includes('/prirodni-repelenty-proti-komarum-a-klistatum/')) {\n  errors.push(\`repellent article: hero is not tied to the article topic: \${JSON.stringify(repellentHeroSrc)}\`);\n}`,
    'jedinečný obrázek článku o repelentech',
  ],
];

let changed = false;
for (const [before, after, label] of replacements) {
  if (source.includes(after)) continue;
  if (!source.includes(before)) throw new Error(`Nelze bezpečně aktualizovat ${label}: očekávaný blok nebyl nalezen.`);
  source = source.replace(before, after);
  changed = true;
}

if (changed) {
  await writeFile(target, source, 'utf8');
  console.log('Audit webu byl aktualizován pro obrazovou hernu, arkádovou hru a jedinečné tematické obrázky.');
} else {
  console.log('Audit webu už odpovídá obrazové herně, arkádové hře a jedinečným tematickým obrázkům.');
}
