import type { ArticleEntry } from './articles';

export interface CriticalRecipeNotice {
  title: string;
  explanation: string;
  alternatives: Array<{ href: string; label: string }>;
}

const notices: Array<{ pattern: RegExp; notice: CriticalRecipeNotice }> = [
  {
    pattern: /kostival.*(?:sirup|tinktur)|(?:sirup|tinktur).*kostival/u,
    notice: {
      title: 'Domácí kostivalový sirup se nedoporučuje',
      explanation: 'Kostival obsahuje pyrrolizidinové alkaloidy, které mohou při vnitřním užívání poškodit játra. Domácí výroba neumí jejich množství spolehlivě změřit ani odstranit. Proto zde recept k pití nezobrazujeme. Kostival se používá pouze zevně, krátkodobě a ideálně v kontrolovaném přípravku s omezeným obsahem těchto látek.',
      alternatives: [
        { href: '/mesickovy-sirup/', label: 'Měsíčkový sirup – kuchyňská alternativa' },
        { href: '/bylinne-pripravky/mesickova-mast/', label: 'Měsíčková mast pro zevní péči' },
      ],
    },
  },
  {
    pattern: /vlastovicnik.*(?:sirup|tinktur)|(?:sirup|tinktur).*vlastovicnik/u,
    notice: {
      title: 'Vlaštovičník nepatří do domácího sirupu ani tinktury',
      explanation: 'Vlaštovičník může být při vnitřním užívání toxický a je spojován s poškozením jater. Bez odborného vedení se nemá užívat vnitřně. Čerstvá šťáva navíc dráždí kůži, oči a sliznice.',
      alternatives: [
        { href: '/medunkovy-sirup/', label: 'Meduňkový sirup' },
        { href: '/bylinne-caje/', label: 'Bezpečnější bylinné čaje' },
      ],
    },
  },
  {
    pattern: /arnik.*sirup|sirup.*arnik/u,
    notice: {
      title: 'Arnika není vhodná pro domácí sirup',
      explanation: 'Arnika je určená především pro zevní použití v hotových přípravcích. Vnitřní užití může být toxické a domácí sirup proto není bezpečnou formou.',
      alternatives: [
        { href: '/bylinne-pripravky/mesickova-mast/', label: 'Jemná měsíčková mast' },
        { href: '/bylinne-masti-a-balzamy/', label: 'Masti a balzámy pro zevní použití' },
      ],
    },
  },
  {
    pattern: /(?:kastan|jirovec).*sirup|sirup.*(?:kastan|jirovec)/u,
    notice: {
      title: 'Jírovec se nepřipravuje jako domácí sirup',
      explanation: 'Syrová semena jírovce obsahují problematické látky. Pro vnitřní užití přicházejí v úvahu pouze standardizované léčivé přípravky; domácí sirup není bezpečná náhrada.',
      alternatives: [
        { href: '/sipkovy-sirup/', label: 'Šípkový sirup' },
        { href: '/hlohovy-sirup/', label: 'Hlohový sirup s bezpečnostním upozorněním' },
      ],
    },
  },
  {
    pattern: /(?:podb[eě]l|dev[eě]tsil).*(?:sirup|tinktur)|(?:sirup|tinktur).*(?:podb[eě]l|dev[eě]tsil)/u,
    notice: {
      title: 'Používejte pouze kontrolované přípravky bez rizikových alkaloidů',
      explanation: 'Podběl a devětsil mohou obsahovat pyrrolizidinové alkaloidy. U domácího receptu nelze zaručit jejich nepřítomnost ani bezpečnou dávku. Návod k vnitřnímu užívání proto nezobrazujeme.',
      alternatives: [
        { href: '/tymianovy-sirup/', label: 'Tymiánový sirup' },
        { href: '/jitrocelovy-sirup/', label: 'Jitrocelový sirup' },
      ],
    },
  },
  {
    pattern: /pelyn[eě]k.*sirup|sirup.*pelyn[eě]k/u,
    notice: {
      title: 'Pelyňkový sirup není vhodný pro běžnou domácí spotřebu',
      explanation: 'Pelyněk obsahuje thujon a vyžaduje přesné omezení dávky i délky užívání. Domácí sladký sirup může snadno zakrýt hořkost, která jinak varuje před nadměrným množstvím.',
      alternatives: [
        { href: '/fenyklovy-sirup/', label: 'Fenyklový sirup' },
        { href: '/bylinne-caje/', label: 'Jemnější bylinné nálevy' },
      ],
    },
  },
  {
    pattern: /rout.*sirup|sirup.*rout/u,
    notice: {
      title: 'Routa není vhodná pro domácí sirup',
      explanation: 'Routa je silně působící rostlina s významnými riziky a není vhodná k běžnému domácímu vnitřnímu užívání. Zvlášť nebezpečná může být v těhotenství.',
      alternatives: [
        { href: '/matovy-sirup-recept/', label: 'Mátový sirup' },
        { href: '/medunkovy-sirup/', label: 'Meduňkový sirup' },
      ],
    },
  },
];

function normalize(value = '') {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function criticalRecipeNotice(entry: ArticleEntry) {
  const haystack = normalize(`${entry.data.title} ${entry.data.path}`);
  return notices.find(({ pattern }) => pattern.test(haystack))?.notice;
}
