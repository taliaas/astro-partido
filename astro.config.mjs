// @ts-check
// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel";

import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [vue({ appEntrypoint: "/src/main.ts" }), tailwind(), auth()],
  adapter: vercel({ imageService: true, maxDuration: 60 }),
});
