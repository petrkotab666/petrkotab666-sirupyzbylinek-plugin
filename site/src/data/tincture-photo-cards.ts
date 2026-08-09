export const tincturePhotoBySlug = {
  'dychaci-cesty-a-nachlazeni': '/media/generated/prirodni-lekarna/byliny-6083d43d.webp',
  'tinktury-imunita-dychani': '/media/generated/prirodni-lekarna/3obr-07cd0380-mirror.webp',
  'tinktury-traveni-metabolismus': '/media/generated/prirodni-lekarna/sirupyuvod-78eb30cb.webp',
  'tinktury-spanek-nervy': '/media/generated/prirodni-lekarna/bylinkovymagazin-58281674.webp',
  'tinktury-srdce-krevni-obeh': '/media/generated/prirodni-lekarna/sklenice-na-sirupy-a-zavarovani-4b170c4d.webp',
  'tinktury-klouby-svaly': '/media/generated/prirodni-lekarna/masti-a-balzamy-v2.webp',
  'tinktury-mocove-cesty-ledviny': '/media/generated/prirodni-lekarna/byliny-300x300-eca005d2.webp',
  'tinktury-zeny-muzi': '/media/generated/prirodni-lekarna/kontryhel-obecny-caj-sber-suseni-40c765ff.webp',
  'tinktury-detoxikace-ocista': '/media/generated/prirodni-lekarna/byliny-6083d43d-mirror.webp',
} as const;

export const tincturePhotoAltBySlug = {
  'dychaci-cesty-a-nachlazeni': 'Čerstvé bylinky připravené pro domácí bylinnou tinkturu',
  'tinktury-imunita-dychani': 'Bylinky a lahvičky pro domácí bylinné tinktury',
  'tinktury-traveni-metabolismus': 'Bylinné suroviny a lahvičky pro domácí maceraci',
  'tinktury-spanek-nervy': 'Bylinková zahrada se surovinami pro večerní bylinné směsi',
  'tinktury-srdce-krevni-obeh': 'Skleněné lahvičky a nádoby pro bylinné výluhy',
  'tinktury-klouby-svaly': 'Fotografický bylinný motiv pro zevní péči a balzámy',
  'tinktury-mocove-cesty-ledviny': 'Sušené bylinky připravené pro domácí zpracování',
  'tinktury-zeny-muzi': 'Kontryhel a další bylinky pro domácí bylinné zpracování',
  'tinktury-detoxikace-ocista': 'Odlišný fotografický motiv bylin pro domácí maceraci a výluhy',
} as const;

export type TincturePhotoSlug = keyof typeof tincturePhotoBySlug;

export const tinctureHubHeroPhoto = '/media/generated/prirodni-lekarna/3obr-07cd0380.webp';
