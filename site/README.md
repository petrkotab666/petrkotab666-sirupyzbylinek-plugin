# SirupyZBylinek.cz – nový jednotný web

Statický obsahový web v Astro. WordPress zůstává během migrace beze změny jako záloha.

## Lokální spuštění

```bash
npm install
npm run dev
```

## Import stávajícího WordPressu

```bash
npm run import:wordpress
npm run build
```

Import nepoužívá WordPress REST API. Projde veřejnou sitemapu a interní odkazy, převede obsah do Markdownu a stáhne obrázky do `public/media/imported`.

## Cloudflare Pages

- Repository: `petrkotab666/petrkotab666-sirupyzbylinek-plugin`
- Production branch: `main`
- Root directory: `site`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: `22`

Nejdříve připojte pouze náhledovou adresu `*.pages.dev`. Doménu `sirupyzbylinek.cz` přepněte až po kontrole URL, obsahu a obrázků.
