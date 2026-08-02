import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: '**/*.md',
    deferRender: true,
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    path: z.string().regex(/^\//),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    category: z.string().default('Bylinky'),
    featured: z.boolean().default(false),
    legacy: z.boolean().default(false),
    draft: z.boolean().default(false),
    sourceUrl: z.string().url().optional(),
  }),
});

export const collections = { articles };
