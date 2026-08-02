export type ArtworkTopic =
  | 'sirup'
  | 'caj'
  | 'koupel'
  | 'mast'
  | 'olej'
  | 'tinktura'
  | 'napoj'
  | 'zavarovani'
  | 'pestovani'
  | 'sber'
  | 'zvirata'
  | 'repelent'
  | 'zdravi'
  | 'bylinky';

interface ArtworkInput {
  title: string;
  key: string;
  topic: ArtworkTopic;
  subtitle?: string;
}

const palettes: Record<ArtworkTopic, [string, string, string, string]> = {
  sirup: ['#f7e5a9', '#d69b36', '#7c3d33', '#174c2b'],
  caj: ['#eee5bf', '#d3a24d', '#7b5131', '#244f2e'],
  koupel: ['#dcebe3', '#8dbdb0', '#4f7f80', '#1b4b3b'],
  mast: ['#f2e2c3', '#d8a860', '#8d633c', '#2d5a35'],
  olej: ['#f6e6b8', '#e0a62d', '#8f5c24', '#305b31'],
  tinktura: ['#e4dded', '#9273a9', '#5a3d6b', '#234b2c'],
  napoj: ['#dceacb', '#84ad61', '#45764b', '#173e25'],
  zavarovani: ['#f2dfc2', '#c98743', '#89493d', '#274c2f'],
  pestovani: ['#dce8bd', '#8db56b', '#4e7a3e', '#173f25'],
  sber: ['#e7e2bd', '#c6a355', '#6d6437', '#1d4a2a'],
  zvirata: ['#e9dfcc', '#c58b5d', '#7e5d48', '#264d31'],
  repelent: ['#d7e7dc', '#80aa8e', '#3c6e58', '#173f2b'],
  zdravi: ['#e6ead5', '#9caf74', '#5d7448', '#244b30'],
  bylinky: ['#e7edcf', '#91b36d', '#557b44', '#18462a'],
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function escapeXml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/u);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > 31 && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === 2) break;
  }
  if (current && lines.length < 3) lines.push(current);
  const used = lines.join(' ').split(/\s+/u).length;
  if (used < words.length && lines.length) lines[lines.length - 1] = `${lines.at(-1)?.replace(/[.…]+$/u, '')}…`;
  return lines.slice(0, 3);
}

