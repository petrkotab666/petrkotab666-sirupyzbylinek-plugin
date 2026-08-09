import type { ArticleEntry } from './articles';
import { articleImage, topicImage } from './articles';
import { keyedHubPhoto } from './hub-photo';

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
  return keyedHubPhoto(entry.data.path, entry.data.title);
}

export function emergencyArticleImage(entry: ArticleEntry) {
  return keyedHubPhoto(`${entry.data.path}fallback`, entry.data.title) || topicImage(entry);
}
