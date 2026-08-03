export interface RestoredHubCategory {
  slug: string;
  title: string;
  eyebrow: string;
  pattern: RegExp;
  image: string;
  description?: string;
  intro?: string;
}

export const syrupHubCategories: readonly RestoredHubCategory[] = [
  {
    slug: 'sirupy-na-dychani',
    title: 'Sirupy na dýchací cesty',
    description: 'Bylinné sirupy tradičně spojované s hrdlem, průduškami a dýchacími cestami, včetně bezpečnostních omezení.',
    eyebrow: 'Kašel, hrdlo a průdušky',
    intro: 'Vyberte konkrétní bylinu nebo recept. U rizikových rostlin je původní domácí návod nahrazen bezpečnostním vysvětlením.',
    pattern: /kasel|dych|prudus|plic|odhlen|hlasiv|hrdlo|nachlazen/u,
    image: '/obrazky/clanky/domaci-sirupy--sirupy-na-dychani.svg',
  },
  {
    slug: 'traveni-a-zazivani',
    title: 'Sirupy pro trávení a zažívání',
    description: 'Domácí sirupy z aromatických, kořeněných a hořkých bylin tradičně používaných v kuchyni a při zažívacích tématech.',
    eyebrow: 'Aromatické a hořké byliny',
    intro: 'Máta, fenykl, kmín, anýz, meduňka a další suroviny jsou rozdělené do samostatných receptů.',
    pattern: /traven|zaziv|zalud|strev|nadym|zluc|brisko|metabol/u,
    image: '/obrazky/clanky/domaci-sirupy--traveni-a-zazivani.svg',
  },
  {
    slug: 'imunita-a-vitalita',
    title: 'Sirupy pro imunitu a vitalitu',
    description: 'Ovocné a bylinné sirupy ze šípků, rakytníku, bezu, aronie, rybízu a dalších tradičních surovin.',
    eyebrow: 'Plody, květy a výhonky',
    intro: 'Vyberte si konkrétní recept podle suroviny. Texty nepřisuzují sirupům léčebný účinek a uvádějí důležitá omezení.',
    pattern: /imunit|vital|vitamin|obranyschop|antioxid|posil|energie/u,
    image: '/obrazky/clanky/domaci-sirupy--imunita-a-vitalita.svg',
  },
  {
    slug: 'uklidneni-a-spanek',
    title: 'Sirupy pro uklidnění a spánek',
    description: 'Aromatické domácí sirupy z meduňky, levandule, chmele a dalších bylin spojovaných s večerní pohodou.',
    eyebrow: 'Večerní bylinky',
    intro: 'U silněji působících bylin věnujte pozornost lékům, věku, těhotenství a délce používání.',
    pattern: /spanek|uklid|nerv|stres|psychik|nespav|klid/u,
    image: '/obrazky/clanky/domaci-sirupy--uklidneni-a-spanek.svg',
  },
  {
    slug: 'mocove-cesty-a-ledviny',
    title: 'Sirupy pro močové cesty a ledviny',
    description: 'Přehled domácích sirupů spojovaných s močovými cestami, ledvinami a vylučováním, včetně zásadních omezení.',
    eyebrow: 'Močové cesty a vylučování',
    intro: 'Akutní bolest, krev v moči, horečka nebo dlouhodobé potíže nepatří k domácímu experimentování s bylinkami.',
    pattern: /ledvin|mocov|odvod|vyluc|otok/u,
    image: '/obrazky/clanky/domaci-sirupy--mocove-cesty-a-ledviny.svg',
  },
  {
    slug: 'pohybovy-aparat-a-kuze',
    title: 'Sirupy, pohybový aparát a kůže',
    description: 'Přehled receptů a bezpečnostních oprav u rostlin tradičně spojovaných s klouby, svaly, kůží a krevním oběhem.',
    eyebrow: 'Klouby, svaly a zevní péče',
    intro: 'U arniky, kostivalu, jírovce a dalších rostlin je důležité rozlišit bezpečné zevní použití od nevhodného domácího sirupu.',
    pattern: /kloub|sval|kuze|plet|revma|pohyb|cev|zily|regener/u,
    image: '/obrazky/clanky/domaci-sirupy--pohybovy-aparat-a-kuze.svg',
  },
];

