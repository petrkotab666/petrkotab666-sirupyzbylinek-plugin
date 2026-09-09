// NK_AD_RUNTIME_EMERGENCY_20260909_V1
// Naše Kadaň: globální reklamní pojistka bez prázdných gradientů a blokovaných partnerů.
(()=>{
  'use strict';

  const CARD_SELECTOR=[
    'a.promo-card',
    'a.article-rail-card',
    '.featured-cleaning-ad a',
    '.featured-rotating-ad a',
    '.nk-home-lms a',
    '[data-home-lastminuteslevy] a',
    '[data-promos] a',
    '.promo-wrap a',
    '.article-aside-adstream a',
    'a.nk-season-card'
  ].join(',');

  const BLOCKED=[
    {
      re:/apollostore|a883bbdd/i,
      title:'ProAlergiky.cz – zdravější vzduch doma',
      text:'Čističky vzduchu, odvlhčování a další vybavení pro příjemnější prostředí v domácnosti.',
      tag:'DOMÁCNOST · ZDRAVĚJŠÍ VZDUCH',
      url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=abc25217&data1=nasekadan&data2=runtime-replacement',
      target:'proalergiky.cz'
    },
    {
      re:/excursia|76c9b39c/i,
      title:'České Kormidlo – zájezdy a pobyty',
      text:'Aktuální pobytové, poznávací a last minute zájezdy od aktivního affiliate partnera.',
      tag:'CESTOVÁNÍ · ZÁJEZDY',
      url:'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=b880f187&data1=nasekadan&data2=runtime-replacement',
      target:'ceskekormidlo.cz'
    }
  ];

  const cardKey=card=>`${card.getAttribute('href')||''} ${card.getAttribute('aria-label')||''} ${card.textContent||''}`.toLowerCase();
  const itemKey=item=>`${item?.id||''} ${item?.title||''} ${item?.name||''} ${item?.url||''} ${item?.defaultLinkId||''}`.toLowerCase();
  const blockedFor=value=>BLOCKED.find(x=>x.re.test(typeof value==='string'?value:itemKey(value)))||null;

  function sanitizeArrays(){
    try{
      if(typeof promoItems!=='undefined'&&Array.isArray(promoItems)){
        for(let i=promoItems.length-1;i>=0;i--)if(blockedFor(promoItems[i]))promoItems.splice(i,1);
      }
    }catch(_){}
    try{
      if(typeof towerCreativeItems!=='undefined'&&Array.isArray(towerCreativeItems)){
        for(let i=towerCreativeItems.length-1;i>=0;i--)if(blockedFor(towerCreativeItems[i]))towerCreativeItems.splice(i,1);
      }
    }catch(_){}
  }

  function titleOf(card){
    const node=card.querySelector('.promo-wide-copy strong,.nk-ad-safe-copy strong,.article-rail-copy strong,.article-rail-fallback,.nk-season-copy strong,h3,.ad-title,strong');
    const text=String(node?.textContent||'').replace(/\s+/g,' ').trim();
    if(text&&!/^reklama$/i.test(text))return text;
    const aria=String(card.getAttribute('aria-label')||'').replace(/^reklama:\s*/i,'').trim();
    if(aria)return aria;
    try{return new URL(card.getAttribute('href')||'',location.href).hostname.replace(/^www\./,'')||'Nabídka partnera';}catch(_){return 'Nabídka partnera';}
  }

  function hideGraphic(card){
    card.classList.add('nk-ad-safe-runtime-fallback');
    card.classList.remove('promo-card-full-image','is-image-error');
    card.querySelectorAll('.nk-ad-generated-visual,.promo-banner,.promo-banner-fallback,.article-rail-visual,.article-rail-tower-picture,.article-rail-product-picture,.ad-visual').forEach(node=>{
      node.style.setProperty('display','none','important');
      node.style.setProperty('height','0','important');
      node.style.setProperty('min-height','0','important');
      node.setAttribute('aria-hidden','true');
    });
    card.querySelectorAll('img').forEach(img=>{
      img.style.setProperty('display','none','important');
      img.setAttribute('aria-hidden','true');
    });
  }

  function ensureWideCopy(card,data){
    let copy=card.querySelector('.promo-wide-copy,.nk-ad-safe-copy');
    if(!copy){copy=document.createElement('span');copy.className='nk-ad-safe-copy';card.appendChild(copy);}
    let tag=copy.querySelector('small');if(!tag){tag=document.createElement('small');copy.prepend(tag);}
    let title=copy.querySelector('strong');if(!title){title=document.createElement('strong');tag.after(title);}
    let desc=copy.querySelector('.promo-description');if(!desc){desc=document.createElement('span');desc.className='promo-description';title.after(desc);}
    let cta=copy.querySelector('b');if(!cta){cta=document.createElement('b');copy.appendChild(cta);}
    tag.textContent=data?.tag||'REKLAMA';
    title.textContent=data?.title||titleOf(card);
    desc.textContent=data?.text||'Aktuální nabídku a podmínky najdete po kliknutí u partnera.';
    cta.textContent='Zjistit více →';
  }

  function ensureRailCopy(card,data){
    let copy=card.querySelector('.article-rail-copy');
    if(!copy){copy=document.createElement('span');copy.className='article-rail-copy';card.appendChild(copy);}
    let tag=copy.querySelector('small');if(!tag){tag=document.createElement('small');copy.prepend(tag);}
    let title=copy.querySelector('strong,h3');if(!title){title=document.createElement('strong');copy.appendChild(title);}
    let desc=copy.querySelector('.article-rail-description,.promo-description');if(!desc){desc=document.createElement('span');desc.className='article-rail-description';copy.appendChild(desc);}
    let cta=copy.querySelector('b');if(!cta){cta=document.createElement('b');copy.appendChild(cta);}
    tag.textContent=data?.tag||'REKLAMA';
    title.textContent=data?.title||titleOf(card);
    desc.textContent=data?.text||'Aktuální nabídku a podmínky najdete po kliknutí u partnera.';
    cta.textContent='Zjistit více →';
    card.querySelectorAll('.article-rail-fallback').forEach(node=>node.remove());
  }

  function replaceSeasonal(card,data){
    card.href=data.url;
    card.setAttribute('data-final-target',data.target);
    card.setAttribute('aria-label',`Reklama: ${data.title}`);
    const visual=card.querySelector('.nk-season-image');
    if(visual){visual.innerHTML='🍃';visual.style.fontSize='48px';}
    const copy=card.querySelector('.nk-season-copy');
    if(copy){
      const tag=copy.querySelector('small');if(tag)tag.textContent=data.tag;
      const title=copy.querySelector('strong');if(title)title.textContent=data.title;
      const desc=copy.querySelector('span:not(.nk-season-target)');if(desc)desc.textContent=data.text;
      const target=copy.querySelector('.nk-season-target');if(target)target.textContent=`Cíl: ${data.target}`;
      const cta=copy.querySelector('b');if(cta)cta.textContent='Prohlédnout nabídku →';
    }
    card.dataset.nkAdBlockedReplaced='1';
  }

  function toText(card,data=null){
    if(card.classList.contains('nk-season-card')){
      if(data)replaceSeasonal(card,data);
      return;
    }
    hideGraphic(card);
    if(data){
      card.href=data.url;
      card.setAttribute('data-final-target',data.target);
      card.setAttribute('aria-label',`Reklama: ${data.title}`);
    }
    if(card.classList.contains('article-rail-card'))ensureRailCopy(card,data);
    else ensureWideCopy(card,data);
  }

  function repair(card){
    if(!(card instanceof Element))return;
    const replacement=blockedFor(cardKey(card));
    if(replacement){toText(card,replacement);return;}

    if(card.classList.contains('nk-ad-generated-card')||card.classList.contains('is-image-error')||card.querySelector('.nk-ad-generated-visual,.promo-banner-fallback')){
      toText(card);return;
    }

    const imgs=Array.from(card.querySelectorAll('img'));
    for(const img of imgs){
      const fail=()=>toText(card);
      if(img.complete&&(!img.naturalWidth||!img.naturalHeight)){fail();return;}
      if(!img.dataset.nkRuntimeFallbackWatch){
        img.dataset.nkRuntimeFallbackWatch='1';
        img.addEventListener('error',fail,{once:true});
        setTimeout(()=>{if(img.complete&&(!img.naturalWidth||!img.naturalHeight))fail();},1200);
      }
    }
  }

  function scan(root=document){
    sanitizeArrays();
    const scope=root&&root.querySelectorAll?root:document;
    if(scope.matches&&scope.matches(CARD_SELECTOR))repair(scope);
    scope.querySelectorAll(CARD_SELECTOR).forEach(repair);
  }

  function style(){
    if(document.getElementById('nk-ad-runtime-emergency-style'))return;
    const s=document.createElement('style');s.id='nk-ad-runtime-emergency-style';s.textContent=`
      html body a.nk-ad-safe-runtime-fallback{display:block!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:auto!important;overflow:hidden!important;background:#fff!important;border:1px solid #d9e1e5!important;border-radius:18px!important;box-shadow:0 10px 28px rgba(18,35,45,.10)!important;color:#17242d!important;text-decoration:none!important}
      html body a.nk-ad-safe-runtime-fallback .promo-banner,html body a.nk-ad-safe-runtime-fallback .promo-banner-fallback,html body a.nk-ad-safe-runtime-fallback .article-rail-visual,html body a.nk-ad-safe-runtime-fallback .article-rail-tower-picture,html body a.nk-ad-safe-runtime-fallback .article-rail-product-picture,html body a.nk-ad-safe-runtime-fallback .ad-visual,html body a.nk-ad-safe-runtime-fallback .nk-ad-generated-visual{display:none!important;height:0!important;min-height:0!important;max-height:0!important}
      html body a.nk-ad-safe-runtime-fallback .promo-wide-copy,html body a.nk-ad-safe-runtime-fallback .nk-ad-safe-copy,html body a.nk-ad-safe-runtime-fallback .article-rail-copy{display:flex!important;visibility:visible!important;opacity:1!important;flex-direction:column!important;align-items:flex-start!important;gap:7px!important;height:auto!important;min-height:0!important;padding:20px 24px!important;box-sizing:border-box!important;background:#fff!important;color:#17242d!important;text-align:left!important}
      html body a.nk-ad-safe-runtime-fallback small{display:block!important;color:#6c7780!important;font-size:11px!important;font-weight:900!important;letter-spacing:.07em!important;text-transform:uppercase!important}
      html body a.nk-ad-safe-runtime-fallback strong,html body a.nk-ad-safe-runtime-fallback h3{display:block!important;margin:0!important;color:#17242d!important;font:900 23px/1.18 Georgia,serif!important}
      html body a.nk-ad-safe-runtime-fallback .promo-description,html body a.nk-ad-safe-runtime-fallback .article-rail-description{display:block!important;color:#52616a!important;font-size:15px!important;line-height:1.45!important}
      html body a.nk-ad-safe-runtime-fallback b{display:inline-block!important;margin-top:3px!important;padding:8px 12px!important;border-radius:999px!important;background:#9f2626!important;color:#fff!important;font-size:13px!important;line-height:1.2!important}
      @media(max-width:700px){html body a.nk-ad-safe-runtime-fallback .promo-wide-copy,html body a.nk-ad-safe-runtime-fallback .nk-ad-safe-copy,html body a.nk-ad-safe-runtime-fallback .article-rail-copy{padding:17px 18px!important}html body a.nk-ad-safe-runtime-fallback strong,html body a.nk-ad-safe-runtime-fallback h3{font-size:20px!important}}
    `;(document.head||document.documentElement).appendChild(s);
  }

  function start(){
    style();scan();
    if(document.documentElement)new MutationObserver(mutations=>{
      for(const m of mutations){
        if(m.type==='attributes'&&m.target instanceof Element)repair(m.target);
        for(const node of m.addedNodes)if(node instanceof Element)scan(node);
      }
    }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','href']});
    [100,300,700,1500,3000,5000].forEach(ms=>setTimeout(()=>scan(),ms));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
