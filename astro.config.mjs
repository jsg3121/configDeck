// @ts-check
import fs from 'node:fs'
import path from 'node:path'

import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

/**
 * Sitemap serialize 헬퍼 (SPEC-0007 페이즈 5).
 *
 * @astrojs/sitemap이 빌드 시 생성하는 각 URL 항목에 `lastmod`/`changefreq`/`priority`를
 * 페이지 유형별로 휴리스틱하게 채운다.
 *
 * Google은 changefreq·priority를 무시(공식 문서 명시)하지만 Bing·Yandex 등 일부 검색
 * 엔진이 참고할 수 있고, 사용자 요청에 따라 모두 출력한다. lastmod는 Google이 실제로
 * 크롤 빈도 결정에 사용한다.
 *
 * advisory 페이지의 lastmod는 frontmatter `updatedAt`을 사용한다. 다른 페이지는
 * 정적이라 빌드 시간(=현재 시각)을 sitemap 기본값으로 사용한다.
 */
const ADVISORY_DIR = path.join(process.cwd(), 'src/content/advisory')

/** advisory slug → updatedAt ISO 문자열 매핑을 빌드 시점에 1회 만든다. */
const buildAdvisoryUpdatedMap = () => {
  const map = new Map()
  for (const locale of ['en', 'ko']) {
    const localeDir = path.join(ADVISORY_DIR, locale)
    if (!fs.existsSync(localeDir)) continue
    for (const file of fs.readdirSync(localeDir)) {
      if (!file.endsWith('.md')) continue
      const content = fs.readFileSync(path.join(localeDir, file), 'utf-8')
      const m = content.match(/^updatedAt:\s*(.+)$/m)
      if (!m) continue
      const date = new Date(m[1].trim())
      if (Number.isNaN(date.getTime())) continue
      const slug = file.replace(/\.md$/, '')
      // locale 간 같은 slug의 updatedAt은 SPEC-0006 정책상 동일하므로 어느 값을
      // 사용해도 무방하다.
      map.set(slug, date.toISOString())
    }
  }
  return map
}

const advisoryUpdatedMap = buildAdvisoryUpdatedMap()

/**
 * 페이지 경로(URL pathname)에 따라 priority/changefreq를 반환한다.
 * @param {string} pathname
 * @returns {{ priority: number, changefreq: ChangeFreqEnum }}
 */
const getPagePolicy = (pathname) => {
  // 홈
  if (pathname === '/' || /^\/(en|ko)\/?$/.test(pathname)) {
    return { priority: 1.0, changefreq: ChangeFreqEnum.DAILY }
  }
  // Generator 페이지 (핵심 자산)
  if (/^\/(en|ko)\/generator(\/|$)/.test(pathname)) {
    return { priority: 0.9, changefreq: ChangeFreqEnum.WEEKLY }
  }
  // Migration (핵심 기능)
  if (/^\/(en|ko)\/migration(\/|$)/.test(pathname)) {
    return { priority: 0.8, changefreq: ChangeFreqEnum.WEEKLY }
  }
  // AI Config (핵심 기능)
  if (/^\/(en|ko)\/ai-config(\/|$)/.test(pathname)) {
    return { priority: 0.8, changefreq: ChangeFreqEnum.WEEKLY }
  }
  // Advisory 상세
  if (/^\/(en|ko)\/advisory\/[^/]+$/.test(pathname)) {
    return { priority: 0.7, changefreq: ChangeFreqEnum.WEEKLY }
  }
  // Advisory 목록
  if (/^\/(en|ko)\/advisory\/?$/.test(pathname)) {
    return { priority: 0.6, changefreq: ChangeFreqEnum.DAILY }
  }
  // 기본값
  return { priority: 0.5, changefreq: ChangeFreqEnum.MONTHLY }
}

/**
 * advisory 상세 페이지면 frontmatter updatedAt을 lastmod로 반환, 아니면 undefined.
 * @param {string} pathname
 * @returns {string | undefined}
 */
const getAdvisoryLastmod = (pathname) => {
  const m = pathname.match(/^\/(?:en|ko)\/advisory\/([^/]+)\/?$/)
  if (!m) return undefined
  return advisoryUpdatedMap.get(m[1])
}

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

  integrations: [
    svelte(),
    sitemap({
      // /article 경로는 자동 생성 콘텐츠 품질 이슈로 noindex 상태이므로
      // sitemap에서도 제외해 도메인 권위 손실을 차단한다 (hotfix v1.5.2).
      filter: (page) => !/\/article(\/|$)/.test(new URL(page).pathname),
      // 페이지 유형별로 lastmod/changefreq/priority를 부여한다 (SPEC-0007 페이즈 5).
      // lastmod는 Google이 실제 사용하며, advisory는 frontmatter updatedAt을 활용한다.
      serialize(item) {
        const pathname = new URL(item.url).pathname
        const policy = getPagePolicy(pathname)
        const advisoryLastmod = getAdvisoryLastmod(pathname)
        return {
          ...item,
          // advisory 상세는 frontmatter updatedAt, 나머지는 sitemap 기본값(빌드 시간)
          lastmod: advisoryLastmod ?? item.lastmod,
          changefreq: policy.changefreq,
          priority: policy.priority,
        }
      },
    }),
  ],

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
