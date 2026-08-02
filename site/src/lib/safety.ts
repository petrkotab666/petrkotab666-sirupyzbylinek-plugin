import type { ArticleEntry } from './articles';

interface SafetyRule {
  pattern: RegExp;
  warnings: string[];
}

const rules: SafetyRule[] = [
  {
    pattern: /kostival/u,
    warnings: [
      'Kostival není vhodný pro domácí vnitřní užívání. Obsahuje pyrrolizidinové alkaloidy, které mohou poškodit játra.',
      'Zevní přípravky používejte jen krátkodobě, na neporušenou kůži a ne u dětí, v těhotenství ani při kojení bez doporučení zdravotníka.',
    ],
  },
  {
    pattern: /podb[eě]l|dev[eě]tsil/u,
    warnings: [
      'Rostlina může obsahovat pyrrolizidinové alkaloidy. Pro vnitřní užívání volte pouze kontrolované přípravky s doloženým obsahem a řiďte se příbalovou informací.',
    ],
  },
  {
    pattern: /vla[sš]tovi[cč]n[ií]k/u,
    warnings: [
      'Vlaštovičník není vhodný k domácímu vnitřnímu užívání. Nesprávné dávkování může být toxické a je spojováno s poškozením jater.',
      'Čerstvá šťáva může podráždit kůži a oči; pracujte v rukavicích a nepoužívejte na sliznice.',
    ],
  },
  {
    pattern: /t[rř]ezalk/u,
    warnings: [
      'Třezalka může významně ovlivňovat účinek řady léků, mimo jiné některých antikoncepčních, antikoagulačních, imunosupresivních a antivirových přípravků.',
      'Může zvyšovat citlivost na sluneční záření. Při užívání léků je nutná konzultace s lékařem nebo lékárníkem.',
    ],
  },
  {
    pattern: /l[eé]ko[rř]ic/u,
    warnings: [
      'Lékořice není vhodná k dlouhodobému nebo vysokému příjmu. Může zvyšovat krevní tlak, zadržovat tekutiny a snižovat hladinu draslíku.',
      'Nevhodná je zejména při vysokém tlaku, onemocnění srdce či ledvin, v těhotenství a při užívání některých léků.',
    ],
  },
  {
    pattern: /pelyn[eě]k|pelyň/u,
    warnings: [
      'Pelyněk obsahuje thujon a není vhodný k dlouhodobému užívání, v těhotenství, při kojení, u dětí ani při epilepsii.',
    ],
  },
  {
    pattern: /[sš]alv[eě]j/u,
    warnings: [
      'Silné šalvějové přípravky a silice nejsou vhodné k dlouhodobému vnitřnímu užívání. Zvýšená opatrnost je nutná v těhotenství, při kojení, u dětí a při epilepsii.',
    ],
  },
  {
    pattern: /jinan|ginkgo/u,
    warnings: [
      'Jinan může ovlivnit srážení krve. Při užívání antikoagulancií, před operací nebo při krvácivých stavech je nutná konzultace s lékařem.',
    ],
  },
  {
    pattern: /tu[zž]ebn[ií]k|vrbov/i,
    warnings: [
      'Obsahuje salicylátové látky. Nevhodné při alergii na aspirin, při léčbě antikoagulancii, u dětí s horečnatým onemocněním a bez odborné rady v těhotenství.',
    ],
  },
  {
    pattern: /he[rř]m[aá]n/u,
    warnings: [
      'Heřmánek může vyvolat alergickou reakci zejména u lidí citlivých na rostliny z čeledi hvězdnicovitých.',
    ],
  },
  {
    pattern: /med\b|medov/u,
    warnings: [
      'Med se nepodává dětem mladším 12 měsíců kvůli riziku kojeneckého botulismu.',
    ],
  },
  {
    pattern: /tinktur|alkohol|lihov/u,
    warnings: [
      'Alkoholové přípravky nejsou vhodné pro děti, těhotné a kojící osoby, při onemocnění jater ani před řízením.',
    ],
  },
];

function normalize(value = '') {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function articleSafetyWarnings(entry: ArticleEntry) {
  const haystack = normalize(`${entry.data.title} ${entry.data.path} ${(entry.body || '').slice(0, 3500)}`);
  const result = new Set<string>();
  for (const rule of rules) {
    if (rule.pattern.test(haystack)) rule.warnings.forEach((warning) => result.add(warning));
  }
  return [...result];
}
