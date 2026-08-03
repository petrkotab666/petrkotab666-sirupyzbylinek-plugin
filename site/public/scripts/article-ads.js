(() => {
  const placeArticleAds = () => {
    document.querySelectorAll('.article-shell').forEach((article) => {
      const content = article.querySelector('.article-content');
      if (!content) return;
      const headings = [...content.querySelectorAll(':scope > h2')];
      const paragraphs = [...content.querySelectorAll(':scope > p')];
      const ads = [...article.querySelectorAll('[data-inline-article-ad]')];

      ads.forEach((ad) => {
        if (content.contains(ad) || ad.dataset.moved === 'true') return;
        const position = ad.dataset.placement === 'lower' ? 5 : 2;
        const paragraphIndex = Math.min(position + 2, Math.max(0, paragraphs.length - 1));
        const target = headings[position - 1] || paragraphs[paragraphIndex];
        if (!target) return;
        target.insertAdjacentElement('afterend', ad);
        ad.dataset.moved = 'true';
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', placeArticleAds, { once: true });
  } else {
    placeArticleAds();
  }
})();
