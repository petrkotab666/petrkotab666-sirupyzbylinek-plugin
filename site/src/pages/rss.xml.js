import rss from '@astrojs/rss';
import { cleanDescription, getPublishedArticles } from '../lib/articles';

export async function GET(context) {
  const articles = (await getPublishedArticles()).filter((entry) => entry.data.date);
  return rss({
    title: 'Sirupy z bylinek',
    description: 'Recepty, sběr, pěstování a bezpečné používání bylinek.',
    site: context.site,
    items: articles.map((entry) => ({
      title: entry.data.title,
      description: cleanDescription(entry.data.description, entry.body),
      pubDate: entry.data.date,
      link: entry.data.path,
    })),
  });
}
