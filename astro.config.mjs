// @ts-check
import { defineConfig, envField } from 'astro/config';
import clerk from "@clerk/astro";
import netlify from "@astrojs/netlify";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

export default defineConfig({

    env: {
        schema: {
            PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
                context: "client",
                access: "public",
            }),
            CLERK_SECRET_KEY: envField.string({
                context: "server",
                access: "secret",
            }),
            STRIPE_SECRET_KEY: envField.string({
                context: "server",
                access: "secret",
            }),
            STRIPE_SIGNING_SECRET: envField.string({
                context: "server",
                access: "secret",
            }),
            PRODIGI_API_KEY: envField.string({
                context: "server",
                access: "secret"
            }),
            PRODIGI_API_URL: envField.string({
                context: "client",
                access: "public",
            }),
        }
    },

    integrations: [clerk(), tailwind(), mdx()],
    adapter: netlify(),
    output: "server",

});