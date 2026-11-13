/* NK_FOTBALTOUR_CHRISTMAS_LOADER_2026: ensure voucher ads in sports articles using the existing ad scripts. */
if (!document.querySelector('script[data-fotbaltour-christmas-2026]')) {
  const fotbalTourXmasScript = document.createElement('script');
  fotbalTourXmasScript.src = '/vanoce-2026/fotbaltour-poukazy.js?v=20261104';
  fotbalTourXmasScript.defer = true;
  fotbalTourXmasScript.setAttribute('data-fotbaltour-christmas-2026','1');
  document.head.append(fotbalTourXmasScript);
}
/* NK_FOTBALTOUR_CHRISTMAS_LOADER_2026_END */

(function(){
  if(window.__NK_ARTICLE_ADSTREAM_V5__){
    window.renderArticleSideRails=window.__NK_ARTICLE_ADSTREAM_V5__.rebuild;
    window.renderArticleSideRails?.();
    return;
  }
  window.__NK_ARTICLE_ADSTREAM_V5__={build:'20261113-full-height-v1'};
  const ASSET_VERSION='20261103-premium-xmas-1';

  if(!document.querySelector('link[data-article-adstream-css]')){
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href=`/reklamy-sidebar.css?v=${ASSET_VERSION}`;
    style.setAttribute('data-article-adstream-css','true');
    document.head.appendChild(style);
  }

  /* Compact product offers on mobile; override historical fixed-height ad cards. */
  if(!document.querySelector('style[data-nk-mobile-product-20261112]')){
    const compactStyle=document.createElement('style');
    compactStyle.setAttribute('data-nk-mobile-product-20261112','1');
    compactStyle.textContent=`
      @media(max-width:700px){
        .article-aside-adstream{gap:16px!important}
        .article-aside-adstream .article-aside-ad{padding:10px!important;border-radius:14px!important}
        .article-aside-adstream .article-rail-card-product .article-rail-product-picture img{height:160px!important;padding:10px!important}
        .article-aside-adstream .article-rail-card-product .article-rail-copy{min-height:0!important;padding:14px 16px 16px!important}
        .article-aside-adstream .article-rail-card-product .article-rail-copy strong{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important;font:700 19px/1.22 Georgia,serif!important;margin:0 0 9px!important;overflow-wrap:anywhere!important}
        .article-aside-adstream .article-rail-card-product .article-rail-copy span{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important;flex:0 1 auto!important;font-size:13px!important;line-height:1.4!important}
        .article-aside-adstream .article-rail-card-product .article-rail-copy b{margin-top:12px!important}
      }
    `;
    document.head.appendChild(compactStyle);
  }

  function normalizePartnerKey(value){
    const raw=String(value||'partner');
    if(typeof normalizeToken==='function')return normalizeToken(raw);
    return raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function partnerKey(item){
    if(item?.partnerKey)return normalizePartnerKey(item.partnerKey);
    if(typeof nkAdvertiserKey==='function')return nkAdvertiserKey(item);
    const title=String(item?.title||item?.partner||item?.id||item?.url||'');
    return normalizePartnerKey(title.split(/[:–—]/)[0]);
  }

  function uniqueByCreative(items){
    const seenIds=new Set();
    const seenImages=new Set();
    return items.filter(entry=>{
      const id=String(entry?.id||'');
      const image=String(entry?.image||entry?.banner||entry?.wideBanner||'');
      if(!id||seenIds.has(id))return false;
      if(image&&seenImages.has(image))return false;
      seenIds.add(id);
      if(image)seenImages.add(image);
      return true;
    });
  }

  function combinedPartnerPool(context){
    const towerSource=typeof towerCreativeItems==='undefined'?[]:towerCreativeItems;
    const promoSource=typeof promoItems==='undefined'?[]:promoItems;
    // Independent exclusion: protect sidebar even when an older main ad script is cached.
    const activeItem=item=>{
      const fields=[item?.id,item?.name,item?.title,item?.tag,item?.text,item?.url,item?.image,item?.banner,item?.wideBanner,item?.partner,item?.programKey].join(' ').toLowerCase();
      if(typeof nkRetiredPartner==='function'&&nkRetiredPartner(item))return false;
      if(/excursia|76c9b39c|naturprodukt|cretamart|0c6277d3|mamedoma|259ca026|lazy\s*farm|lazyfarm|28e75ba2|batohy.?zavazadla|ffcffc9b|apollostore|a883bbdd|twisto|1cb94817|prima\+|prima-plus|telly|b1a888ed/.test(fields))return false;
      if(/lazy\s*farm|lazyfarm|28e75ba2/.test(fields))return false;
      return typeof isPromoActive==='function'?isPromoActive(item):true;
    };

    const towers=uniqueByCreative(towerSource
      .filter(item=>item&&item.image&&item.url&&activeItem(item)&&item.runtimeVerified===true)
      .map(item=>({kind:'tower',item,key:partnerKey(item),id:`tower:${item.id}`})));

    const promos=uniqueByCreative(promoSource
      .filter(item=>item&&item.url&&activeItem(item)&&item.runtimeVerified===true)
      .map(item=>({kind:'custom',item,key:partnerKey(item),id:`custom:${item.id}`})));

    const exact=[
      ...towers.filter(entry=>Array.isArray(entry.item.contexts)&&entry.item.contexts.includes(context)),
      ...promos.filter(entry=>Array.isArray(entry.item.contexts)&&entry.item.contexts.includes(context))
    ];
    const fallback=[
      ...towers.filter(entry=>!exact.includes(entry)),
      ...promos.filter(entry=>!exact.includes(entry))
    ];

    const ordered=[...exact,...fallback];
    const seenCreative=new Set();
    return ordered.filter(entry=>{
      if(!entry.key||seenCreative.has(entry.id))return false;
      seenCreative.add(entry.id);
      return true;
    });
  }

  function selectVariedAds(pool,count,seed){
    if(!pool.length||count<1)return [];
    const start=seed%pool.length;
    // IMAGE_PRIORITY_V3: do reklamního streamu pouštět pouze obrazové kreativy.
    const rotatedBase=[...pool.slice(start),...pool.slice(0,start)];
    const hasVisual=entry=>{
      const item=entry?.item||{};
      return Boolean(item.image||item.banner||item.wideBanner);
    };
    const visual=rotatedBase.filter(hasVisual);
    if(!visual.length)return [];
    // Shared, unbiased rotation: show different advertisers before repeating any.
    // Cleaning and clearing remain eligible without monopolising the first slots.
    const rotated=visual;
    const selected=[];
    const usedPartnerKeys=new Set();

    // Nejdřív použít co nejvíce různých partnerů bez jediného opakování.
    for(const entry of rotated){
      if(usedPartnerKeys.has(entry.key))continue;
      selected.push(entry);
      usedPartnerKeys.add(entry.key);
      if(selected.length===count)return selected;
    }

    // Až po vyčerpání všech partnerů lze začít další kolo, nikdy však stejný partner za sebou.
    let cursor=0;
    let safety=0;
    while(selected.length<count&&safety<count*pool.length*3){
      const entry=rotated[cursor%rotated.length];
      const previous=selected[selected.length-1];
      cursor+=1;
      safety+=1;
      if(previous&&entry.key===previous.key)continue;
      selected.push(entry);
    }

    return selected;
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function escapeAdHtml(value){
    return String(value||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function renderEntry(entry){
    const item=entry.item||{};
    const title=String(item.title||'Partnerská nabídka');
    const text=String(item.text||'Vybraná partnerská nabídka.')
      .replace(/<[^>]*>/g,' ')
      .replace(/<\s*\/?\s*[a-z][^>]*$/gi,' ')
      .replace(/&nbsp;|&#160;/gi,' ')
      .replace(/\s+/g,' ').trim();
    const url=String(item.url||'#');
    const image=String(item.image||item.banner||item.wideBanner||'');
    const itemId=String(item.id||'');
    const isFeedProduct=/^(multi-|feed-product-)/.test(itemId);

    if(entry.kind==='custom'&&isFeedProduct&&image){
      const safeTitle=escapeAdHtml(title);
      const safeText=escapeAdHtml(text);
      const safeUrl=escapeAdHtml(url);
      const safeImage=escapeAdHtml(image);
      return `<a class="article-rail-card article-rail-card-custom article-rail-card-product" href="${safeUrl}" target="_blank" rel="nofollow sponsored noopener noreferrer"><span class="article-rail-label">Reklama</span><span class="article-rail-product-picture" style="display:block;width:100%;background:#fff;border-radius:12px 12px 0 0;overflow:hidden"><img src="${safeImage}" alt="${safeTitle}" loading="lazy" decoding="async" style="display:block;width:100%;height:220px;object-fit:contain;background:#fff;padding:10px;box-sizing:border-box"></span><span class="article-rail-copy"><strong>${safeTitle}</strong><span>${safeText}</span><b>Zjistit více →</b></span></a>`;
    }

    if(entry.kind==='tower'&&typeof renderTowerRailCard==='function') return renderTowerRailCard(entry.item);
    if(entry.kind==='custom'&&typeof renderCustomRailCard==='function') return renderCustomRailCard(entry.item);

    const safeTitle=escapeAdHtml(title);
    const safeUrl=escapeAdHtml(url);
    const safeImage=escapeAdHtml(image);
    if(image){
      return `<a class="article-rail-card article-rail-card-tower" href="${safeUrl}" target="_blank" rel="nofollow sponsored noopener noreferrer"><span class="article-rail-label">Reklama</span><span class="article-rail-tower-picture"><img src="${safeImage}" width="300" height="600" alt="${safeTitle}" loading="lazy" decoding="async"></span><span class="article-rail-fallback">${safeTitle}</span></a>`;
    }
    return '';
  }

  function isDomainTitle(value){
    return /^[^\s]+\.[a-z0-9-]{2,}$/i.test(String(value||'').trim());
  }

  // Measure the rendered rail, including late images and seasonal creative swaps.
  // A mobile rail is a short block below the story, not a copy of the desktop rail.
  let streamState=null;
  let layoutTimer;
  let rebuildTimer;
  const watchedImages=new WeakSet();
  const sizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(scheduleStreamLayout):null;
  const contentObserver=new MutationObserver(scheduleStreamLayout);

  function scheduleStreamLayout(){
    if(layoutTimer)return;
    layoutTimer=setTimeout(()=>{layoutTimer=null;fitArticleAdStream();},100);
  }

  function isDesktopRail(article,sidebar){
    return window.matchMedia('(min-width:981px)').matches &&
      sidebar.getBoundingClientRect().left>=article.getBoundingClientRect().right-2;
  }

  function nextSlot(state){
    while(state.cursor<state.entries.length){
      const entry=state.entries[state.cursor++];
      if(state.failedEntries.has(entry.id))continue;
      const slot=document.createElement('div');
      slot.className=`article-aside-ad article-aside-ad-${entry.kind}`;
      slot.dataset.partner=entry.key;
      slot.dataset.creative=entry.id;
      slot.innerHTML=renderEntry(entry);
      const image=slot.querySelector('img[src]');
      if(!image||state.failedImages.has(image.src))continue;
      const title=String(entry.item?.title||'').trim();
      const heading=slot.querySelector('.article-rail-copy strong');
      if(heading&&isDomainTitle(title)){
        heading.classList.add('ad-domain-title');
        heading.setAttribute('title',title);
      }
      return slot;
    }
    return null;
  }

  function watchStreamImages(state){
    state.stream.querySelectorAll('img').forEach(image=>{
      if(watchedImages.has(image))return;
      watchedImages.add(image);
      image.addEventListener('load',scheduleStreamLayout,{once:true});
      image.addEventListener('error',()=>{
        const slot=image.closest('.article-aside-ad');
        // A seasonal renderer may already have replaced this image.
        if(streamState!==state||!slot)return;
        state.failedImages.add(image.src);
        state.failedEntries.add(slot.dataset.creative);
        slot.remove();
        scheduleStreamLayout();
      },{once:true});
    });
  }

  function fitArticleAdStream(){
    const state=streamState;
    if(!state||!state.stream.isConnected)return;
    const {article,sidebar,stream}=state;
    const desktop=isDesktopRail(article,sidebar);
    sidebar.classList.toggle('article-ads-below',!desktop);
    const maxCards=desktop?64:2;
    const bottom=article.getBoundingClientRect().bottom;
    // Ignore seasonal placements explicitly hidden by the existing campaign policy.
    [...stream.children].forEach(slot=>{
      if(getComputedStyle(slot).display==='none'||!slot.querySelector('img[src]')){
        state.failedEntries.add(slot.dataset.creative);
        slot.remove();
      }
    });
    while(stream.children.length>maxCards)stream.lastElementChild.remove();
    if(desktop){
      while(stream.children.length>1&&stream.lastElementChild.getBoundingClientRect().top>bottom-120){
        stream.lastElementChild.remove();
      }
    }
    let added=false;
    while(stream.children.length<maxCards){
      const last=stream.lastElementChild;
      if(desktop&&last&&last.getBoundingClientRect().bottom>=bottom-120)break;
      const slot=nextSlot(state);
      if(!slot)break;
      stream.appendChild(slot);
      added=true;
      // Wait for the stylesheet if the new card has not acquired a layout yet.
      if(desktop&&slot.getBoundingClientRect().height<20)break;
    }
    [...stream.children].forEach((slot,index)=>{
      slot.dataset.adIndex=String(index+1);
      // Keep a visible ad label after another renderer replaces an anchor's children.
      if(!slot.querySelector('.article-rail-label')){
        const label=document.createElement('span');
        label.className='article-rail-label';
        label.textContent='Reklama';
        slot.prepend(label);
      }
    });
    watchStreamImages(state);
    if(added&&typeof installImageFallbacks==='function')installImageFallbacks(stream);
    stream.dataset.layout=desktop?'full-height':'compact';
    stream.dataset.adCount=String(stream.children.length);
  }

  function rebuildArticleAdStream(){
    const shell=document.querySelector('main.article-shell');
    const article=shell?.querySelector('article.article');
    const sidebar=shell?.querySelector('aside.sticky');
    if(!shell||!article||!sidebar)return;
    let context='general';
    try{
      if(typeof inferPromoContext==='function')context=inferPromoContext(`${document.title} ${article.textContent||''}`);
    }catch(error){
      console.warn('Nepodařilo se určit kontext reklamy.',error);
    }
    const pool=combinedPartnerPool(context);
    if(!pool.length)return;
    const interval=Math.floor(Date.now()/(30*60*1000));
    const seed=typeof hashSeed==='function'?hashSeed(`${location.pathname}|${interval}|sidebar-stream-v4`):0;
    // Selection is cheap; only append cards actually needed by the measured article.
    const entries=selectVariedAds(pool,128,seed);
    if(!entries.length)return;
    sizeObserver?.disconnect();
    contentObserver.disconnect();
    document.querySelectorAll('.article-ad-rail').forEach(node=>node.remove());
    sidebar.querySelectorAll(':scope > .article-aside-tower,:scope > .article-aside-adstream').forEach(node=>node.remove());
    const stream=document.createElement('div');
    stream.className='article-aside-adstream';
    stream.setAttribute('aria-label','Reklamy vedle článku');
    // The story's own height must not stretch in response to its advertising rail.
    article.style.alignSelf='start';
    stream.style.flex='none';
    stream.style.alignContent='start';
    sidebar.appendChild(stream);
    streamState={article,sidebar,stream,entries,cursor:0,failedImages:new Set(),failedEntries:new Set()};
    fitArticleAdStream();
    sizeObserver?.observe(article);
    [...sidebar.children].forEach(node=>sizeObserver?.observe(node));
    contentObserver.observe(sidebar,{childList:true,subtree:true,attributes:true,attributeFilter:['src','hidden','data-nk-christmas-property-hidden']});
  }

  window.renderArticleSideRails=rebuildArticleAdStream;
  window.__NK_ARTICLE_ADSTREAM_V5__.rebuild=rebuildArticleAdStream;
  window.addEventListener('resize',()=>{
    // Re-select on a breakpoint change so a mobile visit can later grow a full rail.
    clearTimeout(rebuildTimer);
    rebuildTimer=setTimeout(rebuildArticleAdStream,220);
  });
  window.addEventListener('load',scheduleStreamLayout,{once:true});
  if(document.fonts?.ready)document.fonts.ready.then(scheduleStreamLayout);
  rebuildArticleAdStream();
  setTimeout(rebuildArticleAdStream,450);
  setTimeout(rebuildArticleAdStream,1400);
})();

/* NK_APPROVED_CHRISTMAS_CLEANING_LOADER_20261113 */
(function(){
  if(document.querySelector('script[data-nk-approved-christmas-cleaning]'))return;
  const script=document.createElement('script');
  script.src='/predvanocni-cisteni-20261113.js?v=20261113-approved-v1';
  script.dataset.nkApprovedChristmasCleaning='1';
  script.defer=true;
  document.head.appendChild(script);
})();
/* NK_APPROVED_CHRISTMAS_CLEANING_LOADER_20261113_END */
