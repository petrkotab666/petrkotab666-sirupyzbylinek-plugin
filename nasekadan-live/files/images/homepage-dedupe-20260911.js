// HOMEPAGE_ARTICLE_DEDUPE_20260911_V1
(() => {
  'use strict';

  const articleHref = (node) => {
    if (!(node instanceof Element)) return '';
    const links = node.matches('a[href*="/clanky/"]')
      ? [node]
      : Array.from(node.querySelectorAll('a[href*="/clanky/"]'));
    for (const link of links) {
      try {
        const url = new URL(link.getAttribute('href') || '', location.href);
        const path = url.pathname.replace(/\/+/g, '/').replace(/\/$/, '');
        if (/^\/clanky\/[^/]+\.html$/i.test(path)) return path.toLowerCase();
      } catch (_) {}
    }
    return '';
  };

  const titleKey = (node) => {
    const el = node.querySelector('h1,h2,h3,.copy h1,.article-body h3,strong');
    return String(el?.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase('cs-CZ');
  };

  const containers = () => Array.from(document.querySelectorAll([
    'main .hero .lead',
    'main .hero .current-aside',
    'main .article-list .article-card',
    'main [data-auto-article].article-card'
  ].join(',')));

  const dedupe = () => {
    const seenHref = new Set();
    const seenTitle = new Set();
    let removed = 0;

    for (const node of containers()) {
      if (!(node instanceof Element) || !node.isConnected) continue;
      const href = articleHref(node);
      const title = titleKey(node);

      const duplicateByHref = Boolean(href && seenHref.has(href));
      const duplicateByTitle = Boolean(title && seenTitle.has(title));

      if (duplicateByHref || duplicateByTitle) {
        node.remove();
        removed += 1;
        continue;
      }
      if (href) seenHref.add(href);
      if (title) seenTitle.add(title);
    }

    if (removed && document.documentElement) {
      document.documentElement.dataset.nkHomepageDeduped = String(removed);
    }
  };

  const start = () => {
    dedupe();
    [100, 350, 900, 2000, 5000].forEach(ms => setTimeout(dedupe, ms));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once: true});
  } else {
    start();
  }
})();
