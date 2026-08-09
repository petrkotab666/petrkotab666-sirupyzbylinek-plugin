const PREPARATION_PHOTOS = [
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
  '/media/generated/prirodni-lekarna/bylinkova-herna-photo.webp',
  '/media/generated/prirodni-lekarna/masti-a-balzamy-v2.webp',
] as const;

function stableIndex(value = '') {
  let hash = 0;
  for (const character of value) hash = ((hash * 31) + (character.codePointAt(0) || 0)) >>> 0;
  return hash % PREPARATION_PHOTOS.length;
}

export function preparationPhoto(group = '', position = 0) {
  const offset = Math.max(0, position) % PREPARATION_PHOTOS.length;
  return PREPARATION_PHOTOS[(stableIndex(group) + offset) % PREPARATION_PHOTOS.length];
}

export const preparationPhotoPoolSize = PREPARATION_PHOTOS.length;
