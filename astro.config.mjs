// @ts-check
import sitemap from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://configdeck.dev',

  trailingSlash: 'never',
  build: {
    format: 'file',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [svelte(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
})
