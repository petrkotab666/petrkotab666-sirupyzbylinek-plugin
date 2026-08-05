import { renderArticleArtwork, type ArtworkTopic } from './artwork';

interface ArtworkSceneInput {
  title: string;
  key: string;
  topic: ArtworkTopic;
}

/**
 * Vytvoří čistou tematickou ilustraci bez nápisů určenou pro široké hero bloky.
 * Kartové obrázky si nadále ponechávají nadpis, ale v hero bloku by se jejich
 * text ořezával a duplikoval nadpis stránky.
 */
export function renderArtworkScene({ title, key, topic }: ArtworkSceneInput) {
  return renderArticleArtwork({ title, key, topic, subtitle: '' })
    .replace(/\s*<rect x="72" y="72" width="330" height="42"[^>]*\/>/u, '')
    .replace(/\s*<text\b[^>]*>[\s\S]*?<\/text>/gu, '');
}
