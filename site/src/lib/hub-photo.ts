import { IMPORTED_HUB_PHOTOS } from './hub-photo-pool.generated';

const PHOTO_POOL: readonly string[] = [...IMPORTED_HUB_PHOTOS];

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

function assertPool() {
  if (!PHOTO_POOL.length) throw new Error('Fotografický pool rozcestníků je prázdný. Spusťte prebuild.');
}

export function isLegacyHubSvg(src = '') {
  return /\.svg(?:[?#].*)?$/iu.test(src);
}

export function keyedHubPhoto(href = '', title = '') {
  assertPool();
  return PHOTO_POOL[stableIndex(`${normalize(href)}|${normalize(title)}`)];
}

export function thematicHubPhoto(href = '', title = '', position = 0, group = '') {
  assertPool();
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
  assertPool();
  for (let offset = 0; offset < PHOTO_POOL.length; offset += 1) {
    const candidate = thematicHubPhoto(href, title, position + offset, group);
    if (!used.has(candidate)) return candidate;
  }
  throw new Error(`Pro rozcestník ${group || parentRoute(href)} není dost unikátních fotografií (${used.size} již použitých, pool ${PHOTO_POOL.length}).`);
}

export function hubPhotoAlt(title = '') {
  return title ? `Fotografický motiv k tématu ${title}` : 'Bylinky a domácí bylinné zpracování';
}

export const hubPhotoPoolSize = PHOTO_POOL.length;
