export type PreparationCategory = 'caje' | 'koupele' | 'masti' | 'oleje' | 'octy' | 'obklady' | 'kuchyne';

export interface HerbalPreparation {
  slug: string;
  title: string;
  category: PreparationCategory;
  description: string;
  ingredients: string[];
  steps: string[];
  prepMinutes: number;
  restMinutes?: number;
  yield: string;
  storage: string;
  safety: string[];
  tags: string[];
  featured?: boolean;
}

export const preparationCategories: Record<PreparationCategory, {
  title: string;
  shortTitle: string;
  description: string;
  path: string;
  art: 'caj' | 'koupel' | 'mast' | 'olej' | 'sirup' | 'zdravi' | 'bylinky';
}> = {
  caje: {
    title: 'Bylinné čaje a nálevy',
    shortTitle: 'Čaje',
    description: 'Jemné jednodruhové i směsné nálevy s přesnou dobou louhování a bezpečnostními poznámkami.',
    path: '/bylinne-caje/',
    art: 'caj',
  },
  koupele: {
    title: 'Bylinné koupele',
    shortTitle: 'Koupele',
    description: 'Celkové, sedací i koupelové a nožní lázně připravené z vodních výluhů, bez nutnosti koncentrovaných silic.',
    path: '/bylinne-koupele/',
    art: 'koupel',
  },
  masti: {
    title: 'Bylinné masti a balzámy',
    shortTitle: 'Masti a balzámy',
    description: 'Zevní přípravky z olejových macerátů, vosku a šetrných bylin v malých domácích dávkách.',
    path: '/bylinne-masti-a-balzamy/',
    art: 'mast',
  },
  oleje: {
    title: 'Bylinné oleje a maceráty',
    shortTitle: 'Oleje a maceráty',
    description: 'Olejové výluhy ze spolehlivě usušených bylin pro následnou výrobu balzámů a zevní péči.',
    path: '/bylinne-oleje-a-maceraty/',
    art: 'olej',
  },
  octy: {
    title: 'Bylinné octy a oxymely',
    shortTitle: 'Octy a oxymely',
    description: 'Kuchyňské bylinné octy a medovo-octové směsi s důrazem na kyselost, hygienu a střídmé použití.',
    path: '/bylinne-octy-a-oxymely/',
    art: 'sirup',
  },
  obklady: {
    title: 'Obklady, kloktadla a bylinná pára',
    shortTitle: 'Obklady a kloktadla',
    description: 'Krátkodobé zevní postupy z čerstvě připravených nálevů včetně ochrany před opařením a podrážděním.',
    path: '/bylinne-obklady-a-kloktadla/',
    art: 'zdravi',
  },
  kuchyne: {
    title: 'Bylinky v kuchyni',
    shortTitle: 'Kuchyňské výrobky',
    description: 'Soli, cukry, másla, pesta a další rychlé výrobky pro běžné kulinární použití.',
    path: '/bylinky-v-kuchyni-recepty/',
    art: 'bylinky',
  },
};

const teaSafety = ['Začněte jedním šálkem a nemíchejte mnoho druhů najednou.', 'V těhotenství, při kojení, u dětí a při užívání léků ověřte vhodnost konkrétních bylin.'];
const externalSafety = ['Pouze k zevnímu použití.', 'Nejprve vyzkoušejte na malé ploše kůže a nepoužívejte na hluboké, infikované nebo silně podrážděné rány.'];
const honeySafety = ['Med se nepodává dětem mladším 12 měsíců.', 'Kyselé směsi mohou dráždit žaludek a zubní sklovinu; používejte je ředěné a v malém množství.'];

