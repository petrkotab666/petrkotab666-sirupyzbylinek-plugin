import type { APIRoute } from 'astro';

const topics = {
  bylinky: { label: 'Bylinky a příroda', from: '#dcefd7', to: '#f8f2d8', accent: '#356b39', motif: 'leaf' },
  sber: { label: 'Sběr a sušení bylinek', from: '#e4f0d8', to: '#f5e6c7', accent: '#5a7335', motif: 'basket' },
  pestovani: { label: 'Pěstování bylinek', from: '#d7ecd8', to: '#eadbbf', accent: '#2f7040', motif: 'pot' },
  recepty: { label: 'Domácí recepty', from: '#f5e4bf', to: '#e4efd6', accent: '#8b5b20', motif: 'jar' },
  napoje: { label: 'Bylinkové nápoje', from: '#d8edf0', to: '#edf0d3', accent: '#27737a', motif: 'glass' },
  zavarovani: { label: 'Sklenice a zavařování', from: '#f2dfc5', to: '#e2efd8', accent: '#7b542e', motif: 'jar' },
  zdravi: { label: 'Bylinky a zdraví', from: '#dcecdc', to: '#f2e4d8', accent: '#326b45', motif: 'heart' },
  vyziva: { label: 'Výživa a vitalita', from: '#e1e6f4', to: '#e9f0d8', accent: '#445c93', motif: 'heart' },
  krasa: { label: 'Přírodní péče', from: '#f3dfe9', to: '#e5efdc', accent: '#8b496d', motif: 'flower' },
  zvirata: { label: 'Bylinky pro zvířata', from: '#e8e2cf', to: '#dcebd9', accent: '#6e5a35', motif: 'paw' },
  repelenty: { label: 'Přírodní ochrana', from: '#d8ebdf', to: '#efe3c8', accent: '#346c50', motif: 'shield' },
} as const;

type Topic = keyof typeof topics;

export function getStaticPaths() {
  return Object.keys(topics).map((topic) => ({ params: { topic } }));
}

function motif(type: string, accent: string) {
  const common = `fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"`;
  switch (type) {
    case 'jar':
      return `<path ${common} d="M490 260h220M520 260v70c0 42-28 76-28 150v210c0 50 40 90 90 90h36c50 0 90-40 90-90V480c0-74-28-108-28-150v-70"/><path ${common} d="M505 420h190M505 650h190"/>`;
    case 'glass':
      return `<path ${common} d="M500 270h200l-26 430c-3 45-40 80-85 80h-6c-45 0-82-35-85-80z"/><path ${common} d="M530 510c70-40 110 40 160 0"/><path ${common} d="M620 250c10-70 65-95 112-110"/>`;
    case 'pot':
      return `<path ${common} d="M480 500h240l-30 230H510z"/><path ${common} d="M600 500V300"/><path ${common} d="M600 370c-95-10-130-70-125-145 83 2 132 48 125 145z"/><path ${common} d="M602 410c90-6 132-58 136-130-79-5-130 38-136 130z"/>`;
    case 'basket':
      return `<path ${common} d="M455 480h290l-48 250H503z"/><path ${common} d="M520 480c8-130 152-130 160 0"/><path ${common} d="M535 565h130M525 645h150"/>`;
    case 'heart':
      return `<path ${common} d="M600 760S420 650 420 485c0-82 58-135 125-135 44 0 78 24 105 64 27-40 61-64 105-64 67 0 125 53 125 135 0 165-180 275-280 275z"/><path ${common} d="M515 545h65l28-62 38 115 28-53h72"/>`;
    case 'flower':
      return `<circle ${common} cx="600" cy="500" r="70"/><circle ${common} cx="600" cy="350" r="80"/><circle ${common} cx="600" cy="650" r="80"/><circle ${common} cx="450" cy="500" r="80"/><circle ${common} cx="750" cy="500" r="80"/><path ${common} d="M600 720v100M600 780c-65-45-110-15-140 25M600 780c65-45 110-15 140 25"/>`;
    case 'paw':
      return `<ellipse ${common} cx="600" cy="620" rx="145" ry="120"/><circle ${common} cx="455" cy="430" r="58"/><circle ${common} cx="565" cy="370" r="58"/><circle ${common} cx="680" cy="385" r="58"/><circle ${common} cx="775" cy="465" r="58"/>`;
    case 'shield':
      return `<path ${common} d="M600 245c90 65 170 70 220 75v210c0 145-92 230-220 300-128-70-220-155-220-300V320c50-5 130-10 220-75z"/><path ${common} d="M515 520l65 65 120-145"/>`;
    default:
      return `<path ${common} d="M600 780V330"/><path ${common} d="M600 460c-115-5-180-75-170-180 115 0 180 65 170 180z"/><path ${common} d="M602 570c120 0 183-66 178-170-112-5-176 55-178 170z"/><path ${common} d="M600 680c-92-2-145-55-142-138 90-3 140 45 142 138z"/>`;
  }
}

export const GET: APIRoute = ({ params }) => {
  const topic = (params.topic || 'bylinky') as Topic;
  const item = topics[topic] || topics.bylinky;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
    <title id="title">${item.label}</title>
    <desc id="desc">Tematická ilustrace pro článek na webu Sirupy z bylinek</desc>
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${item.from}"/><stop offset="1" stop-color="${item.to}"/></linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-opacity=".14"/></filter>
    </defs>
    <rect width="1200" height="675" rx="42" fill="url(#bg)"/>
    <circle cx="600" cy="385" r="250" fill="#fff" opacity=".55" filter="url(#shadow)"/>
    <g transform="translate(0,-110) scale(1,.72)">${motif(item.motif, item.accent)}</g>
    <text x="600" y="590" text-anchor="middle" font-family="Georgia,serif" font-size="54" font-weight="700" fill="${item.accent}">${item.label}</text>
    <text x="600" y="635" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" letter-spacing="3" fill="${item.accent}" opacity=".75">SIRUPY Z BYLINEK</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
