import type { ArticleEntry } from './articles';
import { articleImage, topicImage } from './articles';

export function articleArtworkKey(entry: ArticleEntry) {
  return entry.data.path
    .split('/')
    .filter(Boolean)
    .join('--')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'clanek';
}

export function generatedArticleImage(entry: ArticleEntry) {
  return `/obrazky/clanky/${articleArtworkKey(entry)}.svg`;
}

export function displayArticleImage(entry: ArticleEntry) {
  const selected = articleImage(entry);
  if (selected.startsWith('/media/imported/') || /^https?:\/\//iu.test(selected)) return selected;
  return generatedArticleImage(entry);
}

export function emergencyArticleImage(entry: ArticleEntry) {
  return generatedArticleImage(entry) || topicImage(entry);
}
