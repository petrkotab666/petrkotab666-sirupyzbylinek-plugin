import { getCollection } from 'astro:content';
import { articleArtworkKey } from '../../../lib/display-image';
import { inferArtworkTopic, renderArticleArtwork } from '../../../lib/artwork';

export async function getStaticPaths() {
  const entries = await getCollection('articles', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    params: { slug: articleArtworkKey(entry) },
    props: { entry },
  }));
}

export async function GET({ props }: { props: { entry: Awaited<ReturnType<typeof getCollection<'articles'>>>[number] } }) {
  const { entry } = props;
  const topic = inferArtworkTopic(`${entry.data.title} ${entry.data.category} ${entry.data.path}`);
  const svg = renderArticleArtwork({
    title: entry.data.title,
    key: entry.data.path,
    topic,
    subtitle: entry.data.category || 'SIRUPY Z BYLINEK',
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
