import { herbalPreparations, preparationCategories } from '../../../data/herbal-preparations';
import { renderArtworkScene } from '../../../lib/artwork-scene';

export function getStaticPaths() {
  return herbalPreparations.map((recipe) => ({ params: { slug: recipe.slug }, props: { recipe } }));
}

export function GET({ props }: { props: { recipe: (typeof herbalPreparations)[number] } }) {
  const { recipe } = props;
  const meta = preparationCategories[recipe.category];
  const svg = renderArtworkScene({
    title: recipe.title,
    key: `${recipe.slug}-scene`,
    topic: meta.art,
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
