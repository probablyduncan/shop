import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const greetings = {
    getGreeting: defineAction({
        input: z.object({
            name: z.string(),
        }),
        handler: async (input) => {
            return `Hello, ${input.name}`;
        }
    }),
    getGoodbye: defineAction({
        input: z.object({
            forever: z.boolean().default(false),
            name: z.string(),
        }),
        handler: async (input) => {
            return `Goodbye${input.forever ? " forever" : ""}, ${input.name}`;
        }
    })
}