(()=>{
  'use strict';

  const VERSION='20260920-owned-services-ad-integrity-1';
  // NK_AD_FEATURED_INTEGRITY_GUARD_20260920: replace expired/unverified featured ads and reveal copy if a generated visual masks it.
  const LEVNE_URL='https://levnevyklidime.cz/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50';
  const UKLID_URL='https://vaseuklizecka.cz/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50';
  const CISTENI_URL='https://www.vaseuklizecka.cz/sluzby/cisteni-kobercu-a-calouneni/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50';
  const VYKLIDIME_URL='https://vyklidime.to/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50';
  const REALITY_URL='https://realitykadan.cz/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50';

  const PRIORITY_MAIN_IDS=new Set([
    'owned-levnevyklidime',
    'owned-vaseuklizecka',
    'uklizecka-cisteni',
    'uklizecka-cisteni-rotating',
    'owned-vyklidime-banner',
    'owned-realitykadan-banner',
    'realitykadan-byt',
    'realitykadan-garaz'
  ]);
  const PRIORITY_TOWER_IDS=new Set([
    'owned-levnevyklidime-tower',
    'owned-vaseuklizecka-tower',
    'uklizecka-cisteni-tower',
    'uklizecka-cisteni-tower-rotating',
    'owned-vyklidime-banner-tower',
    'owned-realitykadan-banner-tower'
  ]);

  function normalized(value){
    return String(value||'')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function hash(value){
    return [...String(value)].reduce((sum,char)=>((sum*31)+char.charCodeAt(0))>>>0,0);
  }

  function day(){
    return new Date().toISOString().slice(0,10);
  }

  function isActive(item){
    const today=day();
    if(item?.validFrom&&today<item.validFrom)return false;
    if(item?.validTo&&today>item.validTo)return false;
    return true;
  }

  function itemId(item){
    return normalized(item?.id||item?.title);
  }

  function isPriorityMain(item){
    return PRIORITY_MAIN_IDS.has(itemId(item));
  }

  function isPriorityTower(item){
    return PRIORITY_TOWER_IDS.has(itemId(item));
  }

  function upsert(list,id,item){
    const existing=list.find(row=>itemId(row)===id);
    if(existing)Object.assign(existing,item);
    else list.unshift(item);
  }

  function installPriorityCreatives(){
    try{
      if(typeof promoItems!=='undefined'&&Array.isArray(promoItems)){
        upsert(promoItems,'owned-levnevyklidime',{
          id:'owned-levnevyklidime',
          title:'LevneVyklidime.cz',
          text:'Vyklízení bytů, domů, sklepů a pozůstalostí. Také stěhování, převoz materiálu a odvoz na sběrný dvůr.',
          url:`${LEVNE_URL}&utm_content=rotation`,
          banner:'/levnevyklidime-square.svg',
          wideBanner:'/levnevyklidime-wide.svg',
          tag:'Vyklízení a odvoz',
          contexts:['local','home','sidebar','general'],
          weight:1,
          fullBleed:true,
          runtimeVerified:true
        });
        upsert(promoItems,'owned-vaseuklizecka',{
          id:'owned-vaseuklizecka',
          title:'VašeUklízečka.cz',
          text:'Úklid domácností, firem, kanceláří a bytových domů na Kadaňsku.',
          url:`${UKLID_URL}&utm_content=rotation`,
          banner:'/assets/reklamy/owned-vaseuklizecka-square.svg',
          wideBanner:'/assets/reklamy/owned-vaseuklizecka-wide.svg',
          tag:'Úklidové služby',
          contexts:['local','home','sidebar','general','health'],
          weight:1,
          fullBleed:true,
          runtimeVerified:true
        });
        const cleaningExisting=promoItems.find(row=>['uklizecka-cisteni','uklizecka-cisteni-rotating'].includes(itemId(row)));
        const cleaning={
          id:cleaningExisting?.id||'uklizecka-cisteni',
          title:'Čištění koberců, sedaček a čalounění',
          text:'Hloubkové čištění koberců, sedaček a čalounění na Kadaňsku. Objednávky: 603 206 308.',
          url:`${CISTENI_URL}&utm_content=rotation`,
          banner:'/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg',
          wideBanner:'/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg',
          tag:'Čištění koberců a čalounění',
          contexts:['local','home','sidebar','general','health'],
          weight:1,
          fullBleed:true,
          runtimeVerified:true
        };
        if(cleaningExisting)Object.assign(cleaningExisting,cleaning);
        else promoItems.unshift(cleaning);
        upsert(promoItems,'owned-vyklidime-banner',{
          id:'owned-vyklidime-banner',
          title:'VYKLIDIME.TO',
          text:'Vyklízení bytů, domů, sklepů a pozůstalostí. Odnos, odvoz i úklid.',
          url:`${VYKLIDIME_URL}&utm_content=rotation`,
          banner:'/assets/reklamy/owned-vyklidime-banner-square.svg',
          wideBanner:'/assets/reklamy/owned-vyklidime-banner-wide.svg',
          tag:'Vyklízení',
          contexts:['local','home','sidebar','general'],
          weight:1,
          fullBleed:true,
          runtimeVerified:true
        });
        upsert(promoItems,'owned-realitykadan-banner',{
          id:'owned-realitykadan-banner',
          title:'RealityKadan.cz',
          text:'Prodej bytů, domů, garáží a pozemků v Kadani a okolí. Rychlá a nezávazná nabídka.',
          url:`${REALITY_URL}&utm_content=rotation`,
          banner:'/assets/reklamy/owned-realitykadan-banner-square.svg',
          wideBanner:'/assets/reklamy/owned-realitykadan-banner-wide.svg',
          tag:'Reality v Kadani',
          contexts:['local','home','sidebar','general','finance'],
          weight:1,
          fullBleed:true,
          runtimeVerified:true
        });
      }

      if(typeof towerCreativeItems!=='undefined'&&Array.isArray(towerCreativeItems)){
        upsert(towerCreativeItems,'owned-levnevyklidime-tower',{
          id:'owned-levnevyklidime-tower',title:'LevneVyklidime.cz',url:`${LEVNE_URL}&utm_content=sidebar-tower`,
          image:'/levnevyklidime-tower.svg',width:300,height:600,contexts:['local','home','sidebar','general'],weight:1,runtimeVerified:true
        });
        upsert(towerCreativeItems,'owned-vaseuklizecka-tower',{
          id:'owned-vaseuklizecka-tower',title:'VašeUklízečka.cz',url:`${UKLID_URL}&utm_content=sidebar-tower`,
          image:'/assets/reklamy/owned-vaseuklizecka-tower.svg',width:300,height:600,contexts:['local','home','sidebar','general','health'],weight:1,runtimeVerified:true
        });
        const cleaningTowerExisting=towerCreativeItems.find(row=>['uklizecka-cisteni-tower','uklizecka-cisteni-tower-rotating'].includes(itemId(row)));
        const cleaningTower={
          id:cleaningTowerExisting?.id||'uklizecka-cisteni-tower',title:'Čištění koberců, sedaček a čalounění',
          url:`${CISTENI_URL}&utm_content=sidebar-tower`,image:'/assets/reklamy/vaseuklizecka-cisteni-yellow-tower-160x237.webp',
          width:300,height:600,contexts:['local','home','sidebar','general','health'],weight:1,runtimeVerified:true
        };
        if(cleaningTowerExisting)Object.assign(cleaningTowerExisting,cleaningTower);
        else towerCreativeItems.unshift(cleaningTower);
        upsert(towerCreativeItems,'owned-vyklidime-banner-tower',{
          id:'owned-vyklidime-banner-tower',title:'VYKLIDIME.TO',url:`${VYKLIDIME_URL}&utm_content=sidebar-tower`,
          image:'/assets/reklamy/owned-vyklidime-banner-tower.svg',width:300,height:600,contexts:['local','home','sidebar','general'],weight:1,runtimeVerified:true
        });
        upsert(towerCreativeItems,'owned-realitykadan-banner-tower',{
          id:'owned-realitykadan-banner-tower',title:'RealityKadan.cz',url:`${REALITY_URL}&utm_content=sidebar-tower`,
          image:'/assets/reklamy/realitykadan-300x600.svg',width:300,height:600,contexts:['local','home','sidebar','general','finance'],weight:1,runtimeVerified:true
        });
      }

      document.documentElement.dataset.ownedAds5050=VERSION;
    }catch(error){
      console.warn('Prioritní vlastní reklamy se nepodařilo připravit.',error);
    }
  }

  function activeVerified(list,priorityTest){
    return list.filter(item=>isActive(item)&&(item?.runtimeVerified===true||priorityTest(item)));
  }

  function weightedByContext(list,context){
    const exact=[];
    const fallback=[];
    for(const item of list){
      const target=Array.isArray(item.contexts)&&item.contexts.includes(context)?exact:fallback;
      const weight=Math.max(1,Number(item.weight)||1);
      for(let i=0;i<weight;i++)target.push(item);
    }
    return [...exact,...fallback];
  }

  function uniqueRotated(list,seed){
    if(!list.length)return [];
    const shift=seed%list.length;
    const rotated=[...list.slice(shift),...list.slice(0,shift)];
    const seen=new Set();
    const unique=[];
    for(const item of rotated){
      const id=itemId(item);
      if(!id||seen.has(id))continue;
      seen.add(id);
      unique.push(item);
    }
    try{
      if(typeof usedPromoIds!=='undefined'&&usedPromoIds?.has){
        return [...unique.filter(item=>!usedPromoIds.has(item.id)),...unique.filter(item=>usedPromoIds.has(item.id))];
      }
    }catch{}
    return unique;
  }

  function markUsed(items){
    try{
      if(typeof usedPromoIds!=='undefined'&&usedPromoIds?.add)items.forEach(item=>usedPromoIds.add(item.id));
    }catch{}
  }

  function priorityFirst(context,offset){
    return ((hash(`${location.pathname}|${day()}|${context}`)+(Number(offset)||0))&1)===0;
  }

  function pickFromPool(pool,count,context,salt){
    return uniqueRotated(weightedByContext(pool,context),hash(`${location.pathname}|${day()}|${context}|${salt}`)).slice(0,count);
  }

  function balancedPromos(context,count,offset){
    if(typeof promoItems==='undefined'||!Array.isArray(promoItems)||count<=0)return [];
    installPriorityCreatives();
    const active=activeVerified(promoItems,isPriorityMain);
    const own=active.filter(isPriorityMain);
    const other=active.filter(item=>!isPriorityMain(item));
    if(!own.length||!other.length)return pickFromPool(active,count,context,`fallback-${offset}`);

    const firstOwn=priorityFirst(context,offset);
    const ownTarget=Math.floor(count/2)+((count%2&&firstOwn)?1:0);
    const otherTarget=count-ownTarget;
    const ownPicked=pickFromPool(own,ownTarget,context,`own-${offset}`);
    const otherPicked=pickFromPool(other,otherTarget,context,`other-${offset}`);

    const result=[];
    let oi=0;
    let xi=0;
    for(let i=0;i<count;i++){
      const wantOwn=((i+(firstOwn?0:1))%2)===0;
      const preferred=wantOwn?ownPicked[oi++]:otherPicked[xi++];
      const fallback=wantOwn?otherPicked[xi++]:ownPicked[oi++];
      if(preferred)result.push(preferred);
      else if(fallback)result.push(fallback);
    }

    if(result.length<count){
      const fill=pickFromPool(active,count,context,`fill-${offset}`);
      for(const item of fill){
        if(result.some(row=>itemId(row)===itemId(item)))continue;
        result.push(item);
        if(result.length===count)break;
      }
    }
    markUsed(result);
    return result.slice(0,count);
  }

  function balancedSingle(list,priorityTest,context,offset,salt){
    installPriorityCreatives();
    const active=activeVerified(list,priorityTest);
    const own=active.filter(priorityTest);
    const other=active.filter(item=>!priorityTest(item));
    const preferred=priorityFirst(context,offset)?own:other;
    const fallback=priorityFirst(context,offset)?other:own;
    const picked=pickFromPool(preferred,1,context,`${salt}-preferred-${offset}`)[0]||pickFromPool(fallback,1,context,`${salt}-fallback-${offset}`)[0]||null;
    if(picked&&list===promoItems)markUsed([picked]);
    return picked;
  }

  function patchSelectionEngines(){
    try{
      if(typeof pickPromos==='function'&&!pickPromos.__ownedServices5050){
        const balanced=function(context,count,offset){return balancedPromos(context,Number(count)||0,Number(offset)||0);};
        balanced.__ownedServices5050=true;
        pickPromos=balanced;
      }
      if(typeof pickTowerCreative==='function'&&!pickTowerCreative.__ownedServices5050){
        const balancedTower=function(context,offset=0){
          if(typeof towerCreativeItems==='undefined'||!Array.isArray(towerCreativeItems))return null;
          return balancedSingle(towerCreativeItems,isPriorityTower,context,Number(offset)||0,'tower');
        };
        balancedTower.__ownedServices5050=true;
        pickTowerCreative=balancedTower;
      }
      if(typeof pickRailPromo==='function'&&!pickRailPromo.__ownedServices5050){
        const balancedRail=function(context,offset=0){
          if(typeof promoItems==='undefined'||!Array.isArray(promoItems))return null;
          const available=promoItems.filter(item=>item?.banner||item?.wideBanner);
          return balancedSingle(available,isPriorityMain,context,Number(offset)||0,'rail');
        };
        balancedRail.__ownedServices5050=true;
        pickRailPromo=balancedRail;
      }
    }catch(error){
      console.warn('Poměr reklam 50/50 se nepodařilo zapnout.',error);
    }
  }

  function itemForCard(card){
    if(typeof promoItems==='undefined'||!Array.isArray(promoItems)||!(card instanceof Element))return null;
    const href=card.getAttribute('href')||'';
    let key='';
    try{key=new URL(href,location.href).href.replace(/\/$/,'');}catch{}
    return promoItems.find(item=>{
      try{return new URL(item?.url||'',location.href).href.replace(/\/$/,'')===key;}catch{return false;}
    })||null;
  }

  function repairFeaturedAndGenerated(){
    try{
      document.querySelectorAll('.nk-ad-generated-visual').forEach(visual=>{
        const card=visual.closest('.promo-card,.article-rail-card');
        if(!card)return;
        visual.style.setProperty('display','none','important');
        card.classList.remove('promo-card-full-image','nk-ad-generated-card');
        const copy=card.querySelector('.promo-wide-copy,.article-rail-copy,.nk-ad-safe-copy');
        if(copy){
          copy.style.setProperty('display','flex','important');
          copy.style.setProperty('visibility','visible','important');
          copy.style.setProperty('opacity','1','important');
        }
      });

      document.querySelectorAll('.featured-rotating-ad').forEach(section=>{
        const card=section.querySelector('a.promo-card,a');
        if(!card)return;
        const item=itemForCard(card);
        const valid=item&&isActive(item)&&(item.runtimeVerified===true||isPriorityMain(item));
        if(valid)return;
        const replacement=balancedPromos(section.closest('article')?'general':'home',1,97)[0];
        if(replacement&&typeof renderBannerCard==='function'){
          section.innerHTML='<div class="promo-label">REKLAMA</div>'+renderBannerCard(replacement);
          section.dataset.nkAdIntegrityReplaced='20260920';
        }else{
          section.remove();
        }
      });
    }catch(error){
      console.warn('Ad integrity guard selhal.',error);
    }
  }

  function rerender(){
    installPriorityCreatives();
    patchSelectionEngines();
    try{if(typeof renderPromos==='function')renderPromos();}catch(error){console.warn('50/50: renderPromos selhal.',error);}
    try{if(typeof renderArticleSideRails==='function')renderArticleSideRails();}catch(error){console.warn('50/50: renderArticleSideRails selhal.',error);}
    repairFeaturedAndGenerated();
  }

  installPriorityCreatives();
  patchSelectionEngines();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(rerender,60),{once:true});
  else setTimeout(rerender,60);
  setTimeout(rerender,120);
  setTimeout(rerender,800);
  setTimeout(rerender,1800);
  setTimeout(repairFeaturedAndGenerated,3200);
  if(document.documentElement){
    let integrityTimer=0;
    new MutationObserver(()=>{
      clearTimeout(integrityTimer);
      integrityTimer=setTimeout(repairFeaturedAndGenerated,40);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }
})();
