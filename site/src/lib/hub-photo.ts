const PHOTO_POOL = [
  '/media/generated/prirodni-lekarna/3obr-07cd0380.webp',
  '/media/generated/prirodni-lekarna/byliny-6083d43d.webp',
  '/media/generated/prirodni-lekarna/sirupyuvod-78eb30cb.webp',
  '/media/generated/prirodni-lekarna/bylinkovymagazin-58281674.webp',
  '/media/generated/prirodni-lekarna/sklenice-na-sirupy-a-zavarovani-4b170c4d.webp',
  '/media/generated/prirodni-lekarna/byliny-300x300-eca005d2.webp',
  '/media/generated/prirodni-lekarna/kontryhel-obecny-caj-sber-suseni-40c765ff.webp',
  '/media/generated/prirodni-lekarna/masti-a-balzamy-v2.webp',
  '/media/generated/prirodni-lekarna/bylinkova-herna-photo.webp',
] as const;

function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function stableIndex(value = '') {
  let hash = 0;
  for (const character of value) hash = ((hash * 31) + character.codePointAt(0)) >>> 0;
  return hash % PHOTO_POOL.length;
}

export function isLegacyHubSvg(src = '') {
  return /^\/obrazky\/.*\.svg(?:[?#].*)?$/iu.test(src);
}

export function thematicHubPhoto(href = '', title = '', position = 0) {
  const value = normalize(`${href} ${title}`);

  if (/mast|balzam|kloub|sval|kuze|plet|pohyb/u.test(value)) return PHOTO_POOL[7];
  if (/caj|kontryhel|zen|hormon|menstru|plodnost/u.test(value)) return PHOTO_POOL[6];
  if (/sklen|lahv|olej|macer|tinktur|kapk/u.test(value)) return PHOTO_POOL[4];
  if (/sirup|med|slad|zavar/u.test(value)) return PHOTO_POOL[2];
  if (/imunit|obranyschop|detox|ocist|jatra|srdce|cev/u.test(value)) return PHOTO_POOL[0];
  if (/sus|ledvin|mocov|bylin|trav|zaziv/u.test(value)) return PHOTO_POOL[5];
  if (/sber|pestov|zahrad|etika|vcely|motyl|prirod/u.test(value)) return PHOTO_POOL[3];
  if (/limon|napoj|fresh|ferment|ovoce/u.test(value)) return PHOTO_POOL[1];
  if (/hern|hra|pexeso/u.test(value)) return PHOTO_POOL[8];

  return PHOTO_POOL[(stableIndex(`${href}|${title}`) + position) % PHOTO_POOL.length];
}

export function resolveHubImage(src = '', href = '', title = '', position = 0) {
  if (!src || isLegacyHubSvg(src)) return thematicHubPhoto(href, title, position);
  return src;
}

export function hubPhotoAlt(title = '') {
  return title ? `Fotografický motiv k tématu ${title}` : 'Bylinky a domácí bylinné zpracování';
}