export const tinctureHubCategories: readonly RestoredHubCategory[] = [
  { slug: 'dychaci-cesty-a-nachlazeni', title: 'Tinktury pro dýchací cesty', eyebrow: 'Hrdlo, průdušky a nachlazení', pattern: /kasel|dych|prudus|plic|odhlen|hlasiv|hrdlo|nachlazen/u, image: '/obrazky/clanky/tinktury--dychaci-cesty-a-nachlazeni.svg' },
  { slug: 'tinktury-imunita-dychani', title: 'Tinktury pro imunitu a obranyschopnost', eyebrow: 'Odolnost organismu', pattern: /imunit|obranyschop|vital|nachlazen|alerg/u, image: '/obrazky/clanky/tinktury--tinktury-imunita-dychani.svg' },
  { slug: 'tinktury-traveni-metabolismus', title: 'Tinktury pro trávení a metabolismus', eyebrow: 'Hořké a aromatické byliny', pattern: /traven|zaziv|zalud|strev|nadym|metabol|zluc|jatra/u, image: '/obrazky/clanky/tinktury--tinktury-traveni-metabolismus.svg' },
  { slug: 'tinktury-spanek-nervy', title: 'Tinktury pro spánek a nervy', eyebrow: 'Zklidnění a večerní režim', pattern: /spanek|nerv|stres|uklid|psychik|nespav|uzkost/u, image: '/obrazky/clanky/tinktury--tinktury-spanek-nervy.svg' },
  { slug: 'tinktury-srdce-krevni-obeh', title: 'Tinktury pro srdce a krevní oběh', eyebrow: 'Cévy, tlak a oběh', pattern: /srdce|krevni|obeh|cev|zily|tlak|cholesterol/u, image: '/obrazky/clanky/tinktury--tinktury-srdce-krevni-obeh.svg' },
  { slug: 'tinktury-klouby-svaly', title: 'Tinktury pro klouby a svaly', eyebrow: 'Pohybový aparát', pattern: /kloub|sval|pohyb|revma|regener|krece/u, image: '/obrazky/clanky/tinktury--tinktury-klouby-svaly.svg' },
  { slug: 'tinktury-mocove-cesty-ledviny', title: 'Tinktury pro močové cesty a ledviny', eyebrow: 'Vylučování a prostata', pattern: /ledvin|mocov|prostat|odvod|vyluc/u, image: '/obrazky/clanky/tinktury--tinktury-mocove-cesty-ledviny.svg' },
  { slug: 'tinktury-zeny-muzi', title: 'Tinktury pro ženská a mužská témata', eyebrow: 'Hormony a specifická období', pattern: /zen|muz|hormon|plodnost|menstru|prostat|kojeni/u, image: '/obrazky/clanky/tinktury--tinktury-zeny-muzi.svg' },
  { slug: 'tinktury-detoxikace-ocista', title: 'Tinktury pro detoxikaci a očistu', eyebrow: 'Játra a látková výměna', pattern: /detox|ocist|jatra|zluc|krev|metabol/u, image: '/obrazky/clanky/tinktury--tinktury-detoxikace-ocista.svg' },
];

export const lemonadeHubCategories: readonly RestoredHubCategory[] = [
  { slug: 'limonady-ze-sirupu', title: 'Limonády ze sirupu', eyebrow: 'Rychlá domácí příprava', pattern: /limonada-ze-sirupu|limonady-ze-sirupu|ze-sirupu/u, image: '/obrazky/clanky/recepty-na-domaci-limonady--limonady-ze-sirupu.svg', intro: 'Hotový sirup, voda, citrusy, ovoce a led. Vyberte příchuť a upravte sladkost podle použitého sirupu.' },
  { slug: 'limonady-z-bylinneho-vyluhu', title: 'Limonády z bylinného výluhu', eyebrow: 'Nálev jako základ nápoje', pattern: /z-vyluhu|bylinneho-vyluhu|vyluh/u, image: '/obrazky/clanky/recepty-na-domaci-limonady--limonady-z-bylinneho-vyluhu.svg', intro: 'Bylinky se nejprve krátce vylouhují, nálev se ochladí a doplní vodou, ovocem nebo citrusy.' },
  { slug: 'fresh-limonady', title: 'Fresh limonády', eyebrow: 'Čerstvé ovoce a bylinky', pattern: /fresh|okurkova-limonada|citrusova-limonada|broskvova-limonada|mangova-limonada|kiwi-limonada|melounova-limonada/u, image: '/obrazky/clanky/recepty-na-domaci-limonady--fresh-limonady.svg', intro: 'Čerstvé ovoce, zelenina, bylinky, voda a led bez dlouhého louhování nebo fermentace.' },
  { slug: 'macerovane-limonady', title: 'Macerované limonády', eyebrow: 'Studené louhování', pattern: /macerovan/u, image: '/obrazky/clanky/recepty-na-domaci-limonady--macerovane-limonady.svg', intro: 'Ovoce, citrusy a bylinky se nechají několik hodin v chladu uvolnit do vody bez vaření.' },
  { slug: 'fermentovane-limonady', title: 'Fermentované limonády', eyebrow: 'Kontrolované kvašení', pattern: /fermentovan|ginger-bug|water-kefir|divoka-fermentace/u, image: '/obrazky/clanky/recepty-na-domaci-limonady--fermentovane-limonady.svg', intro: 'Vyberte konkrétní recept nebo základní metodu. Sledujte čistotu, tlak v lahvích, vůni a dobu kvašení.' },
];

