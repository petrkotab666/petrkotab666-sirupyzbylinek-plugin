import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkCleanLegacyContent from './scripts/remark-clean-legacy-content.mjs';

export default defineConfig({
  site: 'https://www.sirupyzbylinek.cz',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkCleanLegacyContent],
    shikiConfig: { theme: 'github-light' },
  },
});
