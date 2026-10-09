/* NK_ADROP_PRE_BLACK_FRIDAY_20261009_START */
(() => {
  'use strict';
  const begins = Date.parse('2026-10-09T00:00:00+02:00');
  const ends = Date.parse('2026-10-13T00:00:00+02:00');
  const active = () => Date.now() >= begins && Date.now() < ends;
  if (!active() || window.__nkAdropOctoberInstalled) return;
  window.__nkAdropOctoberInstalled = true;
  const id = 'central-adrop-cz';
  const href = 'https://ehub.cz/system/scripts/click.php?a_aid=6926a50f&a_bid=0001595B';
  const image = 'https://doc.ehub.cz/b/0000262X/005ec960.jpg';
  const title = 'Vánoční dárky s předstihem: zážitky se slevou až 51 %';
  const copy = 'Před Black Friday · 9.–12. října 2026. Vybrané zážitkové dárky pro partnera, rodinu a přátele. Některé nabídky končí dříve; podmínky ověřte u konkrétního zážitku.';
  let original, selectedOffset = null, installed = false;
  const remember = item => { if (!original) original = {...item, contexts:[...item.contexts]}; };
  const promote = () => {
    if (typeof promoItems === 'undefined') return;
    const item = promoItems.find(item => item.id === id);
    if (!item) return;
    remember(item);
    if (!active()) return;
    Object.assign(item,{title,text:copy,tag:'Před Black Friday',weight:12,validFrom:'2026-10-09',validTo:'2026-10-12',contexts:['shopping','home','travel','family','local','general','sidebar']});
  };
  const card = () => `<a class="promo-card nk-adrop-october" data-nk-adrop-october="1" href="${href}" target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="${image}" width="970" height="310" loading="lazy" decoding="async" alt="Adrop.cz – Darujte zážitek"><span class="nk-adrop-copy"><small>REKLAMA · ADROP.CZ</small><strong>${title}</strong><span>${copy}</span><b>Vybrat zážitkový dárek →</b></span></a>`;
  function install() {
    if (installed || typeof renderFeedCard !== 'function' || typeof pickPromos !== 'function') return;
    installed = true;
    promote();
    const style = document.createElement('style');
    style.id = 'nk-adrop-october-style';
    style.textContent = '.nk-adrop-october{display:flex!important;flex-direction:column!important;padding:0!important;min-width:0!important;height:auto!important;background:#fff!important;overflow:hidden!important;border:1px solid #e0e4e7!important;border-radius:14px!important;color:#161044!important;text-decoration:none!important}.nk-adrop-october>img{display:block!important;width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;margin:0!important;padding:0!important}.nk-adrop-copy{display:flex!important;flex-direction:column!important;gap:10px!important;padding:20px!important;white-space:normal!important;overflow-wrap:anywhere!important}.nk-adrop-copy small{font:700 10px/1.4 Arial,sans-serif!important;letter-spacing:.07em!important;color:#805016!important}.nk-adrop-copy strong{display:block!important;font:700 23px/1.2 Georgia,serif!important;color:#161044!important}.nk-adrop-copy>span{display:block!important;font:400 14px/1.55 Arial,sans-serif!important;color:#46515a!important}.nk-adrop-copy b{display:block!important;font:700 14px/1.4 Arial,sans-serif!important;color:#d55500!important}.article-shell>.article-ad-bottom[data-nk-adrop-bottom]{grid-column:1/-1!important;margin:40px 0 12px!important}.article-ad-auto .promo-grid:has(>.nk-adrop-october){grid-template-columns:minmax(0,1fr)!important}.article-ad-bottom .nk-adrop-bottom-pair{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:20px!important}.article-ad-bottom .nk-adrop-bottom-pair>.promo-card{min-width:0!important;max-width:none!important;width:auto!important}.nk-adrop-october:focus-visible{outline:3px solid #ff8000!important;outline-offset:3px!important}@media(max-width:600px){.article-ad-bottom .nk-adrop-bottom-pair{grid-template-columns:minmax(0,1fr)!important}.nk-adrop-copy{padding:16px!important}.nk-adrop-copy strong{font-size:21px!important}}';
    document.head.append(style);
    const oldFeed = renderFeedCard, oldBanner = renderBannerCard, oldPick = pickPromos;
    renderFeedCard = function(item){return active() && item.id === id ? card() : oldFeed(item);};
    renderBannerCard = function(item){return active() && item.id === id ? card() : oldBanner(item);};
    pickPromos = function(context,count,offset){
      promote();
      const items = oldPick(context,count,offset);
      if (!active() || context === 'sidebar' || !(count >= 2 || offset >= 5)) return items;
      if (selectedOffset === null) selectedOffset = offset;
      if (offset !== selectedOffset) return items;
      const offer = promoItems.find(item => item.id === id);
      if (!offer) return items;
      const result = [offer,...items.filter(item=>item.id!==id)].slice(0,count);
      if (typeof usedPromoIds !== 'undefined') usedPromoIds.add(id);
      return result;
    };
    const pairBottom = () => {
      if (!active()) return;
      const article=document.querySelector('article.article');
      const inside=article && article.querySelector(':scope > .article-ad-bottom');
      if(inside){
        article.parentElement.querySelectorAll(':scope > .article-ad-bottom[data-nk-adrop-bottom]').forEach(old=>old.remove());
        inside.dataset.nkAdropBottom='1';
        article.parentElement.appendChild(inside);
      }
      document.querySelectorAll('.article-ad-bottom[data-nk-adrop-bottom] .promo-grid').forEach(grid=>{
        if (grid.querySelector('a.nk-adrop-october')) return;
        grid.classList.add('nk-adrop-bottom-pair');
        grid.insertAdjacentHTML('beforeend',card());
      });
    };
    const oldRender = renderPromos;
    renderPromos = function(...args){const result=oldRender(...args);pairBottom();return result;};
    [0,250,1000,2500].forEach(ms=>setTimeout(()=>{if(active()){renderPromos();pairBottom();}},ms));
    const delay = Math.max(0,ends-Date.now());
    const expire = () => {
      if (active()) {setTimeout(expire,Math.min(ends-Date.now(),2147483647));return;}
      const item = promoItems.find(item=>item.id===id);
      if (item && original) {for(const key of ['validFrom','validTo']) if (!(key in original)) delete item[key];Object.assign(item,original);}
      document.querySelectorAll('a[data-nk-adrop-october]').forEach(node=>{if(node.closest('.nk-adrop-bottom-pair'))node.remove();else if(item)node.outerHTML=oldFeed(item);else node.remove();});
      document.querySelectorAll('.nk-adrop-bottom-pair').forEach(grid=>grid.classList.remove('nk-adrop-bottom-pair'));
      const article=document.querySelector('article.article');
      document.querySelectorAll('.article-ad-bottom[data-nk-adrop-bottom]').forEach(slot=>{delete slot.dataset.nkAdropBottom;if(article)article.appendChild(slot);});
      delete document.documentElement.dataset.nkAdropOctober;
    };
    setTimeout(expire,Math.min(delay,2147483647));
    document.documentElement.dataset.nkAdropOctober = '20261009';
  }
  if(document.readyState !== 'complete') document.addEventListener('DOMContentLoaded',install,{once:true});
  [0,100,500,1500].forEach(ms=>setTimeout(install,ms));
})();
/* NK_ADROP_PRE_BLACK_FRIDAY_20261009_END */
