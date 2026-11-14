/* NK_ARTICLE_AD_CARDS_LOADER_20261112: unified sidebar/feed formatting. */
(function(){
  function loadAdCardStyles(){
    if(!document.querySelector('main.article-shell'))return;
    if(document.querySelector('link[data-nk-article-ad-cards]'))return;
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/article-ad-cards-20261112.css?v=20261112-1';
    link.setAttribute('data-nk-article-ad-cards','1');
    document.head.appendChild(link);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',loadAdCardStyles,{once:true});
  } else loadAdCardStyles();
})();
/* NK_ARTICLE_AD_CARDS_LOADER_END */

/* NK_SPORT_PARTNER_SIDEBAR_SEPARATION_20261112: keep independent advertisers outside FotbalTour cards. */
(function () {
  function separateSportPartnerSidebarPromos() {
    document.querySelectorAll('.sport-partner > [data-promos][data-context="sidebar"]').forEach(function (slot) {
      var sponsorCard = slot.closest('.sport-partner');
      if (sponsorCard && sponsorCard.parentElement) sponsorCard.insertAdjacentElement('afterend', slot);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', separateSportPartnerSidebarPromos, {once: true});
  } else {
    separateSportPartnerSidebarPromos();
  }
})();
/* NK_SPORT_PARTNER_SIDEBAR_SEPARATION_20261112_END */

/* NK_FOTBALTOUR_CHRISTMAS_LOADER_2026: ensure voucher ads in sports articles using the existing ad scripts. */
if (!document.querySelector('script[data-fotbaltour-christmas-2026]')) {
  const fotbalTourXmasScript = document.createElement('script');
  fotbalTourXmasScript.src = '/vanoce-2026/fotbaltour-poukazy.js?v=20261111-sport-guard-1';
  fotbalTourXmasScript.defer = true;
  fotbalTourXmasScript.setAttribute('data-fotbaltour-christmas-2026','1');
  document.head.append(fotbalTourXmasScript);
}
/* NK_FOTBALTOUR_CHRISTMAS_LOADER_2026_END */

// NK_LAZYFARM_RETIRED_20261103: eHUB program ends 3 Nov 2026.
   // Remove ads early and exclude future central feed/snapshot imports.
   function retiredLazyFarmPartner(item){
     const fields=[item?.id,item?.name,item?.title,item?.tag,item?.text,
       item?.url,item?.baseClickUrl,item?.defaultTargetUrl,item?.defaultLinkId,
       item?.programKey,item?.trackingUrl,item?.partner].join(' ').toLowerCase();
     return /lazy\s*farm|lazyfarm|28e75ba2/.test(fields);
   }
   // MAMEDOMA_SUNSET_20261005: eHUB notification; end 31 Oct, Prague.
function mamedomaProgramAllowed(item, now=Date.now()){
  const text=[item?.id,item?.name,item?.title,item?.tag,item?.url,item?.baseClickUrl,item?.defaultTargetUrl,item?.programKey,item?.defaultLinkId].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(!/mamedoma|259ca026/.test(text))return true;
  return now < Date.parse('2026-11-01T00:00:00+01:00');
}

const promoItems=[
/* NK_INVIA_AFFILIATE_NOV2026 */
  {"id":"invia-nasekadan-20261112","title":"Invia – dovolená a zájezdy","text":"Vyberte si dovolenou nebo poznávací zájezd. Aktuální ceny a termíny ověřte na Invia.cz.","url":"https://www.invia.cz/?b_https=1&aid=9256106","banner":"/invia-nasekadan-square-20261112.svg","wideBanner":"/invia-nasekadan-wide-20261112.svg","tag":"Reklama · affiliate","contexts":["travel","family","general","sidebar","local","home"],"weight":16,"partnerKey":"invia","fullBleed":true,"runtimeVerified":true,"imageRequired":true},
/* ACTIVE_PROMOTIONS_START */
  {"id":"slavia-pojistovna-ehub-20261027","title":"Slavia pojišťovna","text":"Pojištění auta, bydlení, cestování i podnikání. Aktuální podmínky ověřte přímo u pojišťovny.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=379bb894","banner":"https://pojistime.to/assets/slavia-pojistovna-square.svg","wideBanner":"https://pojistime.to/assets/slavia-pojistovna-wide.svg","tag":"Reklama · affiliate","contexts":["auto","home","travel","finance","sidebar","general"],"weight":5,"fullBleed":true,"runtimeVerified":true,"validFrom":"2026-10-27"},
/* OCTOBER_AFFILIATE_2026_START */
  {"id":"concept-nakupy-oct-2026","title":"Concept: Nákupy se slevou až 30 %","text":"Slevové kódy CONCEPT20, CONCEPT15, NAKUPY20, CONCEPT30, NAKUPY30 a NAKUPY10. Jen do 19. října, dle podmínek.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2F","banner":"/assets/reklamy/concept-nakupy-oct-2026.svg","wideBanner":"/assets/reklamy/concept-nakupy-oct-2026.svg","tag":"Reklama · affiliate","contexts":["home","sidebar","general","shopping"],"weight":12,"validTo":"2026-10-19","runtimeVerified":true},
  {"id":"aranys-broze-halloween-2026","title":"Aranys: halloweenské brože","text":"Originální brože s podzimními motivy pro váš outfit. Nabídku a dostupnost ověřte u prodejce.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fbroze","banner":"/assets/reklamy/aranys-broze-halloween-2026.svg","wideBanner":"/assets/reklamy/aranys-broze-halloween-2026.svg","tag":"Reklama · affiliate","contexts":["home","sidebar","general","shopping"],"weight":9,"validTo":"2026-10-31","runtimeVerified":true},
  {"id":"aranys-vltavin-2026","title":"Aranys: prsteny s vltavínem","text":"Originální šperk s přírodním zeleným kamenem. Tip na podzimní či vánoční dárek.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fprsteny%2Fvltavin","banner":"/assets/reklamy/aranys-vltavin-2026.svg","wideBanner":"/assets/reklamy/aranys-vltavin-2026.svg","tag":"Reklama · affiliate","contexts":["home","sidebar","general","shopping"],"weight":8,"validTo":"2026-12-31","runtimeVerified":true},
  {"id":"csob-pojisteni-online-oct26","title":"ČSOB Pojišťovna: slevy při online sjednání","text":"Až 20 % na vybraná pojištění při online sjednání. Podmínky a aktuální nabídku ověřte u pojišťovny.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f5e0f8fb&desturl=https%3A%2F%2Fwww.csobpoj.cz%2F","banner":"/assets/reklamy/csob-pojisteni-online-oct26.svg","wideBanner":"/assets/reklamy/csob-pojisteni-online-oct26.svg","tag":"Reklama · affiliate","contexts":["home","sidebar","general","shopping"],"weight":7,"validTo":"2026-12-31","runtimeVerified":false},
/* OCTOBER_AFFILIATE_2026_END */
  {id:'season-concept-fans',title:'Vedro? Ventilátory Concept',text:'Stolní, stojanové i sloupové ventilátory pro rychlejší proudění vzduchu.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2Fventilatory_c3392989.html',banner:'/assets/reklamy/season-concept-fans-square.svg',wideBanner:'/assets/reklamy/season-concept-fans-wide.svg',tag:'Vedro a ochlazení',contexts:['home', 'local', 'sidebar', 'general', 'health'],weight:12,fullBleed:true,runtimeVerified:true,validTo:'2026-09-15'},
  {id:'season-proalergiky-aircon',title:'Mobilní klimatizace Meaco Cool',text:'Chlazení, ventilace, odvlhčování a ovládání přes mobilní aplikaci.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=abc25217&desturl=https%3A%2F%2Fwww.proalergiky.cz%2Feshop%2Fmobilni-klimatizace-meaco-cool-9000-pro',banner:'/assets/reklamy/season-proalergiky-aircon-square.svg',wideBanner:'/assets/reklamy/season-proalergiky-aircon-wide.svg',tag:'Klimatizace',contexts:['home', 'local', 'sidebar', 'general', 'health'],weight:11,fullBleed:true,runtimeVerified:true,validTo:'2026-09-15'},
  {id:'owned-vaseuklizecka',title:'VašeUklízečka.cz',text:'Úklid domácností, firem, bytových domů, koberců a sedaček na Kadaňsku.',url:'https://vaseuklizecka.cz/',banner:'/assets/reklamy/owned-vaseuklizecka-square.svg',wideBanner:'/assets/reklamy/owned-vaseuklizecka-wide.svg',tag:'Naše místní služba',contexts:['home', 'local', 'sidebar', 'general', 'health'],weight:8,fullBleed:true,runtimeVerified:true},
  {id:'owned-vyklidime-banner',title:'VYKLIDIME.TO',text:'Vyklízení bytů, domů, sklepů a pozůstalostí. Odnos, odvoz i úklid.',url:'https://vyklidime.to/',banner:'/assets/reklamy/owned-vyklidime-banner-square.svg',wideBanner:'/assets/reklamy/owned-vyklidime-banner-wide.svg',tag:'Naše místní služba',contexts:['home', 'local', 'sidebar', 'general'],weight:8,fullBleed:true,runtimeVerified:true},
  {id:'owned-pojistime-banner',title:'Pojistime.to',text:'Pojištění auta, domácnosti, cestování, odpovědnosti i další možnosti na jednom místě.',url:'https://pojistime.to/',banner:'/assets/reklamy/owned-pojistime-banner-square.svg',wideBanner:'/assets/reklamy/owned-pojistime-banner-wide.svg',tag:'Náš web',contexts:['finance', 'auto', 'home', 'travel', 'sidebar', 'general'],weight:6,fullBleed:true,runtimeVerified:true},
  {id:'coupon-concept-leto30',title:'Concept: 30 % na malé spotřebiče',text:'Kupón LETO30 na vybrané malé spotřebiče v letním úklidu skladu. Platí do 31. srpna.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2F',banner:'/assets/reklamy/coupon-concept-leto30-square.svg',wideBanner:'/assets/reklamy/coupon-concept-leto30-wide.svg',tag:'Kupón LETO30',contexts:['home', 'sidebar', 'general', 'local'],weight:10,fullBleed:true,runtimeVerified:true,validTo:'2026-08-31'},
  {id:'coupon-concept-vyprodej30',title:'Concept: 30 % na velké spotřebiče',text:'Kupón VYPRODEJ30 na vybrané velké spotřebiče. Platí do 31. srpna.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2F',banner:'/assets/reklamy/coupon-concept-vyprodej30-square.svg',wideBanner:'/assets/reklamy/coupon-concept-vyprodej30-wide.svg',tag:'Kupón VYPRODEJ30',contexts:['home', 'sidebar', 'general', 'local'],weight:10,fullBleed:true,runtimeVerified:true,validTo:'2026-08-31'},
  {id:'coupon-ariete-italy',title:'Ariete: 25 % na kompletní sortiment',text:'Slevový kód ITALY platí na kompletní sortiment Ariete.cz do konce roku 2026.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ffcf2387&desturl=https%3A%2F%2Fwww.ariete.cz%2F',banner:'/assets/reklamy/coupon-ariete-italy-square.svg',wideBanner:'/assets/reklamy/coupon-ariete-italy-wide.svg',tag:'Kupón ITALY',contexts:['home', 'sidebar', 'general'],weight:7,fullBleed:true,runtimeVerified:true,validTo:'2026-12-31'},
  {id:'promo-aranys-80',title:'Aranys: výprodej se slevami až 80 %',text:'Výprodej vybraných produktů Aranys.cz se slevami až 80 %.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fakce-slevy',banner:'/assets/reklamy/promo-aranys-80-square.svg',wideBanner:'/assets/reklamy/promo-aranys-80-wide.svg',tag:'Výprodej až 80 %',contexts:['general', 'sidebar', 'home'],weight:8,fullBleed:true,runtimeVerified:true,validTo:'2026-12-31'},
  {id:'coupon-museum-partner30',title:'Museum of Bricks: 30 % na vstupenky',text:'Slevový kód PARTNER30 na vstupenky. Platí do 31. srpna.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=160115dc&desturl=https%3A%2F%2Fmuseumofbricks.cz%2F',banner:'/assets/reklamy/coupon-museum-partner30-square.svg',wideBanner:'/assets/reklamy/coupon-museum-partner30-wide.svg',tag:'Kupón PARTNER30',contexts:['family', 'travel', 'sidebar', 'general', 'local'],weight:8,fullBleed:true,runtimeVerified:true,validTo:'2026-08-31'},
  {id:'promo-bricks-shop-august',title:'Museum of Bricks: akční nabídka v e-shopu',text:'Slevy na vybrané produkty v e-shopu platí do 16. srpna.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=3ffab0a4&desturl=https%3A%2F%2Feshop.museumofbricks.cz%2Fakcni-nabidka%2F',banner:'/assets/reklamy/promo-bricks-shop-august-square.svg',wideBanner:'/assets/reklamy/promo-bricks-shop-august-wide.svg',tag:'Akce do 16. srpna',contexts:['family', 'sidebar', 'general', 'local'],weight:7,fullBleed:true,runtimeVerified:true,validTo:'2026-08-16'},
  {id:'promo-petexpert-two-months',title:'PetExpert: dva měsíce pojištění zdarma',text:'Akce na pojištění psů a koček platí do 31. srpna.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce2e382f',banner:'/assets/reklamy/promo-petexpert-two-months-square.svg',wideBanner:'/assets/reklamy/promo-petexpert-two-months-wide.svg',tag:'2 měsíce zdarma',contexts:['pets', 'family', 'sidebar', 'general'],weight:6,fullBleed:true,runtimeVerified:true,validTo:'2026-08-31'},
  {id:'promo-csob-travel-ebook-202610',title:'ČSOB: cestovní pojištění + e-kniha zdarma',text:'Při sjednání cestovního pojištění získá klient e-knihu k cestovnímu pojištění zdarma. Akce platí do 1. listopadu 2026; podmínky ověřte u ČSOB Pojišťovny.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f5e0f8fb&desturl=https%3A%2F%2Fwww.csobpoj.cz%2Fpojisteni%2Fcestovni-pojisteni',banner:'/assets/reklamy/csob-pojisteni-online-oct26.svg',wideBanner:'/assets/reklamy/csob-pojisteni-online-oct26.svg',tag:'E-kniha zdarma · do 1. 11.',contexts:['travel','family','finance','sidebar','general','local'],weight:16,fullBleed:true,runtimeVerified:true,validFrom:'2026-10-20',validTo:'2026-11-01'},
  {id:'promo-csob-home-alza500-202610',title:'ČSOB: pojištění majetku + Alza 500 Kč',text:'Při online sjednání pojištění majetku lze při splnění podmínek získat poukázku Alza 500 Kč a 10% online slevu. Akce platí do 30. listopadu 2026.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f5e0f8fb',banner:'/assets/reklamy/csob-pojisteni-online-oct26.svg',wideBanner:'/assets/reklamy/csob-pojisteni-online-oct26.svg',tag:'Alza 500 Kč · do 30. 11.',contexts:['home','finance','family','sidebar','general','local'],weight:13,fullBleed:true,runtimeVerified:true,validFrom:'2026-10-14',validTo:'2026-11-30'},
  {id:'promo-csob-eurooil1000',title:'ČSOB: poukázka EuroOil 1 000 Kč',text:'Při sjednání autopojištění lze při splnění podmínek získat poukázku EuroOil 1 000 Kč. Akce platí do 31. prosince 2026.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f5e0f8fb&desturl=https%3A%2F%2Fwww.csobpoj.cz%2Fpojisteni%2Fpojisteni-vozidel',banner:'/assets/reklamy/promo-csob-eurooil1000-square.svg',wideBanner:'/assets/reklamy/promo-csob-eurooil1000-wide.svg',tag:'EuroOil 1 000 Kč · do 31. 12.',contexts:['auto','finance','sidebar','general','local'],weight:12,fullBleed:true,runtimeVerified:true,validFrom:'2026-10-01',validTo:'2026-12-31'},
  {id:'probione-premium-q4-2026',title:'ProbiONE Premium',text:'Individuální probiotický program. Jde o doplněk stravy; informace o složení, dávkování a vhodnosti ověřte přímo u prodejce.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=97341218&desturl=https%3A%2F%2Fwww.probione.com%2Fprobione-individual-premium%2F',banner:'https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/54-5_probione-premium-2.png?6a75d69a',wideBanner:'https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/54-5_probione-premium-2.png?6a75d69a',tag:'Partnerská nabídka · do 31. 12.',contexts:['health','family','shopping','sidebar','general'],weight:15,runtimeVerified:true,imageRequired:true,validFrom:'2026-10-21',validTo:'2026-12-31'},
  {id:'probione-standard-q4-2026',title:'ProbiONE Standard',text:'Individuální probiotický program. Jde o doplněk stravy; informace o složení, dávkování a vhodnosti ověřte přímo u prodejce.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=97341218&desturl=https%3A%2F%2Fwww.probione.com%2Fprobione-individual-standard%2F',banner:'https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/51-5_probione-standard-2.png?6a75d6ef',wideBanner:'https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/51-5_probione-standard-2.png?6a75d6ef',tag:'Partnerská nabídka · do 31. 12.',contexts:['health','family','shopping','sidebar','general'],weight:13,runtimeVerified:true,imageRequired:true,validFrom:'2026-10-21',validTo:'2026-12-31'},
  {id:'promo-mbank-421',title:'mBank: úrok až 4,21 % p.a.',text:'mSpořicí účet Plus: zůstatky do 250 000 Kč s úrokem až 4,21 % p.a. Sazba platí do odvolání, nejméně do 30. listopadu 2026; pro vyšší zůstatky zůstávají sazby beze změny.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=cb64a4ba',banner:'/assets/reklamy/promo-mbank-421-square.svg',wideBanner:'/assets/reklamy/promo-mbank-421-wide.svg',tag:'Nejméně do 30. 11.',contexts:['finance','home','sidebar','general'],weight:9,fullBleed:true,runtimeVerified:true,validTo:'2026-11-30'},

  {id:'owned-realitykadan-banner',title:'RealityKadan.cz',text:'Prodej bytů, domů, garáží a pozemků v Kadani a okolí. Rychlá a nezávazná nabídka.',url:'https://realitykadan.cz/',banner:'/assets/reklamy/owned-realitykadan-banner-square.svg',wideBanner:'/assets/reklamy/owned-realitykadan-banner-wide.svg',tag:'Naše místní služba',contexts:['home','local','sidebar','general','finance'],weight:8,fullBleed:true,runtimeVerified:true},
/* ACTIVE_PROMOTIONS_END */
/* ARANYS_MEGA_SALE_85_2026_START */
  {id:"aranys-mega-sale-85-2026",title:"Aranys: Mega letní výprodej – slevy až 85 %",text:"Slevy až 85 % na vybrané produkty. Akce platí do vyprodání zásob; konkrétní cenu a dostupnost ověřte v aktuálním výprodeji.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fakce-slevy",banner:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",wideBanner:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",image:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",tag:"Mega výprodej · až 85 %",contexts:["shopping", "family", "sidebar", "general", "local"],weight:18,runtimeVerified:true,imageRequired:true},
  {id:"aranys-product-tip-1-2026",title:"Varianta",text:"Cena ve feedu: 219 Kč. Konkrétní produkt z aktuální nabídky Aranys. Zda je právě součástí výprodeje a aktuální cenu ověřte po prokliku.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fnaramek-strasovy-vice-velikosti-26212%23varianta%3D13172",banner:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",wideBanner:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",image:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",tag:"Tip z Aranys · obrázková nabídka",contexts:["shopping", "sidebar", "general", "local"],weight:6,runtimeVerified:true,imageRequired:true},
  {id:"aranys-product-tip-2-2026",title:"Varianta",text:"Cena ve feedu: 274 Kč. Konkrétní produkt z aktuální nabídky Aranys. Zda je právě součástí výprodeje a aktuální cenu ověřte po prokliku.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fnaramek-strasovy-vice-velikosti-26212%23varianta%3D13173",banner:"https://aranys.cz/pool/vzor/products/naramek-42224.jpg",wideBanner:"https://aranys.cz/pool/vzor/products/naramek-42224.jpg",image:"https://aranys.cz/pool/vzor/products/naramek-42224.jpg",tag:"Tip z Aranys · obrázková nabídka",contexts:["shopping", "sidebar", "general", "local"],weight:6,runtimeVerified:true,imageRequired:true},
/* ARANYS_MEGA_SALE_85_2026_END */
/* RB_THREE_REWARDS_2026_START */
  {id:"rb-three-rewards-2026",title:"Raiffeisenbank: vyberte si jednu ze 3 odměn",text:"Vyberte si 1 ze 3 odměn: 6×500 Kč (max. 6 měsíců), 50 % zpět za vybrané online služby (max. 500 Kč měsíčně po 12 měsíců), nebo 10 % zpět z vybraných nákupů potravin (max. 500 Kč měsíčně po 12 měsíců). Nutných je alespoň 10 plateb kartou měsíčně. Pro nové klienty 18+ bez osobního účtu RB/EQUA posledních 6 měsíců, kteří již nevyužili 6×500 Kč. Výběr odměny je při sjednání závazný, při nezvolení platí 6×500 Kč. Podrobnosti u banky.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=446f3eb0",banner:"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221000%22%20height%3D%22560%22%20viewBox%3D%220%200%201000%20560%22%20role%3D%22img%22%20aria-label%3D%22Raiffeisenbank%20%C2%B7%20b%C4%9B%C5%BEn%C3%BD%20%C3%BA%C4%8Det%20VYBERTE%20SI%20JEDNU%20ZE%203%20ODM%C4%9AN%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23111827%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23334155%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%221000%22%20height%3D%22560%22%20rx%3D%2228%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2218%22%20height%3D%22560%22%20fill%3D%22%23facc15%22%2F%3E%3Crect%20x%3D%22790%22%20y%3D%2224%22%20width%3D%22180%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22%23facc15%22%2F%3E%3Ctext%20x%3D%22880%22%20y%3D%2252%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23111827%22%3EDO%2031.%2012.%202026%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%2258%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2221%22%20font-weight%3D%22700%22%20fill%3D%22%23fde047%22%3ERaiffeisenbank%20%C2%B7%20b%C4%9B%C5%BEn%C3%BD%20%C3%BA%C4%8Det%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22145%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2244%22%20font-weight%3D%22800%22%20fill%3D%22%23ffffff%22%3EVYBERTE%20SI%20JEDNU%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22207%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2244%22%20font-weight%3D%22800%22%20fill%3D%22%23ffffff%22%3EZE%203%20ODM%C4%9AN%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22297%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3E6%C3%97500%20K%C4%8D%20%C2%B7%2050%20%25%20zp%C4%9Bt%20za%20online%20z%C3%A1bavu%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22335%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3Enebo%2010%20%25%20zp%C4%9Bt%20z%20n%C3%A1kup%C5%AF%20potravin%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22373%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3EPodm%C3%ADnka%3A%20min.%2010%20plateb%20kartou%20m%C4%9Bs%C3%AD%C4%8Dn%C4%9B%3C%2Ftext%3E%3Crect%20x%3D%2256%22%20y%3D%22460%22%20width%3D%22310%22%20height%3D%2250%22%20rx%3D%2225%22%20fill%3D%22%23facc15%22%2F%3E%3Ctext%20x%3D%22211%22%20y%3D%22494%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2221%22%20font-weight%3D%22800%22%20fill%3D%22%23111827%22%3EZjistit%20podm%C3%ADnky%20%E2%86%92%3C%2Ftext%3E%3Ctext%20x%3D%22968%22%20y%3D%22542%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%23cbd5e1%22%3EReklama%20%C2%B7%20proklik%20p%C5%99es%20eHUB%3C%2Ftext%3E%3C%2Fsvg%3E",wideBanner:"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221000%22%20height%3D%22560%22%20viewBox%3D%220%200%201000%20560%22%20role%3D%22img%22%20aria-label%3D%22Raiffeisenbank%20%C2%B7%20b%C4%9B%C5%BEn%C3%BD%20%C3%BA%C4%8Det%20VYBERTE%20SI%20JEDNU%20ZE%203%20ODM%C4%9AN%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23111827%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23334155%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%221000%22%20height%3D%22560%22%20rx%3D%2228%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2218%22%20height%3D%22560%22%20fill%3D%22%23facc15%22%2F%3E%3Crect%20x%3D%22790%22%20y%3D%2224%22%20width%3D%22180%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22%23facc15%22%2F%3E%3Ctext%20x%3D%22880%22%20y%3D%2252%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23111827%22%3EDO%2031.%2012.%202026%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%2258%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2221%22%20font-weight%3D%22700%22%20fill%3D%22%23fde047%22%3ERaiffeisenbank%20%C2%B7%20b%C4%9B%C5%BEn%C3%BD%20%C3%BA%C4%8Det%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22145%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2244%22%20font-weight%3D%22800%22%20fill%3D%22%23ffffff%22%3EVYBERTE%20SI%20JEDNU%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22207%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2244%22%20font-weight%3D%22800%22%20fill%3D%22%23ffffff%22%3EZE%203%20ODM%C4%9AN%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22297%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3E6%C3%97500%20K%C4%8D%20%C2%B7%2050%20%25%20zp%C4%9Bt%20za%20online%20z%C3%A1bavu%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22335%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3Enebo%2010%20%25%20zp%C4%9Bt%20z%20n%C3%A1kup%C5%AF%20potravin%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22373%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3EPodm%C3%ADnka%3A%20min.%2010%20plateb%20kartou%20m%C4%9Bs%C3%AD%C4%8Dn%C4%9B%3C%2Ftext%3E%3Crect%20x%3D%2256%22%20y%3D%22460%22%20width%3D%22310%22%20height%3D%2250%22%20rx%3D%2225%22%20fill%3D%22%23facc15%22%2F%3E%3Ctext%20x%3D%22211%22%20y%3D%22494%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2221%22%20font-weight%3D%22800%22%20fill%3D%22%23111827%22%3EZjistit%20podm%C3%ADnky%20%E2%86%92%3C%2Ftext%3E%3Ctext%20x%3D%22968%22%20y%3D%22542%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%23cbd5e1%22%3EReklama%20%C2%B7%20proklik%20p%C5%99es%20eHUB%3C%2Ftext%3E%3C%2Fsvg%3E",image:"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221000%22%20height%3D%22560%22%20viewBox%3D%220%200%201000%20560%22%20role%3D%22img%22%20aria-label%3D%22Raiffeisenbank%20%C2%B7%20b%C4%9B%C5%BEn%C3%BD%20%C3%BA%C4%8Det%20VYBERTE%20SI%20JEDNU%20ZE%203%20ODM%C4%9AN%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%23111827%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23334155%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%221000%22%20height%3D%22560%22%20rx%3D%2228%22%20fill%3D%22url%28%23g%29%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2218%22%20height%3D%22560%22%20fill%3D%22%23facc15%22%2F%3E%3Crect%20x%3D%22790%22%20y%3D%2224%22%20width%3D%22180%22%20height%3D%2242%22%20rx%3D%2221%22%20fill%3D%22%23facc15%22%2F%3E%3Ctext%20x%3D%22880%22%20y%3D%2252%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%23111827%22%3EDO%2031.%2012.%202026%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%2258%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2221%22%20font-weight%3D%22700%22%20fill%3D%22%23fde047%22%3ERaiffeisenbank%20%C2%B7%20b%C4%9B%C5%BEn%C3%BD%20%C3%BA%C4%8Det%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22145%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2244%22%20font-weight%3D%22800%22%20fill%3D%22%23ffffff%22%3EVYBERTE%20SI%20JEDNU%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22207%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2244%22%20font-weight%3D%22800%22%20fill%3D%22%23ffffff%22%3EZE%203%20ODM%C4%9AN%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22297%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3E6%C3%97500%20K%C4%8D%20%C2%B7%2050%20%25%20zp%C4%9Bt%20za%20online%20z%C3%A1bavu%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22335%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3Enebo%2010%20%25%20zp%C4%9Bt%20z%20n%C3%A1kup%C5%AF%20potravin%3C%2Ftext%3E%3Ctext%20x%3D%2256%22%20y%3D%22373%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22500%22%20fill%3D%22%23e5e7eb%22%3EPodm%C3%ADnka%3A%20min.%2010%20plateb%20kartou%20m%C4%9Bs%C3%AD%C4%8Dn%C4%9B%3C%2Ftext%3E%3Crect%20x%3D%2256%22%20y%3D%22460%22%20width%3D%22310%22%20height%3D%2250%22%20rx%3D%2225%22%20fill%3D%22%23facc15%22%2F%3E%3Ctext%20x%3D%22211%22%20y%3D%22494%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2221%22%20font-weight%3D%22800%22%20fill%3D%22%23111827%22%3EZjistit%20podm%C3%ADnky%20%E2%86%92%3C%2Ftext%3E%3Ctext%20x%3D%22968%22%20y%3D%22542%22%20text-anchor%3D%22end%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%23cbd5e1%22%3EReklama%20%C2%B7%20proklik%20p%C5%99es%20eHUB%3C%2Ftext%3E%3C%2Fsvg%3E",tag:"3 odměny · do 31. 12.",contexts:["finance", "shopping", "family", "sidebar", "general", "local"],weight:18,validFrom:"2026-09-01",validTo:"2026-12-31",runtimeVerified:true,imageRequired:true},
/* RB_THREE_REWARDS_2026_END */

/* MOVIT15_SPOTLIGHT_START */
  {id:"multi-movit15-kolekce",title:"MOVitenergy: 15 % na vše s kódem MOVIT15",text:"Sleva 15 % na vše kromě výhodných balíčků. Kód MOVIT15 platí do 16. září 2026.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2F",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",tag:"15 % · kód MOVIT15",contexts:["health", "shopping", "family", "sidebar", "general", "local"],weight:23,runtimeVerified:true,validFrom:"2026-08-30",validTo:"2026-09-16"},
  {id:"multi-movit15-product-1",title:"Probiotika, komplex laktobacilů a bifidobakterií, 90 veganských kapslí",text:"359 CZK · s kódem MOVIT15 sleva 15 % · Přípravek obsahuje komplex 6 kmenů laktobacilů a bifidobakterií a vitamin C, který přispívá k normální fu",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2Fproducts%2Fmovit-probiotika-komplex-laktobacilu-a-bifidobakterii-90-veganskych-kapsli%3Fvariant%3D55070661968249",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",tag:"MOVIT15 · 15 %",contexts:["health", "shopping", "family", "sidebar", "general"],weight:17,runtimeVerified:true,validFrom:"2026-08-30",validTo:"2026-09-16"},
  {id:"multi-movit15-product-2",title:"Železo Chelát Premium, 90 kapslí",text:"259 CZK · s kódem MOVIT15 sleva 15 % · Vysoká biodostupnost, účinná a velmi dobře snášená forma železa ve vegetariánských kapslích, pro zdravou ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2Fproducts%2Fmovit-zelezo-chelat-premium-90-cps%3Fvariant%3D55070662558073",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Zelezo_Chelat_Premium_90.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Zelezo_Chelat_Premium_90.png",tag:"MOVIT15 · 15 %",contexts:["health", "shopping", "family", "sidebar", "general"],weight:17,runtimeVerified:true,validFrom:"2026-08-30",validTo:"2026-09-16"},
  {id:"multi-movit-marianne-2026-kolekce",title:"MOVitenergy: Dny Marianne – 25 % na vše",text:"Sleva 25 % na vše během Dnů Marianne. Akce platí od 17. do 21. září 2026.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2F",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",tag:"Dny Marianne · −25 %",contexts:["health", "shopping", "family", "sidebar", "general", "local"],weight:30,runtimeVerified:true,validFrom:"2026-09-17",validTo:"2026-09-21"},
  {id:"multi-movit-marianne-2026-product-1",title:"Probiotika, komplex laktobacilů a bifidobakterií, 90 veganských kapslí",text:"359 CZK · během Dnů Marianne sleva 25 % · Přípravek obsahuje komplex 6 kmenů laktobacilů a bifidobakterií a vitamin C, který přispívá k normální fu",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2Fproducts%2Fmovit-probiotika-komplex-laktobacilu-a-bifidobakterii-90-veganskych-kapsli%3Fvariant%3D55070661968249",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",tag:"Dny Marianne · −25 %",contexts:["health", "shopping", "family", "sidebar", "general"],weight:22,runtimeVerified:true,validFrom:"2026-09-17",validTo:"2026-09-21"},
  {id:"multi-movit-marianne-2026-product-2",title:"Železo Chelát Premium, 90 kapslí",text:"259 CZK · během Dnů Marianne sleva 25 % · Vysoká biodostupnost, účinná a velmi dobře snášená forma železa ve vegetariánských kapslích, pro zdravou ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2Fproducts%2Fmovit-zelezo-chelat-premium-90-cps%3Fvariant%3D55070662558073",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Zelezo_Chelat_Premium_90.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Zelezo_Chelat_Premium_90.png",tag:"Dny Marianne · −25 %",contexts:["health", "shopping", "family", "sidebar", "general"],weight:22,runtimeVerified:true,validFrom:"2026-09-17",validTo:"2026-09-21"},
/* MOVIT15_SPOTLIGHT_END */

/* POMPO_LEGO_POKEMON_SPOTLIGHT_START */
  {id:"multi-pompo-lego-pokemon-kolekce",title:"Novinka: LEGO Pokémon na Pompo.cz",text:"Nová kolekce LEGO Pokémon. Prohlédněte si aktuální sety a dostupnost přímo na Pompo.cz.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Flego-pokemon%2F",banner:"https://data.pompo.cz/data/tmp/102/6/517296_102.jpg?1777033406_1",wideBanner:"https://data.pompo.cz/data/tmp/102/6/517296_102.jpg?1777033406_1",tag:"Exkluzivní novinka · LEGO Pokémon",contexts:["family", "shopping", "sidebar", "general", "local"],weight:24,runtimeVerified:true},
  {id:"multi-pompo-lego-pokemon-1",title:"LEGO® Pokémon™ 72151 Eevee",text:"1372.00 CZK · GAMERSKÝ KOUSEK PRO FANOUŠKY EEVEE – Připomeňte si krásné okamžiky jako cvičitel Pokémonů se stavebnicí LEGO® Pokémon™ E",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Flego-pokemon-72151-eevee_z267531%2F",banner:"https://data.pompo.cz/data/tmp/102/6/517296_102.jpg?1777033406_1",wideBanner:"https://data.pompo.cz/data/tmp/102/6/517296_102.jpg?1777033406_1",tag:"Novinka · LEGO Pokémon",contexts:["family", "shopping", "sidebar", "general", "local"],weight:20,runtimeVerified:true},
  {id:"multi-pompo-lego-pokemon-2",title:"LEGO® Pokémon™ 72152 Pikachu a Pokébal",text:"4749.00 CZK · BITEVNÍ POKÉMON NA VÝSTAVKU – Dekorace Pikachu a Pokébal (72152) obsahuje model této ikonické postavičky, který lze vyst",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Flego-pokemon-72152-pikachu-a-pokebal_z267532%2F",banner:"https://data.pompo.cz/data/tmp/102/8/517258_102.jpg?1777033377_1",wideBanner:"https://data.pompo.cz/data/tmp/102/8/517258_102.jpg?1777033377_1",tag:"Novinka · LEGO Pokémon",contexts:["family", "shopping", "sidebar", "general", "local"],weight:16,runtimeVerified:true},
  {id:"multi-pompo-lego-pokemon-3",title:"LEGO® Pokémon™ 30729 Prémioball",text:"87.00 CZK · LEGO Pokémon Gift Ball je stavitelná verze standardního Poké Ballu: elegantní, bílá a určená pro všechny \"speciální příl",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Flego-pokemon-30729-premioball_z271941%2F",banner:"https://data.pompo.cz/data/tmp/102/8/540768_102.jpg?1785155009_1",wideBanner:"https://data.pompo.cz/data/tmp/102/8/540768_102.jpg?1785155009_1",tag:"Novinka · LEGO Pokémon",contexts:["family", "shopping", "sidebar", "general", "local"],weight:16,runtimeVerified:true},
  {id:"multi-pompo-lego-pokemon-4",title:"LEGO® Pokémon™ 30730 Potřeby pro Trenéry",text:"87.00 CZK · LEGO Pokémon Trainer doplňky s Pokéballem, dárkovým míčem, bobulemi, ovocem a nápojem. Dokonce jsou tu cíle, jak procvič",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Flego-pokemon-30730-potreby-pro-trenery_z271942%2F",banner:"https://data.pompo.cz/data/tmp/102/5/541005_102.jpg?1785155181_1",wideBanner:"https://data.pompo.cz/data/tmp/102/5/541005_102.jpg?1785155181_1",tag:"Novinka · LEGO Pokémon",contexts:["family", "shopping", "sidebar", "general", "local"],weight:16,runtimeVerified:true},
  {id:"multi-pompo-lego-pokemon-5",title:"LEGO® Pokémon™ 72150 Munchlax",text:"1429.00 CZK · STAVEBNICE S MODELEM MUNCHLAXE – Užijte si spoustu zábavy s propracovanou stavebnicí věčně hladového Pokémona LEGO® Munc",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Flego-pokemon-72150-munchlax_z271957%2F",banner:"https://data.pompo.cz/data/tmp/102/6/540866_102.jpg?1785155082_1",wideBanner:"https://data.pompo.cz/data/tmp/102/6/540866_102.jpg?1785155082_1",tag:"Novinka · LEGO Pokémon",contexts:["family", "shopping", "sidebar", "general", "local"],weight:16,runtimeVerified:true},
/* POMPO_LEGO_POKEMON_SPOTLIGHT_END */
/* AUTO_MULTI_FEED_PRODUCTS_START */
  {id:"multi-multi-feed-d82179f13d566b",title:"Varianta",text:"219 Kč · Štrasový pružný náramek Elorian je vyroben z kvalitní bižuterie a dostupný ve více variantách podle počtu řad. Každá varianta působí jinak – od jemnéh",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fnaramek-strasovy-vice-velikosti-26212%23varianta%3D13172",banner:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",wideBanner:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",image:"https://aranys.cz/pool/vzor/products/naramek-42223.jpg",tag:"Produkt · Aranys.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-81588e5ac1328e",title:"Ariete Moka Aroma 1358/10, bílý",text:"1139 Kč · Dokonalá káva bez námahy Tento elegantní kávovar vám pomůže připravit lahodnou kávu s neodolatelnou chutí a vůní tradičním způsobem překapávání. Přípr",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ffcf2387&desturl=https%3A%2F%2Fwww.ariete.cz%2Fariete-moka-electrik-1358-10-bily%2F%3Futm_source%3Dheureka%26amp%3Butm_medium%3Dporovnavac%26amp%3Butm_campaign%3Dheureka",banner:"https://www.edsi.sk/api/v1/image?query=product/20/34/57/17692.jpg",wideBanner:"https://www.edsi.sk/api/v1/image?query=product/20/34/57/17692.jpg",image:"https://www.edsi.sk/api/v1/image?query=product/20/34/57/17692.jpg",tag:"Produkt · Ariete.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-ee7eda9f0455ac",title:"Bredemeijer Drátěnka na čištění hubičky na konvičce",text:"229 Kč · Nerezová",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=8b5aa099&desturl=https%3A%2F%2Fwww.bakly.cz%2Fbredemeijer-cistici-houbicka-na-konvici-145",banner:"https://bakly.fra1.digitaloceanspaces.com/142704/conversions/BM145-large.jpg",wideBanner:"https://bakly.fra1.digitaloceanspaces.com/142704/conversions/BM145-large.jpg",image:"https://bakly.fra1.digitaloceanspaces.com/142704/conversions/BM145-large.jpg",tag:"Produkt · Bakly.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-1354412fda1248",title:"Měděná lžička s diskem 28 cm",text:"355 Kč · Tato barová lžíce v měděné barvě nabízí profesionálním barmanům celou řadu požadovaných vlastností. Elegantní s měděným povrchem, moderní styl práce. ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=6caa871c&desturl=https%3A%2F%2Fwww.barman.cz%2Fmedena-lzicka-s-diskem-28-cm-2%2F",banner:"https://cdn.myshoptet.com/usr/www.barman.cz/user/shop/orig/9830_medena-lzicka-s-diskem-28-cm.jpg?608ff3ea",wideBanner:"https://cdn.myshoptet.com/usr/www.barman.cz/user/shop/orig/9830_medena-lzicka-s-diskem-28-cm.jpg?608ff3ea",image:"https://cdn.myshoptet.com/usr/www.barman.cz/user/shop/orig/9830_medena-lzicka-s-diskem-28-cm.jpg?608ff3ea",tag:"Produkt · Barman.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-8859c8432f4625",title:"Brit Premium Cat Pouches whit fish Kitten 100g",text:"11.9 Kč · Kousky s bílou rybou v omáčce pro koťata. Kompletní prémiové mokré krmivo pro koťata. Kousky bílé ryby v lahodné omáčce! Kompletní prémiové mokré krmi",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e26bf9fd&desturl=https%3A%2F%2Fwww.bezednamiska.cz%2Fvse-pro-kocky%2Fkrmivo-pro-kocky%2Fkapsicky-pro-kocky%2Fbrit-premium-cat-pouches-whit-fish-kitten-100g.html",banner:"https://www.bezednamiska.cz/out/pictures/z1/101111835_z1.jpg?v=1630993733-44017",wideBanner:"https://www.bezednamiska.cz/out/pictures/z1/101111835_z1.jpg?v=1630993733-44017",image:"https://www.bezednamiska.cz/out/pictures/z1/101111835_z1.jpg?v=1630993733-44017",tag:"Produkt · Bezednámiska.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-f8ad1ccb8583f3",title:"Bioalis Forte (60 kapslí)",text:"690 CZK · Tento komplexní doplněk stravy je vhodný pro celou rodinu, a to zejména v okamžiku potřeby posílení imunity. Doporučujeme užívat také během regenerace",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5eef1c1f&desturl=https%3A%2F%2Fwww.bioalis.com%2Fprodukt%2Fbioalis-forte",banner:"https://www.bioalis.com/data/products/43/656a83d6cbfe2fcbeb9947be5f8e41ba.png",wideBanner:"https://www.bioalis.com/data/products/43/656a83d6cbfe2fcbeb9947be5f8e41ba.png",image:"https://www.bioalis.com/data/products/43/656a83d6cbfe2fcbeb9947be5f8e41ba.png",tag:"Produkt · Bioalis.com",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-a7951a65957915",title:"Bylík Brusinka nať 400g",text:"196 Kč · Brusinka nať – tradiční bylina pro každodenní rovnováhu Brusinka obecná (Vaccinium vitis-idaea) je nízký stálezelený keřík známý především svými červe",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=fc69bdf3&desturl=https%3A%2F%2Fbylik.cz%2Fzbozi%2F1-brusinka-nat.html%3Fvar%3D400",banner:"https://bylik.cz/obrazky/img/pic4/obr-404.png",wideBanner:"https://bylik.cz/obrazky/img/pic4/obr-404.png",image:"https://bylik.cz/obrazky/img/pic4/obr-404.png",tag:"Produkt · Bylík.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-cb05302f231c81",title:"A.M.A. S.P.A. AMA - kotoučový nůž na větve 255 mm / 36 zubů / O 25.4 mm / 2.0 mm",text:"239 Kč · Kvalitní nože pro křovinořezy. Vhodné pro podrost,křoví a větve. Nůž je určen pro motory 3-5HP. Počet zubů - 36 Materiál - Wolfram",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=902a5fec&desturl=https%3A%2F%2Fwww.ceskazahrada.cz%2Fama-kotoucovy-nuz-na-vetve-255-mm-36-zubu-o-25-4-mm-2-0-mm%2F",banner:"https://cdn.myshoptet.com/usr/www.ceskazahrada.cz/user/shop/orig/9890_kotoucovy-nuz-na-vetve-2x26-4x255-36zubu-1.jpg?67587461",wideBanner:"https://cdn.myshoptet.com/usr/www.ceskazahrada.cz/user/shop/orig/9890_kotoucovy-nuz-na-vetve-2x26-4x255-36zubu-1.jpg?67587461",image:"https://cdn.myshoptet.com/usr/www.ceskazahrada.cz/user/shop/orig/9890_kotoucovy-nuz-na-vetve-2x26-4x255-36zubu-1.jpg?67587461",tag:"Produkt · Ceskazahrada.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-939cb218708e29",title:"Concept HEPA filtr Cosmic VP1000 (č.2)",text:"169 Kč · HEPA filtr Cosmic VP1000 (č.2)HEPA filtr Cosmic VP1000 (č.2)",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2Fhepa-filtr-cosmic-vp1000-c-2-_d7925.html",banner:"https://www.my-concept.cz/img.asp?stiid=7925",wideBanner:"https://www.my-concept.cz/img.asp?stiid=7925",image:"https://www.my-concept.cz/img.asp?stiid=7925",tag:"Produkt · Concept.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e2cb6f74180fa0",title:"Zelené olivové mýdlo 125 g – ABEA",text:"79 Kč · Každý výrobek ABEA si vypůjčuje několik vzácných tajemství přírody. 100% přírodní | Bez parfemace | i pro citlivou pokožku Zelené",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=0c6277d3&desturl=https%3A%2F%2Fcretamart.com%2Fcs%2Fpece-o-telo%2F62-zelene-olivove-mydlo-abea-125g.html%3FSubmitCurrency%3D1%26id_currency%3D4",banner:"https://cretamart.com/271/zelene-olivove-mydlo-abea-125g.jpg",wideBanner:"https://cretamart.com/271/zelene-olivove-mydlo-abea-125g.jpg",image:"https://cretamart.com/271/zelene-olivove-mydlo-abea-125g.jpg",tag:"Produkt · Cretamart.com",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-3bc9e40e683057",title:"e 1294 Aviváž s kondicionérem Diwa Vivien 1000ml",text:"229 Kč · Přednosti a vlastnosti: Dlouhotrvající parfemace a měkkost. Neobsahuje žádná barviva. Oděvy a ložní prádlo jsou „jako nové“, ručníky si uchovávají při",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=7039de6e&desturl=https%3A%2F%2Fwww.diskont-zahradkar.cz%2Fp%2Fe-1294-avivaz-s-kondicionerem-diwa-vivien-1000ml",banner:"https://diskont-zahradkar.s13.cdn-upgates.com/w/w6ab6447f2a80a-diwa-vivien.webp",wideBanner:"https://diskont-zahradkar.s13.cdn-upgates.com/w/w6ab6447f2a80a-diwa-vivien.webp",image:"https://diskont-zahradkar.s13.cdn-upgates.com/w/w6ab6447f2a80a-diwa-vivien.webp",tag:"Produkt · Diskont-zahrádkář.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-2c57fa7838fa7e",title:"Dokonalá Láska Kartáček Curaprox CS 1009 Single",text:"134 Kč · Skvělý kartáček pro malé tlamičky a také pro precizní práci i na hůře přístupných místech. Obzvláště dlouhá jemná vlákna jednosvazkového kartáčku Cura",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=fe530349&desturl=https%3A%2F%2Fdokonalalaska.cz%2Fkartacek-curaprox-cs-1009-single%2F%3Futm_campaign%3DAll%26utm_content%3DChovatelske%2Bpotreby%2B%257C%2BPro%2Bpsy%2B%257C%2BHygiena%2Ba%2Bkosmetik%26utm_medium%3Dproduct%26utm_source%3Dheureka.cz%26utm_term%3DDokonala%2BLaska%2BKartacek%2BCuraprox%2BCS%2B1009%2BSingle",banner:"https://dokonalalaska.cz/wp-content/uploads/2020/07/CS-1009-single-orange-blue-copy-600x600-1.jpg",wideBanner:"https://dokonalalaska.cz/wp-content/uploads/2020/07/CS-1009-single-orange-blue-copy-600x600-1.jpg",image:"https://dokonalalaska.cz/wp-content/uploads/2020/07/CS-1009-single-orange-blue-copy-600x600-1.jpg",tag:"Produkt · Dokonaláláska.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-8e5a219c95a38f",title:"Bonbony Jitrocel, 70 g Dr. Popov",text:"84 Kč · Bylinné bonbony s 10 % pravého jitrocelového čaje s příjemnou bylinnou chutí jitrocele.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00bf6577&desturl=https%3A%2F%2Fwww.drpopov.cz%2Fprodukt%2Fbonbony-jitrocel-70-g%2F",banner:"https://www.drpopov.cz/wp-content/uploads/2022/06/bonbony-jitrocel-m.jpg",wideBanner:"https://www.drpopov.cz/wp-content/uploads/2022/06/bonbony-jitrocel-m.jpg",image:"https://www.drpopov.cz/wp-content/uploads/2022/06/bonbony-jitrocel-m.jpg",tag:"Produkt · DrPopov.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e6bd0677632bf3",title:"Bema Vzorek Opalovací krém SPF 50 BIO 2 ml",text:"15 Kč · Opalovací krém SPF 50, testovaný na citlivé pokožce, je vhodný pro obličej i tělo. Složení kombinuje fyzikální filtry, jako je titan a zinek, které po",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=02b953fa&desturl=https%3A%2F%2Fwww.ecoteeno.cz%2Fbema-vzorek-opalovaci-krem-spf-50-bio%2F",banner:"https://cdn.myshoptet.com/usr/www.ecoteeno.cz/user/shop/orig/21040_1102c-bema-vzorek.jpg?69a7fb8a",wideBanner:"https://cdn.myshoptet.com/usr/www.ecoteeno.cz/user/shop/orig/21040_1102c-bema-vzorek.jpg?69a7fb8a",image:"https://cdn.myshoptet.com/usr/www.ecoteeno.cz/user/shop/orig/21040_1102c-bema-vzorek.jpg?69a7fb8a",tag:"Produkt · Ecoteeno.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-0b2dc525ca3b38",title:"Aphipar – Aphidius colemani - na mšice Balenie: 500 ks",text:"783 CZK · <span style=\"font-family: 'Roboto",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=7092fff6&desturl=https%3A%2F%2Feshop.ekoclovek.cz%2Fpomocnici-bioagens%2Faphipar-aphidius-colemani%2F%3FvariantId%3D4430",banner:"https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/3854_aphipar-aphidius-colemani-osicka-proti-msicim.jpg?65902b77",wideBanner:"https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/3854_aphipar-aphidius-colemani-osicka-proti-msicim.jpg?65902b77",image:"https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/3854_aphipar-aphidius-colemani-osicka-proti-msicim.jpg?65902b77",tag:"Produkt · eshop.ekoclovek.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-ef3cd15cb04556",title:"LEGO® Botanicals 10281 Bonsaj",text:"989 Kč · 10281 <div class=\"lapc-ianteov lapc-ianlit",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=3ffab0a4&desturl=https%3A%2F%2Feshop.museumofbricks.cz%2Flego-icons-10281-bonsaj%2F",banner:"https://cdn.myshoptet.com/usr/eshop.museumofbricks.cz/user/shop/orig/20190-13_lego-botanicals-10281-bonsaj.jpg?62aaf073",wideBanner:"https://cdn.myshoptet.com/usr/eshop.museumofbricks.cz/user/shop/orig/20190-13_lego-botanicals-10281-bonsaj.jpg?62aaf073",image:"https://cdn.myshoptet.com/usr/eshop.museumofbricks.cz/user/shop/orig/20190-13_lego-botanicals-10281-bonsaj.jpg?62aaf073",tag:"Produkt · eshop.MuseumofBricks.cz",contexts:["family", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-de0f1fed9f1e98",title:"Salente nádoba na přílohy pro Ario a Cuco",text:"199 Kč · Salente nádoba na přílohy pro Ario a Cuco od výrobce SALENTE",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e945dbdb&desturl=https%3A%2F%2Feshop.salente.cz%2Fsalente-nadoba-na-prilohy-pro-ario-a-cuco%2F",banner:"https://cdn.myshoptet.com/usr/eshop.salente.cz/user/shop/orig/222_salente-nadoba-na-p--345-ilohy-pro-ario-a-cuco.jpg?6a3e66be",wideBanner:"https://cdn.myshoptet.com/usr/eshop.salente.cz/user/shop/orig/222_salente-nadoba-na-p--345-ilohy-pro-ario-a-cuco.jpg?6a3e66be",image:"https://cdn.myshoptet.com/usr/eshop.salente.cz/user/shop/orig/222_salente-nadoba-na-p--345-ilohy-pro-ario-a-cuco.jpg?6a3e66be",tag:"Produkt · eshop.Salente.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-3f4f387cbc39f8",title:"Green idea Acnegreen - tobolky 90 ks",text:"388 Kč · ACNEGREEN PRO ČISTOU PLEŤ - tobolky Doplněk stravy Objevte sílu přírody v boji s problematickou pletí.​ Pečujte o svou pleť přírodní cestou a dodejte ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=574c29b8&desturl=https%3A%2F%2Fwww.greenidea.cz%2Facnegreen-tobolky%2F",banner:"https://cdn.myshoptet.com/usr/www.greenidea.cz/user/shop/orig/1935-1_acnegreen-tobolky.png?69a5e617",wideBanner:"https://cdn.myshoptet.com/usr/www.greenidea.cz/user/shop/orig/1935-1_acnegreen-tobolky.png?69a5e617",image:"https://cdn.myshoptet.com/usr/www.greenidea.cz/user/shop/orig/1935-1_acnegreen-tobolky.png?69a5e617",tag:"Produkt · GreenIdea.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-170bf3afcb3fb1",title:"CBD Broskve",text:"1 830 Kč · Klidná mysl jasná hlava 25 mg CBD / ks Jemnější, ale znatelná dávka <div class=\"produ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=8995aa40&desturl=https%3A%2F%2Fwww.gummylife.cz%2Fgummies-plus-broskve-2%2F",banner:"https://cdn.myshoptet.com/usr/www.gummylife.cz/user/shop/orig/118_broskveimg.jpg?6a902f50",wideBanner:"https://cdn.myshoptet.com/usr/www.gummylife.cz/user/shop/orig/118_broskveimg.jpg?6a902f50",image:"https://cdn.myshoptet.com/usr/www.gummylife.cz/user/shop/orig/118_broskveimg.jpg?6a902f50",tag:"Produkt · Gummylife.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-d55b5b0c870f39",title:"Organická apotéka Havlíkova apotéka Pleťová maska Kolagen 30 ml",text:"372 Kč · 3minutová ranní pleťová maska Kolagen pleti dopřeje hydrataci a vypnutí. Obsahuje přírodní kolagen a bambucké máslo. Je to dokonalá výživa pro pleť, k",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=8fb01877&desturl=https%3A%2F%2Fwww.havlikovaapoteka.cz%2Fpletova-maska-kolagen%2F",banner:"https://cdn.myshoptet.com/usr/www.havlikovaapoteka.cz/user/shop/orig/47_pletova-maska-kolagen-30-ml-od-havlikovy-apoteky.png?6673e12a",wideBanner:"https://cdn.myshoptet.com/usr/www.havlikovaapoteka.cz/user/shop/orig/47_pletova-maska-kolagen-30-ml-od-havlikovy-apoteky.png?6673e12a",image:"https://cdn.myshoptet.com/usr/www.havlikovaapoteka.cz/user/shop/orig/47_pletova-maska-kolagen-30-ml-od-havlikovy-apoteky.png?6673e12a",tag:"Produkt · Havlíkovaapotéka.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-f4fb00fa7cdcab",title:"Herbal Store Maté - drcené listy 200 g",text:"129 Kč · Kontrola tělesné hmotnosti Potlačení duševní a tělesné únavy Vylučování vody z organizmu Yerba Maté (Ilex paraguariensis) patří mezi nejznámější tradi",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=efea1626&desturl=https%3A%2F%2Fwww.herbal-store.cz%2Fmate-drcene-listy_z5620%2F",banner:"https://data.herbal-store.cz/data/tmp/102/8/3868_102.jpg?1786044397_1",wideBanner:"https://data.herbal-store.cz/data/tmp/102/8/3868_102.jpg?1786044397_1",image:"https://data.herbal-store.cz/data/tmp/102/8/3868_102.jpg?1786044397_1",tag:"Produkt · Herbal-store.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-c52b9c71b8f734",title:"Omega 3 přírodní produkt - 60 tobolek / Herbavia.cz",text:"299 Kč · OMEGA 3 - Rybí olej plus - 18 % EPA, 12 % DHA Pro zdravé srdce a cévy, mozek a zrak <span style=\"",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=6f6d0507&desturl=https%3A%2F%2Fwww.herbavia.cz%2Fprodukty%2Fomega-3%2F",banner:"https://cdn.myshoptet.com/usr/www.herbavia.cz/user/shop/orig/1252-1_omega-3.jpg?684ef2d1",wideBanner:"https://cdn.myshoptet.com/usr/www.herbavia.cz/user/shop/orig/1252-1_omega-3.jpg?684ef2d1",image:"https://cdn.myshoptet.com/usr/www.herbavia.cz/user/shop/orig/1252-1_omega-3.jpg?684ef2d1",tag:"Produkt · Herbavia.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-63cba1885eb0f3",title:"Hnojík Vápník 10 kg",text:"599 Kč · Vysoká reaktivita - min 95% Obsah vápna min. 95% CaCO3 Nízký obsah vody 4-8% Objemová hmotnost 1,25 kg/dm (+-5%) Granulace 3-6mm Určeno pro všechny ty",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=1da58c10&desturl=https%3A%2F%2Fhnojik.cz%2Fprodukt%2Fvapnik-na-bazi-skutecne-kridy-10kg%2F",banner:"https://hnojik.cz/wp-content/uploads/2023/10/10kg_vapnik.jpg",wideBanner:"https://hnojik.cz/wp-content/uploads/2023/10/10kg_vapnik.jpg",image:"https://hnojik.cz/wp-content/uploads/2023/10/10kg_vapnik.jpg",tag:"Produkt · Hnojík.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-c6e2ca7138bc7c",title:"Inca Collagen Vitamin C 30 kapslí",text:"89 Kč",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ec5b8e1f&desturl=https%3A%2F%2Fwww.incacollagen.cz%2Fproduct%2Fvitamin-c-se-sipkami-500mg%2F%3FSubmitCurrency%3D1%26id_currency%3D2",banner:"https://www.incacollagen.cz/18/vitamin-c-se-sipkami-500mg.jpg",wideBanner:"https://www.incacollagen.cz/18/vitamin-c-se-sipkami-500mg.jpg",image:"https://www.incacollagen.cz/18/vitamin-c-se-sipkami-500mg.jpg",tag:"Produkt · IncaCollagen.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-bacc3e2818ea95",title:"Lavandia Jablečné marokánky s levandulí 100 g",text:"89 Kč · <div i",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=cf386fe0&desturl=https%3A%2F%2Fwww.levandulezmoravy.cz%2Fjablecne-marokanky-s-levanduli%2F",banner:"https://cdn.myshoptet.com/usr/www.levandulezmoravy.cz/user/shop/orig/95-1_jablecne-marokanky-s-levanduli.jpg?678ffa52",wideBanner:"https://cdn.myshoptet.com/usr/www.levandulezmoravy.cz/user/shop/orig/95-1_jablecne-marokanky-s-levanduli.jpg?678ffa52",image:"https://cdn.myshoptet.com/usr/www.levandulezmoravy.cz/user/shop/orig/95-1_jablecne-marokanky-s-levanduli.jpg?678ffa52",tag:"Produkt · Levandulezmoravy.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-bd93df5673ffda",title:"Versele Laga Nutribird A19 pro papoušky Hmotnost: 3 kg",text:"1 180 Kč · Dokrmovací směs NutriBird A19 je kompletní ptačí krmivo pro ruční dokrmování arů, eklektusů, papoušků šedých žako, amazoňanů vějířovitých a ostatních ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ef0a4a83&desturl=https%3A%2F%2Fwww.lihne.cz%2Fnutribird-a19-pro-papousky%2F%3FvariantId%3D10949",banner:"https://cdn.myshoptet.com/usr/www.lihne.cz/user/shop/orig/10316_5443a028dfe6d5124a2dd63c7db4910c658e91ec.jpg?672b1e2e",wideBanner:"https://cdn.myshoptet.com/usr/www.lihne.cz/user/shop/orig/10316_5443a028dfe6d5124a2dd63c7db4910c658e91ec.jpg?672b1e2e",image:"https://cdn.myshoptet.com/usr/www.lihne.cz/user/shop/orig/10316_5443a028dfe6d5124a2dd63c7db4910c658e91ec.jpg?672b1e2e",tag:"Produkt · Lihne.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-1a857f3338eb45",title:"Snubní prsteny chirurgická ocel HK1456",text:"1000 Kč · Snubní ocelové prsteny.Matné snubní prsteny zdobené šikmým rýhováním.materiál: chirurgická ocelpovrchová úprava: matnášíře dámského prstenu: 6 mmšíře ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=75b5dc73&desturl=https%3A%2F%2Fwww.marre.cz%2F-z118CZ",banner:"https://www.marre.cz/Prilohy/328043-5ed10f269358a.jpg",wideBanner:"https://www.marre.cz/Prilohy/328043-5ed10f269358a.jpg",image:"https://www.marre.cz/Prilohy/328043-5ed10f269358a.jpg",tag:"Produkt · Marre.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-18c80946e4441b",title:"Probiotika, komplex laktobacilů a bifidobakterií, 90 veganských kapslí",text:"359 CZK · Přípravek obsahuje komplex 6 kmenů laktobacilů a bifidobakterií a vitamin C, který přispívá k normální funkci imunitního systému.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2Fproducts%2Fmovit-probiotika-komplex-laktobacilu-a-bifidobakterii-90-veganskych-kapsli%3Fvariant%3D55070661968249",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",image:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Probiotika_komplex_laktobacilu_a_bifidobakterii_transparent_shadow.png",tag:"Produkt · MOVitenergy.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-b4a2b0ea7a7178",title:"Sada sáčků FoodSaver pro vakuování 0,94l (FSB4802-I)",text:"490 Kč · Tyto sáčky lze použít společně s vakuovými svářečkami značky FoodSaver , a to kromě ruční akumulátorové vakuovačky a vakuové baličky FFS010X. I pro op",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=259ca026&desturl=https%3A%2F%2Fwww.mamedoma.cz%2Ffolie-a-sacky%2Fsada-sacku-foodsaver-pro-vakuovani-0-94l-fsb4802-i%2F",banner:"https://cdn.myshoptet.com/usr/www.mamedoma.cz/user/shop/orig/144_fsb4802.jpg?5cfd27ca",wideBanner:"https://cdn.myshoptet.com/usr/www.mamedoma.cz/user/shop/orig/144_fsb4802.jpg?5cfd27ca",image:"https://cdn.myshoptet.com/usr/www.mamedoma.cz/user/shop/orig/144_fsb4802.jpg?5cfd27ca",tag:"Produkt · Mámedoma.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-d1c1cab9667f12",title:"Nanolab Cestovní dezinfekce: OMG série F*CK COVID Varianta: bílá",text:"162 Kč · OMG série dezinfekce: F*CK COVID Dezinfekční kapesní sprej s obsahem nanostříbra objem 10 ml Jak dlouho vydrží COVID-19 na povrchu? Velmi záleží na ty",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=32dfe8fd&desturl=https%3A%2F%2Fwww.nanospace.cz%2Fdezinfekce-uz-toho-mam-dost%2F%3FvariantId%3D2645",banner:"https://cdn.myshoptet.com/usr/www.nanospace.cz/user/shop/orig/1682-2_cestovni-dezinfekce--omg-serie-f-ck-covid--varianta-bila.jpg?60f13d6c",wideBanner:"https://cdn.myshoptet.com/usr/www.nanospace.cz/user/shop/orig/1682-2_cestovni-dezinfekce--omg-serie-f-ck-covid--varianta-bila.jpg?60f13d6c",image:"https://cdn.myshoptet.com/usr/www.nanospace.cz/user/shop/orig/1682-2_cestovni-dezinfekce--omg-serie-f-ck-covid--varianta-bila.jpg?60f13d6c",tag:"Produkt · Nanospace.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-2ae1baaea03710",title:"NaturalProtein Bylinný sypaný čaj Vitamínový",text:"151 Kč · Bylinný sypaný čaj Vitamínový Dodejte tělu vitamíny v šálku Stačí šálek horkého vitamínového čaje a vaším tělem hned proudí vitamíny C, A, E, K, B, an",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f166f5e6&desturl=https%3A%2F%2Fwww.naturalprotein.cz%2Fbylinny-sypany-caj-vitaminovy",banner:"https://www.naturalprotein.cz/image/s/1920x1080/shrink/storage/gallery/98/e8502d/original/sablona-wwwfoto-caj5-1.png",wideBanner:"https://www.naturalprotein.cz/image/s/1920x1080/shrink/storage/gallery/98/e8502d/original/sablona-wwwfoto-caj5-1.png",image:"https://www.naturalprotein.cz/image/s/1920x1080/shrink/storage/gallery/98/e8502d/original/sablona-wwwfoto-caj5-1.png",tag:"Produkt · NaturalProtein.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-799689fd61fbca",title:"AGRO Kapalné železo 0,5L",text:"129 Kč · Dvousložkové hnojivo určené pro všechny rostliny.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=d25f1a73&desturl=https%3A%2F%2Fwww.nelenprozelen.cz%2Fagro-kapalne-zelezo-0-5l--4120022.html%3Futm_source%3Dgoogle%26utm_medium%3Dfeed%232000025790007",banner:"https://www.nelenprozelen.cz/WINSHOP/foto_temp/4120022.jpeg",wideBanner:"https://www.nelenprozelen.cz/WINSHOP/foto_temp/4120022.jpeg",image:"https://www.nelenprozelen.cz/WINSHOP/foto_temp/4120022.jpeg",tag:"Produkt · Neleňprozeleň.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-c35ca7036e8a50",title:"Sprchový gel Dračí ovoce 400 ml Faith in Nature",text:"209 Kč · Dračí ovoce je bohatým zdrojem vitaminů B a C, minerálů, vápníku, fosforu a železa a antioxidantů , které pomáhají bojovat proti volným radiká",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=4f1d3c00&desturl=https%3A%2F%2Fwww.netestovano.cz%2Ffaith-in-nature-draci-ovoce-sprchovy-gel-400ml%2F",banner:"https://cdn.myshoptet.com/usr/www.netestovano.cz/user/shop/orig/245_7cd0e7ee2426eaff7d912d8828bb9e83-mmf250x250.jpg?6901d86f",wideBanner:"https://cdn.myshoptet.com/usr/www.netestovano.cz/user/shop/orig/245_7cd0e7ee2426eaff7d912d8828bb9e83-mmf250x250.jpg?6901d86f",image:"https://cdn.myshoptet.com/usr/www.netestovano.cz/user/shop/orig/245_7cd0e7ee2426eaff7d912d8828bb9e83-mmf250x250.jpg?6901d86f",tag:"Produkt · Netestováno.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-9e9f15131b11b6",title:"Powerlogy Protein Snack 90 g Mandle a skořice",text:"99 Kč · Praktický zdroj energie na cestyVýživný ořechový krém s kolagenem a MCT tuky pro stabilní energii bez výkyvů glykémie. Vysoký obsah proteinu a zdravýc",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=bc9ba583&desturl=https%3A%2F%2Fnutriheads.cz%2Fproducts%2Fpowerlogy-high-protein-snack%3Fvariant%3D44953804210220%26utm_source%3DHeureka%26utm_medium%3DPaid",banner:"https://cdn.shopify.com/s/files/1/0702/7906/9740/files/powerlogy_snack_almond.png",wideBanner:"https://cdn.shopify.com/s/files/1/0702/7906/9740/files/powerlogy_snack_almond.png",image:"https://cdn.shopify.com/s/files/1/0702/7906/9740/files/powerlogy_snack_almond.png",tag:"Produkt · Nutriheads.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e10436ec6db0e0",title:"Spin Master Tech Deck Fingerboard čtyřbalení",text:"351 Kč · Vyber si z široké škály zcela nových originálních tvarů a stylů fingerboardů. Tyhle malé skateboardy ovládáš pomocí prstů. Nauč se co nejvíce triků. V",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Fspin-master-tech-deck-fingerboard-ctyrbaleni_z76%2F",banner:"https://data.pompo.cz/data/tmp/102/1/241_102.jpg?1680168519_1",wideBanner:"https://data.pompo.cz/data/tmp/102/1/241_102.jpg?1680168519_1",image:"https://data.pompo.cz/data/tmp/102/1/241_102.jpg?1680168519_1",tag:"Produkt · Pompo.cz",contexts:["family", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-6470596850e863",title:"Collagile Collagile® horse (2,5 kg) Počet kusů: 1",text:"3 996 Kč · Collagile® horse Každý majitel si přeje pro svého koně jen to nejlepší – <",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ea9c8cd4&desturl=https%3A%2F%2Fwww.pomahamezitlepe.cz%2Fcollagile-horse%2F%3FvariantId%3D135",banner:"https://cdn.myshoptet.com/usr/www.pomahamezitlepe.cz/user/shop/orig/60_collagile-horse-2-5kg.png?653fd1c4",wideBanner:"https://cdn.myshoptet.com/usr/www.pomahamezitlepe.cz/user/shop/orig/60_collagile-horse-2-5kg.png?653fd1c4",image:"https://cdn.myshoptet.com/usr/www.pomahamezitlepe.cz/user/shop/orig/60_collagile-horse-2-5kg.png?653fd1c4",tag:"Produkt · Pomáhámežítlépe.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-9212e747ec9a5a",title:"Microplane Gourmet chránič prstů 45057",text:"179 Kč · Univerzální plastový nástavec pro usnadnění a větší bezpečnost strouhání, určeno pro struhadla ze série Gourmet.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ef1622c3&desturl=https%3A%2F%2Fwww.pottenpannen.cz%2Fp%2Fgourmet-chranic-prstu",banner:"https://pottenpannen-prod-storage-dmdehvecc4ecf2ap.a03.azurefd.net/ppmedia/sharedmedia/pottenpannencz/pimicsimages/products/a0044525/obr_p_45057_0_naz_1442840718-45057_pug100008.jpg",wideBanner:"https://pottenpannen-prod-storage-dmdehvecc4ecf2ap.a03.azurefd.net/ppmedia/sharedmedia/pottenpannencz/pimicsimages/products/a0044525/obr_p_45057_0_naz_1442840718-45057_pug100008.jpg",image:"https://pottenpannen-prod-storage-dmdehvecc4ecf2ap.a03.azurefd.net/ppmedia/sharedmedia/pottenpannencz/pimicsimages/products/a0044525/obr_p_45057_0_naz_1442840718-45057_pug100008.jpg",tag:"Produkt · Pottenpannen.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e06828bfaf48e3",title:"Dřevěný horní kryt a nožičky pro zvlhčovač vzduchu Meaco Deluxe 202",text:"490 CZK · Sada pro zvlhčovač a čističku vzduchu Meaco Deluxe 202 obsahuje 4 dřevěné nožičky a vrchní kryt v dřevěném dekoru. Jedná se o kvalitní plast s povrcho",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=abc25217&desturl=https%3A%2F%2Fwww.proalergiky.cz%2Feshop%2Fdreveny-horni-kryt-a-nozicky-pro-zvlhcovac-vzduchu-meaco-deluxe-202",banner:"https://www.proalergiky.cz/getmedia/63382ed9-0e65-4dd4-b166-5475586372b9/Meaco202_wooden_cover_1.jpg.aspx",wideBanner:"https://www.proalergiky.cz/getmedia/63382ed9-0e65-4dd4-b166-5475586372b9/Meaco202_wooden_cover_1.jpg.aspx",image:"https://www.proalergiky.cz/getmedia/63382ed9-0e65-4dd4-b166-5475586372b9/Meaco202_wooden_cover_1.jpg.aspx",tag:"Produkt · Proalergiky.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e89829fd31164f",title:"Individuální probiotická kúra - probiONE Premium, 50 miliard denní dávka, 190 tbl",text:"21 900 Kč · <div i",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=97341218&desturl=https%3A%2F%2Fwww.probione.com%2Fprobione-individual-premium%2F",banner:"https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/54-5_probione-premium-2.png?6a75d69a",wideBanner:"https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/54-5_probione-premium-2.png?6a75d69a",image:"https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/54-5_probione-premium-2.png?6a75d69a",tag:"Produkt · ProbiONE.com",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-849f1cbd1765c2",title:"BIO Esenciální olej CITRON 30 ml",text:"293 Kč · Typ vůně - výrazně svěží, ovocně citronová. Oživuje a osvěžuje psychiku a koncentraci. Slouží k pročištění vnitřních prostor, ať už kancelářských či b",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=9399a567&desturl=https%3A%2F%2Fwww.prirodnilekarna.cz%2Feshop-bio-esencialni-olej-citron.html",banner:"https://www.prirodnilekarna.cz/files/thumbs/mod_eshop/produkty/bio-esencialni-olej-citron-30-ml-2959.1646628311.webp?t=1693381454",wideBanner:"https://www.prirodnilekarna.cz/files/thumbs/mod_eshop/produkty/bio-esencialni-olej-citron-30-ml-2959.1646628311.webp?t=1693381454",image:"https://www.prirodnilekarna.cz/files/thumbs/mod_eshop/produkty/bio-esencialni-olej-citron-30-ml-2959.1646628311.webp?t=1693381454",tag:"Produkt · PřírodníLékárna.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-d35dc785edf2d6",title:"Drenalase Pet Mini Pes a kočka 20 Tbl – Odvodnění Tekutin",text:"408,93 Kč · Kdy? Pro všechny druhy OTOKU:Před a po chirurgických zákrocích.Ve všech situacích, kdy na pacienta působí trauma, bakterie, viry, chemikálie nebo tepl",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=979d94bf&desturl=https%3A%2F%2Fsakaripet.cz%2Fprodejna%2Fdrenalase-pet-mini-pes-a-kocka-20-tbl-odvodneni-tekutin%2F",banner:"https://sakaripet.cz/wp-content/uploads/2024/10/Amazon-Drenalase-Mini-1.jpg",wideBanner:"https://sakaripet.cz/wp-content/uploads/2024/10/Amazon-Drenalase-Mini-1.jpg",image:"https://sakaripet.cz/wp-content/uploads/2024/10/Amazon-Drenalase-Mini-1.jpg",tag:"Produkt · SakariPET.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-fa455395747bc0",title:"Tejp Škola tejpování - růžoví jednorožci",text:"199 Kč · Kvalita ověřena stovkami kurzistů. Na našich kurzech tejpování tyto tejpy používáme. Kurzisté jejich kvalitu neustále prověřují. Tejp je vyroben v Již",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=4b7ba687&desturl=https%3A%2F%2Fwww.svetfyzioterapie.cz%2Fsfshop%2Ftejp-skola-tejpovani-1662%23v708400",banner:"https://www.svetfyzioterapie.cz/frontend/data/files/0/1/836/836095-nw2eowfpw9/jednorozec-ruzovy.jpg",wideBanner:"https://www.svetfyzioterapie.cz/frontend/data/files/0/1/836/836095-nw2eowfpw9/jednorozec-ruzovy.jpg",image:"https://www.svetfyzioterapie.cz/frontend/data/files/0/1/836/836095-nw2eowfpw9/jednorozec-ruzovy.jpg",tag:"Produkt · Svetfyzioterapie.cz",contexts:["shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-680bf2636ba90f",title:"Rozchodnice růžová 50 kapslí",text:"239 Kč · Rozchodnice růžová extrakt z kořene 50 kapslí s 500 mg. Rhodiola Rosea nebo-li Rozchodnice růžová je adaptogenní bylina posilující tělo ale hlavně duc",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f245fde9&desturl=https%3A%2F%2Fwww.uplife.cz%2Fprodukty%2Frozchodnice-ruzova-50-kapsli%2F",banner:"https://cdn.mujnody.cz/user/uplife-cz/product/original/rozchodnice-ruzova-50-kapsli-432788.jpg?ts=1688459471",wideBanner:"https://cdn.mujnody.cz/user/uplife-cz/product/original/rozchodnice-ruzova-50-kapsli-432788.jpg?ts=1688459471",image:"https://cdn.mujnody.cz/user/uplife-cz/product/original/rozchodnice-ruzova-50-kapsli-432788.jpg?ts=1688459471",tag:"Produkt · UpLife.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-a6387e26495043",title:"Vitahit Chaga 250 ml",text:"690 Kč · Někdy vyšší mocí a někdy vlastním přičiněním se dostaneme do situace, kdy naše en",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=cdc25894&desturl=https%3A%2F%2Feshop.vitahit.cz%2Fchaga%2F",banner:"https://cdn.myshoptet.com/usr/eshop.vitahit.cz/user/shop/orig/51-3_kv-yellow.jpg?670d8874",wideBanner:"https://cdn.myshoptet.com/usr/eshop.vitahit.cz/user/shop/orig/51-3_kv-yellow.jpg?670d8874",image:"https://cdn.myshoptet.com/usr/eshop.vitahit.cz/user/shop/orig/51-3_kv-yellow.jpg?670d8874",tag:"Produkt · Vitahit.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-49e71e225e3412",title:"VitasLife Lecitin 180 kapslí",text:"390 Kč · Lecitin: Lecitin hraje důležitou roli v metabolismu tuků. V játrech pomáhá při přeměně tuků a cukrů na energii. Dostatek lecitinu zajišťuje, aby se tu",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=aed88d89&desturl=https%3A%2F%2Fvitaslife.store%2Fprodukt%2Fvitaslife-lecitin",banner:"https://vitaslife.store/upload/product/65/lecitin-mockup.1920x1920.fit.q85.png",wideBanner:"https://vitaslife.store/upload/product/65/lecitin-mockup.1920x1920.fit.q85.png",image:"https://vitaslife.store/upload/product/65/lecitin-mockup.1920x1920.fit.q85.png",tag:"Produkt · VitasLife.store",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-310f9aaefe7355",title:"Vivaco Tělové mléko Levandule BODY TIP 250 ml",text:"75 Kč · Zvláčňující tělové mléko s mandlovým a levandulovým olejem se lehce vstřebává a nezanechává pocit mastnoty. Pokožku zklidní, zvláční a příjemně provon",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00a7dfa4&desturl=https%3A%2F%2Fwww.vivaco.cz%2Ftelove-mleko-levandule-body-tip%2F%3Futm_campaign%3Dheureka_product%26utm_id%3Dheureka_product%26utm_medium%3Daffiliate%26utm_source%3Dheureka",banner:"https://www.vivaco.cz/user/shop/orig/17630_telove-mleko.jpg?6a882462",wideBanner:"https://www.vivaco.cz/user/shop/orig/17630_telove-mleko.jpg?6a882462",image:"https://www.vivaco.cz/user/shop/orig/17630_telove-mleko.jpg?6a882462",tag:"Produkt · Vivaco.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-8efa86e3cf899b",title:"Zavařovací víčko ZLATÉ TO 82 (paster do 105°C) | Zavarovacisklo.cz Počet kusů v balení: 1",text:"3,29 Kč · Víčko Twist Off RTS na zavařovací sklenici se šroubovacím uzávěrem typu TO 82 Šroubovací zavařovací",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=4f262bbb&desturl=https%3A%2F%2Fwww.zavarovacisklo.cz%2Fzavarovaci-vicko-zlate-to-82--paster-do-105--c%2F%3FvariantId%3D4974",banner:"https://cdn.myshoptet.com/usr/www.zavarovacisklo.cz/user/shop/orig/58_zlate-to-82.png?6a881042",wideBanner:"https://cdn.myshoptet.com/usr/www.zavarovacisklo.cz/user/shop/orig/58_zlate-to-82.png?6a881042",image:"https://cdn.myshoptet.com/usr/www.zavarovacisklo.cz/user/shop/orig/58_zlate-to-82.png?6a881042",tag:"Produkt · Zavařovacísklo.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-ab53edef1e1d52",title:"Varianta",text:"274 Kč · Štrasový pružný náramek Elorian je vyroben z kvalitní bižuterie a dostupný ve více variantách podle počtu řad. Každá varianta působí jinak – od jemnéh",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fnaramek-strasovy-vice-velikosti-26212%23varianta%3D13173",banner:"https://aranys.cz/pool/vzor/products/naramek-42224.jpg",wideBanner:"https://aranys.cz/pool/vzor/products/naramek-42224.jpg",image:"https://aranys.cz/pool/vzor/products/naramek-42224.jpg",tag:"Produkt · Aranys.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-68875489dc2e0c",title:"Ariete Vintage rychlovarná konvice 2877/05, modrá",text:"1349 Kč · Začněte své ráno stylově a vychutnejte si každý doušek kávy nebo čaje s tou správnou atmosférou. Retro rychlovarná konvice z Vintage řady Ariete přiná",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ffcf2387&desturl=https%3A%2F%2Fwww.ariete.cz%2Fariete-vintage-kettle-2877-05-modra%2F%3Futm_source%3Dheureka%26amp%3Butm_medium%3Dporovnavac%26amp%3Butm_campaign%3Dheureka",banner:"https://www.edsi.sk/api/v1/image?query=product/20/34/56/250224084231-ariete-vintage-rychlovarna-konvice-modra-2877-05.jpg",wideBanner:"https://www.edsi.sk/api/v1/image?query=product/20/34/56/250224084231-ariete-vintage-rychlovarna-konvice-modra-2877-05.jpg",image:"https://www.edsi.sk/api/v1/image?query=product/20/34/56/250224084231-ariete-vintage-rychlovarna-konvice-modra-2877-05.jpg",tag:"Produkt · Ariete.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-187f5546b9cbad",title:"Bredemeijer Sítko na čaj Duet",text:"499 Kč · Nerezové/plastové",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=8b5aa099&desturl=https%3A%2F%2Fwww.bakly.cz%2Fbredemeijer-sitko-na-caj-duet-1421",banner:"https://bakly.fra1.digitaloceanspaces.com/142707/conversions/BM1421-large.jpg",wideBanner:"https://bakly.fra1.digitaloceanspaces.com/142707/conversions/BM1421-large.jpg",image:"https://bakly.fra1.digitaloceanspaces.com/142707/conversions/BM1421-large.jpg",tag:"Produkt · Bakly.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-79241908b27ff9",title:"Zlatá míchací lžička s plochým zakončením 45 cm",text:"425 Kč · Míchací nerezová lžička s jemným vinutím a plochým zakončením má skvělou rovnováhu při míchaní v míchací sklenici. Barové míchací lžičky patří mezi vý",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=6caa871c&desturl=https%3A%2F%2Fwww.barman.cz%2Fzlata-michaci-lzicka-s-plochym-zakoncenim-45-cm%2F",banner:"https://cdn.myshoptet.com/usr/www.barman.cz/user/shop/orig/9821_zlata-michaci-lzicka-s-plochym-zakoncenim-45-cm.jpg?608ff3e8",wideBanner:"https://cdn.myshoptet.com/usr/www.barman.cz/user/shop/orig/9821_zlata-michaci-lzicka-s-plochym-zakoncenim-45-cm.jpg?608ff3e8",image:"https://cdn.myshoptet.com/usr/www.barman.cz/user/shop/orig/9821_zlata-michaci-lzicka-s-plochym-zakoncenim-45-cm.jpg?608ff3e8",tag:"Produkt · Barman.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-3723817a9ee3db",title:"Canvit Biocal Plus Maxi 230 g",text:"177.8 Kč · Vhodné při prokázaném deficitu minerálních látek (psi v růstu, přezubování, stárnoucí zvířata) nebo při tvorbě nové kostní tkáně. Pro psy nad 15 kg. C",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e26bf9fd&desturl=https%3A%2F%2Fwww.bezednamiska.cz%2Fvse-pro-psy%2Fleciva-a-vitaminy-pro-psy%2Fpotravinove-doplnky-pro-psy%2Ftablety%2Fcanvit-biocal-plus-maxi-230-g.html",banner:"https://www.bezednamiska.cz/out/pictures/z1/115100455_z1_z1.png?v=1782373891-341294",wideBanner:"https://www.bezednamiska.cz/out/pictures/z1/115100455_z1_z1.png?v=1782373891-341294",image:"https://www.bezednamiska.cz/out/pictures/z1/115100455_z1_z1.png?v=1782373891-341294",tag:"Produkt · Bezednámiska.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-c2c2af7b987a02",title:"Bioalis kozí kolostrum pro děti 140 cps",text:"1290 CZK · Malé kapsle velikosti 3 umožňují snadné spolknutí nejen dětem, ale také dospělým a seniorům, kteří mohou mít s polykáním větších kapslí potíže. Každá ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5eef1c1f&desturl=https%3A%2F%2Fwww.bioalis.com%2Fprodukt%2Fbioalis-kozi-kolostrum-pro-deti-140-cps",banner:"https://www.bioalis.com/data/products/46/80eb5a6bfdcd380f13d3e5db78d1453c.png",wideBanner:"https://www.bioalis.com/data/products/46/80eb5a6bfdcd380f13d3e5db78d1453c.png",image:"https://www.bioalis.com/data/products/46/80eb5a6bfdcd380f13d3e5db78d1453c.png",tag:"Produkt · Bioalis.com",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-8f2d557061b755",title:"Bylík Divizna květ 50g",text:"86 Kč · Divizna velkokvětá – žlutá svíce na okraji polí Divizna velkokvětá (Verbascum densiflorum) je jedna z nejznámějších a nejcharakterističtějších bylin s",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=fc69bdf3&desturl=https%3A%2F%2Fbylik.cz%2Fzbozi%2F2-divizna-kvet.html%3Fvar%3D50",banner:"https://bylik.cz/obrazky/img/pic4/obr-410.png",wideBanner:"https://bylik.cz/obrazky/img/pic4/obr-410.png",image:"https://bylik.cz/obrazky/img/pic4/obr-410.png",tag:"Produkt · Bylík.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-04e957d7fb7878",title:"A.M.A. S.P.A. AMA kotoučový nůž na větve 255 mm / O 25.4 mm",text:"245 Kč · Kvalitní nože pro křovinořezy. Vhodné pro podrost,křoví a větve. Nůž je určen pro motory 3-5HP.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=902a5fec&desturl=https%3A%2F%2Fwww.ceskazahrada.cz%2Fama-kotoucovy-nuz-na-vetve-255-mm-o-25-4-mm%2F",banner:"https://cdn.myshoptet.com/usr/www.ceskazahrada.cz/user/shop/orig/9887_ama-kotoucovy-nuz-na-vetve-255-mm-o-25-4-mm.jpg?675874d1",wideBanner:"https://cdn.myshoptet.com/usr/www.ceskazahrada.cz/user/shop/orig/9887_ama-kotoucovy-nuz-na-vetve-255-mm-o-25-4-mm.jpg?675874d1",image:"https://cdn.myshoptet.com/usr/www.ceskazahrada.cz/user/shop/orig/9887_ama-kotoucovy-nuz-na-vetve-255-mm-o-25-4-mm.jpg?675874d1",tag:"Produkt · Ceskazahrada.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-f47e43a9bece62",title:"Concept Víko sekací nádoby s převodovkou TM4900",text:"349 Kč · Víko sekací nádoby s převodovkou TM4900Víko sekací nádoby s převodovkou TM4900",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2Fviko-sekaci-nadoby-s-prevodovkou-tm4900_d152006.html",banner:"https://www.my-concept.cz/img.asp?stiid=152006",wideBanner:"https://www.my-concept.cz/img.asp?stiid=152006",image:"https://www.my-concept.cz/img.asp?stiid=152006",tag:"Produkt · Concept.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-dd0449ec1ce559",title:"Zelené olivové mýdlo OLIVA 125 g – ABEA",text:"79 Kč · Každý výrobek ABEA si vypůjčuje několik vzácných tajemství přírody. 100% přírodní | Bez parfemace | i pro citlivou pokožku <strong",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=0c6277d3&desturl=https%3A%2F%2Fcretamart.com%2Fcs%2Fpece-o-telo%2F61-zelene-olivove-mydlo-abea-125g.html%3FSubmitCurrency%3D1%26id_currency%3D4",banner:"https://cretamart.com/257/zelene-olivove-mydlo-abea-125g.jpg",wideBanner:"https://cretamart.com/257/zelene-olivove-mydlo-abea-125g.jpg",image:"https://cretamart.com/257/zelene-olivove-mydlo-abea-125g.jpg",tag:"Produkt · Cretamart.com",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-11337561249aa3",title:"e 1308 Aviváž s kondicionérem Angel Rose 1000ml",text:"249 Kč · Přednosti a vlastnosti: Dlouhotrvající parfemace a měkkost. Neobsahuje žádná barviva. Oděvy a ložní prádlo jsou „jako nové“, ručníky si uchovávají při",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=7039de6e&desturl=https%3A%2F%2Fwww.diskont-zahradkar.cz%2Fp%2Fe-1308-avivaz-s-kondicionerem-angel-rose-1000ml",banner:"https://diskont-zahradkar.s13.cdn-upgates.com/u/u6ab643e9b0dff-avivaz-1308-angel-rose.webp",wideBanner:"https://diskont-zahradkar.s13.cdn-upgates.com/u/u6ab643e9b0dff-avivaz-1308-angel-rose.webp",image:"https://diskont-zahradkar.s13.cdn-upgates.com/u/u6ab643e9b0dff-avivaz-1308-angel-rose.webp",tag:"Produkt · Diskont-zahrádkář.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-a1cc2585072272",title:"Dokonalá Láska Levandule - zvýhodněná kolekce terapeutický olej a sprchové máslo",text:"884 Kč · Kolekce obsahuje: LÁSKA J28 Levandule - terapeutický olej 100 ml a Vysokohorská levandule - přírodní sprchové máslo 200ml . Levandule je snad nejznámě",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=fe530349&desturl=https%3A%2F%2Fdokonalalaska.cz%2Flevandule-zvyhodnena-kolekce-terapeuticky-olej-a-sprchove-maslo%2F%3Futm_campaign%3DAll%26utm_content%3DKosmetika%2Ba%2Bparfemy%2B%257C%2BTelo%2B%257C%2BSprcha%2Ba%2Bkoupel%2B%257C%2BSpr%26utm_medium%3Dproduct%26utm_source%3Dheureka.cz%26utm_term%3DDokonala%2BLaska%2BLevandule%2B-%2Bzvyhodnena%2Bkolekce%2Btera",banner:"https://dokonalalaska.cz/wp-content/uploads/2020/07/levandule-set.png",wideBanner:"https://dokonalalaska.cz/wp-content/uploads/2020/07/levandule-set.png",image:"https://dokonalalaska.cz/wp-content/uploads/2020/07/levandule-set.png",tag:"Produkt · Dokonaláláska.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-9f152abe27d88a",title:"Tea Tree Oil 100%, 50 ml Dr. Popov",text:"587 Kč · 100% čistý Tea Tree Oil s antiseptickými účinky, v nejvyšší možné kvalitě. Rodinné balení.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00bf6577&desturl=https%3A%2F%2Fwww.drpopov.cz%2Fprodukt%2Ftea-tree-oil-100-50-ml%2F",banner:"https://www.drpopov.cz/wp-content/uploads/2022/03/dr-popov_tto_50ml.jpg",wideBanner:"https://www.drpopov.cz/wp-content/uploads/2022/03/dr-popov_tto_50ml.jpg",image:"https://www.drpopov.cz/wp-content/uploads/2022/03/dr-popov_tto_50ml.jpg",tag:"Produkt · DrPopov.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-3fade3c7b9a8ad",title:"Bema Vzorek Šampon proti vypadávání vlasů BIO 2 ml",text:"20 Kč · Složení: Aqua, Sodium Lauryl Glucose Carboxylate, Lauryl Glucoside, Rosmarinus Officinalis Leaf Water, Cocamidopropyl Betaine, Moringa Pterygosperma S",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=02b953fa&desturl=https%3A%2F%2Fwww.ecoteeno.cz%2Fbema-vzorek-sampon-proti-vypadavani-vlasu-bio-2-ml%2F",banner:"https://cdn.myshoptet.com/usr/www.ecoteeno.cz/user/shop/orig/21034_1951c-bema-vzorek-sampon-proti-padani-vlasu.jpg?69a7fb8a",wideBanner:"https://cdn.myshoptet.com/usr/www.ecoteeno.cz/user/shop/orig/21034_1951c-bema-vzorek-sampon-proti-padani-vlasu.jpg?69a7fb8a",image:"https://cdn.myshoptet.com/usr/www.ecoteeno.cz/user/shop/orig/21034_1951c-bema-vzorek-sampon-proti-padani-vlasu.jpg?69a7fb8a",tag:"Produkt · Ecoteeno.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-40f8f6a8c3bd56",title:"CoCana - Kapalné draselné kokosové mýdlo liter: 5,00",text:"1194 CZK · CoCana - Kokosové mýdlo Kapalné draselné kokosové mýdlo určené p",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=7092fff6&desturl=https%3A%2F%2Feshop.ekoclovek.cz%2Fpouziti-proti-nemocem%2Fcocana-kokosove-mydlo%2F%3FvariantId%3D4424",banner:"https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/3851_cocana.jpg?65902b77",wideBanner:"https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/3851_cocana.jpg?65902b77",image:"https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/3851_cocana.jpg?65902b77",tag:"Produkt · eshop.ekoclovek.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-00234c6da0b88a",title:"LEGO® City 60304 Křižovatka",text:"359 Kč · 60304 <div class=\"lapc-ianteov lapc-ianlit",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=3ffab0a4&desturl=https%3A%2F%2Feshop.museumofbricks.cz%2Flego-city-60304-krizovatka%2F",banner:"https://cdn.myshoptet.com/usr/eshop.museumofbricks.cz/user/shop/orig/20019_lego-city-60304-krizovatka.jpg?5fdc85a7",wideBanner:"https://cdn.myshoptet.com/usr/eshop.museumofbricks.cz/user/shop/orig/20019_lego-city-60304-krizovatka.jpg?5fdc85a7",image:"https://cdn.myshoptet.com/usr/eshop.museumofbricks.cz/user/shop/orig/20019_lego-city-60304-krizovatka.jpg?5fdc85a7",tag:"Produkt · eshop.MuseumofBricks.cz",contexts:["family", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-5f8e49651e5ba8",title:"Salente prachový zásobník s HEPA filtrem pro robotický vysavač R2",text:"399 Kč · Originální prachový zásobník s integrovaným HEPA filtrem pro robotický vysavač Salente R2. HEPA filtr zachytává až 99,97 % mikroskopických částic – pr",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e945dbdb&desturl=https%3A%2F%2Feshop.salente.cz%2Fsalente-prachovy-zasobnik-s-hepa-filtrem-pro-roboticky-vysavac-r2%2F",banner:"https://cdn.myshoptet.com/usr/eshop.salente.cz/user/shop/orig/240_salente-prachovy-zasobnik-s-hepa-filtrem-pro-roboticky-vysava--269--r2.jpg?6a3e66be",wideBanner:"https://cdn.myshoptet.com/usr/eshop.salente.cz/user/shop/orig/240_salente-prachovy-zasobnik-s-hepa-filtrem-pro-roboticky-vysava--269--r2.jpg?6a3e66be",image:"https://cdn.myshoptet.com/usr/eshop.salente.cz/user/shop/orig/240_salente-prachovy-zasobnik-s-hepa-filtrem-pro-roboticky-vysava--269--r2.jpg?6a3e66be",tag:"Produkt · eshop.Salente.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-60f9072b62b1a9",title:"Topvet Aktivní sérum na kopyta pro koně 100 ml",text:"248 Kč · AKTIVNÍ SÉRUM NA KOPYTA Podpora hojení a regenerace Veterinární přípravek pro koně Sérum <span data",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=574c29b8&desturl=https%3A%2F%2Fwww.greenidea.cz%2Faktivni-serum-na-kopyta%2F",banner:"https://cdn.myshoptet.com/usr/www.greenidea.cz/user/shop/orig/1938-1_aktivni-serum-na-kopyta.png?69a5e617",wideBanner:"https://cdn.myshoptet.com/usr/www.greenidea.cz/user/shop/orig/1938-1_aktivni-serum-na-kopyta.png?69a5e617",image:"https://cdn.myshoptet.com/usr/www.greenidea.cz/user/shop/orig/1938-1_aktivni-serum-na-kopyta.png?69a5e617",tag:"Produkt · GreenIdea.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-367ebd5eb6cbe7",title:"CBD Srdíčka",text:"1 736 Kč · Klidná mysl jasná hlava 10 mg CBD/ks Jemná dávka na každý den <div class=\"products-usps__it",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=8995aa40&desturl=https%3A%2F%2Fwww.gummylife.cz%2Fcbd-gummies-happy-love%2F",banner:"https://cdn.myshoptet.com/usr/www.gummylife.cz/user/shop/orig/67_d310f5ceeb31177aebdb277075953b1ad128508e.jpg?6a96d557",wideBanner:"https://cdn.myshoptet.com/usr/www.gummylife.cz/user/shop/orig/67_d310f5ceeb31177aebdb277075953b1ad128508e.jpg?6a96d557",image:"https://cdn.myshoptet.com/usr/www.gummylife.cz/user/shop/orig/67_d310f5ceeb31177aebdb277075953b1ad128508e.jpg?6a96d557",tag:"Produkt · Gummylife.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-7160e0e1fba5e1",title:"Organická apotéka Havlíkova apotéka Pleťová maska Růže damašská 30 ml",text:"372 Kč · Vyživující noční pleťová maska Růže damašská na pleť s extraktem ze vzácné růže damašské, kyselinou hyaluronovou a aktivní látkou ALGAKTIV ® GenoFix N",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=8fb01877&desturl=https%3A%2F%2Fwww.havlikovaapoteka.cz%2Fpletova-maska-ruze-damasska%2F",banner:"https://cdn.myshoptet.com/usr/www.havlikovaapoteka.cz/user/shop/orig/110_pletova-maska-ruze-damasska-30-ml-od-havlikovy-apoteky.png?6673e12a",wideBanner:"https://cdn.myshoptet.com/usr/www.havlikovaapoteka.cz/user/shop/orig/110_pletova-maska-ruze-damasska-30-ml-od-havlikovy-apoteky.png?6673e12a",image:"https://cdn.myshoptet.com/usr/www.havlikovaapoteka.cz/user/shop/orig/110_pletova-maska-ruze-damasska-30-ml-od-havlikovy-apoteky.png?6673e12a",tag:"Produkt · Havlíkovaapotéka.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-970c36240226ab",title:"Herbal Store Škornice šípolistá (Horny Goat Weed) - drcené listy 50 g",text:"139 Kč · Obsahuje icariin Bylina prostopášného kozla Standardizovaný extrakt Škornice šípolistá (Epimedium sagittatum) je tradiční asijská bylina využívaná po ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=efea1626&desturl=https%3A%2F%2Fwww.herbal-store.cz%2Fskornice-sipolista-horny-goat-weed-drcene-listy_z5597%2F",banner:"https://data.herbal-store.cz/data/tmp/102/5/3915_102.jpg?1786049273_1",wideBanner:"https://data.herbal-store.cz/data/tmp/102/5/3915_102.jpg?1786049273_1",image:"https://data.herbal-store.cz/data/tmp/102/5/3915_102.jpg?1786049273_1",tag:"Produkt · Herbal-store.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-5e0911da457a43",title:"Vegan komplex - železo - multivitamín - 60 kapslí / Herbavia.cz",text:"369 Kč · VEGAN MULTICOMPLEX Biologicky aktivní - vitamínový komplex s železem <span style=\"color: #808000; fon",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=6f6d0507&desturl=https%3A%2F%2Fwww.herbavia.cz%2Fprodukty%2Fzelezo%2F",banner:"https://cdn.myshoptet.com/usr/www.herbavia.cz/user/shop/orig/1249-1_vegan-multicomplex-zelezo.jpg?684ef2d1",wideBanner:"https://cdn.myshoptet.com/usr/www.herbavia.cz/user/shop/orig/1249-1_vegan-multicomplex-zelezo.jpg?684ef2d1",image:"https://cdn.myshoptet.com/usr/www.herbavia.cz/user/shop/orig/1249-1_vegan-multicomplex-zelezo.jpg?684ef2d1",tag:"Produkt · Herbavia.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-7545d6c928202d",title:"Hnojík Vápník s hořčíkem 10 kg",text:"599 Kč · Obsah vápna min. 42,5% (CaCO3) Vysoký obsah hořčíku min. 29% (MgCO3) Velmi nízká vlhkost 3,5% (+- 2%) 2,5kg nasypte na 40m2 půdy Vápník se hořčíkem se",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=1da58c10&desturl=https%3A%2F%2Fhnojik.cz%2Fprodukt%2Fvapnik-s-horcikem-10kg%2F",banner:"https://hnojik.cz/wp-content/uploads/2023/10/10kg_horcik.jpg",wideBanner:"https://hnojik.cz/wp-content/uploads/2023/10/10kg_horcik.jpg",image:"https://hnojik.cz/wp-content/uploads/2023/10/10kg_horcik.jpg",tag:"Produkt · Hnojík.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e66d0b01de8d4b",title:"Inca Collagen čaj sypaný Geisha 50 g",text:"90 Kč · Zdravý a osvěžující čaj nyní v naší nabídce",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ec5b8e1f&desturl=https%3A%2F%2Fwww.incacollagen.cz%2Fproduct%2Fcaj-geisha-oxalis%2F%3FSubmitCurrency%3D1%26id_currency%3D2",banner:"https://www.incacollagen.cz/25/caj-geisha-oxalis.jpg",wideBanner:"https://www.incacollagen.cz/25/caj-geisha-oxalis.jpg",image:"https://www.incacollagen.cz/25/caj-geisha-oxalis.jpg",tag:"Produkt · IncaCollagen.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-d2aeca60342129",title:"Lavandia Vonný pytlíček z levandule z recyklované látky 10 x 5 cm Vzor Látky: Náhodný mix - zašleme ",text:"89 Kč · <div class=\"inl",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=cf386fe0&desturl=https%3A%2F%2Fwww.levandulezmoravy.cz%2Fvonny-pytlicek%2F%3FvariantId%3D1100",banner:"https://cdn.myshoptet.com/usr/www.levandulezmoravy.cz/user/shop/orig/98-7_nahodny-pytlik.jpg?6033d99e",wideBanner:"https://cdn.myshoptet.com/usr/www.levandulezmoravy.cz/user/shop/orig/98-7_nahodny-pytlik.jpg?6033d99e",image:"https://cdn.myshoptet.com/usr/www.levandulezmoravy.cz/user/shop/orig/98-7_nahodny-pytlik.jpg?6033d99e",tag:"Produkt · Levandulezmoravy.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-6d21bdd0a6a481",title:"Versele Laga Nutribird A19 pro papoušky Hmotnost: 800 g",text:"420 Kč · Dokrmovací směs NutriBird A19 je kompletní ptačí krmivo pro ruční dokrmování arů, eklektusů, papoušků šedých žako, amazoňanů vějířovitých a ostatních ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ef0a4a83&desturl=https%3A%2F%2Fwww.lihne.cz%2Fnutribird-a19-pro-papousky%2F%3FvariantId%3D10946",banner:"https://cdn.myshoptet.com/usr/www.lihne.cz/user/shop/orig/10316_5443a028dfe6d5124a2dd63c7db4910c658e91ec.jpg?672b1e2e",wideBanner:"https://cdn.myshoptet.com/usr/www.lihne.cz/user/shop/orig/10316_5443a028dfe6d5124a2dd63c7db4910c658e91ec.jpg?672b1e2e",image:"https://cdn.myshoptet.com/usr/www.lihne.cz/user/shop/orig/10316_5443a028dfe6d5124a2dd63c7db4910c658e91ec.jpg?672b1e2e",tag:"Produkt · Lihne.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-f1beb8f32f2457",title:"Snubní prsteny chirurgická ocel OKRM0003",text:"700 Kč · Snubní ocelové prsteny. Vysoceleštěné snubní prsteny jsou zdobeny matným černým pruhem ve středové linii.materiál: chirurgická ocelpovrchová úprava: m",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=75b5dc73&desturl=https%3A%2F%2Fwww.marre.cz%2F-z120CZ",banner:"https://www.marre.cz/Prilohy/328044-5ed10f26ec9ad.jpg",wideBanner:"https://www.marre.cz/Prilohy/328044-5ed10f26ec9ad.jpg",image:"https://www.marre.cz/Prilohy/328044-5ed10f26ec9ad.jpg",tag:"Produkt · Marre.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-df3ba64a594e94",title:"Železo Chelát Premium, 90 kapslí",text:"259 CZK · Vysoká biodostupnost, účinná a velmi dobře snášená forma železa ve vegetariánských kapslích, pro zdravou krvetvorbu, redukci únavy a podporu psychiky.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=677d5033&desturl=https%3A%2F%2Fmovitenergy.cz%2Fproducts%2Fmovit-zelezo-chelat-premium-90-cps%3Fvariant%3D55070662558073",banner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Zelezo_Chelat_Premium_90.png",wideBanner:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Zelezo_Chelat_Premium_90.png",image:"https://cdn.shopify.com/s/files/1/0909/9726/0665/files/Zelezo_Chelat_Premium_90.png",tag:"Produkt · MOVitenergy.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-3b193077db5832",title:"Sada sáčků FoodSaver pro vakuování 3,78l (FSB3202)",text:"490 Kč · Sáčky jsou určeny pro vakuové svářečky značky FoodSaver , a to kromě ruční akumulátorové vakuovačky a vakuové baličky FFS010X. Variabilní použití Tyto",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=259ca026&desturl=https%3A%2F%2Fwww.mamedoma.cz%2Ffolie-a-sacky%2Fsada-sacku-foodsaver-pro-vakuovani-3-78-l-fsb3202%2F",banner:"https://cdn.myshoptet.com/usr/www.mamedoma.cz/user/shop/orig/141_fsb3202.jpg?5cfd27ca",wideBanner:"https://cdn.myshoptet.com/usr/www.mamedoma.cz/user/shop/orig/141_fsb3202.jpg?5cfd27ca",image:"https://cdn.myshoptet.com/usr/www.mamedoma.cz/user/shop/orig/141_fsb3202.jpg?5cfd27ca",tag:"Produkt · Mámedoma.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-328e4a4f703f82",title:"NeilMed Zvlhčující sprej do nosu NasoGEL 30ml",text:"380 Kč · Kyselina hyaluronová pomáhá hloubkově hydratovat dutinu nosní. Aloe vera je známé tím, že urychluje hojení povrchových poranění v nose a má regeneračn",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=32dfe8fd&desturl=https%3A%2F%2Fwww.nanospace.cz%2Fzvlhcujici-sprej-do-nosu-nasogel-30ml%2F",banner:"https://cdn.myshoptet.com/usr/www.nanospace.cz/user/shop/orig/1040_zvlhcujici-sprej-nasogel.jpg?60f13d6c",wideBanner:"https://cdn.myshoptet.com/usr/www.nanospace.cz/user/shop/orig/1040_zvlhcujici-sprej-nasogel.jpg?60f13d6c",image:"https://cdn.myshoptet.com/usr/www.nanospace.cz/user/shop/orig/1040_zvlhcujici-sprej-nasogel.jpg?60f13d6c",tag:"Produkt · Nanospace.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e86b4d3f5fcbe4",title:"NaturalProtein Dýňová semínka",text:"71 Kč · Dýňová semínka Dýňová semínka Dýňová semínka jsou dlouhodobým hitem zdravé výživy a neměly by chybět v žádné domácnosti. Mají příjemně oříškovou chuť ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f166f5e6&desturl=https%3A%2F%2Fwww.naturalprotein.cz%2Fdynova-seminka",banner:"https://www.naturalprotein.cz/image/s/1920x1080/shrink/storage/gallery/7f/6b9958/original/1500x1500-np-www-allsem-1.webp.png",wideBanner:"https://www.naturalprotein.cz/image/s/1920x1080/shrink/storage/gallery/7f/6b9958/original/1500x1500-np-www-allsem-1.webp.png",image:"https://www.naturalprotein.cz/image/s/1920x1080/shrink/storage/gallery/7f/6b9958/original/1500x1500-np-www-allsem-1.webp.png",tag:"Produkt · NaturalProtein.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-48c4ad2d9f1e7c",title:"AGRO Kapalný vápník 0,5L",text:"129 Kč · Jednosložkové hnojivo určené pro všechny rostliny.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=d25f1a73&desturl=https%3A%2F%2Fwww.nelenprozelen.cz%2Fagro-kapalny-vapnik-0-5l--4120027.html%3Futm_source%3Dgoogle%26utm_medium%3Dfeed%232000025800003",banner:"https://www.nelenprozelen.cz/WINSHOP/foto_temp/4120027.jpeg",wideBanner:"https://www.nelenprozelen.cz/WINSHOP/foto_temp/4120027.jpeg",image:"https://www.nelenprozelen.cz/WINSHOP/foto_temp/4120027.jpeg",tag:"Produkt · Neleňprozeleň.cz",contexts:["home", "garden", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-c89d781cdf4a2a",title:"Šlehaný pleťový Mangový krém 60 ml Kvitok",text:"329 Kč · Hlavní složkou krému je mangové a cupuacu máslo , které zklidňuje alergické reakce a jiná podráždění, regeneruje a vyhlazuje jemné vrásky. <stron",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=4f1d3c00&desturl=https%3A%2F%2Fwww.netestovano.cz%2Fkvitok-slehany-pletovy-mangovy-krem-60-ml%2F",banner:"https://cdn.myshoptet.com/usr/www.netestovano.cz/user/shop/orig/57_cex0000901.jpg?6901d86f",wideBanner:"https://cdn.myshoptet.com/usr/www.netestovano.cz/user/shop/orig/57_cex0000901.jpg?6901d86f",image:"https://cdn.myshoptet.com/usr/www.netestovano.cz/user/shop/orig/57_cex0000901.jpg?6901d86f",tag:"Produkt · Netestováno.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-6e3444a216b4ee",title:"Powerlogy Upgraded Vegan Protein Bar 50 g",text:"75 Kč · Certifikovaná veganská proteinová tyčinkaObsahuje 10 g rostlinného proteinu z rýže a kešu, doplněného o prebiotickou vlákninu a MCT olej. Podpora ener",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=bc9ba583&desturl=https%3A%2F%2Fnutriheads.cz%2Fproducts%2Fpowerlogy-upgraded-vegan-protein-bar%3Fvariant%3D44953716555820%26utm_source%3DHeureka%26utm_medium%3DPaid",banner:"https://cdn.shopify.com/s/files/1/0702/7906/9740/files/powerlogy_upgraded_vegan.png",wideBanner:"https://cdn.shopify.com/s/files/1/0702/7906/9740/files/powerlogy_upgraded_vegan.png",image:"https://cdn.shopify.com/s/files/1/0702/7906/9740/files/powerlogy_upgraded_vegan.png",tag:"Produkt · Nutriheads.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-133e1406d85784",title:"Spin Master Tech Deck Skateshop 6ks s příslušenstvím",text:"545 Kč · Malé skateboardy ovládáš pomocí prstů. Nauč se co nejvíce triků. V balení najdeš také náhradní kolečka, samolepky a mininářadí.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81&desturl=https%3A%2F%2Fpompo.cz%2Fspin-master-tech-deck-skateshop-6ks-s-prislusenstvim_z77%2F",banner:"https://data.pompo.cz/data/tmp/102/1/251_102.jpg?1653650095_1",wideBanner:"https://data.pompo.cz/data/tmp/102/1/251_102.jpg?1653650095_1",image:"https://data.pompo.cz/data/tmp/102/1/251_102.jpg?1653650095_1",tag:"Produkt · Pompo.cz",contexts:["family", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-d3c8f131737bb1",title:"Collagile Collagile® skin (30 sáčků po 3,9 g) - doplněk stravy Počet kusů: 6",text:"3 998 Kč · Collagile® skin Každý si přeje cítit se dobře ve své kůži a mít",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ea9c8cd4&desturl=https%3A%2F%2Fwww.pomahamezitlepe.cz%2Fcollagile-skin-doplnek-stravy%2F%3FvariantId%3D117",banner:"https://cdn.myshoptet.com/usr/www.pomahamezitlepe.cz/user/shop/orig/54-2_collagile-skin-clovek-30-sacku-po-3-9g-doplnek-stravy-baleni-6ks.jpg?653fd1c4",wideBanner:"https://cdn.myshoptet.com/usr/www.pomahamezitlepe.cz/user/shop/orig/54-2_collagile-skin-clovek-30-sacku-po-3-9g-doplnek-stravy-baleni-6ks.jpg?653fd1c4",image:"https://cdn.myshoptet.com/usr/www.pomahamezitlepe.cz/user/shop/orig/54-2_collagile-skin-clovek-30-sacku-po-3-9g-doplnek-stravy-baleni-6ks.jpg?653fd1c4",tag:"Produkt · Pomáhámežítlépe.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-3cbb7e5a0ae261",title:"Nordic Ware Forma na bábovku 75. Anniversary Propletená, zlatá, 2,84 l 95577",text:"1 190 Kč · Kovová pečící forma na velkou, nízkou bábovku v prémiovém zlatém provedení, uvedená na trh v roce 2021 k 75. výročí existence značky. Objem 12 cup ( 2",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ef1622c3&desturl=https%3A%2F%2Fwww.pottenpannen.cz%2Fp%2Fforma-na-babovku-75-anniversary-propletena-zlata-2",banner:"https://pottenpannen-prod-storage-dmdehvecc4ecf2ap.a03.azurefd.net/ppmedia/sharedmedia/pottenpannencz/pimicsimages/products/a0044646/obr_p_95577_0_naz_1627300957-95577-braided-bundt-panx_pug100008.jpg",wideBanner:"https://pottenpannen-prod-storage-dmdehvecc4ecf2ap.a03.azurefd.net/ppmedia/sharedmedia/pottenpannencz/pimicsimages/products/a0044646/obr_p_95577_0_naz_1627300957-95577-braided-bundt-panx_pug100008.jpg",image:"https://pottenpannen-prod-storage-dmdehvecc4ecf2ap.a03.azurefd.net/ppmedia/sharedmedia/pottenpannencz/pimicsimages/products/a0044646/obr_p_95577_0_naz_1627300957-95577-braided-bundt-panx_pug100008.jpg",tag:"Produkt · Pottenpannen.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-25b85cccfaf824",title:"Odvlhčovač s čističkou vzduchu Meaco 12L Low Energy",text:"4990 CZK · Nízkoenergetický odvlhčovač Meaco 12L Low Energy kombinuje vysoký výkon a energeticky úsporný provoz. Pomáhá předcházet kondenzaci vody, vzniku plísní",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=abc25217&desturl=https%3A%2F%2Fwww.proalergiky.cz%2Feshop%2Fmeaco-12l-low-energy-odvlhcovac-vzduchu",banner:"https://www.proalergiky.cz/getmedia/4d394809-0f51-4c45-b42a-73f68c4ecdcf/meaco_12l_LE_1.jpg.aspx",wideBanner:"https://www.proalergiky.cz/getmedia/4d394809-0f51-4c45-b42a-73f68c4ecdcf/meaco_12l_LE_1.jpg.aspx",image:"https://www.proalergiky.cz/getmedia/4d394809-0f51-4c45-b42a-73f68c4ecdcf/meaco_12l_LE_1.jpg.aspx",tag:"Produkt · Proalergiky.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-e1010d2a6a9cbf",title:"Individuální probiotická kúra - probiONE Standard, 30 miliard denní dávka, 90 tbl",text:"8 900 Kč · probiONE STANDARD Elementární forma individualizované probiotické suplementace určena pro ty, kteří chtějí pečovat o svůj střev",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=97341218&desturl=https%3A%2F%2Fwww.probione.com%2Fprobione-individual-standard%2F",banner:"https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/51-5_probione-standard-2.png?6a75d6ef",wideBanner:"https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/51-5_probione-standard-2.png?6a75d6ef",image:"https://cdn.myshoptet.com/usr/www.probione.com/user/shop/orig/51-5_probione-standard-2.png?6a75d6ef",tag:"Produkt · ProbiONE.com",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-232249c473788b",title:"BIO Esenciální olej EUKALYPTUS CITRONOVÝ 10 ml",text:"150 Kč · Esenciální olej citronového eukalyptu v BIO kvalitě. V aromaterapii je ceněn díky svým vlastnostem uvolnit svaly a jako účinný \"povzbuzovač\". Jeho vůn",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=9399a567&desturl=https%3A%2F%2Fwww.prirodnilekarna.cz%2Feshop-bio-esencialni-olej-eukalyptus-citronovy.html",banner:"https://www.prirodnilekarna.cz/files/thumbs/mod_eshop/produkty/bio-esencialni-olej-eukalyptus-citronovy-10-ml-3193.1646628311.webp?t=1693381484",wideBanner:"https://www.prirodnilekarna.cz/files/thumbs/mod_eshop/produkty/bio-esencialni-olej-eukalyptus-citronovy-10-ml-3193.1646628311.webp?t=1693381484",image:"https://www.prirodnilekarna.cz/files/thumbs/mod_eshop/produkty/bio-esencialni-olej-eukalyptus-citronovy-10-ml-3193.1646628311.webp?t=1693381484",tag:"Produkt · PřírodníLékárna.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-cdf2e5d995f445",title:"Perognidol Forte pes a kočka 40 ks – úleva při chronické a neuropatické bolesti",text:"KDY POUŽÍT ? Když je potřeba normalizovat vnímání bolesti, zejména u starších psů a koček s artrózou či neuropatickou bolestí. PROČ DOPORUČIT? Lze pou",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=979d94bf&desturl=https%3A%2F%2Fsakaripet.cz%2Fprodejna%2Fperognidol-forte-pes-a-kocka-40-kps-podporuje-normalni-nocicepci%2F",banner:"https://sakaripet.cz/wp-content/uploads/2024/10/Amazon-Perognidol-Forte.jpg",wideBanner:"https://sakaripet.cz/wp-content/uploads/2024/10/Amazon-Perognidol-Forte.jpg",image:"https://sakaripet.cz/wp-content/uploads/2024/10/Amazon-Perognidol-Forte.jpg",tag:"Produkt · SakariPET.cz",contexts:["pets", "family", "shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-2d80f5068ef03f",title:"Tejp Škola tejpování - zvířátka z lesa",text:"199 Kč · Kvalita ověřena stovkami kurzistů. Na našich kurzech tejpování tyto tejpy používáme. Kurzisté jejich kvalitu neustále prověřují. Tejp je vyroben v Již",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=4b7ba687&desturl=https%3A%2F%2Fwww.svetfyzioterapie.cz%2Fsfshop%2Ftejp-skola-tejpovani-1662%23v705281",banner:"https://www.svetfyzioterapie.cz/frontend/data/files/0/1/837/836900-io04jynomx/zviratka.jpg",wideBanner:"https://www.svetfyzioterapie.cz/frontend/data/files/0/1/837/836900-io04jynomx/zviratka.jpg",image:"https://www.svetfyzioterapie.cz/frontend/data/files/0/1/837/836900-io04jynomx/zviratka.jpg",tag:"Produkt · Svetfyzioterapie.cz",contexts:["shopping", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-6e7af8e4403311",title:"Sangre de Drago 30 ml",text:"239 Kč · Croton lechleri 30 ml,100% neředěná, ručně sbíraná míza ze stromů Croton lechleri z amazonského pralesa. Sangre de Drago, česky známá jako „dračí krev",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f245fde9&desturl=https%3A%2F%2Fwww.uplife.cz%2Fprodukty%2Fsangre-de-drago-30-ml%2F",banner:"https://cdn.mujnody.cz/user/uplife-cz/product/original/sangre-de-drago-30-ml-432746.jpg?ts=1688459471",wideBanner:"https://cdn.mujnody.cz/user/uplife-cz/product/original/sangre-de-drago-30-ml-432746.jpg?ts=1688459471",image:"https://cdn.mujnody.cz/user/uplife-cz/product/original/sangre-de-drago-30-ml-432746.jpg?ts=1688459471",tag:"Produkt · UpLife.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-c841090e7cb5b8",title:"Vitahit Daily Balance 500 ml",text:"1 890 Kč · Někdy vyšší mocí a někdy vlastním přičiněním se dostaneme do situace, kdy nás naš",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=cdc25894&desturl=https%3A%2F%2Feshop.vitahit.cz%2Fdaily-balance-500ml%2F",banner:"https://cdn.myshoptet.com/usr/eshop.vitahit.cz/user/shop/orig/45-4_spek.jpg?670d8824",wideBanner:"https://cdn.myshoptet.com/usr/eshop.vitahit.cz/user/shop/orig/45-4_spek.jpg?670d8824",image:"https://cdn.myshoptet.com/usr/eshop.vitahit.cz/user/shop/orig/45-4_spek.jpg?670d8824",tag:"Produkt · Vitahit.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-39bd3fb742ea95",title:"VitasLife MSM 250g",text:"290 Kč · Na co je dobrý MSM? Podpora zdraví kloubů: MSM je často používán pro úlevu při bolesti kloubů a zánětech. Síra obsažená v MSM může pomoci snižovat zán",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=aed88d89&desturl=https%3A%2F%2Fvitaslife.store%2Fprodukt%2Fvitaslife-msm",banner:"https://vitaslife.store/upload/product/a3/msm-bez-pozadi.1920x1920.fit.q85.png",wideBanner:"https://vitaslife.store/upload/product/a3/msm-bez-pozadi.1920x1920.fit.q85.png",image:"https://vitaslife.store/upload/product/a3/msm-bez-pozadi.1920x1920.fit.q85.png",tag:"Produkt · VitasLife.store",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-eba88287a39bc3",title:"Vivaco Tělový balzám s BIO arganovým olejem BODY TIP 300 ml",text:"135 Kč · Arganový olej zajišťuje pokožce hydrataci, pružnost a hedvábnou jemnost. Je bohatý na nenasycené mastné kyseliny a vitaminy E, A a F. Působí preventiv",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00a7dfa4&desturl=https%3A%2F%2Fwww.vivaco.cz%2Ftelovy-balzam-s-bio-arganovym-olejem-body-tip%2F%3Futm_campaign%3Dheureka_product%26utm_id%3Dheureka_product%26utm_medium%3Daffiliate%26utm_source%3Dheureka",banner:"https://www.vivaco.cz/user/shop/orig/16580_97903.png?6a882462",wideBanner:"https://www.vivaco.cz/user/shop/orig/16580_97903.png?6a882462",image:"https://www.vivaco.cz/user/shop/orig/16580_97903.png?6a882462",tag:"Produkt · Vivaco.cz",contexts:["health", "shopping", "home", "sidebar", "general"],weight:3,runtimeVerified:true,imageRequired:true},
  {id:"multi-multi-feed-11e33fede944fb",title:"Zavařovací víčko ZLATÉ TO 82 (paster do 105°C) | Zavarovacisklo.cz Počet kusů v balení: 700",text:"1 890 Kč · Víčko Twist Off RTS na zavařovací sklenici se šroubovacím uzávěrem typu TO 82 Šroubovací zavařovací",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=4f262bbb&desturl=https%3A%2F%2Fwww.zavarovacisklo.cz%2Fzavarovaci-vicko-zlate-to-82--paster-do-105--c%2F%3FvariantId%3D18351",banner:"https://cdn.myshoptet.com/usr/www.zavarovacisklo.cz/user/shop/orig/58_zlate-to-82.png?6a881042",wideBanner:"https://cdn.myshoptet.com/usr/www.zavarovacisklo.cz/user/shop/orig/58_zlate-to-82.png?6a881042",image:"https://cdn.myshoptet.com/usr/www.zavarovacisklo.cz/user/shop/orig/58_zlate-to-82.png?6a881042",tag:"Produkt · Zavařovacísklo.cz",contexts:["home", "shopping", "sidebar", "general", "local"],weight:3,runtimeVerified:true,imageRequired:true},
/* AUTO_MULTI_FEED_PRODUCTS_END */
/* AUTO_ALL_CENTRAL_PARTNERS_START */
  
  {id:"central-idealninajemce-cz",title:"IdeálníNájemce.cz",text:"Aktuální nabídka partnera IdeálníNájemce.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=148dee30",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-idealninajemce-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-idealninajemce-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-idealninajemce-cz.svg",imageRequired:true},
  {id:"central-dobre-knihy-cz",title:"Dobré-knihy.cz",text:"Aktuální nabídka partnera Dobré-knihy.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=1ec2df65",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-dobre-knihy-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-dobre-knihy-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-dobre-knihy-cz.svg",imageRequired:true},
  {id:"central-nebudbyval-cz",title:"Nebudbyval.cz",text:"Aktuální nabídka partnera Nebudbyval.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=2683c4f3",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-nebudbyval-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-nebudbyval-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-nebudbyval-cz.svg",imageRequired:true},
  {id:"central-nadeje-byliny-eu",title:"Naděje-byliny.eu",text:"Aktuální nabídka partnera Naděje-byliny.eu. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=48feaa4c",tag:"Partnerská nabídka",contexts:["health", "shopping", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-nadeje-byliny-eu.svg",wideBanner:"/assets/reklamy/auto-graphic/central-nadeje-byliny-eu-wide.svg",image:"/assets/reklamy/auto-graphic/central-nadeje-byliny-eu.svg",imageRequired:true},
  {id:"central-bondster-com",title:"BONDSTER.com",text:"Aktuální nabídka partnera BONDSTER.com. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=4c326833",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-bondster-com.svg",wideBanner:"/assets/reklamy/auto-graphic/central-bondster-com-wide.svg",image:"/assets/reklamy/auto-graphic/central-bondster-com.svg",imageRequired:true},
  {id:"central-portugallery-cz",title:"PortuGallery.cz",text:"Aktuální nabídka partnera PortuGallery.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=52935970",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-portugallery-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-portugallery-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-portugallery-cz.svg",imageRequired:true},
  {id:"central-raiffeisenbank-cz-podnikatelsky-ucet",title:"Raiffeisenbank.cz Podnikatelský účet",text:"Aktuální nabídka partnera Raiffeisenbank.cz Podnikatelský účet. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=53811bcd",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-podnikatelsky-ucet.svg",wideBanner:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-podnikatelsky-ucet-wide.svg",image:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-podnikatelsky-ucet.svg",imageRequired:true},
  {id:"central-raiffeisenbank-cz-pujcka",title:"Raiffeisenbank.cz Půjčka",text:"Aktuální nabídka partnera Raiffeisenbank.cz Půjčka. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5b4b99ee",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-pujcka.svg",wideBanner:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-pujcka-wide.svg",image:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-pujcka.svg",imageRequired:true},
  {id:"central-driveto-cz",title:"Driveto.cz",text:"Aktuální nabídka partnera Driveto.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=65b4f04b",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-driveto-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-driveto-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-driveto-cz.svg",imageRequired:true},
  {id:"central-cz-cebia-com",title:"cz.Cebia.com",text:"Aktuální nabídka partnera cz.Cebia.com. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=67e04d9d",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-cz-cebia-com.svg",wideBanner:"/assets/reklamy/auto-graphic/central-cz-cebia-com-wide.svg",image:"/assets/reklamy/auto-graphic/central-cz-cebia-com.svg",imageRequired:true},
  {id:"central-raiffeisenbank-cz-kreditni-karty",title:"Raiffeisenbank.cz Kreditní karty",text:"Aktuální nabídka partnera Raiffeisenbank.cz Kreditní karty. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=86a048b9",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-kreditni-karty.svg",wideBanner:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-kreditni-karty-wide.svg",image:"/assets/reklamy/auto-graphic/central-raiffeisenbank-cz-kreditni-karty.svg",imageRequired:true},
  {id:"central-glami-cz",title:"Glami.cz",text:"Aktuální nabídka partnera Glami.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=aa718f14",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-glami-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-glami-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-glami-cz.svg",imageRequired:true},
  {id:"central-hypospace-cz",title:"HypoSpace.cz",text:"Aktuální nabídka partnera HypoSpace.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=aa9f76a3",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-hypospace-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-hypospace-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-hypospace-cz.svg",imageRequired:true},
  {id:"central-stalynajem-cz",title:"Stálýnájem.cz",text:"Aktuální nabídka partnera Stálýnájem.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=afb2ec2f",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-stalynajem-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-stalynajem-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-stalynajem-cz.svg",imageRequired:true},
  {id:"central-zazitky-cz",title:"Zážitky.cz",text:"Aktuální nabídka partnera Zážitky.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=c22fc1d9",tag:"Partnerská nabídka",contexts:["travel", "family", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-zazitky-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-zazitky-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-zazitky-cz.svg",imageRequired:true},
  {id:"central-conseq-zavodou",title:"CONSEQ ZaVodou",text:"Aktuální nabídka partnera CONSEQ ZaVodou. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=c5a7a152",tag:"Partnerská nabídka",contexts:["shopping", "home", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-conseq-zavodou.svg",wideBanner:"/assets/reklamy/auto-graphic/central-conseq-zavodou-wide.svg",image:"/assets/reklamy/auto-graphic/central-conseq-zavodou.svg",imageRequired:true},
  {id:"central-hyponamiru-cz",title:"Hyponamíru.cz",text:"Aktuální nabídka partnera Hyponamíru.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=d25e45d9",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-hyponamiru-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-hyponamiru-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-hyponamiru-cz.svg",imageRequired:true},
  {id:"central-ceskekormidlo-cz",title:"Českékormidlo.cz",text:"Aktuální nabídka partnera Českékormidlo.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b880f187",banner:"https://doc.ehub.cz/b/3babee44/2629cacf.jpg",wideBanner:"https://doc.ehub.cz/b/3babee44/2629cacf.jpg",tag:"Partnerská nabídka",contexts:["travel", "family", "sidebar", "general"],weight:1,runtimeVerified:true},
  
  {id:"central-atis-cz",title:"Atis.cz",text:"Aktuální nabídka partnera Atis.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=49886ce2",tag:"Partnerská nabídka",contexts:["travel", "family", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-atis-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-atis-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-atis-cz.svg",imageRequired:true},
  {id:"central-direct-fondee-cz",title:"Direct Fondee CZ",text:"Aktuální nabídka partnera Direct Fondee CZ. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e0652f78",banner:"https://doc.ehub.cz/b/e4d32378/004e8ef7.png",wideBanner:"https://doc.ehub.cz/b/e4d32378/004e8ef7.png",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true},
  {id:"central-roier-cz",title:"Roier.cz",text:"Aktuální nabídka partnera Roier.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=de29b6e6",banner:"https://doc.ehub.cz/b/1358a18b/04ca5b68.png",wideBanner:"https://doc.ehub.cz/b/1358a18b/04ca5b68.png",tag:"Partnerská nabídka",contexts:["finance", "sidebar", "general"],weight:1,runtimeVerified:true},
  {id:"central-procamping-cz",title:"Procamping.cz",text:"Aktuální nabídka partnera Procamping.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=94f699e2",banner:"https://doc.ehub.cz/b/d51b0ac7/172d08a4.png",wideBanner:"https://doc.ehub.cz/b/d51b0ac7/172d08a4.png",tag:"Partnerská nabídka",contexts:["travel", "family", "sidebar", "general"],weight:1,runtimeVerified:true},
  {id:"central-reslshop-cz",title:"Reslshop.cz",text:"Aktuální nabídka partnera Reslshop.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=c38e2d15",banner:"https://doc.ehub.cz/b/73f0cae6/180b9773.jpg",wideBanner:"https://doc.ehub.cz/b/73f0cae6/180b9773.jpg",tag:"Partnerská nabídka",contexts:["travel", "family", "sidebar", "general"],weight:1,runtimeVerified:true},
  {id:"central-svetkaravanu-cz",title:"SvětKaravanů.cz",text:"Aktuální nabídka partnera SvětKaravanů.cz. Cenu, dostupnost a podmínky ověřte na cílové stránce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=38137ac4",tag:"Partnerská nabídka",contexts:["travel", "family", "sidebar", "general"],weight:1,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/central-svetkaravanu-cz.svg",wideBanner:"/assets/reklamy/auto-graphic/central-svetkaravanu-cz-wide.svg",image:"/assets/reklamy/auto-graphic/central-svetkaravanu-cz.svg",imageRequired:true},
/* AUTO_ALL_CENTRAL_PARTNERS_END */
/* AUTO_FEED_PRODUCTS_START */
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-eec68aea1dd7",title:"Bielastické potahy UNIVERSO NOVÉ žíhané cihlové dvojkřeslo (š. 120 - 160 cm)",text:"Italská elegance v prémiové kvalitě kontrastní melírování působící luxusním dojmem, to je kolekce bielastických potahů universo. elegantní dekor je vhodný pro každého, kdo se rád odlišuje, a",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fpotahy-na-sedaci-soupravy%3Fvid%3D37363543%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-eec68aea1dd7.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-eec68aea1dd7-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-eec68aea1dd7.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-41c27b1a8679",title:"Froté prostěradlo EXCLUSIVE tyrkysové 140x200 cm",text:"Froté prostěradlo froté prostěradlo je žádané a vyhledávané pro svou snadnou údržbu, odolnost a vysokou savost. hebký materiál je příjemný na dotek, drží stálý tvar a pyšní se dlouhou životn",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fprosteradla%3Fvid%3D56657493%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-41c27b1a8679.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-41c27b1a8679-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-41c27b1a8679.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-110cf4009925",title:"Froté prostěradlo EXCLUSIVE krémové 140x200 cm",text:"Froté prostěradlo froté prostěradlo je žádané a vyhledávané pro svou snadnou údržbu, odolnost a vysokou savost. hebký materiál je příjemný na dotek, drží stálý tvar a pyšní se dlouhou životn",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fprosteradla%3Fvid%3D56657441%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-110cf4009925.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-110cf4009925-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-110cf4009925.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-42ca89e2b775",title:"Vrchní matrace 5 cm 80x200 5 ECOMATRACE vr580",text:"Vrchní matrace (topper) 5 cm – pur pěna, střední tuhost vrchní (krycí) matrace z pur pěny střední tuhosti. vynikající doplněk pro každý konstrukční typ matrace. je velmi vhodný především pro",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fchranice-a-toppery%3Fvid%3D68998101%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-42ca89e2b775.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-42ca89e2b775-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-42ca89e2b775.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-eb845ab1bd2d",title:"Noční stolek Ilona dub",text:"Materiál masivní borovicové dřevo ekologicky nezávadný nátěr barva olše pozn.: vnitřní část zásuvky je v přírodní barvě borovicového dřeva. rozměry výška: 42 cm šířka: 42 cm hloubka: 28 cm t",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fnocni-stolky%3Fvid%3D57578141%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-eb845ab1bd2d.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-eb845ab1bd2d-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-eb845ab1bd2d.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-c85f52a3e703",title:"Dětská postel se šuplíkem 180x90cm FALL IN LOVE",text:"Nádherná dětská postel s matrací zdarma vybírejte ze stovek vzorů kvalitních obrázkových postelí! ve stejném motivu jako tuto postel pro děti máme také: boxy na hračky, dětské komody, dětské",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fklasicke-detske-postele%3Fvid%3D54848543%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-c85f52a3e703.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-c85f52a3e703-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-c85f52a3e703.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-6aaf917c858c",title:"Noční stolek Ilona ořech",text:"Materiál masivní borovicové dřevo ekologicky nezávadný nátěr barva ořech pozn.: vnitřní část zásuvky je v přírodní barvě borovicového dřeva. rozměry výška: 42 cm šířka: 42 cm hloubka: 28 cm ",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fnocni-stolky%3Fvid%3D57578137%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-6aaf917c858c.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-6aaf917c858c-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-6aaf917c858c.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-df18dcfedfdb",title:"Kartell designové sedačky Foliage Sofa",text:"Designová sedačka kartell foliage sofa přináší do interiéru i exteriéru lehkost, svěží moderní výraz a jemně „přírodní“ detail, který je pro kolekci foliage typický. na první pohled zaujme i",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fpohovky-a-gauce%3Fvid%3D65787221%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-df18dcfedfdb.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-df18dcfedfdb-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-df18dcfedfdb.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-c56cc9f38761",title:"DEOKORK Zahradní ratanová sestava NAPOLI I. 1+2 (šedá)",text:"Zahradní jídelní sestava z umělého ratanu pro 2 osoby má takřka univerzální využití jak v domácnostech, tak v zahrádkách restaurací. tvoří ji černý čtvercový stůl s tvrzeným sklem (80 × 80 c",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Fzahradni-sety%3Fvid%3D53354723%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-c56cc9f38761.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-c56cc9f38761-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-c56cc9f38761.svg",imageRequired:true},
  {id:"feed-product-biano-cz-automaticky-nactene-nabidky-3fe17257c359",title:"Normann Copenhagen designové závěsná svítidla Bell Lamp XSmall",text:"Závěsná lampa bell od normann copenhagen v podobě robustního zvonu s důrazem na detaily. přívodní kabel se stává jedním z vizuálních akcentů této lampy. lampa bell se hodí jak do kuchyně, na",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=da726a9e&desturl=https%3A%2F%2Fwww.biano.cz%2Fprodukty%2Flustry-a-zavesna-svitidla%3Fvid%3D51046929%26fs%3Dehub",tag:"Produkt · Biano.cz – automaticky načtené nabídky",contexts:["home", "shopping", "sidebar", "general", "local"],weight:2,runtimeVerified:true,banner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-3fe17257c359.svg",wideBanner:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-3fe17257c359-wide.svg",image:"/assets/reklamy/auto-graphic/feed-product-biano-cz-automaticky-nactene-nabidky-3fe17257c359.svg",imageRequired:true},
/* AUTO_FEED_PRODUCTS_END */
/* AUTO_CENTRAL_PARTNERS_START */

/* AUTO_CENTRAL_PARTNERS_END */
/* LIVE_MEGA_CAMPAIGNS_START */
  {id:"live-vodafone-referral",title:"Vodafone: internet od 199 Kč, TV od 258 Kč",text:"Internet na vybraných adresách od 199 Kč měsíčně po dobu prvních 12 měsíců a Vodafone TV od 258 Kč. Přehled je na Pojistime.to.",url:"https://pojistime.to/internet-televize.html?utm_source=nasekadan&utm_medium=owned_promo&utm_campaign=vodafone_august_2026",tag:"Končí 31. 8.",contexts:["internet", "home", "sidebar", "general", "local"],weight:14,runtimeVerified:true,validFrom:"2026-08-26",validTo:"2026-08-31",banner:"/assets/reklamy/auto-graphic/live-vodafone-referral.svg",wideBanner:"/assets/reklamy/auto-graphic/live-vodafone-referral-wide.svg",image:"/assets/reklamy/auto-graphic/live-vodafone-referral.svg",imageRequired:true},
  {id:"live-csob-travel20",title:"ČSOB: 20 % na cestovní pojištění online",text:"Sleva 20 % na cestovní pojištění při online sjednání podle srpnové partnerské akce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f5e0f8fb&desturl=https%3A%2F%2Fwww.csobpoj.cz%2Fpojisteni%2Fcestovni-pojisteni",tag:"Končí 31. 8.",contexts:["travel", "family", "finance", "sidebar", "general"],weight:12,runtimeVerified:true,validTo:"2026-08-31",banner:"/assets/reklamy/auto-graphic/live-csob-travel20.svg",wideBanner:"/assets/reklamy/auto-graphic/live-csob-travel20-wide.svg",image:"/assets/reklamy/auto-graphic/live-csob-travel20.svg",imageRequired:true},
  {id:"live-csob-auto20",title:"ČSOB: 20 % na autopojištění online",text:"Sleva 20 % na autopojištění při online sjednání podle srpnové partnerské akce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f5e0f8fb&desturl=https%3A%2F%2Fwww.csobpoj.cz%2Fpojisteni%2Fpojisteni-vozidel",tag:"Končí 31. 8.",contexts:["auto", "finance", "sidebar", "general", "local"],weight:11,runtimeVerified:true,validTo:"2026-08-31",banner:"/assets/reklamy/auto-graphic/live-csob-auto20.svg",wideBanner:"/assets/reklamy/auto-graphic/live-csob-auto20-wide.svg",image:"/assets/reklamy/auto-graphic/live-csob-auto20.svg",imageRequired:true},
  {id:"live-innogy-september",title:"innogy: sleva 20 % na energie na 3 roky",text:"eHUB uvádí akci sleva 20 % na energie na následující 3 roky do 30. září. Přehled a měřený odkaz jsou na Pojistime.to.",url:"https://pojistime.to/elektrina-plyn.html?utm_source=nasekadan&utm_medium=owned_promo&utm_campaign=innogy_september_2026",tag:"Do 30. 9.",contexts:["home", "finance", "sidebar", "general", "local"],weight:11,runtimeVerified:true,validTo:"2026-09-30",banner:"/assets/reklamy/auto-graphic/live-innogy-september.svg",wideBanner:"/assets/reklamy/auto-graphic/live-innogy-september-wide.svg",image:"/assets/reklamy/auto-graphic/live-innogy-september.svg",imageRequired:true},
  {id:"live-fotbaltour-f1",title:"FIRST MINUTE: F1 2027 za nejlepší ceny",text:"FIRST MINUTE nabídka zájezdů na Formuli 1 v roce 2027 přes FotbalTour.cz.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5ace1024&desturl=https%3A%2F%2Fwww.fotbaltour.cz%2Fformule-1",tag:"F1 2027",contexts:["travel", "sport", "family", "sidebar", "general", "local"],weight:10,runtimeVerified:true,validTo:"2026-09-30",banner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",wideBanner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",image:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",imageRequired:true},
  {id:"live-fotbaltour-nhl",title:"NHL 2026/27: sportovní zájezdy",text:"Vybrané zájezdy na NHL 2026/27 přes FotbalTour.cz.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5ace1024&desturl=https%3A%2F%2Fwww.fotbaltour.cz%2Fliga%2Fnhl",tag:"NHL 2026/27",contexts:["travel", "sport", "family", "sidebar", "general"],weight:8,runtimeVerified:true,validTo:"2026-09-30",banner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",wideBanner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",image:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",imageRequired:true},
  {id:"live-fotbaltour-acmilan",title:"AC Milán: oficiální vstupenky a VIP sektory",text:"Oficiální vstupenky přímo od AC Milán, VIP sektory a další možnosti.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5ace1024&desturl=https%3A%2F%2Fwww.fotbaltour.cz%2Fklub%2Fac-milan",tag:"AC Milán",contexts:["travel", "sport", "sidebar", "general"],weight:6,runtimeVerified:true,validTo:"2026-10-31",banner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",wideBanner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",image:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",imageRequired:true},
  {id:"live-fotbaltour-marathons",title:"Světové maratony a půlmaratony",text:"Startovné a zájezdy na světové maratony a půlmaratony v nabídce FotbalTour.cz.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5ace1024&desturl=https%3A%2F%2Fwww.fotbaltour.cz%2Fklub%2Fmaratony-a-pulmaratony%2F",tag:"Běžecké zájezdy",contexts:["travel", "sport", "health", "sidebar", "general"],weight:5,runtimeVerified:true,validTo:"2026-11-08",banner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",wideBanner:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",image:"https://doc.ehub.cz/b/dad45d5d/177d09bc.png",imageRequired:true},
  {id:"live-vivaco-ppl1",title:"Vivaco: PPL box za 1 Kč",text:"Doprava do PPL boxu za 1 Kč při objednávce od 300 Kč. Akce do 2. září.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00a7dfa4&desturl=https%3A%2F%2Fwww.vivaco.cz%2F",tag:"Doprava za 1 Kč",contexts:["shopping", "health", "home", "sidebar", "general"],weight:9,runtimeVerified:true,validTo:"2026-09-02",banner:"/assets/reklamy/auto-graphic/live-vivaco-ppl1.svg",wideBanner:"/assets/reklamy/auto-graphic/live-vivaco-ppl1-wide.svg",image:"/assets/reklamy/auto-graphic/live-vivaco-ppl1.svg",imageRequired:true},
  {id:"live-vivaco-feet",title:"Vivaco: pemza zdarma k péči o nohy",text:"Pemza zdarma k nákupu péče o nohy podle partnerské akce.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00a7dfa4&desturl=https%3A%2F%2Fwww.vivaco.cz%2Fpece-o-nohy-3%2F",tag:"Dárek k nákupu",contexts:["health", "shopping", "sidebar", "general"],weight:4,runtimeVerified:true,validTo:"2026-09-30",banner:"/assets/reklamy/auto-graphic/live-vivaco-feet.svg",wideBanner:"/assets/reklamy/auto-graphic/live-vivaco-feet-wide.svg",image:"/assets/reklamy/auto-graphic/live-vivaco-feet.svg",imageRequired:true},
  {id:"live-vivaco-plet15",title:"Vivaco: 15 % na pleťovou péči – PLET15",text:"Pleť po létě – sleva 15 % na vybranou pleťovou péči. Kód PLET15.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00a7dfa4&desturl=https%3A%2F%2Fwww.vivaco.cz%2F",tag:"Kód PLET15",contexts:["health", "shopping", "sidebar", "general"],weight:8,runtimeVerified:true,validFrom:"2026-09-07",validTo:"2026-09-14",banner:"/assets/reklamy/auto-graphic/live-vivaco-plet15.svg",wideBanner:"/assets/reklamy/auto-graphic/live-vivaco-plet15-wide.svg",image:"/assets/reklamy/auto-graphic/live-vivaco-plet15.svg",imageRequired:true},
  {id:"live-vivaco-vlasy10",title:"Vivaco: 10 % na vlasovou péči – VLASY10",text:"Vlasy zpět do formy – sleva 10 % na vlasovou kategorii. Kód VLASY10.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=00a7dfa4&desturl=https%3A%2F%2Fwww.vivaco.cz%2F",tag:"Kód VLASY10",contexts:["health", "shopping", "sidebar", "general"],weight:8,runtimeVerified:true,validFrom:"2026-09-11",validTo:"2026-09-18",banner:"/assets/reklamy/auto-graphic/live-vivaco-vlasy10.svg",wideBanner:"/assets/reklamy/auto-graphic/live-vivaco-vlasy10-wide.svg",image:"/assets/reklamy/auto-graphic/live-vivaco-vlasy10.svg",imageRequired:true},
  {id:"live-patria-px",title:"Patria: první ETF na pražský index PX",text:"Nové ETF od WOOD & Company kopíruje hlavní index PX a umožňuje jedním nákupem získat expozici vůči velké části českého akciového trhu. Investování nese riziko ztráty.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=0ca65dab&desturl=https%3A%2F%2Fwww.patria.cz%2Fzpravodajstvi%2F7232019%2Fetf-dospela-i-v-cesku-patria-otevrela-investorum-svet-prazska-burza-ted-dostala-vlastni-fond.html",tag:"Novinka · PX ETF",contexts:["finance", "sidebar", "general"],weight:8,runtimeVerified:true,validFrom:"2026-09-07",banner:"/assets/reklamy/auto-graphic/live-patria-px.svg",wideBanner:"/assets/reklamy/auto-graphic/live-patria-px-wide.svg",image:"/assets/reklamy/auto-graphic/live-patria-px.svg",imageRequired:true},
  {id:"live-patria-etf",title:"Patria: pravidelné ETF bez nákupních poplatků",text:"Pravidelné investování do ETF podle partnerské akce bez nákupních poplatků. Investování nese riziko ztráty.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=0ca65dab&desturl=https%3A%2F%2Ffinance.patria.cz%2Fprodukty-a-sluzby%2FETF-pravidelne-zdarma",tag:"Pravidelné ETF",contexts:["finance", "sidebar", "general"],weight:4,runtimeVerified:true,validTo:"2026-12-31",banner:"/assets/reklamy/auto-graphic/live-patria-etf.svg",wideBanner:"/assets/reklamy/auto-graphic/live-patria-etf-wide.svg",image:"/assets/reklamy/auto-graphic/live-patria-etf.svg",imageRequired:true},
  {id:"live-patria-young",title:"Patria: investice pro mladé bez vstupního poplatku",text:"Investice pro mladé bez vstupního poplatku podle partnerské akce. Investování nese riziko ztráty.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=0ca65dab&desturl=https%3A%2F%2Ffinance.patria.cz%2Fprodukty-a-sluzby%2Finvestice-pro-mlade",tag:"Investice pro mladé",contexts:["finance", "sidebar", "general"],weight:3,runtimeVerified:true,validTo:"2026-12-31",banner:"/assets/reklamy/auto-graphic/live-patria-young.svg",wideBanner:"/assets/reklamy/auto-graphic/live-patria-young-wide.svg",image:"/assets/reklamy/auto-graphic/live-patria-young.svg",imageRequired:true},
  {id:"live-vitahit10",title:"Vitahit: 10 % na všechna probiotika – vitahit10",text:"Sleva 10 % na všechna probiotika s kódem vitahit10 podle partnerského programu.",url:"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=cdc25894&desturl=https%3A%2F%2Feshop.vitahit.cz%2F",tag:"Kód vitahit10",contexts:["health", "shopping", "sidebar", "general"],weight:4,runtimeVerified:true,validTo:"2027-12-31",banner:"/assets/reklamy/auto-graphic/live-vitahit10.svg",wideBanner:"/assets/reklamy/auto-graphic/live-vitahit10-wide.svg",image:"/assets/reklamy/auto-graphic/live-vitahit10.svg",imageRequired:true},
/* LIVE_MEGA_CAMPAIGNS_END */
  {id:'realitykadan-byt',title:'Prodáváte byt v Kadani nebo v Klášterci?',text:'Rychlá nabídka bez zbytečného čekání. Férově, nezávazně a bez provize.',url:'https://realitykadan.cz',banner:'/assets/reklamy/realitykadan-byt-wide-v1.svg',wideBanner:'/assets/reklamy/realitykadan-byt-wide-v1.svg',tag:'Výkup nemovitostí',contexts:['home','local','sidebar','general','finance'],weight:6,fullBleed:true},
  {id:'realitykadan-garaz',title:'Prodáváte garáž v Kadani nebo v Klášterci?',text:'Rychlá nabídka, minimum formalit a férové podmínky.',url:'https://realitykadan.cz',banner:'/assets/reklamy/realitykadan-garaz-wide-v1.svg',wideBanner:'/assets/reklamy/realitykadan-garaz-wide-v1.svg',tag:'Výkup nemovitostí',contexts:['home','local','sidebar','general'],weight:5,fullBleed:true},
  {id:'pojistime',title:'Pojistime.to',text:'Srovnání pojištění auta, domácnosti, cestování a dalších rizik na jednom místě.',url:'https://pojistime.to',tag:'Pojištění',contexts:['finance','auto','home','travel','sidebar','general'],banner:"/assets/reklamy/auto-graphic/pojistime.svg",wideBanner:"/assets/reklamy/auto-graphic/pojistime-wide.svg",image:"/assets/reklamy/auto-graphic/pojistime.svg",imageRequired:true},
  {id:'csob',title:'ČSOB Pojišťovna',text:'Pojištění auta, majetku, odpovědnosti, cestování i podnikatelských rizik.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=f5e0f8fb',banner:'https://doc.ehub.cz/b/174174d6/041e34d5.jpg',tag:'Pojištění',contexts:['finance','auto','home','travel','general']},
  {id:'mutumutu',title:'Mutumutu.cz',text:'Životní pojištění a ochrana příjmu pro každodenní život.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=74eab778',banner:'https://doc.ehub.cz/b/706fc994/00043bad.png',tag:'Život a příjem',contexts:['finance','health','general']},
  {id:'petexpert',title:'PetExpert.cz',text:'Pojištění psů a koček pro nečekané veterinární výdaje.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce2e382f',banner:'https://doc.ehub.cz/b/a540cd53/0dce0d8e.png',tag:'Mazlíčci',contexts:['pets','family','general']},
  {id:'eon',title:'E.ON.cz',text:'Elektřina, plyn a energetická řešení pro domácnosti.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=87497054',banner:'https://doc.ehub.cz/b/40b76033/0d98713f.png',tag:'Energie',contexts:['home','energy','general']},
  {id:'poda',title:'PODA.cz',text:'Internet a televizní služby pro domácnosti.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=a86d04cf',banner:'https://doc.ehub.cz/b/6b66a101/30907ccc.jpg',tag:'Internet a TV',contexts:['internet','home','general']},
  {id:'nejpripojeni',title:'NejPřipojení.cz',text:'Porovnání možností internetu a IPTV podle dostupnosti.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=7dc84251',banner:'https://doc.ehub.cz/b/a7ced961/16394373.png',tag:'Internet',contexts:['internet','home','general']},
  {id:'uvtnet',title:'ÚVTnet.cz',text:'Internetové připojení a související služby.',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=51dbb2b9',banner:'https://doc.ehub.cz/b/f402ef36/135fd2cd.png',tag:'Internet',contexts:['internet','home','general']},
  {id:'klik',title:'Klik.cz',text:'Srovnání pojištění auta, majetku a cestování.',url:'https://www.tkqlhce.com/click-101819174-15024026',banner:'https://www.awltovhc.com/image-101819174-15021022',tag:'Srovnávač',contexts:['finance','auto','travel','home','general']},
  {id:'kalkulator',title:'Kalkulator.cz',text:'Srovnání pojištění, energií a dalších výdajů domácnosti.',url:'https://www.tkqlhce.com/click-101819174-15616422',banner:'https://www.ftjcfx.com/image-101819174-15616436',tag:'Srovnávač',contexts:['finance','auto','energy','home','general']},
  {id:'rixo',title:'RIXO.cz',text:'Online srovnání pojištění vozidel, majetku, cestování i dalších rizik.',url:'https://www.rixo.cz/pojisteni-vozidel/?a_box=9n97unga&a_cam=1',tag:'Pojištění',contexts:['finance','auto','travel','home','general'],banner:"/assets/reklamy/auto-graphic/rixo.svg",wideBanner:"/assets/reklamy/auto-graphic/rixo-wide.svg",image:"/assets/reklamy/auto-graphic/rixo.svg",imageRequired:true},
  {id:'vyklidime',title:'VYKLIDIME.TO',text:'Vyklízení bytů, domů, sklepů a pozůstalostí v Kadani a širokém okolí.',url:'https://vyklidime.to',tag:'Místní služba',contexts:['home','sidebar','local','general'],banner:"/assets/reklamy/auto-graphic/vyklidime.svg",wideBanner:"/assets/reklamy/auto-graphic/vyklidime-wide.svg",image:"/assets/reklamy/auto-graphic/vyklidime.svg",imageRequired:true},
  {id:'uklizecka',title:'Vaše uklízečka',text:'Úklid domácností, firem, kanceláří a bytových domů na Kadaňsku.',url:'https://vaseuklizecka.cz',tag:'Místní služba',contexts:['home','sidebar','local','general'],banner:"/assets/reklamy/auto-graphic/uklizecka.svg",wideBanner:"/assets/reklamy/auto-graphic/uklizecka-wide.svg",image:"/assets/reklamy/auto-graphic/uklizecka.svg",imageRequired:true},
  {id:'uklizecka-cisteni',title:'Čištění koberců, sedaček a čalounění',text:'Hloubkové čištění koberců, sedaček a čalounění na Kadaňsku. Objednávky: 603 206 308.',url:'https://www.vaseuklizecka.cz/sluzby/cisteni-kobercu-a-calouneni/',banner:'/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg',wideBanner:'/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg',tag:'Místní služba',contexts:['home','sidebar','local','general'],weight:4},
  {id:'haffit',title:'Haffit',text:'Krmivo pro psy připravené na míru podle potřeb konkrétního psa.',url:'https://www.haffit.cz/?a_box=cbhtyjjm&a_cam=1',tag:'Pro chovatele',contexts:['pets','family','general'],banner:"/assets/reklamy/auto-graphic/haffit.svg",wideBanner:"/assets/reklamy/auto-graphic/haffit-wide.svg",image:"/assets/reklamy/auto-graphic/haffit.svg",imageRequired:true},
  {id:'zonky',title:'Zonky půjčka',text:'Online půjčka od Zonky s přehledným vyřízením a možností předčasného splacení.',url:'https://www.zonky.cz/pujcka-od-zonky/?a_box=s8m27mmy',tag:'Finance',contexts:['finance','home','general'],banner:"/assets/reklamy/auto-graphic/zonky.svg",wideBanner:"/assets/reklamy/auto-graphic/zonky-wide.svg",image:"/assets/reklamy/auto-graphic/zonky.svg",imageRequired:true},
];

const towerCreativeItems=[
/* ACTIVE_TOWERS_START */
  {id:'season-concept-fans-tower',title:'Vedro? Ventilátory Concept',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2Fventilatory_c3392989.html',image:'/assets/reklamy/season-concept-fans-tower.svg',width:300,height:600,contexts:['home', 'local', 'sidebar', 'general', 'health'],weight:6,runtimeVerified:true,validTo:'2026-09-15'},
  {id:'season-proalergiky-aircon-tower',title:'Mobilní klimatizace Meaco Cool',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=abc25217&desturl=https%3A%2F%2Fwww.proalergiky.cz%2Feshop%2Fmobilni-klimatizace-meaco-cool-9000-pro',image:'/assets/reklamy/season-proalergiky-aircon-tower.svg',width:300,height:600,contexts:['home', 'local', 'sidebar', 'general', 'health'],weight:5,runtimeVerified:true,validTo:'2026-09-15'},
  {id:'owned-vaseuklizecka-tower',title:'VašeUklízečka.cz',url:'https://vaseuklizecka.cz/',image:'/assets/reklamy/owned-vaseuklizecka-tower.svg',width:300,height:600,contexts:['home', 'local', 'sidebar', 'general', 'health'],weight:4,runtimeVerified:true},
  {id:'owned-vyklidime-banner-tower',title:'VYKLIDIME.TO',url:'https://vyklidime.to/',image:'/assets/reklamy/owned-vyklidime-banner-tower.svg',width:300,height:600,contexts:['home', 'local', 'sidebar', 'general'],weight:4,runtimeVerified:true},
  {id:'coupon-concept-leto30-tower',title:'Concept: 30 % na malé spotřebiče',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2F',image:'/assets/reklamy/coupon-concept-leto30-tower.svg',width:300,height:600,contexts:['home', 'sidebar', 'general', 'local'],weight:5,runtimeVerified:true,validTo:'2026-08-31'},
  {id:'coupon-concept-vyprodej30-tower',title:'Concept: 30 % na velké spotřebiče',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5&desturl=https%3A%2F%2Fwww.concept.cz%2F',image:'/assets/reklamy/coupon-concept-vyprodej30-tower.svg',width:300,height:600,contexts:['home', 'sidebar', 'general', 'local'],weight:5,runtimeVerified:true,validTo:'2026-08-31'},
  {id:'promo-aranys-80-tower',title:'Aranys: výprodej se slevami až 80 %',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=15991a3f&desturl=https%3A%2F%2Faranys.cz%2Fakce-slevy',image:'/assets/reklamy/promo-aranys-80-tower.svg',width:300,height:600,contexts:['general', 'sidebar', 'home'],weight:4,runtimeVerified:true,validTo:'2026-12-31'},
  {id:'coupon-museum-partner30-tower',title:'Museum of Bricks: 30 % na vstupenky',url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=160115dc&desturl=https%3A%2F%2Fmuseumofbricks.cz%2F',image:'/assets/reklamy/coupon-museum-partner30-tower.svg',width:300,height:600,contexts:['family', 'travel', 'sidebar', 'general', 'local'],weight:4,runtimeVerified:true,validTo:'2026-08-31'},
/* ACTIVE_TOWERS_END */
  {
    id:'dobre-knihy-tower',
    title:'Dobré-knihy.cz',
    url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5e05c229',
    image:'https://doc.ehub.cz/b/57ad8ec1/5e05c229.jpg',
    width:300,
    height:600,
    contexts:['general','family','local','health']
  },
  {
    id:'network-tower',
    title:'Partnerská nabídka',
    url:'https://www.tkqlhce.com/click-101819174-15753082',
    image:'https://www.lduhtrp.net/image-101819174-15753082',
    width:300,
    height:600,
    contexts:['general','finance','auto','home','local']
  }
  ,{
    id:'uklizecka-cisteni-tower',
    title:'Čištění koberců, sedaček a čalounění',
    url:'https://www.vaseuklizecka.cz/sluzby/cisteni-kobercu-a-calouneni/',
    image:'/assets/reklamy/vaseuklizecka-cisteni-yellow-tower-160x237.webp',
    width:300,
    height:600,
    contexts:['general','home','local','health','sidebar'],
    weight:4
  }
];


/* NK_HOLIDAY_PROMOS_20261027: Christmas retail mix, no expired discount claims. */
const nkGiftOffers2026 = [
  {
    "id": "nk-xmas-concept-2026",
    "title": "Concept: darujte radost do každého domova",
    "text": "Praktické vánoční dárky: spotřebiče a vybavení domácnosti. Aktuální ceny ověřte u prodejce.",
    "url": "https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5",
    "banner": "/vanoce-2026/concept-square.svg",
    "wideBanner": "/vanoce-2026/concept-wide.svg",
    "tag": "Reklama · vánoční inspirace",
    "contexts": [
      "home",
      "general",
      "sidebar",
      "family",
      "shopping",
      "local"
    ],
    "weight": 25,
    "runtimeVerified": true,
    "christmasGift": true,
    "validFrom": "2026-12-01",
    "validTo": "2026-12-24"
  },
  {
    "id": "nk-xmas-pompo-2026",
    "title": "Pompo: dárky, které rozzáří Vánoce",
    "text": "Vánoční katalog Pompo 2026 přináší přes 800 hraček. Vyberte si vánoční dárky pro děti.",
    "url": "https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=ce6cff81",
    "banner": "/vanoce-2026/pompo-square.svg",
    "wideBanner": "/vanoce-2026/pompo-wide.svg",
    "tag": "Reklama · vánoční inspirace",
    "contexts": [
      "home",
      "general",
      "sidebar",
      "family",
      "shopping",
      "local"
    ],
    "weight": 32,
    "runtimeVerified": true,
    "christmasGift": true,
    "validFrom": "2026-10-27",
    "validTo": "2026-12-24"
  },
  {
    "id": "nk-xmas-bricks-2026",
    "title": "Museum of Bricks: darujte zážitek plný stavebnic",
    "text": "Vánoční tip: rodinný výlet za světem stavebnic. Prohlédněte nabídku vstupenek a zážitků.",
    "url": "https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=160115dc&desturl=https%3A%2F%2Fmuseumofbricks.cz%2F",
    "banner": "/vanoce-2026/bricks-square.svg",
    "wideBanner": "/vanoce-2026/bricks-wide.svg",
    "tag": "Reklama · vánoční inspirace",
    "contexts": [
      "home",
      "general",
      "sidebar",
      "family",
      "shopping",
      "local"
    ],
    "weight": 17,
    "runtimeVerified": true,
    "christmasGift": true,
    "validFrom": "2026-10-27",
    "validTo": "2026-12-24"
  }
];
promoItems.push(...nkGiftOffers2026);
towerCreativeItems.push(...nkGiftOffers2026.map(item=>({id:item.id+'-tower',title:item.title,url:item.url,image:'/vanoce-2026/'+(item.id.includes('concept')?'concept':item.id.includes('pompo')?'pompo':'bricks')+'-tower.svg',width:300,height:600,contexts:item.contexts,weight:item.weight,runtimeVerified:true,christmasGift:true,validFrom:item.validFrom,validTo:item.validTo})));
/* NK_HOLIDAY_PROMOS_20261027_END */
/* NK_CONCEPT_BLACK_FRIDAY_20261106: eHUB Nov 2026 offer; official Concept dates 30 Oct–30 Nov. */
const nkConceptBlackFriday2026={
  id:'nk-concept-black-friday-2026',
  title:'Concept BLACK FRIDAY: slevy až 55 %',
  text:'Od 30. října do 30. listopadu 2026 sleva až 55 % na vybrané domácí spotřebiče. V nabídce jsou i aktuální kupóny na vybrané výrobky. Přesné podmínky a možné kombinace ověřte v obchodě.',
  url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b23975b5',
  banner:'/vanoce-2026/concept-black-friday-square.svg',
  wideBanner:'/vanoce-2026/concept-black-friday-wide.svg',
  tag:'Reklama · Black Friday · do 30. 11.',
  contexts:['home','shopping','family','sidebar','general','local'],
  weight:36,
  fullBleed:true,
  runtimeVerified:true,
  christmasGift:true,
  validFrom:'2026-10-30',
  validTo:'2026-11-30'
};
promoItems.push(nkConceptBlackFriday2026);
towerCreativeItems.push({
  id:'nk-concept-black-friday-2026-tower',
  title:nkConceptBlackFriday2026.title,
  url:nkConceptBlackFriday2026.url,
  image:'/vanoce-2026/concept-black-friday-tower.svg',
  width:300,height:600,
  contexts:nkConceptBlackFriday2026.contexts,
  weight:36,
  runtimeVerified:true,
  christmasGift:true,
  validFrom:'2026-10-30',
  validTo:'2026-11-30'
});
/* NK_CONCEPT_BLACK_FRIDAY_20261106_END */
/* NK_FOTBALTOUR_XMAS_2026: sports gift voucher, timed until Christmas. */
const nkFotbalTourVoucher2026 = {
  id:'nk-fotbaltour-voucher-2026',
  title:'FotbalTour: sportovní zážitek pod stromeček',
  text:'Dárkový poukaz na vstupenku nebo sportovní zájezd podle vlastního výběru. Design na míru zdarma.',
  url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5ace1024&desturl=https%3A%2F%2Fwww.fotbaltour.cz%2Fdarkove-poukazy%2F',
  banner:'/vanoce-2026/fotbaltour-poukazy-square.svg',
  wideBanner:'/vanoce-2026/fotbaltour-poukazy-wide.svg',
  tag:'Reklama · Vánoční dárkové poukazy',
  contexts:['sport','home','general','sidebar','travel','family','shopping','local'],
  weight:28,
  fullBleed:true,
  runtimeVerified:true,
  christmasGift:true,
  validFrom:'2026-11-04',
  validTo:'2026-12-24'
};
promoItems.push(nkFotbalTourVoucher2026);
towerCreativeItems.push({
  id:'nk-fotbaltour-voucher-2026-tower',
  title:nkFotbalTourVoucher2026.title,
  url:nkFotbalTourVoucher2026.url,
  image:'/vanoce-2026/fotbaltour-poukazy-tower.svg',
  width:300,height:600,
  contexts:nkFotbalTourVoucher2026.contexts,
  weight:28,
  runtimeVerified:true,
  christmasGift:true,
  validFrom:'2026-11-04',
  validTo:'2026-12-24'
});
/* NK_FOTBALTOUR_XMAS_2026_END */

// NK_SALENTE_BF_2026: timed affiliate campaign, ends automatically after 30 November.
const nkSalenteBlackFriday2026=[
  {
    id:'nk-salente-bf-preview-2026',
    title:'Salente: Black Friday začíná 19. listopadu',
    text:'Připravte si vánoční inspiraci. V ČR od 19. do 30. listopadu 2026 slevy na vybrané produkty až 25 %. Před začátkem akce ještě neplatí.',
    url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e945dbdb&desturl=https%3A%2F%2Feshop.salente.cz%2Fblack-friday%2F',
    banner:'/vanoce-2026/salente-black-friday-square.svg',
    wideBanner:'/vanoce-2026/salente-black-friday-wide.svg',
    tag:'Reklama · Black Friday se blíží',
    contexts:['home','shopping','family','sidebar','general','local'],
    weight:13,christmasGift:true,runtimeVerified:true,validFrom:'2026-11-04',validTo:'2026-11-18'
  },
  {
    id:'nk-salente-bf-active-2026',
    title:'Salente: Black Friday až −25 % do 30. listopadu',
    text:'Vybrané produkty do domácnosti v akci 19.–30. listopadu 2026. Prohlédněte si ceny a dostupnost přímo u prodejce.',
    url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e945dbdb&desturl=https%3A%2F%2Feshop.salente.cz%2Fblack-friday%2F',
    banner:'/vanoce-2026/salente-black-friday-square.svg',
    wideBanner:'/vanoce-2026/salente-black-friday-wide.svg',
    tag:'Reklama · Black Friday 2026',
    contexts:['home','shopping','family','sidebar','general','local'],
    weight:18,christmasGift:true,runtimeVerified:true,validFrom:'2026-11-19',validTo:'2026-11-30'
  }
];
promoItems.push(...nkSalenteBlackFriday2026);
towerCreativeItems.push(...nkSalenteBlackFriday2026.map(item=>({
  id:item.id+'-tower',
  title:item.title,
  url:item.url,
  image:'/vanoce-2026/salente-black-friday-tower.svg',
  width:300,height:600,contexts:item.contexts,
  weight:item.weight,runtimeVerified:true,christmasGift:true,
  validFrom:item.validFrom,validTo:item.validTo
})));
/* NK_SALENTE_BF_2026_END */

/* NK_SMARTYDUM_APPROVED_20261107: approved eHUB program c8f0dd82; use the owner's default measured link and original partner graphics. */
const nkSmartydumAffiliate2026 = {
  id:'nk-smartydum-smart-home-20261107',
  title:'SMARTYdům.cz: chytré zámky, kamery a vybavení domácnosti',
  text:'Chytré zámky, schránky na klíče, senzory, bezpečnostní kamery, termostaty a další prvky chytré domácnosti. Ověřte aktuální ceny a kompatibilitu přímo u prodejce.',
  url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=6cca294d',
  banner:'https://doc.ehub.cz/b/c8f0dd82/18770ce4.png',
  wideBanner:'https://doc.ehub.cz/b/c8f0dd82/36f80e4e.jpg',
  image:'https://doc.ehub.cz/b/c8f0dd82/18770ce4.png',
  tag:'Reklama · partnerská nabídka',
  contexts:['home','shopping','general','sidebar','local','family'],
  weight:17,
  runtimeVerified:true,
  imageRequired:true,
  fullBleed:true,
  validFrom:'2026-11-07'
};
promoItems.push(nkSmartydumAffiliate2026);
/* NK_SMARTYDUM_APPROVED_20261107_END */

const usedPromoIds=new Set();

const partnerCopy={
  'dobre-knihy':'Knihy, audioknihy a další čtení pro volný čas i celou rodinu.',
  biano:'Inspirace a nabídky pro bydlení, nábytek a vybavení domácnosti.',
  nanospace:'České produkty pro zdravější domácnost, alergiky a kvalitnější spánek.',
  concept:'Domácí spotřebiče a praktické vybavení pro každodenní provoz domácnosti.',
  proalergiky:'Specializované produkty pro alergiky a zdravější prostředí v domácnosti.',
  poda:'Internetové připojení a televizní služby pro domácnosti.',
  telly:'Internetová televize se sportovními, filmovými a dalšími programy.',
  nejpripojeni:'Porovnání dostupných možností internetu a IPTV.',
  csob:'Pojištění auta, majetku, odpovědnosti, cestování i dalších rizik.',
  mutumutu:'Životní pojištění a ochrana příjmu pro každodenní život.',
  petexpert:'Pojištění psů a koček pro nečekané veterinární výdaje.',
  eon:'Energie a energetická řešení pro domácnosti.',
  klik:'Srovnání pojištění auta, majetku a cestování.',
  kalkulator:'Srovnání pojištění, energií a dalších výdajů domácnosti.',
  haffit:'Krmivo pro psy připravené na míru podle potřeb konkrétního psa.',
  zonky:'Online půjčka s přehledným vyřízením a možností předčasného splacení.'
};

function hashSeed(value){
  return [...String(value)].reduce((sum,char)=>((sum*31)+char.charCodeAt(0))>>>0,0);
}

function normalizeToken(value){
  return String(value||'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

function safeHttpUrl(value){
  try{
    const url=new URL(String(value||''),location.origin);
    return /^(https?:)$/.test(url.protocol)?url.href:'';
  }catch{
    return '';
  }
}

function escapeHtml(value){
  return String(value||'').replace(/[&<>'"]/g,char=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    "'":'&#39;',
    '"':'&quot;'
  })[char]);
}

/* Normalize legacy merchant-feed descriptions before any ad placement uses them.
   Some source XML descriptions were truncated inside HTML tags. */
function nkPlainProductDescription(value){
  return String(value||'')
    .replace(/<[^>]*>/g,' ')
    .replace(/<\s*\/?\s*[a-z][^>]*$/gi,' ')
    .replace(/&nbsp;|&#160;/gi,' ')
    .replace(/\s+/g,' ').trim();
}
promoItems.forEach(item=>{
  if(String(item.id||'').startsWith('multi-')){
    item.text=nkPlainProductDescription(item.text);
  }
});

function contextsFromCategories(categories){
  const text=(categories||[]).map(normalizeToken).join(' ');
  const contexts=new Set(['general']);
  if(/auto|vozid|doprava|povinne-ruceni/.test(text))contexts.add('auto');
  if(/internet|televize|iptv|telekomunikace|mobil/.test(text))contexts.add('internet');
  if(/energie|elektrina|plyn/.test(text))contexts.add('energy');
  if(/majetek|domacnost|bydleni|nabytek|spotrebice/.test(text))contexts.add('home');
  if(/zdravi|zivot|alergie|ochrana-prijmu/.test(text))contexts.add('health');
  if(/finance|pujcka|pojisteni|odpovednost/.test(text))contexts.add('finance');
  if(/cestovani/.test(text))contexts.add('travel');
  if(/mazlicci|pes|kocka/.test(text))contexts.add('pets');
  if(/rodina|knihy|volny-cas/.test(text))contexts.add('family');
  return [...contexts];
}

function tagFromContexts(contexts,categories){
  if(contexts.includes('internet'))return 'Internet a TV';
  if(contexts.includes('auto'))return 'Auto a pojištění';
  if(contexts.includes('health'))return 'Zdraví';
  if(contexts.includes('energy'))return 'Energie';
  if(contexts.includes('home'))return 'Domácnost';
  if(contexts.includes('pets'))return 'Mazlíčci';
  if(contexts.includes('finance'))return 'Finance';
  const first=(categories||[])[0];
  return first?String(first).replace(/-/g,' '):'Partnerská nabídka';
}

// NK_PERMANENT_AD_POLICY_20261003:
// Na NašeKadaň se smějí do rotace zapojit jen veřejně použitelné a přesně
// trackované affiliate nabídky. Pokud partner omezuje schválené domény,
// musí mezi nimi být nasekadan.cz. Tohle pravidlo se nesmí obcházet.
// NK_PARTNER_STATUS_GUARD_20261109: shared exclusion for ended/paused programs,
 // including stale XML products and deep tracking links.
function nkRetiredPartner(item){
  if(!item)return true;
  const fields=[item.id,item.name,item.title,item.tag,item.text,item.url,
    item.image,item.banner,item.wideBanner,item.partner,item.programKey,
    item.defaultLinkId,item.baseClickUrl,item.defaultTargetUrl,item.trackingUrl]
    .filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return /excursia|76c9b39c|naturprodukt|cretamart|0c6277d3|mamedoma|259ca026|lazy\s*farm|lazyfarm|28e75ba2|batohy.?zavazadla|ffcffc9b|apollostore|a883bbdd|twisto|1cb94817|prima\+|prima-plus|telly|b1a888ed|mydlovysvet|spongr|supramedex/.test(fields)
    || /^(inactive|ended|terminated|suspended|rejected|expired|closed|paused)$/i.test(String(item.status||''));
}

function partnerAllowedHere(row){
  if(nkRetiredPartner(row))return false;
  if(retiredLazyFarmPartner(row))return false;
  if(!mamedomaProgramAllowed(row))return false;
  if(!row||typeof row!=='object'||row.publicUse===false||row.publicCtaEnabled===false)return false;
  const domains=Array.isArray(row.approvedDomains)?row.approvedDomains.map(value=>String(value||'').toLowerCase().replace(/^www\./,'')):[];
  if(domains.length){
    const host=String(location.hostname||'').toLowerCase().replace(/^www\./,'');
    if(!domains.includes(host))return false;
  }
  return true;
}

function firstPartnerLink(row){
  if(!partnerAllowedHere(row))return '';
  const safeLinks=(Array.isArray(row.links)?row.links:[]).filter(link=>link&&typeof link==='object'&&link.publicUse!==false&&link.requiresOfferVerification!==true);
  const candidates=[row.baseClickUrl,row.trackingUrl,...safeLinks.flatMap(link=>[link.clickUrl,link.url,link.trackingUrl])];
  return candidates.map(safeHttpUrl).find(Boolean)||'';
}

function firstPartnerBanner(row){
  if(!partnerAllowedHere(row))return '';
  const bannerRows=(Array.isArray(row.banners)?row.banners:[]).filter(banner=>banner&&typeof banner==='object'&&banner.publicUse!==false&&banner.requiresOfferVerification!==true);
  const preferred=bannerRows.find(banner=>/^(970x|728x|468x|480x|320x|300x)/i.test(String(banner.size||banner.format||'')))||bannerRows[0];
  return safeHttpUrl(preferred?.imageUrl||preferred?.src||row.sampleBanner||'');
}

function seasonalAffiliateWeight(contexts,hasFeeds){
  const month=new Date().getMonth()+1;
  let weight=hasFeeds?3:2;
  if(contexts.includes('travel')&&[1,2,5,6,7,8,9,10,11,12].includes(month))weight+=2;
  if(contexts.includes('home')&&[3,4,5,9,10,11].includes(month))weight+=1;
  if(contexts.includes('finance')&&[1,9,10,11,12].includes(month))weight+=1;
  return weight;
}

function mergeSnapshotPartners(snapshot){
  const existing=new Set(promoItems.map(item=>normalizeToken(item.id||item.title)));
  for(const row of snapshot?.partners||[]){
    if(!partnerAllowedHere(row))continue;
    const id=normalizeToken(row.id||row.name||row.defaultLinkId);
    if(!id||existing.has(id))continue;
    const url=firstPartnerLink(row);
    const banner=firstPartnerBanner(row);
    if(!url||!banner)continue;
    const categories=Array.isArray(row.categories)?row.categories:[];
    const contexts=contextsFromCategories(categories);
    const hasFeeds=Array.isArray(row.feeds)&&row.feeds.length>0;
    promoItems.push({id,title:String(row.name||row.id||'Partnerská nabídka'),text:partnerCopy[id]||'Vybraná partnerská nabídka. Aktuální podmínky ověřte po prokliku.',url,banner,wideBanner:banner,tag:hasFeeds?'Aktuální nabídka':tagFromContexts(contexts,categories),contexts,weight:seasonalAffiliateWeight(contexts,hasFeeds),runtimeVerified:true,feedAware:hasFeeds});
    existing.add(id);
    for(const towerBanner of row.banners||[]){
      if(towerBanner?.publicUse===false||towerBanner?.requiresOfferVerification===true)continue;
      if(String(towerBanner.size||towerBanner.format||'').toLowerCase()!=='300x600')continue;
      const image=safeHttpUrl(towerBanner.imageUrl||towerBanner.src);
      const click=safeHttpUrl(towerBanner.clickUrl||url);
      const towerId=id+'-'+normalizeToken(towerBanner.id||'tower');
      if(!image||!click||towerCreativeItems.some(item=>item.id===towerId))continue;
      towerCreativeItems.push({id:towerId,title:String(row.name||'Partnerská nabídka'),url:click,image,width:300,height:600,contexts,weight:seasonalAffiliateWeight(contexts,hasFeeds),runtimeVerified:true});
    }
  }
}

async function loadAffiliateSnapshot(){
  try{
    const url=new URL('/affiliate-active-snapshot.json',location.origin);
    url.searchParams.set('v',new Date().toISOString().slice(0,13));
    const response=await fetch(url,{cache:'no-store',headers:{'Accept':'application/json'}});
    if(!response.ok)return;
    const snapshot=await response.json();
    mergeSnapshotPartners(snapshot);
  }catch(error){
    console.warn('Centrální affiliate snapshot se nepodařilo načíst.',error);
  }
}

/* NK_APPROVED_EHUB_XML_FEEDS_20261109: read server-cached, recently refreshed merchant offers. */
async function loadProductFeed(){
  try{
    const url=new URL('/affiliate-feed-products.json',location.origin);
    url.searchParams.set('v',new Date().toISOString().slice(0,13));
    const response=await fetch(url,{cache:'no-store',headers:{'Accept':'application/json'}});
    if(!response.ok)return;
    const catalog=await response.json();
    const imported=Date.parse(catalog?.generatedAt||'');
    const age=Date.now()-imported;
    if(catalog?.schemaVersion!==1||!Number.isFinite(imported)||age<0||age>30*3600000)return;
    const approved=new Set(['darkoviny','svetuklidu','001shop','gengar','fanda-nhl']);
    const known=new Set(promoItems.map(item=>item.id));
    for(const source of (Array.isArray(catalog.products)?catalog.products:[]).slice(0,240)){
      if(!source||!approved.has(source.partnerKey)||!source.feedProduct||!String(source.id||'').startsWith('nk-feed-'))continue;
      if(known.has(source.id))continue;
      const link=safeHttpUrl(source.url),image=safeHttpUrl(source.banner||source.image);
      if(!link.startsWith('https://ehub.cz/system/scripts/click.php?')||!image.startsWith('https://'))continue;
      if(!Number.isFinite(Number(source.priceCzk))||Number(source.priceCzk)<=0)continue;
      const freshAt=Date.parse(source.feedUpdatedAt||'');
      if(!Number.isFinite(freshAt)||Date.now()-freshAt>30*3600000||freshAt>Date.now())continue;
      promoItems.push({
        id:String(source.id),partnerKey:String(source.partnerKey),partner:String(source.partner||''),
        title:String(source.title||'').slice(0,110),text:String(source.text||''),
        url:link,banner:image,wideBanner:image,tag:'Reklama · produkt z nabídky',
        priceCzk:Number(source.priceCzk),priceLabel:String(source.priceLabel||''),
        contexts:Array.isArray(source.contexts)?source.contexts:['general','shopping','sidebar'],
        weight:2,feedProduct:true,runtimeVerified:true
      });
      known.add(source.id);
    }
  }catch(error){console.warn('Produktové feedy nejsou dostupné.',error);}
}
/* NK_APPROVED_EHUB_XML_FEEDS_20261109_END */

function isPromoActive(item){
  if(nkRetiredPartner(item))return false;
  if(retiredLazyFarmPartner(item))return false;
  if(!mamedomaProgramAllowed(item))return false;
  // Holiday traffic guard: remove highly specific LazyFarm goat feed ads;
  // campaign closes in early November, never re-enable by feed synchronization.
  const adText=[item?.id,item?.title,item?.tag,item?.text,item?.url].join(' ').toLowerCase();
  // Previously ended partner programmes must never re-enter rotation from stale feed snapshots.
  if(/naturprodukt|cretamart|batohy.?zavazadla|prima\+|prima-plus|lazy\s*farm|lazyfarm|28e75ba2/.test(adText))return false;
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  // NK_EHUB_NOVEMBER_SUNSETS_20261106: stop future affiliate imports on eHUB end dates.
  const affiliateEndDates=[
    [/lazyfarm|28e75ba2/,'2026-11-03'],
    [/mydlovysvet/,'2026-11-01'],
    [/spongr|špongr/,'2026-11-01'],
    [/supramedex/,'2026-11-25'],
    [/chaukiss/,'2026-11-27'],
    [/sanubabu/,'2026-11-30'],
    [/malvik|malvík/,'2026-11-30'],
    [/hravakocka|hravákočka/,'2026-11-30'],
    [/ploom\.sk/,'2026-11-15']
  ];
  if(affiliateEndDates.some(([pattern,stopDate])=>pattern.test(adText)&&today>=stopDate))return false;
  if(item.validFrom&&today<item.validFrom)return false;
  if(item.validTo&&today>item.validTo)return false;
  return true;
}

// Distinct active advertisers, rotated every 30 minutes across pages and placements.
const nkUsedPromoPartners20261109=new Set();
function nkAdvertiserKey(item){
  if(item.partnerKey)return normalizeToken(item.partnerKey);
  const raw=normalizeToken((String(item.title||item.id||'')).split(/[:–—]/)[0]);
  const combined=normalizeToken(String(item.id||'')+' '+String(item.title||''));
  for(const [pattern,key] of [
    [/fotbaltour|fotbal-tour/,'fotbaltour'],[/vase-?uklizecka|uklizecka/,'vaseuklizecka'],
    [/levne-?vyklidime/,'levnevyklidime'],[/vyklidime/,'vyklidime'],
    [/concept/,'concept'],[/aranys/,'aranys'],[/museum-?of-?bricks|bricks/,'museumofbricks'],
    [/c(?:s|z)ob/,'csob'],[/fanda-?nhl/,'fanda-nhl'],[/gengar/,'gengar'],
    [/darkoviny/,'darkoviny'],[/svetuklidu/,'svetuklidu'],[/001shop/,'001shop']
  ]){if(pattern.test(combined))return key;}
  // Product rows from XML feeds are many creatives of the SAME merchant.
  // Group tracked eHUB products by programme creative instead of by product title.
  const ehubCreative=String(item.url||'').match(/[?&]a_bid=([a-f0-9]{8})/i);
  if(ehubCreative)return 'ehub-'+ehubCreative[1].toLowerCase();
  return raw||normalizeToken(item.id);
}
function nkRotationBucket(){return Math.floor(Date.now()/(30*60*1000));}
function pickPromos(context,count,offset){
  const active=promoItems.filter(item=>isPromoActive(item)&&item.runtimeVerified===true&&item.url&&(item.banner||item.image||item.wideBanner));
  if(!active.length||count<1)return [];
  const seed=location.pathname+'|'+nkRotationBucket()+'|'+context+'|'+offset;
  const groups=new Map();
  for(const item of active){
    const key=nkAdvertiserKey(item);
    const fit=Array.isArray(item.contexts)&&item.contexts.includes(context)?2:
      (Array.isArray(item.contexts)&&item.contexts.includes('general')?1:0);
    const priority=fit*2+Math.min(20,Math.max(1,Number(item.weight)||1))/20+
      (hashSeed(seed+'|creative|'+item.id)/4294967296);
    const previous=groups.get(key);
    if(!previous||priority>previous.priority)groups.set(key,{key,item,fit,priority});
  }
  const candidates=[...groups.values()].sort((a,b)=>{
    const aScore=hashSeed(seed+'|brand|'+a.key)/4294967296+a.fit*.15;
    const bScore=hashSeed(seed+'|brand|'+b.key)/4294967296+b.fit*.15;
    return bScore-aScore;
  });
  const fresh=candidates.filter(entry=>!nkUsedPromoPartners20261109.has(entry.key));
  let ordered=[...fresh,...candidates.filter(entry=>nkUsedPromoPartners20261109.has(entry.key))];
  // One rotating newcomer in the first content slot; five newly approved partners
  // take turns while remaining placements preserve the broad, fair partner mix.
  if(offset===0&&typeof nkNewPartners20261109!=='undefined'&&nkNewPartners20261109.length){
    const target=nkNewPartners20261109[(hashSeed(location.pathname)+nkRotationBucket())%nkNewPartners20261109.length];
    const promoted=ordered.find(entry=>entry.key===target.partnerKey);
    if(promoted)ordered=[promoted,...ordered.filter(entry=>entry.key!==promoted.key)];
  }
  const selected=[];
  for(const entry of ordered){
    selected.push(entry.item);
    nkUsedPromoPartners20261109.add(entry.key);
    usedPromoIds.add(entry.item.id);
    if(selected.length>=count)break;
  }
  return selected;
}

function inferPromoContext(text){
  const value=String(text||'').toLocaleLowerCase('cs');
  if(/nehod|doprav|řidič|silnic|vozidl|auto/.test(value))return 'auto';
  if(/internet|televiz|kabel|optik|připojen/.test(value))return 'internet';
  if(/nemocnic|zdrav|porod|péč|audit|lékař|pacient|zraněn/.test(value))return 'health';
  if(/požár|hasič|vyklíz|budov|energie|opravy|domác|investic/.test(value))return 'home';
  if(/peněz|financ|dotac|náklad|výnos|hospodař|milion/.test(value))return 'finance';
  if(/pes|kočk|zvíř|mazlíčk/.test(value))return 'pets';
  if(/hokej|hokejbal|sport|panthers|fotbal|zápas|turnaj|stadion|brankář|gól/.test(value))return 'sport';
  if(/kadaň|ods|volb|kandid|politik|měst|zastupitel/.test(value))return 'local';
  return 'general';
}

function isPlacementCandidate(node){
  if(!node||node.matches('[data-promos],.source-list,.tag,h1,.leadtext,.hero-visual,.toc'))return false;
  return node.matches('p,table,ul,ol,blockquote,.numbers,.callout,.factcheck,.scenario-grid');
}

function nearbyText(node){
  const parts=[node.textContent||''];
  let cursor=node.nextElementSibling;
  for(let i=0;i<3&&cursor;i++,cursor=cursor.nextElementSibling){
    if(cursor.matches('.source-list'))break;
    parts.push(cursor.textContent||'');
  }
  return parts.join(' ');
}

function redistributeArticlePromos(){
  const article=document.querySelector('article.article');
  if(!article)return;
  if(document.documentElement.dataset.nkDoplnky==='1'){
    article.querySelectorAll(':scope > .article-ad-auto,:scope > .article-ad-bottom,:scope > .featured-cleaning-ad').forEach(node=>node.remove());
    return;
  }
  // NK_PERMANENT_AD_POLICY_20261003: inline reklamy s rozestupy + vždy reklama úplně dole.
  article.querySelectorAll(':scope > .article-ad-auto,:scope > .article-ad-bottom').forEach(node=>node.remove());
  const children=[...article.children];
  const endMarker=article.querySelector(':scope > .source-list,:scope > .next-teaser,:scope > .author-box,:scope > .article-footer');
  const endIndex=endMarker?children.indexOf(endMarker):children.length;
  const candidates=children.slice(0,endIndex<0?children.length:endIndex).filter(isPlacementCandidate).filter(node=>!node.matches('.leadtext'));
  const chars=(article.textContent||'').replace(/\s+/g,' ').trim().length;
  let desired=0;
  if(candidates.length>=2&&chars>=650)desired=1;
  if(candidates.length>=7&&chars>=4000)desired=2;
  if(candidates.length>=11&&chars>=8000)desired=3;
  if(candidates.length>=15&&chars>=13000)desired=4;
  if(candidates.length>=20&&chars>=20000)desired=5;
  const selected=[];
  if(desired>0){
    const minIndexGap=3;
    for(let position=0;position<desired;position++){
      const target=Math.round((position+1)*candidates.length/(desired+1))-1;
      let best=-1,bestDistance=Infinity;
      for(let index=0;index<candidates.length;index++){
        if(selected.some(existing=>Math.abs(existing-index)<minIndexGap))continue;
        const distance=Math.abs(index-target);
        if(distance<bestDistance){best=index;bestDistance=distance;}
      }
      if(best>=0)selected.push(best);
    }
    selected.sort((a,b)=>b-a).forEach((candidateIndex,reverseIndex)=>{
      const actualIndex=selected.length-1-reverseIndex;
      const anchor=candidates[candidateIndex];
      const block=document.createElement('section');
      block.className='article-ad article-ad-auto';
      block.dataset.promos='';
      block.dataset.context=inferPromoContext(nearbyText(anchor));
      block.dataset.layout=actualIndex%2===0?'banner':'feed';
      block.dataset.count='1';
      block.setAttribute('aria-label','REKLAMA');
      anchor.after(block);
    });
  }
  const bottom=document.createElement('section');
  bottom.className='article-ad article-ad-bottom';
  bottom.dataset.promos='';
  bottom.dataset.context=inferPromoContext(document.title+' '+(article.textContent||''));
  bottom.dataset.layout='banner';
  bottom.dataset.count='1';
  bottom.setAttribute('aria-label','REKLAMA');
  article.appendChild(bottom);
}

function ensurePromoStyles(){
  if(document.getElementById('promo-dynamic-styles'))return;
  const style=document.createElement('style');
  style.id='promo-dynamic-styles';
  style.textContent=`
    /* NK_ARTICLE_AD_CENTER_20261005 */
    html body article.article > [data-promos] > .promo-label{justify-content:center;text-align:center}
    html body article.article > [data-promos] > .promo-grid{
      grid-template-columns:minmax(0,1fr)!important;
      width:min(320px,100%)!important;max-width:100%!important;
      margin-left:auto!important;margin-right:auto!important;
    }
    html body article.article > [data-promos] > .promo-grid-banner{width:100%!important}
    .promo-label{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .promo-grid-banner{grid-template-columns:minmax(0,1fr)!important}
    .promo-card-full-image{display:block!important;padding:0!important;min-height:0!important;overflow:hidden}
    .promo-card-full-image .promo-banner{display:block!important;height:auto!important;min-height:0!important;margin:0!important;border:0!important}
    .promo-card-full-image .promo-banner img{display:block!important;width:100%!important;height:auto!important;max-width:none!important;max-height:none!important;object-fit:contain!important;padding:0!important;background:#fff}
    .promo-card-full-image .promo-wide-copy{display:none!important}
    .promo-card-wide{display:grid!important;grid-template-columns:minmax(210px,34%) minmax(0,1fr);padding:0!important;min-height:154px!important}
    /* NK_AD_FULLBLEED_TEXT_SAFE_20260920_V2 */
    .promo-card-wide.promo-card-text-safe{display:block!important;grid-template-columns:none!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:auto!important;background:#fff!important}
    .promo-card-wide.promo-card-text-safe>.promo-wide-copy{display:flex!important;width:100%!important;min-height:0!important;padding:24px 28px!important;border-left:6px solid var(--red)!important;background:#fff!important;visibility:visible!important;opacity:1!important}
    .promo-card-wide .promo-banner{height:100%!important;min-height:154px;margin:0!important;border:0;border-right:1px solid var(--line)}
    .promo-card-wide .promo-banner img{width:100%;height:100%;max-width:none!important;max-height:none!important;object-fit:contain;padding:10px;background:#fff}
    .promo-card-wide.promo-card-full-image{display:block!important;grid-template-columns:none!important;width:100%!important;max-width:1180px!important;min-height:0!important;padding:0!important}
    .promo-card-wide.promo-card-full-image>.promo-banner{display:block!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;border:0!important}
    .promo-card-wide.promo-card-full-image>.promo-banner img{display:block!important;width:100%!important;height:auto!important;max-width:none!important;max-height:none!important;object-fit:contain!important;padding:0!important;background:#fff}
    .promo-card-wide.promo-card-full-image>.promo-wide-copy{display:none!important}
    .featured-cleaning-ad>a.promo-card-full-image{max-width:1180px!important}
    .promo-banner-fallback{background:linear-gradient(135deg,var(--red2),var(--red))!important;color:#fff;font:800 24px/1.2 Georgia,serif;text-align:center;padding:24px}
    .promo-wide-copy{display:flex!important;flex-direction:column;padding:22px 25px;color:inherit!important;min-width:0}
    .promo-wide-copy small{color:var(--red);font-weight:850;text-transform:uppercase;letter-spacing:.06em}
    .promo-wide-copy strong{font:700 28px/1.15 Georgia,serif;margin:6px 0;overflow-wrap:anywhere}
    .promo-wide-copy .promo-description{color:#53616a;flex:1;overflow-wrap:anywhere}
    .promo-wide-copy b{color:var(--red);margin-top:12px}
    .article-ad-auto{margin:52px 0}\n    .article-ad-bottom{margin:58px 0 12px;padding-top:8px;border-top:1px solid var(--line)}
    .featured-cleaning-ad{display:block;margin:28px auto 48px;max-width:1180px;padding:0 20px}
    article.article>.featured-cleaning-ad{margin:34px 0 46px;padding:0;max-width:none}
    .featured-cleaning-ad>.promo-label{margin-bottom:8px;color:#747f85;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
    .featured-cleaning-ad>a{display:block;overflow:hidden;max-width:900px;margin:0 auto;border:1px solid #d8e0e4;border-radius:16px;background:#fff;box-shadow:0 12px 32px rgba(18,35,45,.12)}
    .featured-cleaning-ad img{display:block;width:100%;height:auto;object-fit:contain;background:#fff}


    .article-ad-rail{display:none;position:fixed;top:96px;width:176px;z-index:8;max-height:calc(100vh - 116px);overflow:hidden}
    .article-ad-rail-left{left:calc((100vw - 1180px)/2 - 194px)}
    .article-ad-rail-right{right:calc((100vw - 1180px)/2 - 194px)}
    .article-rail-card{display:flex;flex-direction:column;width:176px;max-height:calc(100vh - 116px);overflow:hidden;background:#fff;border:1px solid #d8e0e4;border-radius:16px;box-shadow:0 14px 38px rgba(18,35,45,.14);color:var(--ink);transition:transform .2s,box-shadow .2s}
    .article-rail-card:hover{transform:translateY(-3px);box-shadow:0 20px 48px rgba(18,35,45,.18)}
    .article-rail-label{display:block;padding:7px 9px 6px;color:#747f85;background:#f5f7f8;border-bottom:1px solid #e1e6e8;font-size:9px;font-weight:900;letter-spacing:.12em;text-align:center;text-transform:uppercase}
    .article-rail-tower-picture{display:flex;align-items:center;justify-content:center;background:#fff;min-height:352px}
    .article-rail-tower-picture img{display:block;width:176px;height:352px;object-fit:contain;border:0}
    .article-rail-visual{display:flex;align-items:center;justify-content:center;height:108px;min-height:108px;background:#fff;border-bottom:1px solid var(--line);overflow:hidden}
    .article-rail-visual img{display:block;width:100%;height:100%;object-fit:contain;padding:8px}
    .article-rail-copy{display:flex;flex-direction:column;min-height:240px;padding:15px}
    .article-rail-copy small{color:var(--red);font-size:10px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
    .article-rail-copy strong{font:800 22px/1.13 Georgia,serif;margin:7px 0 9px;overflow-wrap:anywhere}
    .article-rail-copy span{color:#53616a;font-size:13px;line-height:1.45;flex:1;overflow-wrap:anywhere}
    .article-rail-copy b{color:var(--red);font-size:13px;margin-top:13px}
    .article-rail-fallback{display:none;align-items:center;justify-content:center;min-height:270px;padding:18px;background:linear-gradient(145deg,var(--red2),var(--red));color:#fff;font:800 22px/1.2 Georgia,serif;text-align:center}
    .article-rail-card.is-image-error .article-rail-tower-picture,.article-rail-card.is-image-error .article-rail-visual{display:none}
    .article-rail-card.is-image-error .article-rail-fallback{display:flex}
    .article-aside-tower{display:none;margin-top:18px}
    .article-aside-tower .article-rail-card{width:100%;max-width:300px;max-height:none;margin:auto}
    .article-aside-tower .article-rail-tower-picture{min-height:auto}
    .article-aside-tower .article-rail-tower-picture img{width:100%;height:auto;aspect-ratio:1/2;object-fit:contain}

    @media(min-width:981px) and (max-width:1579px){
      .article-aside-tower{display:block}
    }
    @media(min-width:1580px) and (min-height:680px){
      .article-ad-rail{display:block}
    }
    @media(max-height:679px){
      .article-ad-rail{display:none!important}
    }
    @media(max-width:700px){
      .promo-card-wide{grid-template-columns:1fr}
      .promo-card-wide .promo-banner{height:112px!important;min-height:112px;border-right:0;border-bottom:1px solid var(--line)}
      .promo-card-full-image .promo-banner{height:auto!important;min-height:0!important;border:0!important}
      .promo-wide-copy strong{font-size:23px}
      .article-ad-auto{margin:44px 0}
    }
  `;
  style.textContent+=`
    /* NK_FEED_PRODUCT_CARDS_20261109: explicit sponsored label, current feed price. */
    .nk-feed-product{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:0!important;overflow:hidden!important;border:1px solid #dce3e8!important;border-radius:16px!important;background:#fff!important;color:#152535!important;text-decoration:none!important;box-shadow:0 8px 22px rgba(18,35,45,.11)!important;min-height:0!important;padding:0!important;align-content:start!important}
    .nk-feed-product .nk-feed-product-image{display:flex!important;align-items:center;justify-content:center;width:100%!important;height:180px!important;min-height:0!important;background:#fff!important;padding:14px!important;overflow:hidden!important}
    .nk-feed-product .nk-feed-product-image img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;max-width:100%!important;max-height:100%!important}
    .nk-feed-product .nk-feed-product-info{display:flex!important;flex-direction:column;gap:7px;min-width:0!important;padding:16px 18px 18px!important;overflow-wrap:anywhere!important}
    .nk-feed-product .nk-feed-product-info small{display:block!important;font-size:10px!important;letter-spacing:.07em!important;text-transform:uppercase!important;color:#687782!important;font-weight:800!important}
    .nk-feed-product .nk-feed-product-info strong{display:block!important;min-height:0!important;max-height:none!important;font:800 19px/1.22 Arial,sans-serif!important;color:#122b3a!important}
    .nk-feed-product .nk-feed-product-price{display:flex!important;flex-wrap:wrap;align-items:baseline;gap:8px;font:800 21px/1.2 Arial,sans-serif!important;color:#ad1d27!important}
    .nk-feed-product .nk-feed-product-price em{font:400 11px Arial,sans-serif!important;color:#7a8791!important}
    .nk-feed-product .nk-feed-product-info b{font:800 13px Arial,sans-serif!important;color:#ad1d27!important;margin-top:2px!important}
    .nk-feed-product-wide{grid-template-columns:minmax(125px,34%) minmax(0,1fr)!important;max-width:100%!important}
    .nk-feed-product-wide .nk-feed-product-image{height:200px!important}
    @media(max-width:600px){.nk-feed-product-wide{grid-template-columns:minmax(0,1fr)!important}.nk-feed-product-wide .nk-feed-product-image{height:180px!important}}
  `;
  document.head.appendChild(style);
}

function renderFeedProductCard(item,wide=false){
  const title=escapeHtml(item.title);
  const image=safeHttpUrl(item.banner||item.image||item.wideBanner);
  const link=safeHttpUrl(item.url);
  if(!image||!link)return '';
  const partner=escapeHtml(item.partner||item.partnerKey||'Partnerská nabídka');
  const price=escapeHtml(item.priceLabel||'');
  return `<a class="promo-card nk-feed-product${wide?' nk-feed-product-wide':''}" href="${escapeHtml(link)}" target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label="Reklama: ${title}">
    <span class="nk-feed-product-image"><img src="${escapeHtml(image)}" alt="${title}" loading="lazy" decoding="async"></span>
    <span class="nk-feed-product-info"><small>REKLAMA · ${partner}</small><strong>${title}</strong>
    <span class="nk-feed-product-price">${price}<em>cena dle feedu</em></span><b>Prohlédnout produkt →</b></span>
  </a>`;
}

function renderFeedCard(item){
  if(item.feedProduct)return renderFeedProductCard(item,false);
  const title=escapeHtml(item.title);
  const banner=safeHttpUrl(item.banner||item.image||item.wideBanner);
  if(!banner)return '';
  return `<a class="promo-card promo-card-full-image" href="${escapeHtml(safeHttpUrl(item.url))}" target="_blank" rel="nofollow sponsored noopener noreferrer"><span class="promo-banner"><img src="${escapeHtml(banner)}" alt="${title}" loading="lazy" decoding="async"></span><small>${escapeHtml(item.tag||'Reklama')}</small><strong>${title}</strong><b>Zjistit více →</b></a>`;
}

function renderBannerCard(item){
  if(item.feedProduct)return renderFeedProductCard(item,true);
  const title=escapeHtml(item.title);
  const banner=safeHttpUrl(item.wideBanner||item.banner||item.image);
  if(!banner)return '';
  return `<a class="promo-card promo-card-wide promo-card-full-image" href="${escapeHtml(safeHttpUrl(item.url))}" target="_blank" rel="nofollow sponsored noopener noreferrer"><span class="promo-banner"><img src="${escapeHtml(banner)}" alt="${title}" loading="lazy" decoding="async"></span><span class="promo-wide-copy"><small>${escapeHtml(item.tag||'Reklama')}</small><strong>${title}</strong><b>Zjistit více →</b></span></a>`;
}

function renderPromos(){
  document.querySelectorAll('[data-promos]').forEach((box,index)=>{
    const context=box.dataset.context||'general';
    const layout=box.dataset.layout||(context==='sidebar'?'compact':'feed');
    const isBanner=layout==='banner';
    // NK_ARTICLE_AD_DENSITY_GUARD_20260924: uvnitř článku smí jeden slot vykreslit jen jednu reklamu.
    const requestedCount=box.dataset.count?Number(box.dataset.count):(context==='sidebar'||isBanner?1:3);
    const count=box.closest('article.article')?1:(box.closest('main.article-shell aside.sticky')?Math.min(2,requestedCount):requestedCount);
    let items=pickPromos(context,count,index*5);
    // The guaranteed cleaning banner has its own dedicated placement.
    // Keep these ordinary slots available for the full advertiser rotation.
    const compact=context==='sidebar'?' promo-grid-compact':'';
    const bannerClass=isBanner?' promo-grid-banner':'';
    const cards=items.map(item=>isBanner?renderBannerCard(item):renderFeedCard(item)).join('');
    box.innerHTML=`<div class="promo-label">REKLAMA</div><div class="promo-grid${compact}${bannerClass}">${cards}</div>`;
  });
}

function pickTowerCreative(context,offset=0){
  const expand=item=>Array.from({length:Math.max(1,Number(item.weight)||1)},()=>item);
  const active=towerCreativeItems.filter(isPromoActive).filter(item=>item.runtimeVerified===true);
  const exact=active.filter(item=>item.contexts.includes(context)).flatMap(expand);
  const exactIds=new Set(exact.map(item=>item.id));
  const pool=[...exact,...active.filter(item=>!exactIds.has(item.id)).flatMap(expand)];
  if(!pool.length)return null;
  const day=new Date().toISOString().slice(0,10);
  return pool[(hashSeed(`${location.pathname}|${day}|tower`)+offset)%pool.length];
}

function pickRailPromo(context,offset=0){
  const active=promoItems.filter(isPromoActive).filter(item=>item.runtimeVerified===true);
  const pool=[
    ...active.filter(item=>item.contexts.includes(context)&&item.banner),
    ...active.filter(item=>!item.contexts.includes(context)&&item.banner),
    ...active.filter(item=>item.contexts.includes(context)&&!item.banner),
    ...active.filter(item=>!item.contexts.includes(context)&&!item.banner)
  ].filter((item,index,array)=>array.findIndex(entry=>entry.id===item.id)===index);
  if(!pool.length)return null;
  const day=new Date().toISOString().slice(0,10);
  const start=(hashSeed(`${location.pathname}|${day}|rail`)+offset)%pool.length;
  for(let step=0;step<pool.length;step++){
    const item=pool[(start+step)%pool.length];
    if(!usedPromoIds.has(item.id))return item;
  }
  return pool[start];
}

function renderTowerRailCard(item){
  const title=escapeHtml(item.title);
  return `<a class="article-rail-card article-rail-card-tower" href="${escapeHtml(safeHttpUrl(item.url))}" target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label="Reklama: ${title}"><span class="article-rail-label">Reklama</span><span class="article-rail-tower-picture"><img src="${escapeHtml(safeHttpUrl(item.image))}" width="${Number(item.width)||300}" height="${Number(item.height)||600}" alt="${title}" loading="lazy" decoding="async"></span><span class="article-rail-fallback">${title}</span></a>`;
}

function renderCustomRailCard(item){
  const title=escapeHtml(item.title);
  const banner=safeHttpUrl(item.banner||item.image||item.wideBanner);
  if(!banner)return '';
  return `<a class="article-rail-card article-rail-card-custom article-rail-card-product" href="${escapeHtml(safeHttpUrl(item.url))}" target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label="Reklama: ${title}"><span class="article-rail-label">Reklama</span><span class="article-rail-visual"><img src="${escapeHtml(banner)}" alt="${title}" loading="lazy" decoding="async"></span><span class="article-rail-copy"><small>${escapeHtml(item.tag||'Partnerská nabídka')}</small><strong>${title}</strong><b>${item.feedProduct?escapeHtml(item.priceLabel||'Cena dle feedu'):'Zjistit více →'}</b></span><span class="article-rail-fallback">${title}</span></a>`;
}

function installImageFallbacks(root=document){
  root.querySelectorAll('.article-rail-card img').forEach(image=>{
    image.addEventListener('error',()=>image.closest('.article-rail-card')?.classList.add('is-image-error'),{once:true});
  });
}

function renderArticleSideRails(){
  const shell=document.querySelector('main.article-shell');
  const article=shell?.querySelector('article.article');
  if(!shell||!article||document.querySelector('.article-ad-rail'))return;

  const context=inferPromoContext(`${document.title} ${article.textContent||''}`);
  const featuredTower=towerCreativeItems.find(item=>item.id==='uklizecka-cisteni-tower');
  const tower=featuredTower||pickTowerCreative(context,0);
  const custom=pickRailPromo(context,7);
  if(!tower&&!custom)return;

  const seed=hashSeed(location.pathname+new Date().toISOString().slice(0,10));
  const leftContent=seed%2===0
    ?(tower?renderTowerRailCard(tower):renderCustomRailCard(custom))
    :(custom?renderCustomRailCard(custom):renderTowerRailCard(tower));
  const rightContent=seed%2===0
    ?(custom?renderCustomRailCard(custom):renderTowerRailCard(tower))
    :(tower?renderTowerRailCard(tower):renderCustomRailCard(custom));

  if(custom)usedPromoIds.add(custom.id);

  const left=document.createElement('aside');
  left.className='article-ad-rail article-ad-rail-left';
  left.setAttribute('aria-label','Reklama vlevo od článku');
  left.innerHTML=leftContent;

  const right=document.createElement('aside');
  right.className='article-ad-rail article-ad-rail-right';
  right.setAttribute('aria-label','Reklama vpravo od článku');
  right.innerHTML=rightContent;

  document.body.append(left,right);

  const sticky=shell.querySelector('aside.sticky');
  if(sticky&&tower){
    const inside=document.createElement('div');
    inside.className='article-aside-tower';
    inside.setAttribute('aria-label','Svislá reklama');
    inside.innerHTML=renderTowerRailCard(tower);
    sticky.appendChild(inside);
  }

  installImageFallbacks(document);
}


// Seasonal creatives automatically return to older banners after Christmas.
function nkHoliday2026(){
  const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  return date>='2026-11-03'&&date<='2026-12-24';
}
function installGuaranteedCleaningBanner(){
  if(document.querySelector('.featured-cleaning-ad'))return;
  const item=promoItems.find(entry=>entry.id==='uklizecka-cisteni');
  if(!item)return;
  const section=document.createElement('section');
  section.className='featured-cleaning-ad';
  section.setAttribute('aria-label','Reklama: Čištění koberců, sedaček a čalounění');
  section.innerHTML=`<div class="promo-label">REKLAMA</div><a href="${escapeHtml(safeHttpUrl(item.url))}" target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg" width="1200" height="576" alt="Čištění koberců, sedaček a čalounění – Vaše uklízečka, telefon 603 206 308" decoding="async"></a>`;
  if(nkHoliday2026())section.innerHTML=section.innerHTML.replace('/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg','/vanoce-2026/vaseuklizecka-svatky-2026-wide.svg');
  const article=document.querySelector('article.article');
  if(article){
    const anchor=article.querySelector('.hero-visual')||article.querySelector('.leadtext')||article.querySelector('h1');
    if(anchor){anchor.after(section);return;}
  }
  const homeHero=document.querySelector('main .hero');
  if(homeHero){homeHero.after(section);return;}
  const main=document.querySelector('main');
  if(main)main.prepend(section);
}


/* NK_EHUB_NEW_PARTNERS_20261109_START */
const nkNewPartners20261109=[{"id":"nk-new-darkoviny-20261109","partnerKey":"darkoviny","title":"Dárkoviny.cz","text":"Originální dárky a zábavné nápady na vánoční překvapení. Sortiment a dostupnost ověřte v obchodě.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=3e6ac74c","banner":"https://doc.ehub.cz/b/a68cab54/a5b3caa1.jpeg","wideBanner":"https://doc.ehub.cz/b/a68cab54/133bfcf0.jpeg","tag":"Reklama · dárky","contexts":["home","family","shopping","general","sidebar","local"],"weight":8,"runtimeVerified":true},{"id":"nk-new-svetuklidu-20261109","partnerKey":"svetuklidu","title":"Světúklidu.cz","text":"Čisticí prostředky, úklidová chemie a pomůcky pro domácnosti i firmy.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=83c8d241","banner":"https://cdn.myshoptet.com/usr/www.svetuklidu.cz/user/logos/2_(2)-1.png","wideBanner":"https://cdn.myshoptet.com/usr/www.svetuklidu.cz/user/front_images/ogImage/hp.jpg?t=1794253742","tag":"Reklama · domácnost","contexts":["home","local","health","shopping","general","sidebar"],"weight":7,"runtimeVerified":true},{"id":"nk-new-001shop-20261109","partnerKey":"001shop","title":"001shop.cz","text":"Přírodní vitamíny, doplňky stravy a kosmetika. Informace o konkrétních výrobcích ověřte u prodejce.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=a6e1c113","banner":"https://doc.ehub.cz/b/314e35f8/c35fd819.png","wideBanner":"https://doc.ehub.cz/b/314e35f8/3ec500d1.png","tag":"Reklama · zdraví a kosmetika","contexts":["health","family","shopping","general","sidebar","home"],"weight":7,"runtimeVerified":true},{"id":"nk-new-fanda-nhl-20261109","partnerKey":"fanda-nhl","title":"Fanda-NHL.cz","text":"Fanouškovské dárky a vybavení pro hokejové nadšence. Aktuální nabídku ověřte v obchodě.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e701b5ee","banner":"https://doc.ehub.cz/b/99b11db8/ed157a98.png","wideBanner":"https://doc.ehub.cz/b/99b11db8/3ceca62a.png","tag":"Reklama · sportovní dárky","contexts":["sport","family","shopping","general","sidebar","local"],"weight":8,"runtimeVerified":true},{"id":"nk-new-gengar-20261109","partnerKey":"gengar","title":"Gengar.cz","text":"Pokémon karty a sběratelské produkty. Výběr karet a doplňků pro sběratele i hráče.","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=07e497e9","banner":"https://gengar.s28.cdn-upgates.com/_cache/f/6/f651981b27e9df48a9fac5ca3338c2e1-gengar.webp","wideBanner":"https://gengar.s28.cdn-upgates.com/_cache/f/6/f651981b27e9df48a9fac5ca3338c2e1-gengar.webp","tag":"Reklama · sběratelství","contexts":["family","shopping","general","sidebar","local"],"weight":7,"runtimeVerified":true}];
const nkNewPartnerTowers20261109=[{"id":"nk-new-darkoviny-20261109-tower","partnerKey":"darkoviny","title":"Dárkoviny.cz","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=6237d118","image":"https://doc.ehub.cz/b/a68cab54/6237d118.jpeg","width":300,"height":600,"contexts":["home","family","shopping","general","sidebar"],"weight":6,"runtimeVerified":true},{"id":"nk-new-001shop-20261109-tower","partnerKey":"001shop","title":"001shop.cz","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=8fffe966","image":"https://doc.ehub.cz/b/314e35f8/8fffe966.png","width":300,"height":600,"contexts":["health","family","shopping","general","sidebar"],"weight":6,"runtimeVerified":true},{"id":"nk-new-fanda-nhl-20261109-tower","partnerKey":"fanda-nhl","title":"Fanda-NHL.cz","url":"https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=11e76190","image":"https://doc.ehub.cz/b/99b11db8/11e76190.png","width":300,"height":600,"contexts":["sport","family","shopping","general","sidebar"],"weight":7,"runtimeVerified":true}];
for(const item of nkNewPartners20261109){if(!promoItems.some(old=>old.id===item.id))promoItems.push(item);}
for(const item of nkNewPartnerTowers20261109){if(!towerCreativeItems.some(old=>old.id===item.id))towerCreativeItems.push(item);}
/* NK_EHUB_NEW_PARTNERS_20261109_END */

/* NK_CJ_ACTIVE_ROTATION_20261003_START */
(()=>{
  const current=[
    {id:'cj-axa-assistance-cz',title:'AXA ASSISTANCE',text:'Cestovní pojištění a asistenční služby pro cesty do zahraničí.',url:'https://www.dpbolvw.net/click-101662219-17096103',banner:'https://www.lduhtrp.net/image-101662219-17096103',wideBanner:'https://www.lduhtrp.net/image-101662219-17096103',tag:'Cestovní pojištění',contexts:['travel','auto','family','general','sidebar'],weight:5,runtimeVerified:true},
    {id:'cj-direct-cz',title:'Direct.cz',text:'Online autopojištění od Directu. Aktuální cenu a podmínky ověřte po prokliku.',url:'https://www.anrdoezrs.net/click-101662219-17298766',banner:'https://www.ftjcfx.com/image-101662219-17298766',wideBanner:'https://www.ftjcfx.com/image-101662219-17298766',tag:'Autopojištění',contexts:['auto','finance','general','sidebar'],weight:5,runtimeVerified:true},
    {id:'cj-ergo-cestovni-cz',title:'ERV Evropská / ERGO cestovní',text:'Cestovní pojištění včetně variant pro jednorázové i další typy cest.',url:'https://www.dpbolvw.net/click-101662219-17275687',banner:'https://www.lduhtrp.net/image-101662219-17275687',wideBanner:'https://www.lduhtrp.net/image-101662219-17275687',tag:'Cestovní pojištění',contexts:['travel','family','general','sidebar'],weight:5,runtimeVerified:true},
    {id:'cj-generali-ceska',title:'Generali Česká pojišťovna',text:'Pojištění auta, majetku, odpovědnosti, cestování a dalších rizik.',url:'https://www.tkqlhce.com/click-101662219-17286838',banner:'https://www.lduhtrp.net/image-101662219-17286838',wideBanner:'https://www.lduhtrp.net/image-101662219-17286838',tag:'Pojištění',contexts:['auto','finance','home','travel','pets','general','sidebar'],weight:6,runtimeVerified:true},
    {id:'cj-usetreno-cz',title:'Ušetřeno.cz',text:'Srovnání energií, pojištění, internetu, tarifů a dalších služeb domácnosti.',url:'https://www.tkqlhce.com/click-101662219-17153791',banner:'https://www.tqlkg.com/image-101662219-17153791',wideBanner:'https://www.tqlkg.com/image-101662219-17153791',tag:'Srovnání služeb',contexts:['finance','home','energy','internet','auto','travel','general','sidebar'],weight:6,runtimeVerified:true},
    {id:'cj-eximtours-cz',title:'EXIM tours',text:'Dovolené, last minute a pobytové zájezdy. Aktuální cenu a dostupnost ověřte po prokliku.',url:'https://www.dpbolvw.net/click-101662219-15308473',banner:'https://www.ftjcfx.com/image-101662219-15308473',wideBanner:'https://www.ftjcfx.com/image-101662219-15308473',tag:'Dovolená a zájezdy',contexts:['travel','family','general','sidebar'],weight:6,runtimeVerified:true},
    {id:'cj-fischer-cz',title:'FISCHER',text:'Dovolené u moře, exotika, last minute a rodinné pobyty.',url:'https://www.dpbolvw.net/click-101662219-15042054',banner:'https://www.tqlkg.com/image-101662219-15042054',wideBanner:'https://www.tqlkg.com/image-101662219-15042054',tag:'Dovolená a zájezdy',contexts:['travel','family','general','sidebar'],weight:6,runtimeVerified:true},
    {id:'cj-gearup',title:'GearUP',text:'Online služba zaměřená na optimalizaci připojení pro hraní her.',url:'https://www.jdoqocy.com/click-101662219-17235974',banner:'https://www.tqlkg.com/image-101662219-17235974',wideBanner:'https://www.tqlkg.com/image-101662219-17235974',tag:'Gaming a online služby',contexts:['internet','general','sidebar'],weight:3,runtimeVerified:true}
  ];
  const ids=new Set(promoItems.map(item=>item.id));
  for(const item of current){if(!ids.has(item.id)){promoItems.push(item);ids.add(item.id);}}
})();
/* NK_CJ_ACTIVE_ROTATION_20261003_END */

document.addEventListener('DOMContentLoaded',async()=>{
  ensurePromoStyles();
  if(nkHoliday2026()){
    document.documentElement.classList.add('nk-holiday-marketing');
    const cleaning=promoItems.find(item=>item.id==='uklizecka-cisteni');
    if(cleaning){
      cleaning.title='Domov připravený na kouzelné Vánoce';
      cleaning.text='Čištění koberců, sedaček a čalounění. Objednejte si termín na Kadaňsku včas.';
      cleaning.banner='/vanoce-2026/vaseuklizecka-svatky-2026-square.svg';
      cleaning.wideBanner='/vanoce-2026/vaseuklizecka-svatky-2026-wide.svg';
      cleaning.weight=Math.max(Number(cleaning.weight)||0,18);
    }
    towerCreativeItems.forEach(item=>{
      if(/uklizecka/.test(String(item.id||''))&&/cisteni/.test(String(item.id||'')))
        item.image='/vanoce-2026/vaseuklizecka-svatky-2026-tower.svg';
    });
    if(!document.getElementById('nk-holiday-creative-css')){
      const css=document.createElement('style');css.id='nk-holiday-creative-css';
      css.textContent='html.nk-holiday-marketing .promo-card-full-image,html.nk-holiday-marketing .article-rail-card{border:2px solid #d9ac54!important;box-shadow:0 12px 30px rgba(72,24,33,.22)!important;transition:transform .2s ease,box-shadow .2s ease!important}html.nk-holiday-marketing .promo-card-full-image:hover,html.nk-holiday-marketing .article-rail-card:hover{transform:translateY(-3px)!important;box-shadow:0 17px 38px rgba(92,20,30,.32)!important}html.nk-holiday-marketing .promo-card-full-image:focus-visible,html.nk-holiday-marketing .article-rail-card:focus-visible{outline:3px solid #ffbe48!important;outline-offset:3px!important}@media(prefers-reduced-motion:reduce){html.nk-holiday-marketing .promo-card-full-image,html.nk-holiday-marketing .article-rail-card{transition:none!important;transform:none!important}}';
      document.head.appendChild(css);
    }
  }
  installGuaranteedCleaningBanner();
  await loadAffiliateSnapshot();
  await loadProductFeed();
  if(document.documentElement.dataset.nkDoplnky==='1'){
    document.querySelectorAll('.article-ad-auto,.article-ad-rail,.article-aside-tower,.article-aside-adstream,.featured-cleaning-ad').forEach(node=>node.remove());
    return;
  }
  redistributeArticlePromos();
  renderArticleSideRails();
  renderPromos();
});
/* NK_SPORT_PARTNERS_GUARANTEED_20261111 */
(function(){
  'use strict';
  const BLOCK_ID='nk-sport-partners-guaranteed-20261111';
  const partners=[
    {name:'FotbalTour',caption:'Sportovní zájezdy, zápasy a vstupenky',
      href:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=5ace1024&desturl=https%3A%2F%2Fwww.fotbaltour.cz%2Fdarkove-poukazy%2F',
      image:'/sport-fotbaltour-20261111.svg',mobileImage:'/sport-fotbaltour-mobile-20261112.svg'},
    {name:'FootballTime.cz',caption:'Produkty pro výkon a regeneraci fotbalistů',
      href:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=6fa6d276',
      image:'/sport-footballtime-20261111.svg',mobileImage:'/sport-footballtime-mobile-20261112.svg'},
    {name:'Fanda-NHL.cz',caption:'Dresy a dárky pro hokejové fanoušky',
      href:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=e701b5ee',
      image:'/sport-fanda-nhl-20261111.svg',mobileImage:'/sport-fanda-nhl-mobile-20261112.svg'}
  ];
  function isSportsStory(article){
    const tag=article.querySelector(':scope > .tag,:scope > .category,:scope > .article-meta');
    const label=(tag?.textContent||'')+' '+(document.querySelector('meta[property="article:section"],meta[name="article:section"]')?.content||'');
    if(/sport|hokej|fotbal|florbal|hokejbal|běž|atlet|cyklist|kanoist|gymnast|volejbal|basketbal|tenis|plaván|triatlon|závod|turnaj|olympi|pohár/i.test(label) || /(?:^|[\s·—–(),])běh(?:$|[\s·—–(),])/i.test(label)) return true;
    const data=[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>x.textContent||'').join(' ');
    if(/"articleSection"\s*:\s*"[^"]*(sport|hokej|fotbal|florbal|hokejbal|atlet|cyklist|gymnast)/i.test(data)) return true;
    return /(?:^|[-/])(hokej|hokejbal|fotbal|florbal|panthers|beh|bezecky|cyklistika|sportovni-zavod|spartan)(?:[-/.]|$)/i.test(location.pathname);
  }
  function styleSportPartners(){
    if(document.getElementById(BLOCK_ID+'-css')) return;
    const style=document.createElement('style');
    style.id=BLOCK_ID+'-css';
    style.textContent=[
      '.nk-sport-partners-guaranteed{margin:38px 0 41px;padding:19px 21px 22px;border:1px solid #dbe4e8;border-radius:17px;background:#f7f9fa;clear:both}',
      '.nk-sport-partners-guaranteed .nk-sport-partners-title{font:800 11px/1.5 Arial,sans-serif;letter-spacing:.1em;color:#576b77;text-transform:uppercase;margin:0 0 14px}',
      '.nk-sport-partners-guaranteed .nk-sport-partners-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-card{display:flex;flex-direction:column;min-width:0;overflow:hidden;border:1px solid #d9e2e7;border-radius:12px;background:#fff;color:#192b35!important;text-decoration:none!important;box-shadow:0 6px 15px #152a3510;transition:transform .16s,box-shadow .16s}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-card:hover{transform:translateY(-3px);box-shadow:0 11px 23px #152a3521}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-media{display:block;min-width:0;line-height:0}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-card img{width:100%;height:auto;max-height:125px;aspect-ratio:720/260;object-fit:cover;display:block;background:#193c50}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-copy{display:flex;flex-direction:column;gap:6px;padding:11px 12px 14px;flex:1}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-copy strong{font:800 17px/1.25 Arial,sans-serif}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-copy span{font:400 12px/1.5 Arial,sans-serif;color:#526671}',
      '.nk-sport-partners-guaranteed .nk-sport-partner-copy em{font:800 12px/1.4 Arial,sans-serif;color:#98252b;margin-top:auto;font-style:normal}',
      '@media(max-width:720px){.nk-sport-partners-guaranteed{padding:14px}.nk-sport-partners-guaranteed .nk-sport-partners-grid{grid-template-columns:1fr}.nk-sport-partners-guaranteed .nk-sport-partner-card{flex-direction:row;align-items:stretch}.nk-sport-partners-guaranteed .nk-sport-partner-media{flex:0 0 39%;align-self:stretch;aspect-ratio:1;overflow:hidden}.nk-sport-partners-guaranteed .nk-sport-partner-media img{width:100%;height:100%;max-height:none;aspect-ratio:1;object-fit:cover}.nk-sport-partners-guaranteed .nk-sport-partner-copy{justify-content:center;min-width:0;padding:11px}.nk-sport-partners-guaranteed .nk-sport-partner-copy strong{font-size:16px}}',
      '@media(prefers-reduced-motion:reduce){.nk-sport-partners-guaranteed .nk-sport-partner-card{transition:none}.nk-sport-partners-guaranteed .nk-sport-partner-card:hover{transform:none}}'
    ].join('');
    document.head.appendChild(style);
  }
  function installSportPartners(){
    if(!location.pathname.startsWith('/clanky/')) return;
    const article=document.querySelector('main article.article,article.article');
    if(!article||document.getElementById(BLOCK_ID)||!isSportsStory(article)) return;
    styleSportPartners();
    const block=document.createElement('section');
    block.id=BLOCK_ID;
    block.className='nk-sport-partners-guaranteed';
    block.setAttribute('aria-label','Reklama: doporučujeme od našich sportovních partnerů');
    const caption=document.createElement('div');
    caption.className='nk-sport-partners-title';
    caption.textContent='REKLAMA · DOPORUČUJEME OD NAŠICH PARTNERŮ';
    const grid=document.createElement('div');
    grid.className='nk-sport-partners-grid';
    partners.forEach(item=>{
      const link=document.createElement('a');
      link.className='nk-sport-partner-card';
      link.href=item.href;
      link.target='_blank';
      link.rel='sponsored nofollow noopener noreferrer';
      link.setAttribute('aria-label','Reklama: '+item.name+' – '+item.caption);
      const image=document.createElement('img');
      image.src=item.image;
      image.alt='Reklama '+item.name;
      image.width=720;image.height=260;image.loading='lazy';image.decoding='async';
      const media=document.createElement('picture');
      media.className='nk-sport-partner-media';
      const source=document.createElement('source');
      source.media='(max-width: 720px)';
      source.srcset=item.mobileImage;
      media.append(source,image);
      const content=document.createElement('div');
      content.className='nk-sport-partner-copy';
      const title=document.createElement('strong');title.textContent=item.name;
      const desc=document.createElement('span');desc.textContent=item.caption;
      const more=document.createElement('em');more.textContent='Prohlédnout nabídku →';
      content.append(title,desc,more);
      link.append(media,content);
      grid.appendChild(link);
    });
    block.append(caption,grid);
    const firstHeading=article.querySelector(':scope > h2');
    const after=firstHeading?.nextElementSibling?.matches('p,ul,ol')?firstHeading.nextElementSibling
      :article.querySelector(':scope > .article-figure,:scope > .leadtext,:scope > .lead,:scope > h1');
    if(after)after.after(block);else article.appendChild(block);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installSportPartners,{once:true});
  else installSportPartners();
  window.setTimeout(installSportPartners,1200);
})();
/* NK_SPORT_PARTNERS_GUARANTEED_20261111_END */

/* NK_APPROVED_CHRISTMAS_CLEANING_LOADER_20261113 */
(function(){
  if(document.querySelector('script[data-nk-approved-christmas-cleaning]'))return;
  const script=document.createElement('script');
  script.src='/predvanocni-cisteni-20261113.js?v=20261114-original-rotation-v4';
  script.dataset.nkApprovedChristmasCleaning='1';
  script.defer=true;
  document.head.appendChild(script);
})();
/* NK_APPROVED_CHRISTMAS_CLEANING_LOADER_20261113_END */


/* NK_SHAPEHELM_PROPRIETARY_CAMPAIGN_20261114
   Native internal ads for Shapehelm browser CAD + 3D printing + laser cutting.
   Keep independently rotatable and clearly labeled; no affiliate tracking.
*/
(function(){
  const base='/shapehelm-reklamy-20261114/';
  const campaigns=[
    {id:'shapehelm-cad-nov2026',title:'Shapehelm – 3D CAD online',text:'3D CAD přímo v prohlížeči. Modelujte parametrické součástky a sestavy.',banner:base+'shapehelm-gif-300x250.gif',wideBanner:base+'shapehelm-cad-1200x400.webp',image:base+'shapehelm-cad-300x250.webp',contexts:['general','home','local','sidebar','tech','business','shopping'],weight:13},
    {id:'shapehelm-tisk-nov2026',title:'Shapehelm – 3D tisk na zakázku',text:'Od 3D návrhu k fyzickému výrobku. Výroba součástek a modelů na zakázku.',banner:base+'shapehelm-tisk-300x250.webp',wideBanner:base+'shapehelm-tisk-1200x400.webp',image:base+'shapehelm-tisk-300x250.webp',contexts:['general','home','local','sidebar','tech','business'],weight:12},
    {id:'shapehelm-laser-nov2026',title:'Shapehelm – laserové řezání a 3D skenování',text:'Výroba na míru, laserové řezání a 3D skenování.',banner:base+'shapehelm-laser-300x250.webp',wideBanner:base+'shapehelm-laser-1200x400.webp',image:base+'shapehelm-laser-300x250.webp',contexts:['general','home','local','sidebar','tech','business'],weight:11}
  ];
  campaigns.forEach(item=>{
    if(!promoItems.some(old=>old.id===item.id)){
      promoItems.push({...item,url:'https://shapehelm.com/?utm_source=nasekadan.cz&utm_medium=display&utm_campaign=shapehelm_20261114',tag:'REKLAMA · naše služba',partnerKey:'shapehelm',runtimeVerified:true,fullBleed:true,imageRequired:true});
    }
  });
  const towers=[
    {id:'shapehelm-gif-tower-nov2026',title:'Shapehelm – návrh a výroba',image:base+'shapehelm-gif-300x600.gif',weight:7},
    {id:'shapehelm-cad-tower-nov2026',title:'Shapehelm – 3D CAD online',image:base+'shapehelm-cad-300x600.webp',weight:5},
    {id:'shapehelm-tisk-tower-nov2026',title:'Shapehelm – 3D tisk na zakázku',image:base+'shapehelm-tisk-300x600.webp',weight:5},
    {id:'shapehelm-laser-tower-nov2026',title:'Shapehelm – laserové řezání',image:base+'shapehelm-laser-300x600.webp',weight:4}
  ];
  towers.forEach(t=>{
    if(!towerCreativeItems.some(old=>old.id===t.id)){
      towerCreativeItems.push({...t,url:'https://shapehelm.com/?utm_source=nasekadan.cz&utm_medium=display&utm_campaign=shapehelm_20261114',width:300,height:600,contexts:['home','local','general','sidebar','tech','business'],partnerKey:'shapehelm',runtimeVerified:true});
    }
  });
})();
/* NK_SHAPEHELM_PROPRIETARY_CAMPAIGN_20261114_END */