export const animalRecipeHubCategories: readonly RestoredHubCategory[] = [
  { slug: 'dychaci-ustroji-zvirat', title: 'Dýchací ústrojí zvířat', eyebrow: 'Kašel, hrdlo a dýchání', pattern: /kasel|dych|prudus|plic|odhlen|hrdlo/u, image: '/obrazky/clanky/sirupy-a-recepty-pro-zvirata--dychaci-ustroji-zvirat.svg' },
  { slug: 'imunitni-system-zvirat', title: 'Imunitní systém zvířat', eyebrow: 'Vitalita a obranyschopnost', pattern: /imunit|vital|obranyschop|posil|regener/u, image: '/obrazky/clanky/sirupy-a-recepty-pro-zvirata--imunitni-system-zvirat.svg' },
  { slug: 'klid-a-psychika-zvirat', title: 'Klid a psychika zvířat', eyebrow: 'Stres, neklid a spánek', pattern: /klid|psychik|stres|spanek|uklid|nerv/u, image: '/obrazky/clanky/sirupy-a-recepty-pro-zvirata--klid-a-psychika-zvirat.svg' },
  { slug: 'kuze-a-srst-zvirat', title: 'Kůže a srst zvířat', eyebrow: 'Zevní péče', pattern: /kuze|srst|plet|hojen|oliz/u, image: '/obrazky/clanky/sirupy-a-recepty-pro-zvirata--kuze-a-srst-zvirat.svg' },
  { slug: 'pohybovy-aparat-zvirat', title: 'Pohybový aparát zvířat', eyebrow: 'Klouby, svaly a pohyb', pattern: /kloub|sval|pohyb|regener|revma/u, image: '/obrazky/clanky/sirupy-a-recepty-pro-zvirata--pohybovy-aparat-zvirat.svg' },
  { slug: 'zazivani-zvirat', title: 'Zažívání zvířat', eyebrow: 'Trávení a hydratace', pattern: /traven|zaziv|zalud|strev|brisko|nadym/u, image: '/obrazky/clanky/sirupy-a-recepty-pro-zvirata--zazivani-zvirat.svg' },
  { slug: 'prirodni-lekarna-pro-zvirata', title: 'Přírodní lékárna pro zvířata', eyebrow: 'Bezpečný hlavní přehled', pattern: /zvirat|pes|psa|psy|kock|slepice|kurat|drubez/u, image: '/obrazky/clanky/sirupy-a-recepty-pro-zvirata--prirodni-lekarna-pro-zvirata.svg' },
];

export const animalTinctureHubCategories: readonly RestoredHubCategory[] = [
  { slug: 't-dychaci-ustroji-zvirat', title: 'Tinktury a dýchací ústrojí zvířat', eyebrow: 'Kašel a dýchání', pattern: /kasel|dych|prudus|plic|hrdlo/u, image: '/obrazky/clanky/tinktury-pro-zvirata-2--t-dychaci-ustroji-zvirat.svg' },
  { slug: 't-imunitni-system-zvirat', title: 'Tinktury a imunitní systém zvířat', eyebrow: 'Vitalita a obranyschopnost', pattern: /imunit|vital|obranyschop|regener/u, image: '/obrazky/clanky/tinktury-pro-zvirata-2--t-imunitni-system-zvirat.svg' },
  { slug: 't-klid-a-psychika-zvirat', title: 'Tinktury pro klid a psychiku zvířat', eyebrow: 'Stres a neklid', pattern: /klid|psychik|stres|spanek|uklid|nerv/u, image: '/obrazky/clanky/tinktury-pro-zvirata-2--t-klid-a-psychika-zvirat.svg' },
  { slug: 't-kuze-a-srst-zvirat', title: 'Tinktury pro kůži a srst zvířat', eyebrow: 'Zevní péče', pattern: /kuze|srst|plet|hojen/u, image: '/obrazky/clanky/tinktury-pro-zvirata-2--t-kuze-a-srst-zvirat.svg' },
  { slug: 't-pohybovy-aparat-zvirat', title: 'Tinktury pro pohybový aparát zvířat', eyebrow: 'Klouby a svaly', pattern: /kloub|sval|pohyb|regener|revma/u, image: '/obrazky/clanky/tinktury-pro-zvirata-2--t-pohybovy-aparat-zvirat.svg' },
  { slug: 't-zazivani-zvirat', title: 'Tinktury a zažívání zvířat', eyebrow: 'Trávení a metabolismus', pattern: /traven|zaziv|zalud|strev|brisko|nadym/u, image: '/obrazky/clanky/tinktury-pro-zvirata-2--t-zazivani-zvirat.svg' },
];
