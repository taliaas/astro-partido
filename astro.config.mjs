// @ts-check
import { defineConfig, envField } from "astro/config";

import vue from "@astrojs/vue";

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel";

import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [vue({ appEntrypoint: "/src/main.ts" }), tailwind(), auth()],
  adapter: vercel({ imageService: true, maxDuration: 60 }),
  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        url: true,
      }),
    },
  },
});
