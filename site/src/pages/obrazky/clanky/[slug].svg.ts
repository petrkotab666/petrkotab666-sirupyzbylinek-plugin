import { getCollection, type CollectionEntry } from 'astro:content';
import { articleArtworkKey } from '../../../lib/display-image';
import { inferArtworkTopic, renderArticleArtwork } from '../../../lib/artwork';

export async function getStaticPaths() {
  const entries = await getCollection('articles', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    params: { slug: articleArtworkKey(entry) },
    props: { entry },
  }));
}

export async function GET({ props }: { props: { entry: CollectionEntry<'articles'> } }) {
  const { entry } = props;
  const topic = inferArtworkTopic(`${entry.data.title} ${entry.data.category} ${entry.data.path}`);
  const rawSvg = renderArticleArtwork({
    title: entry.data.title,
    key: entry.data.path,
    topic,
    subtitle: entry.data.category || 'SIRUPY Z BYLINEK',
  });

  // Generated artwork is used behind a real HTML title. Visible text baked into
  // an image caused duplicated or cropped headings in cards and article heroes.
  // Keep the accessible <title>/<desc>, remove only visible SVG <text> nodes.
  const svg = rawSvg.replace(/<text\b[^>]*>[\s\S]*?<\/text>/gu, '');

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