function leafStem(x: number, y: number, scale = 1, flip = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale * flip} ${scale})" stroke="#244f2e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 154C3 104 8 53 27 0" fill="none"/>
    <path d="M20 31C-4 28-18 15-22-4C2-7 23 5 31 24Z" fill="#7faa5c"/>
    <path d="M13 72C-14 73-31 61-39 42C-13 34 11 46 23 65Z" fill="#91bb6e"/>
    <path d="M8 115C-17 121-37 112-48 95C-25 82 1 90 15 107Z" fill="#67974d"/>
  </g>`;
}

function centralIcon(topic: ArtworkTopic, primary: string, dark: string) {
  const common = `stroke="${dark}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
  if (topic === 'sirup' || topic === 'olej' || topic === 'tinktura') {
    const fill = topic === 'tinktura' ? '#7b4b7c' : topic === 'olej' ? '#e1a72f' : '#b84d4f';
    return `<g transform="translate(485 154)" filter="url(#shadow)">
      <rect x="55" y="0" width="70" height="56" rx="13" fill="${primary}" ${common}/>
      <path d="M43 49H137L126 254C124 284 109 302 90 302S56 284 54 254Z" fill="#fff8df" ${common}/>
      <path d="M63 131H117V272H63Z" rx="22" fill="${fill}" opacity=".92"/>
      <path d="M70 164H110" ${common} opacity=".35"/>
    </g>`;
  }
  if (topic === 'caj' || topic === 'napoj') {
    return `<g transform="translate(430 183)" filter="url(#shadow)" ${common}>
      <path d="M38 38H220L199 232C196 259 181 273 157 273H99C75 273 60 259 57 232Z" fill="#fff8df"/>
      <path d="M57 85H201L190 228C188 242 178 251 163 251H94C80 251 70 242 68 228Z" fill="${primary}" opacity=".82"/>
      <path d="M218 83C285 77 293 191 226 204" fill="none"/>
      <path d="M92 8C86-17 101-35 124-43M145 7C143-17 158-31 178-38" fill="none" opacity=".65"/>
    </g>`;
  }
  if (topic === 'koupel') {
    return `<g transform="translate(390 225)" filter="url(#shadow)" ${common}>
      <path d="M0 45H300L272 183C267 211 248 226 220 226H80C52 226 33 211 28 183Z" fill="#f7f0d9"/>
      <path d="M30 45C44 12 82 4 111 28C140-1 188 3 210 34C237 8 280 17 290 45Z" fill="#e8f6ee"/>
      <path d="M35 225V260M265 225V260"/>
      <circle cx="74" cy="25" r="18" fill="#ffffff" opacity=".8"/>
      <circle cx="118" cy="11" r="13" fill="#ffffff" opacity=".8"/>
    </g>`;
  }
  if (topic === 'mast') {
    return `<g transform="translate(430 187)" filter="url(#shadow)" ${common}>
      <ellipse cx="145" cy="258" rx="122" ry="25" fill="#26472d" opacity=".15" stroke="none"/>
      <path d="M35 84H255L236 248H54Z" fill="#fff8df"/>
      <rect x="18" y="42" width="254" height="62" rx="24" fill="${primary}"/>
      <rect x="78" y="132" width="134" height="72" rx="18" fill="#ffffff" opacity=".72" stroke="none"/>
      <path d="M102 168H188" opacity=".45"/>
    </g>`;
  }
  if (topic === 'zavarovani') {
    return `<g transform="translate(416 148)" filter="url(#shadow)" ${common}>
      <rect x="32" y="35" width="222" height="50" rx="17" fill="${primary}"/>
      <path d="M47 82H239L226 294H60Z" fill="#fff8df"/>
      <path d="M70 132H215V270H70Z" fill="#b64e55" opacity=".83" stroke="none"/>
      <path d="M82 179H203" opacity=".35"/>
    </g>`;
  }
  if (topic === 'pestovani') {
    return `<g transform="translate(414 176)" filter="url(#shadow)" ${common}>
      <path d="M38 126H276L245 294H69Z" fill="#c98445"/>
      <path d="M89 126C93 66 135 23 157 0C183 31 215 75 221 126" fill="#8fba68"/>
      <path d="M157 123V35"/>
      <path d="M157 73C112 72 90 50 80 22C122 13 153 34 166 62Z" fill="#6da052"/>
      <path d="M159 98C199 98 225 78 238 50C201 38 170 55 153 83Z" fill="#82b361"/>
    </g>`;
  }
  if (topic === 'zvirata') {
    return `<g transform="translate(422 175)" filter="url(#shadow)" fill="${primary}" ${common}>
      <ellipse cx="145" cy="178" rx="91" ry="76"/>
      <circle cx="76" cy="83" r="37"/>
      <circle cx="145" cy="49" r="42"/>
      <circle cx="218" cy="83" r="37"/>
      <circle cx="46" cy="146" r="32"/>
      <circle cx="245" cy="146" r="32"/>
    </g>`;
  }
  if (topic === 'repelent') {
    return `<g transform="translate(440 155)" filter="url(#shadow)" ${common}>
      <ellipse cx="145" cy="150" rx="54" ry="96" fill="${primary}"/>
      <path d="M91 112C34 78 2 93 0 132C8 173 49 184 93 160M197 112C254 78 286 93 288 132C280 173 239 184 195 160" fill="#f5f0ce"/>
      <circle cx="145" cy="50" r="35" fill="#fff8df"/>
      <path d="M123 26L99 0M167 26L191 0M91 130L36 111M197 130L252 111M100 191L50 222M188 191L238 222" fill="none"/>
    </g>`;
  }
  if (topic === 'sber') {
    return `<g transform="translate(397 170)" filter="url(#shadow)" ${common}>
      <path d="M28 115H288L258 286H58Z" fill="#d59648"/>
      <path d="M83 115C88 36 228 36 233 115" fill="none" stroke-width="13"/>
      <path d="M75 157H268M67 204H263" opacity=".35"/>
    </g>`;
  }
  return `<g transform="translate(442 155)" filter="url(#shadow)">${leafStem(80, 30, 1.25, 1)}${leafStem(205, 40, 1.05, -1)}</g>`;
}

