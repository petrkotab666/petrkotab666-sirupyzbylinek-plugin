// NK_AD_REAL_COPY_V4_20260910
// Keep the existing campaign rotation and tracking URLs. Repair only failed creatives.
(() => {
  'use strict';
  if (window.__nkAdSafeFallbackInstalled) return;
  window.__nkAdSafeFallbackInstalled = true;
  const SELECTOR = 'a.promo-card,a.article-rail-card,.featured-cleaning-ad a,.featured-rotating-ad a,[data-promos] a,.promo-wrap a,.article-aside-adstream a';
  const GENERIC = /aktuální nabídku a podmínky|vybraná partnerská nabídka z centrální|^nabídka partnera$|^partnerská nabídka$/i;
  const done = new WeakMap();
  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const norm = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const urlOf = value => { try { return new URL(value, location.href); } catch (_) { return null; } };
  const key = value => { const u = urlOf(value); return u ? u.href.replace(/\/$/, '') : ''; };
  function catalog() { try { return typeof promoItems !== 'undefined' && Array.isArray(promoItems) ? promoItems : []; } catch (_) { return []; } }
  function originalTitle(card) {
    const node = card.querySelector('.promo-wide-copy strong,.article-rail-copy strong,:scope > strong,h3,.ad-title');
    return clean(node && node.textContent) || clean(card.getAttribute('aria-label')).replace(/^reklama:\s*/i, '') || clean(card.querySelector('img')?.alt);
  }
  function offerFor(card) {
    const href = card.getAttribute('href') || '';
    const click = urlOf(href);
    if (!click || !/^https?:$/.test(click.protocol)) return null;
    const oldTitle = originalTitle(card);
    const list = catalog();
    const item = list.find(x => key(x.url) === key(href) && clean(x.title) === oldTitle)
      || list.find(x => key(x.url) === key(href))
      || list.find(x => clean(x.title) === oldTitle && oldTitle);
    const today = new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Prague'}).format(new Date());
    if (item && ((item.validTo && today > item.validTo) || (item.validFrom && today < item.validFrom))) return {expired: true};
    const target = urlOf(click.searchParams.get('desturl') || href) || click;
    const host = target.hostname.replace(/^www\./, '');
    const topic = norm([item?.id, item?.title, href].join(' '));
    const model = (brand, title, text, cta, theme, category) => ({brand, title, text, cta, theme, category});
    if (host === 'vaseuklizecka.cz') {
      if (/cisteni|koberc|sedac|caloun/.test(topic)) return model('VašeUklízečka.cz', 'Čisté koberce a sedačky', 'Čištění koberců, sedacích souprav a čalounění v Kadani a okolí.', 'Poptat čištění →', 'clean', 'Čištění u vás');
      return model('VašeUklízečka.cz', 'Úklid bez starostí', 'Pravidelný i jednorázový úklid domácností, kanceláří a bytových domů.', 'Poptat úklid →', 'clean', 'Kadaň a okolí');
    }
    if (host === 'levnevyklidime.cz') return model('LevněVyklidíme.cz', 'Potřebujete vyklidit?', 'Byty, domy, sklepy i půdy. Vyklízení a stěhování v Kadani a Klášterci.', 'Poptat vyklízení →', 'clear', 'Místní služba');
    if (host === 'vyklidime.to') return model('VYKLIDIME.TO', 'Vyklidíme a odvezeme', 'Byty, domy, sklepy a pozůstalosti. Odnos věcí, odvoz nábytku i odpadu.', 'Poptat vyklízení →', 'clear', 'Kadaň a okolí');
    if (host === 'realitykadan.cz') return model('RealityKadan.cz', /garaz/.test(topic) ? 'Prodáváte garáž?' : 'Prodáváte nemovitost?', 'Byt, dům, garáž nebo pozemek v Kadani a okolí. Nezávazně probereme možnosti prodeje.', 'Probrat prodej →', 'home', 'Nemovitosti v regionu');
    if (host === 'pojistime.to') return model('Pojistime.to', 'Pojištění na jednom místě', 'Pojištění auta, domácnosti a cestování. Vyberte, co potřebujete pojistit.', 'Vybrat pojištění →', 'home', 'Pojištění');
    if (/meaco-cool-9000-pro/.test(target.pathname)) return model('ProAlergiky.cz', 'Mobilní klimatizace Meaco Cool', 'Model 9000 Pro: chlazení, ventilace a odvlhčování v jednom přístroji.', 'Zobrazit model →', 'cool', 'Meaco Cool 9000 Pro');
    if (host === 'concept.cz' && /ventilator/.test(target.pathname)) return model('Concept.cz', 'Vzduch v pohybu', 'Stolní, stojanové a sloupové ventilátory. Vyberte si provedení do svého pokoje.', 'Vybrat ventilátor →', 'cool', 'Ventilátory');
    const existing = card.querySelector('.promo-wide-copy .promo-description,.article-rail-copy > span,.promo-description,:scope > span:not([class])');
    const title = clean(item?.title) || oldTitle;
    let text = clean(item?.text) || clean(existing?.textContent);
    if (GENERIC.test(text)) text = '';
    if (!title || GENERIC.test(title) || /^reklama$/i.test(title)) return null;
    // No invented discounts, price, delivery promise or generic replacement paragraph.
    const category = clean(item?.tag);
    const cta = /pojist/i.test(norm(title + ' ' + category)) ? 'Prohlédnout pojištění →' : /cest|zajezd|dovolen/i.test(norm(title + ' ' + category)) ? 'Prohlédnout zájezdy →' : 'Prohlédnout nabídku →';
    return model(host === 'ehub.cz' ? title : host, title, text, cta, 'partner', GENERIC.test(category) ? '' : category);
  }
  function installStyle() {
    if (document.getElementById('nk-ad-real-copy-v4-style')) return;
    const style = document.createElement('style');
    style.id = 'nk-ad-real-copy-v4-style';
    style.textContent = `
html body a.nk-ad-safe-fallback{--nk-ad-accent:#173d55;--nk-ad-tint:#f2f6f8;display:block!important;container-type:inline-size;box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;max-height:none!important;min-height:0!important;aspect-ratio:auto!important;padding:0!important;overflow:hidden!important;border:1px solid #dbe3e7!important;border-radius:16px!important;background:#fff!important;color:#172d39!important;text-decoration:none!important;box-shadow:0 6px 20px #132d3910!important;}
html body a.nk-ad-safe-fallback[data-nk-ad-theme="clean"]{--nk-ad-accent:#126458;--nk-ad-tint:#f0f8f5;}
html body a.nk-ad-safe-fallback[data-nk-ad-theme="clear"]{--nk-ad-accent:#803712;--nk-ad-tint:#fff7ed;}
html body a.nk-ad-safe-fallback[data-nk-ad-theme="home"]{--nk-ad-accent:#253d66;--nk-ad-tint:#f3f5fa;}
html body a.nk-ad-safe-fallback[data-nk-ad-theme="cool"]{--nk-ad-accent:#115c78;--nk-ad-tint:#eef8fb;}
html body a.nk-ad-safe-fallback::before,html body a.nk-ad-safe-fallback::after,html body a.nk-ad-safe-fallback > :not(.nk-ad-safe-copy){display:none!important;content:none!important;}
html body a.nk-ad-safe-fallback > .nk-ad-safe-copy{display:block!important;position:static!important;visibility:visible!important;opacity:1!important;width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;padding:0!important;box-sizing:border-box!important;text-align:left!important;}
html body .nk-ad-safe-copy *{box-sizing:border-box!important;min-width:0!important;max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;text-overflow:clip!important;}
html body .nk-ad-safe-copy .nk-ad-head{display:flex!important;flex-direction:column!important;gap:10px!important;padding:18px!important;background:var(--nk-ad-accent)!important;color:#fff!important;}
html body .nk-ad-safe-copy .nk-ad-disclosure{display:block!important;margin:0!important;color:#fff!important;opacity:.85!important;font:700 9px/1.3 Arial,sans-serif!important;letter-spacing:.1em!important;}
html body .nk-ad-safe-copy .nk-ad-brand{display:block!important;color:#fff!important;font:700 13px/1.4 Arial,sans-serif!important;}
html body .nk-ad-safe-copy .nk-ad-title{display:block!important;margin:0!important;color:#fff!important;font:800 23px/1.16 Arial,sans-serif!important;letter-spacing:-.025em!important;}
html body .nk-ad-safe-copy .nk-ad-body{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:12px!important;padding:18px!important;background:var(--nk-ad-tint)!important;}
html body .nk-ad-safe-copy .nk-ad-category{display:block!important;margin:0!important;color:var(--nk-ad-accent)!important;font:700 10px/1.4 Arial,sans-serif!important;letter-spacing:.04em!important;text-transform:uppercase!important;}
html body .nk-ad-safe-copy .promo-description{display:block!important;margin:0!important;color:#354b58!important;font:400 14px/1.55 Arial,sans-serif!important;}
html body .nk-ad-safe-copy .nk-ad-cta{display:block!important;margin:2px 0 0!important;padding:10px 12px!important;border-radius:8px!important;background:var(--nk-ad-accent)!important;color:#fff!important;font:700 12px/1.4 Arial,sans-serif!important;}
html body a.nk-ad-safe-fallback:focus-visible{outline:3px solid #167ab0!important;outline-offset:4px!important;}
html body a.nk-ad-safe-fallback:hover .nk-ad-cta{text-decoration:underline!important;}
html body a[data-nk-ad-unavailable="true"]{display:none!important;}
@container(min-width:520px){html body a.nk-ad-safe-fallback > .nk-ad-safe-copy{display:grid!important;grid-template-columns:minmax(0,44%) minmax(0,56%)!important;}html body .nk-ad-safe-copy .nk-ad-head,html body .nk-ad-safe-copy .nk-ad-body{padding:24px!important;justify-content:center!important;}html body .nk-ad-safe-copy .nk-ad-title{font-size:28px!important;}}
`;
    (document.head || document.documentElement).appendChild(style);
  }
  function element(tag, cls, text) { const e = document.createElement(tag); e.className = cls; if (text) e.textContent = text; return e; }
  function mark(card) {
    if (!(card instanceof Element) || !card.matches(SELECTOR)) return;
    const href = card.getAttribute('href');
    if (done.get(card) === href && card.querySelector(':scope > .nk-ad-safe-copy')) return;
    const offer = offerFor(card);
    if (!offer || offer.expired) { if (card.dataset.nkAdUnavailable !== 'true') card.dataset.nkAdUnavailable = 'true'; return; }
    delete card.dataset.nkAdUnavailable;
    const copy = element('span', 'nk-ad-safe-copy');
    const head = element('span', 'nk-ad-head');
    const wrapper = card.closest('[data-promos],.featured-cleaning-ad,.featured-rotating-ad,.promo-wrap');
    const outerLabel = wrapper?.querySelector('.promo-label');
    if (!outerLabel || card.contains(outerLabel)) head.append(element('small', 'nk-ad-disclosure', 'REKLAMA'));
    if (offer.brand !== offer.title) head.append(element('span', 'nk-ad-brand', offer.brand));
    head.append(element('strong', 'nk-ad-title', offer.title));
    const body = element('span', 'nk-ad-body');
    if (offer.category) body.append(element('small', 'nk-ad-category', offer.category));
    if (offer.text) body.append(element('span', 'promo-description', offer.text));
    body.append(element('b', 'nk-ad-cta', offer.cta));
    copy.append(head, body);
    const previous = card.querySelector(':scope > .nk-ad-safe-copy');
    if (previous) previous.replaceWith(copy); else card.append(copy);
    for (const child of card.children) if (child !== copy) child.style.setProperty('display', 'none', 'important');
    card.dataset.nkAdTheme = offer.theme;
    card.dataset.nkAdVersion = '20260910-v4';
    card.setAttribute('aria-label', 'Reklama: ' + offer.brand + '. ' + offer.title);
    if (!card.classList.contains('nk-ad-safe-fallback')) card.classList.add('nk-ad-safe-fallback');
    done.set(card, href);
  }
  function inspect(card) {
    if (card.classList.contains('nk-ad-safe-fallback') || card.classList.contains('nk-ad-generated-card') || card.classList.contains('is-image-error') || card.querySelector('.nk-ad-generated-visual,.promo-banner-fallback') || [...card.querySelectorAll('img')].some(i => i.complete && i.naturalWidth === 0)) mark(card);
  }
  function scan(root) { if (!(root instanceof Element || root === document)) return; if (root instanceof Element && root.matches(SELECTOR)) inspect(root); root.querySelectorAll(SELECTOR).forEach(inspect); }
  function start() {
    installStyle(); scan(document);
    document.addEventListener('error', e => { if (e.target instanceof HTMLImageElement) { const c = e.target.closest(SELECTOR); if (c) mark(c); } }, true);
    new MutationObserver(rows => {
      // Observe only bounded DOM events, not layout/resize; writes are idempotent.
      for (const row of rows) {
        if (row.type === 'attributes') { const c = row.target.closest(SELECTOR); if (c) inspect(c); }
        else { if (row.target instanceof Element) { const c = row.target.closest(SELECTOR); if (c) inspect(c); } for (const n of row.addedNodes) scan(n); }
      }
    }).observe(document.documentElement, {subtree:true,childList:true,attributes:true,attributeFilter:['class','src','href']});
    [100,350,800,1600,3200].forEach(ms => setTimeout(() => scan(document), ms));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();