export const herbalPreparations: HerbalPreparation[] = [
  {
    slug: 'medunkovy-caj-pro-klidny-vecer', title: 'Meduňkový čaj pro klidný večer', category: 'caje',
    description: 'Jemný jednodruhový nálev z meduňky s krátkým louhováním, aby si zachoval svěží vůni.',
    ingredients: ['2 čajové lžičky sušené meduňky', '250 ml vody těsně po varu', 'volitelně plátek citronu'],
    steps: ['Meduňku vložte do předehřátého hrnku nebo konvičky.', 'Zalijte vodou, zakryjte a nechte 7 minut louhovat.', 'Sceďte a pijte čerstvý, nejlépe bez doslazování.'],
    prepMinutes: 10, yield: '1 šálek', storage: 'Nálev neskladujte; připravujte vždy čerstvý.',
    safety: [...teaSafety, 'Může zvyšovat ospalost; nekombinujte bez konzultace se silně tlumivými přípravky.'], tags: ['meduňka', 'nálev', 'večer'], featured: true,
  },
  {
    slug: 'lipovo-hermankovy-caj', title: 'Lipovo-heřmánkový čaj', category: 'caje',
    description: 'Voňavá směs lipového květu a heřmánku pro běžné domácí popíjení.',
    ingredients: ['1 čajová lžička lipového květu', '1 čajová lžička heřmánku', '300 ml horké vody'],
    steps: ['Byliny promíchejte v konvičce.', 'Zalijte horkou vodou, zakryjte a louhujte 8 minut.', 'Pečlivě sceďte přes jemné sítko.'],
    prepMinutes: 11, yield: '1 velký šálek', storage: 'Spotřebujte ihned po přípravě.',
    safety: [...teaSafety, 'Nevhodné při známé alergii na heřmánek nebo další hvězdnicovité rostliny.'], tags: ['lípa', 'heřmánek', 'květy'],
  },
  {
    slug: 'matovo-fenyklovy-caj', title: 'Mátovo-fenyklový čaj po jídle', category: 'caje',
    description: 'Lehký nálev z máty a lehce podrceného fenyklu s čistou, nepřeslazenou chutí.',
    ingredients: ['1 čajová lžička sušené máty', '1 čajová lžička fenyklových semen', '250 ml horké vody'],
    steps: ['Fenykl krátce podrtíte v hmoždíři.', 'Přidejte mátu a zalijte vodou.', 'Zakryté louhujte 8 minut a sceďte.'],
    prepMinutes: 11, yield: '1 šálek', storage: 'Připravujte čerstvý.',
    safety: [...teaSafety, 'Máta může zhoršit pálení žáhy nebo reflux.', 'Fenykl není vhodný při alergii na miříkovité rostliny.'], tags: ['máta', 'fenykl'],
  },
  {
    slug: 'sipkovo-jablecny-caj', title: 'Šípkovo-jablečný čaj', category: 'caje',
    description: 'Ovocně-bylinný nápoj ze sušených šípků a jablka připravený delším tažením.',
    ingredients: ['1 vrchovatá lžíce drcených sušených šípků', '2 lžíce sušeného jablka', '500 ml vody'],
    steps: ['Šípky a jablko zalijte studenou vodou.', 'Pomalu zahřejte téměř k varu a 10 minut táhněte na velmi mírném stupni.', 'Nechte dalších 10 minut stát a sceďte přes husté plátno kvůli chloupkům ze šípků.'],
    prepMinutes: 25, yield: '2 šálky', storage: 'V lednici nejvýše 24 hodin, před pitím znovu šetrně ohřejte.',
    safety: [...teaSafety, 'Drcené šípky vždy sceďte přes jemné plátno.'], tags: ['šípek', 'jablko'], featured: true,
  },
  {
    slug: 'tymianovy-caj-s-citronem', title: 'Tymiánový čaj s citronem', category: 'caje',
    description: 'Výrazný tymiánový nálev připravený v malé dávce a krátce louhovaný.',
    ingredients: ['1 zarovnaná čajová lžička sušeného tymiánu', '250 ml horké vody', '1 plátek citronu'],
    steps: ['Tymián zalijte horkou vodou.', 'Zakryjte a louhujte 6 minut.', 'Sceďte a citron přidejte až do mírně zchladlého nápoje.'],
    prepMinutes: 9, yield: '1 šálek', storage: 'Připravujte čerstvý.',
    safety: [...teaSafety, 'Silný tymiánový nálev není určen k dlouhodobému každodennímu pití.'], tags: ['tymián', 'citron'],
  },
  {
    slug: 'koprivovo-jablecny-nalev', title: 'Kopřivovo-jablečný nálev', category: 'caje',
    description: 'Zelený nálev z mladé sušené kopřivy zjemněný sušeným jablkem.',
    ingredients: ['1 čajová lžička sušené kopřivy', '1 lžíce sušeného jablka', '300 ml horké vody'],
    steps: ['Suroviny vložte do konvičky.', 'Zalijte vodou a 8 minut louhujte zakryté.', 'Sceďte a pijte vlažný.'],
    prepMinutes: 11, yield: '1 velký šálek', storage: 'Spotřebujte v den přípravy.',
    safety: [...teaSafety, 'Při onemocnění ledvin, otocích nejasného původu nebo užívání diuretik se poraďte s lékařem.'], tags: ['kopřiva', 'jablko'],
  },

  {
    slug: 'levandulovo-ovesna-koupel', title: 'Levandulovo-ovesná koupel', category: 'koupele',
    description: 'Jemná koupel z ovesného sáčku a slabého levandulového nálevu bez koncentrovaného esenciálního oleje.',
    ingredients: ['50 g jemných ovesných vloček', '2 lžíce sušené levandule', '1 litr horké vody', 'plátěný sáček'],
    steps: ['Levanduli zalijte litrem vody, zakryjte a 10 minut louhujte.', 'Ovesné vločky uzavřete do plátěného sáčku.', 'Scezený nálev a ovesný sáček vložte do teplé, nikoli horké koupele.', 'Koupejte se 10 až 15 minut a pokožku jemně osušte.'],
    prepMinutes: 18, yield: '1 koupel', storage: 'Použijte ihned; zbytky nálevu nevylévejte do lahve.',
    safety: [...externalSafety, 'Koupel ukončete při pálení, svědění, závrati nebo nevolnosti.'], tags: ['levandule', 'oves'], featured: true,
  },
  {
    slug: 'hermankovo-mesickova-koupel', title: 'Heřmánkovo-měsíčková koupel', category: 'koupele',
    description: 'Světlý květový nálev pro krátkou koupel citlivé pokožky.',
    ingredients: ['2 lžíce heřmánku', '2 lžíce měsíčku', '1,5 litru horké vody'],
    steps: ['Květy zalijte vodou a 12 minut louhujte zakryté.', 'Sceďte přes plátno a přidejte do vlažné koupele.', 'Koupel omezte na 10 minut.'],
    prepMinutes: 16, yield: '1 koupel', storage: 'Použijte ihned.',
    safety: [...externalSafety, 'Nevhodné při alergii na hvězdnicovité rostliny.'], tags: ['heřmánek', 'měsíček'],
  },
  {
    slug: 'rozmarynova-lazen-na-nohy', title: 'Rozmarýnová lázeň na nohy', category: 'koupele',
    description: 'Krátká teplá lázeň na nohy z rozmarýnového nálevu.',
    ingredients: ['2 lžíce sušeného rozmarýnu', '1 litr horké vody', '3 litry příjemně teplé vody'],
    steps: ['Rozmarýn zalijte litrem horké vody a 10 minut louhujte.', 'Sceďte do nádoby a doplňte teplou vodou.', 'Nohy ponořte na 10 minut a poté dobře osušte.'],
    prepMinutes: 15, yield: '1 lázeň na nohy', storage: 'Nepoužívejte opakovaně.',
    safety: [...externalSafety, 'Nevhodné při poruše citlivosti nohou, otevřených ranách nebo závažných cévních potížích bez doporučení zdravotníka.'], tags: ['rozmarýn', 'nohy'],
  },
  {
    slug: 'matova-osvezujici-lazen-na-nohy', title: 'Mátová osvěžující lázeň na nohy', category: 'koupele',
    description: 'Vlažná letní lázeň se slabým mátovým výluhem.',
    ingredients: ['2 lžíce sušené máty', '1 litr horké vody', '3 litry vlažné vody'],
    steps: ['Mátu zalijte horkou vodou a 8 minut louhujte.', 'Sceďte a přilijte do vlažné vody.', 'Nohy koupejte 8 až 10 minut.'],
    prepMinutes: 13, yield: '1 lázeň na nohy', storage: 'Použijte čerstvé.',
    safety: [...externalSafety, 'Při pocitu chladu nebo podráždění lázeň ukončete.'], tags: ['máta', 'nohy'],
  },
  {
    slug: 'lipovo-medunkova-koupel', title: 'Lipovo-meduňková večerní koupel', category: 'koupele',
    description: 'Voňavá vlažná koupel z lipového květu a meduňky.',
    ingredients: ['2 lžíce lipového květu', '2 lžíce meduňky', '1,5 litru horké vody'],
    steps: ['Byliny zalijte vodou a 10 minut louhujte zakryté.', 'Sceďte a vlijte do vlažné koupele.', 'Koupejte se nejvýše 15 minut.'],
    prepMinutes: 15, yield: '1 koupel', storage: 'Použijte ihned.',
    safety: [...externalSafety, 'Při nízkém tlaku nebo sklonu k závratím používejte spíše vlažnou než horkou vodu.'], tags: ['lípa', 'meduňka'],
  },
  {
    slug: 'smrkova-koupel-z-jehlici', title: 'Smrková koupel z jehličí', category: 'koupele',
    description: 'Sezónní koupel z malého množství čistého, správně určeného smrkového jehličí.',
    ingredients: ['2 hrsti omytého smrkového jehličí', '2 litry vody'],
    steps: ['Jehličí pouze z bezpečně určeného smrku opláchněte.', 'Přiveďte k mírnému varu, 5 minut povařte a 15 minut nechte stát.', 'Sceďte přes plátno a přidejte do teplé koupele.'],
    prepMinutes: 25, yield: '1 koupel', storage: 'Použijte v den přípravy.',
    safety: [...externalSafety, 'Nezaměňte smrk za tis, který je prudce jedovatý.', 'Nevhodné při alergii na pryskyřice.'], tags: ['smrk', 'jehličí'],
  },

  {
    slug: 'mesickova-mast', title: 'Měsíčková mast', category: 'masti',
    description: 'Jednoduchá mast z hotového měsíčkového olejového macerátu a včelího vosku.',
    ingredients: ['80 ml měsíčkového macerátu ze sušených květů', '10 g včelího vosku', 'čistá 100ml dóza'],
    steps: ['Olej a vosk zahřívejte ve vodní lázni jen do rozpuštění.', 'Promíchejte a kápněte trochu směsi na studený talíř pro kontrolu tuhosti.', 'Nalijte do čisté suché dózy a nechte bez víčka zcela vychladnout.'],
    prepMinutes: 20, yield: 'asi 90 ml', storage: 'V chladu a temnu přibližně 3 měsíce; vyhoďte při změně vůně nebo vzhledu.',
    safety: [...externalSafety, 'Nevhodné při alergii na hvězdnicovité rostliny nebo včelí produkty.'], tags: ['měsíček', 'mast'], featured: true,
  },
  {
    slug: 'hermankovy-balzam', title: 'Heřmánkový balzám', category: 'masti',
    description: 'Měkký balzám z heřmánkového oleje a menšího množství vosku.',
    ingredients: ['85 ml heřmánkového olejového macerátu', '8 g včelího vosku', 'čistá dóza'],
    steps: ['Ve vodní lázni pomalu rozpusťte vosk v oleji.', 'Směs dobře promíchejte a ihned přelijte do dózy.', 'Nechte zcela vychladnout.'],
    prepMinutes: 18, yield: 'asi 90 ml', storage: 'V chladu a temnu do 3 měsíců.',
    safety: [...externalSafety, 'Nevhodné při alergii na heřmánek nebo jiné hvězdnicovité rostliny.'], tags: ['heřmánek', 'balzám'],
  },
  {
    slug: 'jitrocelovy-balzam', title: 'Jitrocelový balzám', category: 'masti',
    description: 'Zevní balzám připravený z olejového macerátu sušeného jitrocele.',
    ingredients: ['80 ml jitrocelového macerátu', '10 g včelího vosku', 'čistá dóza'],
    steps: ['Macerát zahřejte ve vodní lázni.', 'Přidejte vosk a míchejte do rozpuštění.', 'Nalijte do dózy a nechte vychladnout.'],
    prepMinutes: 18, yield: 'asi 90 ml', storage: 'V chladu a temnu přibližně 3 měsíce.',
    safety: externalSafety, tags: ['jitrocel', 'balzám'],
  },
  {
    slug: 'levandulovy-balzam', title: 'Levandulový balzám bez silice', category: 'masti',
    description: 'Jemný balzám z olejového macerátu sušené levandule, bez přidávání koncentrovaného esenciálního oleje.',
    ingredients: ['85 ml levandulového macerátu', '8 g včelího vosku'],
    steps: ['Macerát a vosk pomalu zahřejte ve vodní lázni.', 'Po rozpuštění promíchejte a nalijte do čisté dózy.', 'Před uzavřením nechte zcela vychladnout.'],
    prepMinutes: 18, yield: 'asi 90 ml', storage: 'V chladu a temnu do 3 měsíců.',
    safety: externalSafety, tags: ['levandule', 'balzám'],
  },
  {
    slug: 'rozmarynovy-hrejivy-balzam', title: 'Rozmarýnový zahřívací balzám', category: 'masti',
    description: 'Výraznější zevní balzám z rozmarýnového macerátu určený pouze na malé plochy neporušené kůže.',
    ingredients: ['80 ml rozmarýnového macerátu', '10 g včelího vosku'],
    steps: ['Olej a vosk rozpusťte ve vodní lázni.', 'Dobře promíchejte a nalijte do dózy.', 'Před prvním použitím proveďte kožní test.'],
    prepMinutes: 18, yield: 'asi 90 ml', storage: 'V chladu a temnu do 3 měsíců.',
    safety: [...externalSafety, 'Nepoužívejte na obličej, u malých dětí ani na velké plochy kůže.'], tags: ['rozmarýn', 'balzám'],
  },
  {
    slug: 'mesickovy-balzam-na-rty', title: 'Měsíčkový balzám na rty', category: 'masti',
    description: 'Malá dávka balzámu z měsíčkového macerátu, vosku a kakaového másla.',
    ingredients: ['20 ml měsíčkového macerátu', '5 g včelího vosku', '5 g kakaového másla', '3 malé kelímky'],
    steps: ['Suroviny rozpusťte ve vodní lázni.', 'Promíchejte a rozlijte do čistých kelímků.', 'Nechte otevřené vychladnout a poté uzavřete.'],
    prepMinutes: 15, yield: '3 malé kelímky', storage: 'V chladu do 3 měsíců.',
    safety: ['Nepoužívejte při alergii na včelí produkty, měsíček nebo kakaové máslo.', 'Nepoužívejte na mokvající či infikované změny.'], tags: ['měsíček', 'rty'],
  },

  {
    slug: 'mesickovy-olejovy-macerat', title: 'Měsíčkový olejový macerát', category: 'oleje',
    description: 'Základní olejový výluh ze zcela suchých měsíčkových květů.',
    ingredients: ['20 g dokonale sušeného měsíčku', '200 ml stabilního rostlinného oleje', 'čistá suchá sklenice'],
    steps: ['Květy musí být zcela suché; vlhká bylina zvyšuje riziko kažení.', 'Zalijte olejem tak, aby byly ponořené.', 'Macerujte 2 až 3 týdny v temnu a denně kontrolujte.', 'Přeceďte přes čisté plátno do tmavé lahve.'],
    prepMinutes: 15, restMinutes: 30240, yield: 'asi 170 ml', storage: 'V chladu a temnu 3 až 6 měsíců podle použitého oleje.',
    safety: externalSafety, tags: ['měsíček', 'macerát'], featured: true,
  },
  {
    slug: 'levandulovy-olejovy-macerat', title: 'Levandulový olejový macerát', category: 'oleje',
    description: 'Voňavý macerát ze sušených levandulových květů pro zevní použití.',
    ingredients: ['15 g sušené levandule', '200 ml rostlinného oleje', 'suchá sklenice'],
    steps: ['Levanduli vložte do suché sklenice.', 'Zalijte olejem a zkontrolujte ponoření.', 'Macerujte 2 týdny v temnu.', 'Přeceďte do tmavé lahve.'],
    prepMinutes: 12, restMinutes: 20160, yield: 'asi 175 ml', storage: 'V chladu a temnu do 6 měsíců.',
    safety: externalSafety, tags: ['levandule', 'macerát'],
  },
  {
    slug: 'rozmarynovy-olej-na-vlasy', title: 'Rozmarýnový olejový macerát na vlasovou pokožku', category: 'oleje',
    description: 'Oplachovatelný olejový macerát ze sušeného rozmarýnu bez přídavku silice.',
    ingredients: ['15 g sušeného rozmarýnu', '150 ml lehkého rostlinného oleje'],
    steps: ['Rozmarýn zalijte olejem v suché sklenici.', 'Macerujte 2 týdny v temnu a občas protřepejte.', 'Přeceďte a používejte malé množství před mytím vlasů.'],
    prepMinutes: 12, restMinutes: 20160, yield: 'asi 130 ml', storage: 'V chladu a temnu do 4 měsíců.',
    safety: [...externalSafety, 'Při podráždění vlasové pokožky ihned smyjte.'], tags: ['rozmarýn', 'vlasy'],
  },
  {
    slug: 'jitrocelovy-olejovy-macerat', title: 'Jitrocelový olejový macerát', category: 'oleje',
    description: 'Macerát ze sušeného jitrocele, který lze použít jako základ balzámu.',
    ingredients: ['20 g sušeného jitrocele', '200 ml rostlinného oleje'],
    steps: ['Použijte pouze dokonale suchou drogu.', 'Zalijte olejem a 2 týdny macerujte v temnu.', 'Přeceďte přes plátno do tmavé lahve.'],
    prepMinutes: 12, restMinutes: 20160, yield: 'asi 170 ml', storage: 'V chladu a temnu do 4 měsíců.',
    safety: externalSafety, tags: ['jitrocel', 'macerát'],
  },
  {
    slug: 'ruzovy-olejovy-macerat', title: 'Růžový olejový macerát', category: 'oleje',
    description: 'Jemný kosmetický macerát ze sušených, chemicky neošetřených okvětních lístků.',
    ingredients: ['10 g sušených růžových lístků', '150 ml mandlového nebo jojobového oleje'],
    steps: ['Lístky vložte do suché sklenice.', 'Zalijte olejem a 10 až 14 dní macerujte v temnu.', 'Přeceďte a přelijte do tmavé lahve.'],
    prepMinutes: 10, restMinutes: 14400, yield: 'asi 135 ml', storage: 'V chladu a temnu do 4 měsíců.',
    safety: [...externalSafety, 'Použijte pouze chemicky neošetřené růže určené pro kosmetické či potravinářské použití.'], tags: ['růže', 'macerát'],
  },
  {
    slug: 'hermankovy-olejovy-macerat', title: 'Heřmánkový olejový macerát', category: 'oleje',
    description: 'Olejový výluh ze sušeného heřmánku pro další zevní zpracování.',
    ingredients: ['15 g sušeného heřmánku', '180 ml rostlinného oleje'],
    steps: ['Heřmánek zalijte olejem v dokonale suché sklenici.', 'Macerujte 2 týdny v temnu.', 'Přeceďte přes jemné plátno.'],
    prepMinutes: 10, restMinutes: 20160, yield: 'asi 155 ml', storage: 'V chladu a temnu do 4 měsíců.',
    safety: [...externalSafety, 'Nevhodné při alergii na hvězdnicovité rostliny.'], tags: ['heřmánek', 'macerát'],
  },

  {
    slug: 'tymianovy-oxymel', title: 'Tymiánový oxymel', category: 'octy',
    description: 'Medovo-octová směs s malým množstvím tymiánu určená k ředění.',
    ingredients: ['120 ml tekutého medu', '120 ml jablečného octa', '1 lžíce sušeného tymiánu'],
    steps: ['Tymián vložte do čisté sklenice.', 'Přidejte med a ocet a dobře promíchejte.', 'Nechte 7 dní v lednici, denně protřepejte.', 'Přeceďte a používejte vždy ředěné.'],
    prepMinutes: 12, restMinutes: 10080, yield: 'asi 220 ml', storage: 'V lednici do 1 měsíce.',
    safety: [...honeySafety, 'Silný tymiánový přípravek není vhodný k dlouhodobému užívání.'], tags: ['tymián', 'oxymel'], featured: true,
  },
  {
    slug: 'sipkovy-oxymel', title: 'Šípkový oxymel', category: 'octy',
    description: 'Kyselosladká směs ze sušených šípků, medu a jablečného octa.',
    ingredients: ['3 lžíce drcených sušených šípků', '150 ml medu', '150 ml jablečného octa'],
    steps: ['Šípky vložte do sklenice a přidejte med s octem.', 'Nechte 7 dní v lednici a denně protřepejte.', 'Přeceďte přes husté plátno kvůli jemným chloupkům.'],
    prepMinutes: 12, restMinutes: 10080, yield: 'asi 260 ml', storage: 'V lednici do 1 měsíce.',
    safety: [...honeySafety, 'Šípky sceďte přes opravdu jemné plátno.'], tags: ['šípek', 'oxymel'],
  },
  {
    slug: 'bylinkovy-ocet-na-salaty', title: 'Bylinkový ocet na saláty', category: 'octy',
    description: 'Kuchyňský ocet s rozmarýnem, tymiánem a bobkovým listem.',
    ingredients: ['500 ml vinného nebo jablečného octa', '1 lžička sušeného rozmarýnu', '1 lžička sušeného tymiánu', '1 bobkový list'],
    steps: ['Byliny vložte do čisté lahve nebo sklenice.', 'Zalijte octem a uzavřete nekovovým víčkem.', 'Macerujte 7 až 10 dní v temnu.', 'Přeceďte do čisté lahve.'],
    prepMinutes: 10, restMinutes: 10080, yield: 'asi 480 ml', storage: 'V temnu do 6 měsíců.',
    safety: ['Používejte jako běžné dochucovadlo, nikoli neředěný nápoj.', 'Při refluxu nebo citlivém žaludku používejte střídmě.'], tags: ['ocet', 'rozmarýn', 'tymián'],
  },
  {
    slug: 'salvejovy-jablecny-ocet', title: 'Šalvějový jablečný ocet', category: 'octy',
    description: 'Výrazný kuchyňský ocet se sušenou šalvějí pro malé dávky do marinád a zálivek.',
    ingredients: ['300 ml jablečného octa', '1 lžíce sušené šalvěje'],
    steps: ['Šalvěj zalijte octem v čisté sklenici.', 'Macerujte 5 dní v temnu.', 'Přeceďte a používejte po lžičkách do jídla.'],
    prepMinutes: 8, restMinutes: 7200, yield: 'asi 285 ml', storage: 'V temnu do 4 měsíců.',
    safety: ['Určeno jako dochucovadlo v malém množství.', 'Nevhodné k pravidelnému koncentrovanému užívání v těhotenství, při kojení, u dětí a při epilepsii.'], tags: ['šalvěj', 'ocet'],
  },
  {
    slug: 'matovo-medunkovy-ocet', title: 'Mátovo-meduňkový ocet', category: 'octy',
    description: 'Svěží bylinný ocet do letních salátů a studených omáček.',
    ingredients: ['400 ml jablečného octa', '1 lžíce sušené máty', '1 lžíce sušené meduňky'],
    steps: ['Byliny vložte do sklenice a zalijte octem.', 'Nechte 5 až 7 dní v temnu.', 'Přeceďte a uzavřete v čisté lahvi.'],
    prepMinutes: 8, restMinutes: 7200, yield: 'asi 380 ml', storage: 'V temnu do 4 měsíců.',
    safety: ['Používejte jako kuchyňské dochucovadlo.', 'Máta může zhoršit reflux.'], tags: ['máta', 'meduňka', 'ocet'],
  },
  {
    slug: 'koprivovy-ocet-na-vlasy', title: 'Kopřivový octový oplach na vlasy', category: 'octy',
    description: 'Zevní oplach z kopřivového octa, který se před použitím výrazně ředí.',
    ingredients: ['2 lžíce sušené kopřivy', '250 ml jablečného octa', '750 ml vody pro jedno ředění'],
    steps: ['Kopřivu zalijte octem a nechte 5 dní v temnu.', 'Přeceďte.', 'Pro použití smíchejte 1 lžíci bylinného octa se 750 ml vody a po umytí vlasy opláchněte.'],
    prepMinutes: 8, restMinutes: 7200, yield: 'asi 230 ml koncentrátu', storage: 'Koncentrát v temnu do 3 měsíců; naředěnou směs spotřebujte ihned.',
    safety: [...externalSafety, 'Chraňte oči a nepoužívejte na poraněnou vlasovou pokožku.'], tags: ['kopřiva', 'vlasy', 'ocet'],
  },

  {
    slug: 'salvejove-kloktadlo', title: 'Šalvějové kloktadlo', category: 'obklady',
    description: 'Čerstvý slabý šalvějový nálev určený pouze ke kloktání a následnému vyplivnutí.',
    ingredients: ['1 čajová lžička sušené šalvěje', '250 ml horké vody'],
    steps: ['Šalvěj zalijte vodou a 7 minut louhujte zakrytou.', 'Sceďte a nechte vychladnout na příjemnou teplotu.', 'Kloktejte malé množství a vždy vyplivněte.'],
    prepMinutes: 12, yield: '1 denní dávka', storage: 'V lednici nejvýše 12 hodin.',
    safety: ['Nepolykejte.', 'Nevhodné pro malé děti, které neumějí bezpečně kloktat, a bez odborné rady v těhotenství, při kojení nebo epilepsii.'], tags: ['šalvěj', 'kloktadlo'], featured: true,
  },
  {
    slug: 'hermankovy-obklad', title: 'Heřmánkový obklad', category: 'obklady',
    description: 'Krátký zevní obklad z čerstvého a dobře scezeného heřmánkového nálevu.',
    ingredients: ['1 lžíce heřmánku', '300 ml horké vody', 'čistá bavlněná látka'],
    steps: ['Heřmánek zalijte vodou a 8 minut louhujte.', 'Velmi dobře sceďte a nechte zchladnout.', 'Navlhčete čistou látku a přiložte na 5 až 10 minut.'],
    prepMinutes: 15, yield: '1 obklad', storage: 'Nálev po použití vyhoďte.',
    safety: [...externalSafety, 'Nepřikládejte do očí a nepoužívejte při alergii na hvězdnicovité rostliny.'], tags: ['heřmánek', 'obklad'],
  },
  {
    slug: 'mesickovy-obklad', title: 'Měsíčkový obklad', category: 'obklady',
    description: 'Zevní obklad z čerstvě připraveného měsíčkového nálevu.',
    ingredients: ['1 lžíce sušeného měsíčku', '300 ml horké vody', 'čistá látka'],
    steps: ['Měsíček zalijte vodou a 10 minut louhujte.', 'Sceďte a nechte vychladnout.', 'Látku navlhčete a přiložte na 5 až 10 minut.'],
    prepMinutes: 16, yield: '1 obklad', storage: 'Použijte ihned a zbytek vylijte.',
    safety: [...externalSafety, 'Nevhodné při alergii na hvězdnicovité rostliny.'], tags: ['měsíček', 'obklad'],
  },
  {
    slug: 'tymianova-bylinna-para', title: 'Tymiánová bylinná pára', category: 'obklady',
    description: 'Mírná bylinná pára z tymiánového nálevu s důrazem na ochranu před opařením.',
    ingredients: ['1 čajová lžička sušeného tymiánu', '750 ml horké vody'],
    steps: ['Tymián vložte do stabilní nádoby a zalijte horkou, nikoli prudce vroucí vodou.', 'Nádobu položte na pevný stůl.', 'Vdechujte z bezpečné vzdálenosti nejvýše 5 minut; hlavu nezakrývejte těsně ručníkem.'],
    prepMinutes: 8, yield: '1 použití', storage: 'Nepoužívejte opakovaně.',
    safety: ['Největším rizikem je opaření. Nepoužívejte u malých dětí.', 'Při astmatu nebo dušnosti může pára stav zhoršit; postup předem konzultujte s lékařem.'], tags: ['tymián', 'pára'],
  },
  {
    slug: 'matovy-chladivy-obklad-na-nohy', title: 'Mátový chladivý obklad na nohy', category: 'obklady',
    description: 'Krátký vlažný obklad z mátového nálevu pro neporušenou pokožku.',
    ingredients: ['1 lžíce sušené máty', '400 ml horké vody', '2 čisté bavlněné látky'],
    steps: ['Mátu zalijte a 8 minut louhujte.', 'Sceďte a nechte vychladnout.', 'Navlhčené látky přiložte na chodidla na 5 minut.'],
    prepMinutes: 15, yield: '1 použití', storage: 'Použijte čerstvé.',
    safety: [...externalSafety, 'Nevhodné při poruše citlivosti nohou nebo závažném cévním onemocnění bez doporučení odborníka.'], tags: ['máta', 'obklad'],
  },
  {
    slug: 'jitrocelovy-oplach', title: 'Jitrocelový zevní oplach', category: 'obklady',
    description: 'Čerstvý vodní výluh ze sušeného jitrocele pro krátké zevní použití.',
    ingredients: ['1 lžíce sušeného jitrocele', '300 ml horké vody'],
    steps: ['Jitrocel zalijte vodou a 10 minut louhujte.', 'Pečlivě sceďte přes plátno.', 'Po zchladnutí použijte jednorázově jako zevní oplach.'],
    prepMinutes: 15, yield: '1 použití', storage: 'Neskladujte.',
    safety: externalSafety, tags: ['jitrocel', 'oplach'],
  },

  {
    slug: 'univerzalni-bylinkova-sul', title: 'Univerzální bylinková sůl', category: 'kuchyne',
    description: 'Suchá směs soli, tymiánu, rozmarýnu a majoránky pro běžné vaření.',
    ingredients: ['100 g hrubší soli', '2 lžičky sušeného tymiánu', '2 lžičky sušené majoránky', '1 lžička jemně drceného rozmarýnu'],
    steps: ['Všechny byliny musí být dokonale suché.', 'Smíchejte je se solí a krátce promněte v hmoždíři.', 'Nasypte do suché kořenky.'],
    prepMinutes: 8, yield: 'asi 120 g', storage: 'V suchu a temnu do 6 měsíců.',
    safety: ['Při omezení soli používejte jen malé množství.'], tags: ['sůl', 'koření'], featured: true,
  },
  {
    slug: 'levandulovy-cukr', title: 'Levandulový cukr', category: 'kuchyne',
    description: 'Aromatický cukr z malého množství potravinářské levandule.',
    ingredients: ['200 g cukru', '1 zarovnaná čajová lžička sušené potravinářské levandule'],
    steps: ['Levanduli velmi jemně rozmělněte s jednou lžící cukru.', 'Promíchejte se zbytkem cukru.', 'Nechte 3 dny v uzavřené suché nádobě.'],
    prepMinutes: 7, restMinutes: 4320, yield: 'asi 200 g', storage: 'V suchu do 4 měsíců.',
    safety: ['Použijte pouze levanduli určenou pro potravinářské použití a nepřekračujte uvedené množství.'], tags: ['levandule', 'cukr'],
  },
  {
    slug: 'petrzelovo-bazalkove-pesto', title: 'Petrželovo-bazalkové pesto', category: 'kuchyne',
    description: 'Čerstvé zelené pesto určené k rychlé spotřebě v lednici.',
    ingredients: ['1 hrnek bazalkových listů', '1 hrnek petrželové natě', '50 g slunečnicových semínek', '80 ml olivového oleje', '1 lžíce citronové šťávy', 'sůl podle chuti'],
    steps: ['Byliny omyjte a opravdu dobře osušte.', 'Rozmixujte je se semínky, citronem a olejem.', 'Přendejte do čisté malé sklenice a ihned uložte do lednice.'],
    prepMinutes: 15, yield: 'asi 250 ml', storage: 'V lednici nejvýše 3 dny; pro delší skladování zamrazte v malých porcích.',
    safety: ['Čerstvé byliny v oleji nenechávejte při pokojové teplotě.', 'Zohledněte alergii na semínka.'], tags: ['bazalka', 'petržel', 'pesto'],
  },
  {
    slug: 'bylinkove-maslo', title: 'Bylinkové máslo', category: 'kuchyne',
    description: 'Rychlé máslo s pažitkou, petrželí a malým množstvím tymiánu.',
    ingredients: ['125 g změklého másla', '1 lžíce jemně nasekané pažitky', '1 lžíce petrželové natě', '1/2 lžičky tymiánu', 'špetka soli'],
    steps: ['Byliny omyjte a důkladně osušte.', 'Promíchejte je s máslem a solí.', 'Vytvarujte váleček v pečicím papíru a zchlaďte.'],
    prepMinutes: 12, yield: '125 g', storage: 'V lednici 4 dny nebo v mrazáku 2 měsíce.',
    safety: ['Dodržujte chladicí řetězec mléčného výrobku.'], tags: ['pažitka', 'petržel', 'máslo'],
  },
  {
    slug: 'medunkovy-med', title: 'Meduňkový ochucený med', category: 'kuchyne',
    description: 'Med krátce aromatizovaný výhradně dokonale sušenou meduňkou.',
    ingredients: ['250 g tekutého medu', '1 lžíce dokonale sušené meduňky'],
    steps: ['Suchou meduňku vmíchejte do medu.', 'Nechte 3 dny v uzavřené sklenici při pokojové teplotě.', 'Přeceďte přes jemné sítko.'],
    prepMinutes: 8, restMinutes: 4320, yield: 'asi 240 g', storage: 'V suchu a temnu podle data minimální trvanlivosti medu.',
    safety: ['Med se nepodává dětem mladším 12 měsíců.', 'Nepoužívejte čerstvou vlhkou bylinu.'], tags: ['meduňka', 'med'],
  },
  {
    slug: 'bylinkove-ledove-kostky', title: 'Bylinkové ledové kostky', category: 'kuchyne',
    description: 'Zmrazené porce máty, meduňky a citronu do letních nápojů.',
    ingredients: ['1 malá hrst máty', '1 malá hrst meduňky', '1 chemicky neošetřený citron', 'voda'],
    steps: ['Byliny omyjte a osušte.', 'Do formy vložte malé kousky bylin a tenké proužky citronové kůry bez bílé části.', 'Zalijte pitnou vodou a zamrazte.'],
    prepMinutes: 12, restMinutes: 240, yield: '1 forma kostek', storage: 'V mrazáku do 2 měsíců v uzavřeném obalu.',
    safety: ['Citronovou kůru použijte jen z plodu vhodného ke konzumaci i s kůrou.'], tags: ['máta', 'meduňka', 'led'],
  },
];

export function preparationsByCategory(category: PreparationCategory) {
  return herbalPreparations.filter((recipe) => recipe.category === category);
}

export function preparationBySlug(slug: string) {
  return herbalPreparations.find((recipe) => recipe.slug === slug);
}

export function preparationPath(recipe: HerbalPreparation) {
  return `/bylinne-pripravky/${recipe.slug}/`;
}
