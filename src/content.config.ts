import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
    loader: glob({
        base: "src/products",
        pattern: ['*.md', '*.mdx'],
    }),
    schema: z.object({
        displayName: z.string(),
        prodigiSku: z.string().optional(),
        stripeSku: z.string().optional(),
        sizing: z.enum(["fillPrintArea", "fitPrintArea", "stretchToPrintArea"]).default("fillPrintArea"),
        availableFrom: z.date().optional(),
        availableUntil: z.date().optional(),
        stripeId: z.string().optional(),
    }),
});

export const collections = { products };