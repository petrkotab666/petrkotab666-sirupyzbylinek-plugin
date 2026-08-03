import type { ArticleEntry } from './articles';
import { cleanDescription } from './articles';
import { displayArticleImage } from './display-image';

export interface ArticleHubCard {
  href: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  kicker?: string;
}

export function articleHubCards(entries: readonly ArticleEntry[], kicker?: string): ArticleHubCard[] {
  return entries.map((entry) => ({
    href: entry.data.path,
    title: entry.data.title,
    text: cleanDescription(entry.data.description || '', entry.body || ''),
    image: displayArticleImage(entry),
    imageAlt: entry.data.title,
    kicker,
  }));
}

export function normalizeForHub(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function matchesHub(entry: ArticleEntry, pattern: RegExp, required?: RegExp) {
  const haystack = normalizeForHub(`${entry.data.title} ${entry.data.path} ${entry.data.description || ''}`);
  return pattern.test(haystack) && (!required || required.test(haystack));
}