export function inferArtworkTopic(value = ''): ArtworkTopic {
  const normalized = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/koupel|lazen|sol do koupele/u.test(normalized)) return 'koupel';
  if (/mast|balzam|pomada|krem/u.test(normalized)) return 'mast';
  if (/olej|macerat/u.test(normalized)) return 'olej';
  if (/caj|nalev/u.test(normalized)) return 'caj';
  if (/tinktur|kapky|lihove/u.test(normalized)) return 'tinktura';
  if (/sirup|med|oxymel/u.test(normalized)) return 'sirup';
  if (/limonad|napoj|smoothie|koktejl/u.test(normalized)) return 'napoj';
  if (/zavar|sklenic|dzem|marmelad|kompot/u.test(normalized)) return 'zavarovani';
  if (/pestov|zahon|kvetinac|substrat|sazen/u.test(normalized)) return 'pestovani';
  if (/sber|sbirat|susit|herbar/u.test(normalized)) return 'sber';
  if (/pes|kock|zvir|slep|kurat|drubez|kun|kralik/u.test(normalized)) return 'zvirata';
  if (/repelent|komar|klist|hmyz/u.test(normalized)) return 'repelent';
  if (/zdravi|imunit|kasel|traven|spanek|bolest/u.test(normalized)) return 'zdravi';
  return 'bylinky';
}

export function renderArticleArtwork({ title, key, topic, subtitle = 'SIRUPY Z BYLINEK' }: ArtworkInput) {
  const seed = hashString(key);
  const [cream, primary, accent, dark] = palettes[topic];
  const offset = 42 + (seed % 74);
  const radius = 92 + (seed % 58);
  const lines = splitTitle(title);
  const titleSvg = lines.map((line, index) => `<text x="84" y="${252 + index * 70}" font-size="${index === 0 ? 55 : 51}" font-weight="800" fill="${dark}" font-family="Georgia,serif">${escapeXml(line)}</text>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
    <title id="title">${escapeXml(title)}</title>
    <desc id="desc">Tematická botanická ilustrace pro článek na webu Sirupy z bylinek.</desc>
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${cream}"/><stop offset="1" stop-color="${primary}" stop-opacity=".48"/></linearGradient>
      <linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${dark}"/><stop offset="1" stop-color="${accent}"/></linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="${dark}" flood-opacity=".2"/></filter>
    </defs>
    <rect width="1200" height="675" rx="38" fill="url(#bg)"/>
    <circle cx="${930 + offset}" cy="${90 + offset / 3}" r="${radius}" fill="${accent}" opacity=".16"/>
    <circle cx="1030" cy="560" r="180" fill="#fff8df" opacity=".28"/>
    <path d="M0 560C200 485 390 520 578 573C776 628 956 603 1200 510V675H0Z" fill="${dark}" opacity=".12"/>
    <rect x="72" y="72" width="330" height="42" rx="21" fill="url(#band)" opacity=".96"/>
    <text x="237" y="100" text-anchor="middle" font-size="18" font-weight="800" letter-spacing="3" fill="#fffaf0" font-family="Arial,sans-serif">${escapeXml(subtitle)}</text>
    ${titleSvg}
    ${centralIcon(topic, primary, dark)}
    ${leafStem(1040, 420, .9, -1)}
    ${leafStem(102, 495, .75, 1)}
  </svg>`;
}
