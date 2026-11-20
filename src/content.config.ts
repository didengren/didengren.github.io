import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    role: z.string(),
    period: z.string(),
    year: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
    problem: z.string(),
    result: z.string(),
    diagram: z.enum(['converge', 'flow', 'layers', 'funnel', 'loop']),
    featured: z.boolean().default(false),
    order: z.number(),
    sources: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    period: z.string(),
    summary: z.string(),
    bullets: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    order: z.number(),
    early: z.boolean().default(false),
  }),
});

export const collections = { projects, experience };
