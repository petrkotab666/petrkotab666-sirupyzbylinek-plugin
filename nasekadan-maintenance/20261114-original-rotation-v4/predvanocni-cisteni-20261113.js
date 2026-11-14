/* Approved VašeUklízečka.cz Christmas creative and seasonal rotation policy.
 * 2026-11-13: prior artwork retained; no editorial text or required sport ads changed.
 * Runs only until Christmas Eve; a fresh page restores normal rotation afterwards. */
(function () {
  'use strict';
  const BUILD = '20261114-original-rotation-v4';
  const START = Date.parse('2026-11-13T00:00:00+01:00');
  const END = Date.parse('2026-12-25T00:00:00+01:00');
  const IMAGE = '/vaseuklizecka-predvanocni-2026.webp';
  const LINK = 'https://www.vaseuklizecka.cz/sluzby/cisteni-kobercu-a-calouneni/?utm_source=nasekadan&utm_medium=banner&utm_campaign=predvanocni_cisteni_2026';
  const TITLE = 'Předvánoční čištění koberců, sedaček a čalounění';
  const ALT = TITLE + ' · vaseuklizecka.cz · 603 206 308';
  const SHAPE_LINK = 'https://shapehelm.com/?utm_source=nasekadan.cz&utm_medium=display&utm_campaign=shapehelm_20261114&utm_content=second_cleaning_replacement';
  const SHAPE_WIDE = '/shapehelm-reklamy-20261114/shapehelm-cad-1200x400.webp';
  const SHAPE_MOBILE = '/shapehelm-reklamy-20261114/shapehelm-gif-300x250.gif';
  const SHAPE_STATIC = '/shapehelm-reklamy-20261114/shapehelm-cad-600x600.webp';
  const SHAPE_TITLE = 'Shapehelm – 3D CAD online, 3D tisk a laserové řezání';
  const active = () => Date.now() >= START && Date.now() < END;
  if (!active() || window.__NK_CHRISTMAS_CLEANING_20261113__) return;
  const state = window.__NK_CHRISTMAS_CLEANING_20261113__ = {build: BUILD, image: IMAGE, until: END, applied: false};
  // Preserve the original three-service carousel and its own image/link rotation.
  const originalRotation = element => !!element?.closest('.nk-uklizecka-rotation');
  const text = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const fields = row => text([row && row.id, row && row.title, row && row.url, row && row.banner, row && row.image, row && row.partnerKey].join(' '));
  const cleaning = row => /uklizecka/.test(fields(row)) && !/okna|myti-oken|window|instalater|krovinorez/.test(fields(row));
  const property = row => /realitykadan|koupime\.to|koupime-to|vykup[^.]{0,30}byt/.test(fields(row));
  const sports = value => /fotbaltour|footballtime|fanda.?nhl|5ace1024|6fa6d276|e701b5ee|99b11db8/.test(text(value));
  let hash = 2166136261;
  for (const ch of location.pathname) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619) >>> 0;
  // Property adverts remain eligible in one fifth of page/time buckets, not disabled forever.
  const propertyEligible = () => ((hash + Math.floor(Date.now() / 1800000)) % 5) === 0;
  const item = {
    id: 'nk-predvanocni-cisteni-20261113', partnerKey: 'vaseuklizecka',
    title: TITLE, text: 'Objednejte včas. Kadaň a okolí. Telefon 603 206 308.',
    url: LINK, banner: IMAGE, wideBanner: IMAGE, image: IMAGE,
    tag: 'REKLAMA · místní služba', contexts: ['home','local','general','sidebar','family'],
    weight: 20, runtimeVerified: true, validFrom: '2026-11-13', validTo: '2026-12-24',
    nkChristmasCleaning: true
  };
  function preparePool() {
    if (!active()) return;
    if (typeof promoItems !== 'undefined' && Array.isArray(promoItems)) {
      for (const row of promoItems) {
        if (cleaning(row)) Object.assign(row, {title: TITLE, text: item.text, url: LINK, banner: IMAGE, wideBanner: IMAGE, image: IMAGE, weight: 20, runtimeVerified: true, nkChristmasCleaning: true});
        if (property(row)) row.weight = 1;
      }
      if (!promoItems.some(row => row.id === item.id)) promoItems.push(item);
    }
    if (typeof towerCreativeItems !== 'undefined' && Array.isArray(towerCreativeItems)) {
      for (const row of towerCreativeItems) {
        if (cleaning(row)) Object.assign(row, {title: TITLE, url: LINK, image: IMAGE, width: 1672, height: 941, weight: 20, runtimeVerified: true, nkChristmasCleaning: true});
        if (property(row)) row.weight = 1;
      }
    }
  }
  function installStyles() {
    if (document.getElementById('nk-christmas-cleaning-style-20261113')) return;
    const style = document.createElement('style');
    style.id = 'nk-christmas-cleaning-style-20261113';
    style.textContent = `
      a[data-nk-christmas-cleaning]{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;padding:0!important;box-sizing:border-box!important;overflow:hidden!important;background:#fff!important;border-radius:12px;text-decoration:none!important;}
      a[data-nk-christmas-cleaning] img{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:1672/941!important;object-fit:contain!important;object-position:center!important;padding:0!important;margin:0!important;opacity:1!important;visibility:visible!important;}
      a[data-nk-christmas-cleaning] .nk-cleaning-cta{display:block!important;padding:10px 12px;color:#85120e;background:#fff8e8;font:700 14px/1.4 system-ui,sans-serif;text-align:center;}
      .article-aside-ad:has(>a[data-nk-christmas-cleaning]){height:auto!important;min-height:0!important;}
      .featured-cleaning-ad:has(a[data-nk-christmas-cleaning]){max-width:100%;}
      a[data-nk-shapehelm-replacement]{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;padding:0!important;overflow:hidden!important;box-sizing:border-box!important;background:#0b121a!important;border-radius:12px;text-decoration:none!important;}
      a[data-nk-shapehelm-replacement] picture{display:block!important;width:100%!important;padding:0!important;margin:0!important;}
      a[data-nk-shapehelm-replacement] img{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:3/1!important;object-fit:contain!important;padding:0!important;margin:0!important;opacity:1!important;visibility:visible!important;}
      .article-aside-ad:has(a[data-nk-shapehelm-replacement]){height:auto!important;min-height:0!important;}
      .featured-cleaning-ad:has(a[data-nk-shapehelm-replacement]) .nk-uklizecka-top,.featured-cleaning-ad:has(a[data-nk-shapehelm-replacement]) .nk-uklizecka-controls{display:none!important;}
      @media(max-width:640px){a[data-nk-shapehelm-replacement] img{aspect-ratio:6/5!important;}}
      @media(max-width:640px) and (prefers-reduced-motion:reduce){a[data-nk-shapehelm-replacement] img{aspect-ratio:1!important;}}
      a[data-nk-shapehelm-replacement]:focus-visible{outline:3px solid #fa9137!important;outline-offset:4px;}
      [data-nk-christmas-property-hidden="1"]{display:none!important;}
      a[data-nk-christmas-cleaning]:focus-visible{outline:3px solid #087447!important;outline-offset:4px;}
    `;
    document.head.appendChild(style);
  }
  // The site disables broad MutationObservers as a recovery measure. Keep that
  // global protection intact; observe only our own ad anchors, idempotently.
  const watchedBanners = new WeakSet();
  const BannerObserver = window.__nkOriginalMutationObserver || window.MutationObserver;
  function watchBanner(anchor) {
    if (!anchor || originalRotation(anchor) || watchedBanners.has(anchor) || typeof BannerObserver !== 'function') return;
    watchedBanners.add(anchor);
    const observer = new BannerObserver(() => {
      if (!active() || !anchor.isConnected || originalRotation(anchor)) return;
      if (anchor.hasAttribute('data-nk-shapehelm-replacement')) setShapehelmBanner(anchor);
      else if (anchor.hasAttribute('data-nk-christmas-cleaning')) setBanner(anchor);
    });
    observer.observe(anchor, {childList:true, subtree:true, attributes:true, attributeFilter:['href','src','srcset']});
  }
  function setBanner(anchor) {
    if (!anchor || originalRotation(anchor) || anchor.hasAttribute('data-nk-shapehelm-replacement')) return;
    if (anchor.dataset.nkChristmasCleaning === BUILD && anchor.querySelector('img')?.getAttribute('src') === IMAGE) return;
    anchor.href = LINK;
    anchor.target = '_blank';
    anchor.rel = 'nofollow sponsored noopener noreferrer';
    anchor.setAttribute('aria-label', 'Reklama: ' + ALT);
    anchor.dataset.nkChristmasCleaning = BUILD;
    // Rebuild only an advertising anchor, never a paragraph or editorial link.
    anchor.replaceChildren();
    const image = document.createElement('img');
    image.src = IMAGE; image.alt = ALT; image.width = 1672; image.height = 941;
    image.loading = 'lazy'; image.decoding = 'async';
    const cta = document.createElement('span');
    cta.className = 'nk-cleaning-cta'; cta.textContent = 'Objednat čištění · 603 206 308 →';
    anchor.append(image, cta);
    watchBanner(anchor);
  }
  const adSelector = '.featured-cleaning-ad,.nk-permanent-ad,.promo-card,.article-rail-card,.article-aside-ad,.ad,.ad-inline,.ad-banner,.article-ad-auto,[data-promos],.owned-network-promotion,.nk-sport-partners-guaranteed,.sport-partner';

  // Explicit user rule (14 Nov 2026): keep the first cleaning ad, replace the
  // next consecutive cleaning ad with Shapehelm, without adding/removing slots.
  function setShapehelmBanner(anchor) {
    if (!anchor || originalRotation(anchor)) return;
    const correct = anchor.dataset.nkShapehelmReplacement === BUILD &&
      anchor.getAttribute('href') === SHAPE_LINK &&
      anchor.querySelector('picture img')?.getAttribute('src') === SHAPE_WIDE;
    if (correct) { watchBanner(anchor); return; }
    anchor.removeAttribute('data-nk-christmas-cleaning');
    anchor.removeAttribute('data-nk-christmas-property-hidden');
    anchor.dataset.nkShapehelmReplacement = BUILD;
    anchor.href = SHAPE_LINK;
    anchor.target = '_blank';
    anchor.rel = 'nofollow sponsored noopener noreferrer';
    anchor.setAttribute('aria-label', 'Reklama: ' + SHAPE_TITLE);
    anchor.replaceChildren();
    const picture = document.createElement('picture');
    const still = document.createElement('source');
    still.media = '(max-width:640px) and (prefers-reduced-motion:reduce)';
    still.srcset = SHAPE_STATIC; still.type = 'image/webp';
    const mobile = document.createElement('source');
    mobile.media = '(max-width:640px)'; mobile.srcset = SHAPE_MOBILE; mobile.type = 'image/gif';
    const image = document.createElement('img');
    image.src = SHAPE_WIDE; image.alt = SHAPE_TITLE;
    image.width = 1200; image.height = 400; image.loading = 'lazy'; image.decoding = 'async';
    picture.append(still, mobile, image); anchor.appendChild(picture);
    watchBanner(anchor);
    const slot = anchor.closest('.featured-cleaning-ad,.nk-permanent-ad,.article-aside-ad,.article-ad-auto,.ad-inline,.ad-banner');
    if (slot) {
      slot.removeAttribute('data-nk-christmas-property-hidden');
      slot.setAttribute('aria-label', 'Reklama: ' + SHAPE_TITLE);
    }
  }
  function preventConsecutiveCleaning() {
    // Compare the rendered visual order across the main flow and the right rail.
    // Keeping separate state per DOM region allowed adjacent on-screen placements
    // to repeat the cleaning creative.
    const anchors = [...document.querySelectorAll('main a[href],.article-ad-rail a[href]')]
      .filter(anchor => !originalRotation(anchor) && anchor.closest(adSelector) && anchor.querySelector('img') && anchor.getClientRects().length)
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return (ar.top + window.scrollY) - (br.top + window.scrollY) || ar.left - br.left;
      });
    let previous = 'other';
    anchors.forEach(anchor => {
      const value = [anchor.href, anchor.getAttribute('aria-label'), ...[...anchor.querySelectorAll('img')].map(im => im.src + ' ' + im.alt)].join(' ');
      let brand = anchor.hasAttribute('data-nk-shapehelm-replacement') ? 'shapehelm' :
        (!sports(value) && cleaning({url:value}) ? 'cleaning' : 'other');
      if (brand === 'cleaning' && previous === 'cleaning') {
        setShapehelmBanner(anchor); brand = 'shapehelm';
      }
      previous = brand;
    });
    state.shapehelmReplacements = [...document.querySelectorAll('a[data-nk-shapehelm-replacement]')].filter(anchor => !originalRotation(anchor)).length;
  }

  function applyDom() {
    if (!active()) return;
    preparePool();
    document.querySelectorAll('a[data-nk-shapehelm-replacement]').forEach(setShapehelmBanner);
    document.querySelectorAll('.featured-cleaning-ad:not(.nk-uklizecka-rotation) a[href]').forEach(setBanner);
    document.querySelectorAll('a[href]').forEach(anchor => {
      if (originalRotation(anchor) || !anchor.closest(adSelector) || !anchor.querySelector('img')) return;
      const value = [anchor.href, anchor.getAttribute('aria-label'), anchor.textContent, ...[...anchor.querySelectorAll('img')].map(im => im.src + ' ' + im.alt)].join(' ');
      if (sports(value)) return;
      if (cleaning({url:value})) setBanner(anchor);
      else if (!propertyEligible() && property({url:value})) {
        const slot = anchor.closest('.article-aside-ad,.ad-inline,.ad-banner,section.ad,.article-ad-auto');
        (slot || anchor).dataset.nkChristmasPropertyHidden = '1';
      }
    });
    // Replace one existing, non-required sidebar slot; do not add to ad density.
    document.querySelectorAll('.article-aside-adstream').forEach(stream => {
      if (stream.querySelector('a[data-nk-christmas-cleaning]')) return;
      const anchors = [...stream.querySelectorAll('.article-aside-ad a[href]')];
      const target = anchors.find(a => !originalRotation(a) && !sports(a.href + ' ' + a.innerHTML));
      if (target) {
        target.closest('.article-aside-ad').removeAttribute('data-nk-christmas-property-hidden');
        target.removeAttribute('data-nk-christmas-property-hidden');
        setBanner(target);
      }
    });
    preventConsecutiveCleaning();
    state.applied = true;
    state.visiblePlacements = [...document.querySelectorAll('a[data-nk-christmas-cleaning]')].filter(anchor => !originalRotation(anchor)).length;
  }
  function patchEngine() {
    if (!active()) return;
    preparePool();
    if (typeof window.isPromoActive === 'function' && !window.isPromoActive.__nkChristmasCleaning) {
      const original = window.isPromoActive;
      const wrapped = function(row) {
        return !(active() && property(row) && !propertyEligible()) && original.apply(this, arguments);
      };
      wrapped.__nkChristmasCleaning = true; window.isPromoActive = wrapped;
    }
    if (typeof window.pickPromos === 'function' && !window.pickPromos.__nkChristmasCleaning) {
      const original = window.pickPromos;
      const wrapped = function(context, count, offset) {
        const selected = original.apply(this, arguments);
        if (!active() || !count || !Array.isArray(selected)) return selected;
        if (Number(offset || 0) === 0 && ['home','local','general','family'].includes(context)) {
          const keep = selected.filter(row => !cleaning(row));
          return [item, ...keep].slice(0, count);
        }
        return selected;
      };
      wrapped.__nkChristmasCleaning = true; window.pickPromos = wrapped;
    }
    for (const name of ['renderPromos','renderArticleSideRails']) {
      const original = window[name];
      if (typeof original !== 'function' || original.__nkShapehelmDedup) continue;
      const wrapped = function() {
        const result = original.apply(this, arguments);
        schedule();
        if (result && typeof result.then === 'function') result.then(schedule, () => {});
        return result;
      };
      wrapped.__nkShapehelmDedup = true; window[name] = wrapped;
    }
  }
  let scheduled = false;
  function schedule() {
    if (scheduled || !active()) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; applyDom(); });
  }
  function start() {
    installStyles(); patchEngine(); applyDom();
    const observer = new MutationObserver(records => {
      if (records.some(r => r.addedNodes.length > 0)) schedule();
    });
    observer.observe(document.body, {childList:true,subtree:true});
    // Legacy renderers can start after the page has loaded. Re-apply without rebuilding content.
    for (const delay of [500,1800,4500]) setTimeout(() => {patchEngine();applyDom();}, delay);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
