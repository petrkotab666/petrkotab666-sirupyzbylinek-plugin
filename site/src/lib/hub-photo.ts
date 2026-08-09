const PHOTO_POOL = [
  '/media/generated/prirodni-lekarna/3obr-07cd0380.webp',
  '/media/generated/prirodni-lekarna/byliny-6083d43d.webp',
  '/media/generated/prirodni-lekarna/sirupyuvod-78eb30cb.webp',
  '/media/generated/prirodni-lekarna/sklenice-na-sirupy-a-zavarovani-4b170c4d.webp',
  '/media/generated/prirodni-lekarna/byliny-300x300-eca005d2.webp',
  '/media/generated/prirodni-lekarna/bylinkovymagazin-58281674.webp',
  '/media/generated/prirodni-lekarna/kontryhel-obecny-caj-sber-suseni-40c765ff.webp',
  '/media/generated/prirodni-lekarna/3obr-07cd0380-mirror.webp',
  '/media/generated/prirodni-lekarna/byliny-6083d43d-mirror.webp',
  '/media/generated/prirodni-lekarna/sirupyuvod-78eb30cb-mirror.webp',
  '/media/generated/prirodni-lekarna/sklenice-na-sirupy-a-zavarovani-4b170c4d-mirror.webp',
  '/media/generated/prirodni-lekarna/byliny-300x300-eca005d2-mirror.webp',
  '/media/generated/prirodni-lekarna/bylinkovymagazin-58281674-mirror.webp',
  '/media/generated/prirodni-lekarna/kontryhel-obecny-caj-sber-suseni-40c765ff-mirror.webp',
] as const;

function normalize(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function stableIndex(value = '') {
  let hash = 0;
  for (const character of value) hash = ((hash * 31) + (character.codePointAt(0) || 0)) >>> 0;
  return hash % PHOTO_POOL.length;
}

function parentRoute(href = '') {
  const clean = href.split(/[?#]/u)[0] || '';
  const parts = clean.split('/').filter(Boolean);
  if (parts.length <= 1) return '/';
  parts.pop();
  return `/${parts.join('/')}/`;
}

export function isLegacyHubSvg(src = '') {
  return /\.svg(?:[?#].*)?$/iu.test(src);
}

export function keyedHubPhoto(href = '', title = '') {
  return PHOTO_POOL[stableIndex(`${normalize(href)}|${normalize(title)}`)];
}

export function thematicHubPhoto(href = '', title = '', position = 0, group = '') {
  const sharedGroup = normalize(group || parentRoute(href) || title || '/');
  return PHOTO_POOL[(stableIndex(sharedGroup) + Math.max(0, position)) % PHOTO_POOL.length];
}

export function resolveHubImage(src = '', href = '', title = '', position = 0, group = '') {
  if (!src || isLegacyHubSvg(src)) {
    return group || position > 0
      ? thematicHubPhoto(href, title, position, group)
      : keyedHubPhoto(href, title);
  }
  return src;
}

export function uniqueHubPhoto(used: Set<string>, href = '', title = '', position = 0, group = '') {
  for (let offset = 0; offset < PHOTO_POOL.length; offset += 1) {
    const candidate = thematicHubPhoto(href, title, position + offset, group);
    if (!used.has(candidate)) return candidate;
  }
  return keyedHubPhoto(`${href}-${position}`, title);
}

export function hubPhotoAlt(title = '') {
  return title ? `Fotografický motiv k tématu ${title}` : 'Bylinky a domácí bylinné zpracování';
}

export const hubPhotoPoolSize = PHOTO_POOL.length;
