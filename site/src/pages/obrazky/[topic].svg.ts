import type { APIRoute } from 'astro';

const topics = {
  bylinky: { from: '#dcefd7', to: '#f8f2d8', accent: '#356b39', motif: 'leaf' },
  sber: { from: '#e4f0d8', to: '#f5e6c7', accent: '#5a7335', motif: 'basket' },
  pestovani: { from: '#d7ecd8', to: '#eadbbf', accent: '#2f7040', motif: 'pot' },
  recepty: { from: '#f5e4bf', to: '#e4efd6', accent: '#8b5b20', motif: 'bottle' },
  napoje: { from: '#d8edf0', to: '#edf0d3', accent: '#27737a', motif: 'cup' },
  zavarovani: { from: '#f2dfc5', to: '#e2efd8', accent: '#7b542e', motif: 'jar' },
  zdravi: { from: '#dcecdc', to: '#f2e4d8', accent: '#326b45', motif: 'leaf' },
  vyziva: { from: '#e1e6f4', to: '#e9f0d8', accent: '#445c93', motif: 'berry' },
  krasa: { from: '#f3dfe9', to: '#e5efdc', accent: '#8b496d', motif: 'flower' },
  zvirata: { from: '#e8e2cf', to: '#dcebd9', accent: '#6e5a35', motif: 'paw' },
  repelenty: { from: '#d8ebdf', to: '#efe3c8', accent: '#346c50', motif: 'leaf' },
} as const;

type Topic = keyof typeof topics;

export function getStaticPaths() {
  return Object.keys(topics).map((topic) => ({ params: { topic } }));
}

function motif(type: string, accent: string) {
  const stroke = `fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"`;
  switch (type) {
    case 'basket':
      return `<g ${stroke}><path d="M430 345h340l-48 245H478z" fill="#cf9146"/><path d="M500 345c8-140 192-140 200 0"/><path d="M510 425h180M500 505h200" opacity=".35"/><path d="M555 345c-10-70 20-120 82-148 14 67-14 119-72 151z" fill="#7cad5c"/></g>`;
    case 'pot':
      return `<g ${stroke}><path d="M440 390h320l-44 225H484z" fill="#c98445"/><path d="M600 390V180"/><path d="M600 260c-110-6-165-65-170-145 102-3 163 48 176 132z" fill="#76aa5a"/><path d="M604 330c106-2 166-56 178-138-96-10-164 39-184 123z" fill="#8bbb67"/></g>`;
    case 'bottle':
      return `<g ${stroke}><rect x="540" y="145" width="120" height="70" rx="18" fill="${accent}"/><path d="M515 205h170l-18 330c-3 53-29 83-67 83s-64-30-67-83z" fill="#fff8df"/><path d="M552 350h96v226h-96z" fill="#b75050" opacity=".82" stroke="none"/></g>`;
    case 'cup':
      return `<g ${stroke}><path d="M440 245h270l-26 280c-3 42-30 68-70 68h-78c-40 0-67-26-70-68z" fill="#fff8df"/><path d="M468 345h214l-17 174c-2 24-17 38-42 38h-96c-25 0-40-14-42-38z" fill="${accent}" opacity=".62" stroke="none"/><path d="M707 315c105-10 119 145 20 170"/><path d="M535 205c-8-48 15-82 53-104M623 205c-6-44 17-73 52-92" opacity=".55"/></g>`;
    case 'jar':
      return `<g ${stroke}><rect x="465" y="195" width="270" height="70" rx="22" fill="${accent}"/><path d="M490 255h220l-19 327H509z" fill="#fff8df"/><path d="M530 365h140v175H530z" fill="#b65055" opacity=".75" stroke="none"/></g>`;
    case 'berry':
      return `<g ${stroke}><path d="M565 150c2 145 35 276 88 405"/><path d="M570 250c-95-15-135-67-128-130 91 5 139 48 140 121z" fill="#7dad60"/><path d="M610 360c88-18 140-69 151-137-81-16-143 25-166 115z" fill="#7dad60"/><circle cx="650" cy="300" r="62" fill="#a84a59"/><circle cx="725" cy="350" r="62" fill="#c15b56"/><circle cx="650" cy="395" r="62" fill="#984556"/></g>`;
    case 'flower':
      return `<g ${stroke}><path d="M600 410v180"/><circle cx="600" cy="315" r="55" fill="#efb44f"/><ellipse cx="600" cy="220" rx="53" ry="76" fill="#fff7dd"/><ellipse cx="600" cy="410" rx="53" ry="76" fill="#fff7dd"/><ellipse cx="505" cy="315" rx="76" ry="53" fill="#fff7dd"/><ellipse cx="695" cy="315" rx="76" ry="53" fill="#fff7dd"/></g>`;
    case 'paw':
      return `<g ${stroke} fill="${accent}"><ellipse cx="600" cy="440" rx="145" ry="115"/><circle cx="455" cy="260" r="55"/><circle cx="560" cy="205" r="60"/><circle cx="675" cy="215" r="60"/><circle cx="770" cy="285" r="55"/></g>`;
    default:
      return `<g ${stroke}><path d="M600 590V180"/><path d="M600 330c-120-8-185-78-178-170 113-5 181 56 188 157z" fill="#75a85b"/><path d="M603 445c121-2 190-68 202-165-112-14-187 45-211 145z" fill="#8bbb67"/><path d="M600 525c-83-5-132-47-140-111 78-9 129 29 147 96z" fill="#6f9e54"/></g>`;
  }
}

export const GET: APIRoute = ({ params }) => {
  const topic = (params.topic || 'bylinky') as Topic;
  const item = topics[topic] || topics.bylinky;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
    <title id="title">Botanická tematická ilustrace</title>
    <desc id="desc">Čistá ilustrace bez vloženého viditelného textu pro web Sirupy z bylinek.</desc>
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${item.from}"/><stop offset="1" stop-color="${item.to}"/></linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-opacity=".14"/></filter>
    </defs>
    <rect width="1200" height="675" rx="42" fill="url(#bg)"/>
    <circle cx="600" cy="360" r="270" fill="#fff" opacity=".42" filter="url(#shadow)"/>
    <circle cx="1080" cy="75" r="160" fill="#fff" opacity=".10"/>
    <path d="M0 585C235 505 345 620 590 555C830 490 955 550 1200 470V675H0Z" fill="${item.accent}" opacity=".12"/>
    ${motif(item.motif, item.accent)}
  </svg>`;

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
