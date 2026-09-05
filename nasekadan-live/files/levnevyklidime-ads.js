// NK-BRIDGE-LIVE 20260905-owned-ads-5050-live-v2
(()=>{
  'use strict';
  const LIVE='20260905-owned-ads-5050-live-v2';
  const U={
    levne:'https://levnevyklidime.cz/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50',
    uklid:'https://vaseuklizecka.cz/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50',
    cisteni:'https://www.vaseuklizecka.cz/sluzby/cisteni-kobercu-a-calouneni/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50',
    vyklidime:'https://vyklidime.to/?utm_source=nasekadan&utm_medium=display&utm_campaign=owned_services_50_50'
  };
  const N=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const H=v=>[...String(v)].reduce((s,c)=>((s*31)+c.charCodeAt(0))>>>0,0);
  const D=()=>new Date().toISOString().slice(0,10);
  const ID=x=>N(x?.id||x?.title);
  const ACTIVE=x=>!(x?.validFrom&&D()<x.validFrom)&&!(x?.validTo&&D()>x.validTo);
  const OWN=x=>{
    const id=ID(x),url=String(x?.url||'').toLowerCase();
    return ['owned-levnevyklidime','owned-vaseuklizecka','uklizecka-cisteni','uklizecka-cisteni-rotating','owned-vyklidime-banner',
      'owned-levnevyklidime-tower','owned-vaseuklizecka-tower','uklizecka-cisteni-tower','uklizecka-cisteni-tower-rotating','owned-vyklidime-banner-tower'].includes(id)
      ||url.includes('levnevyklidime.cz')||url.includes('vaseuklizecka.cz')||url.includes('vyklidime.to');
  };
  const UPSERT=(a,id,x)=>{
    const old=a.find(v=>ID(v)===id);
    if(old)Object.assign(old,x);else a.unshift(x);
  };
  function install(){
    try{
      if(typeof promoItems!=='undefined'&&Array.isArray(promoItems)){
        UPSERT(promoItems,'owned-levnevyklidime',{id:'owned-levnevyklidime',title:'LevneVyklidime.cz',text:'Vyklízení bytů, domů, sklepů a pozůstalostí. Také stěhování, převoz materiálu a odvoz na sběrný dvůr.',url:U.levne+'&utm_content=rotation',banner:'/levnevyklidime-square.svg',wideBanner:'/levnevyklidime-wide.svg',tag:'Vyklízení a odvoz',contexts:['local','home','sidebar','general'],weight:1,fullBleed:true,runtimeVerified:true});
        UPSERT(promoItems,'owned-vaseuklizecka',{id:'owned-vaseuklizecka',title:'VašeUklízečka.cz',text:'Úklid domácností, firem, kanceláří a bytových domů na Kadaňsku.',url:U.uklid+'&utm_content=rotation',banner:'/assets/reklamy/owned-vaseuklizecka-square.svg',wideBanner:'/assets/reklamy/owned-vaseuklizecka-wide.svg',tag:'Úklidové služby',contexts:['local','home','sidebar','general','health'],weight:1,fullBleed:true,runtimeVerified:true});
        UPSERT(promoItems,'uklizecka-cisteni',{id:'uklizecka-cisteni',title:'Čištění koberců, sedaček a čalounění',text:'Hloubkové čištění koberců, sedaček a čalounění na Kadaňsku. Objednávky: 603 206 308.',url:U.cisteni+'&utm_content=rotation',banner:'/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg',wideBanner:'/assets/reklamy/vaseuklizecka-cisteni-wide-sharp-v3.svg',tag:'Čištění koberců a čalounění',contexts:['local','home','sidebar','general','health'],weight:1,fullBleed:true,runtimeVerified:true});
        UPSERT(promoItems,'owned-vyklidime-banner',{id:'owned-vyklidime-banner',title:'VYKLIDIME.TO',text:'Vyklízení bytů, domů, sklepů a pozůstalostí. Odnos, odvoz i úklid.',url:U.vyklidime+'&utm_content=rotation',banner:'/assets/reklamy/owned-vyklidime-banner-square.svg',wideBanner:'/assets/reklamy/owned-vyklidime-banner-wide.svg',tag:'Vyklízení',contexts:['local','home','sidebar','general'],weight:1,fullBleed:true,runtimeVerified:true});
      }
      if(typeof towerCreativeItems!=='undefined'&&Array.isArray(towerCreativeItems)){
        UPSERT(towerCreativeItems,'owned-levnevyklidime-tower',{id:'owned-levnevyklidime-tower',title:'LevneVyklidime.cz',url:U.levne+'&utm_content=sidebar-tower',image:'/levnevyklidime-tower.svg',width:300,height:600,contexts:['local','home','sidebar','general'],weight:1,runtimeVerified:true});
        UPSERT(towerCreativeItems,'owned-vaseuklizecka-tower',{id:'owned-vaseuklizecka-tower',title:'VašeUklízečka.cz',url:U.uklid+'&utm_content=sidebar-tower',image:'/assets/reklamy/owned-vaseuklizecka-tower.svg',width:300,height:600,contexts:['local','home','sidebar','general','health'],weight:1,runtimeVerified:true});
        UPSERT(towerCreativeItems,'uklizecka-cisteni-tower',{id:'uklizecka-cisteni-tower',title:'Čištění koberců, sedaček a čalounění',url:U.cisteni+'&utm_content=sidebar-tower',image:'/assets/reklamy/vaseuklizecka-cisteni-yellow-tower-160x237.webp',width:300,height:600,contexts:['local','home','sidebar','general','health'],weight:1,runtimeVerified:true});
        UPSERT(towerCreativeItems,'owned-vyklidime-banner-tower',{id:'owned-vyklidime-banner-tower',title:'VYKLIDIME.TO',url:U.vyklidime+'&utm_content=sidebar-tower',image:'/assets/reklamy/owned-vyklidime-banner-tower.svg',width:300,height:600,contexts:['local','home','sidebar','general'],weight:1,runtimeVerified:true});
      }
    }catch(e){console.warn('NK 50/50 creatives',e)}
  }
  function uniq(a,seed){
    if(!a.length)return[];
    const n=seed%a.length,r=a.slice(n).concat(a.slice(0,n)),s=new Set();
    return r.filter(x=>{const k=ID(x);if(!k||s.has(k))return false;s.add(k);return true});
  }
  function context(a,c){
    const yes=[],no=[];
    for(const x of a)(Array.isArray(x.contexts)&&x.contexts.includes(c)?yes:no).push(x);
    return yes.concat(no);
  }
  function pick(a,n,c,o=0){
    a=a.filter(ACTIVE);
    const q=a.filter(OWN),z=a.filter(x=>!OWN(x));
    if(!q.length||!z.length)return uniq(context(a,c),H(location.pathname+'|'+D()+'|'+c+'|'+o)).slice(0,n);
    const first=((H(location.pathname+'|'+D()+'|'+c)+(Number(o)||0))&1)===0;
    const qn=Math.floor(n/2)+((n%2&&first)?1:0),zn=n-qn;
    const Q=uniq(context(q,c),H(location.pathname+'|'+D()+'|'+c+'|own|'+o)).slice(0,qn);
    const Z=uniq(context(z,c),H(location.pathname+'|'+D()+'|'+c+'|other|'+o)).slice(0,zn);
    const out=[];let i=0,j=0;
    for(let k=0;k<n;k++){
      const wantOwn=((k+(first?0:1))%2)===0;
      const x=wantOwn?Q[i++]:Z[j++];
      if(x)out.push(x);
    }
    return out;
  }
  function apply(){
    document.documentElement.dataset.ownedAds5050=LIVE;
    document.documentElement.dataset.nkOwnedAdsRatio='50-50';
    document.documentElement.dataset.nkDoplnky='1';
    install();
    try{
      if(typeof pickPromos==='function'&&!pickPromos.__nk5050){
        const f=(c,n,o)=>pick(promoItems,Math.max(0,Number(n)||0),c,Number(o)||0);f.__nk5050=1;pickPromos=f;
      }
      if(typeof pickTowerCreative==='function'&&!pickTowerCreative.__nk5050){
        const f=(c,o=0)=>pick(towerCreativeItems,1,c,Number(o)||0)[0]||null;f.__nk5050=1;pickTowerCreative=f;
      }
      if(typeof pickRailPromo==='function'&&!pickRailPromo.__nk5050){
        const f=(c,o=0)=>pick(promoItems.filter(x=>x?.banner||x?.wideBanner),1,c,Number(o)||0)[0]||null;f.__nk5050=1;pickRailPromo=f;
      }
      document.querySelectorAll('.article-aside-adstream,.article-ad-rail,.featured-cleaning-ad,.nk-doplnek-blok,.nk-doplnek-side-list').forEach(n=>n.remove());
      if(typeof renderPromos==='function')renderPromos();
      if(typeof renderArticleSideRails==='function')renderArticleSideRails();
    }catch(e){console.warn('NK 50/50 runtime',e)}
  }
  apply();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  [80,500,1500,3000,5000].forEach(t=>setTimeout(apply,t));
})();
