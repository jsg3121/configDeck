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
    /**
     * jszip은 stack/ai-config 생성기에서 동적 import (`(await import('jszip')).default`)로
     * 사용된다. 사전 번들링 대상으로 등록해 dev 서버 재시작/HMR 사이에 청크 캐시가
     * 무효화되어 "Failed to fetch dynamically imported module" 에러가 나는 것을 방지한다.
     */
    optimizeDeps: {
      include: ['jszip'],
    },
  },
})
