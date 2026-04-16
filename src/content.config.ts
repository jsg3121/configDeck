import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * 아티클 컬렉션 스키마
 *
 * RSS에서 수집한 개발 도구 업데이트를 저장한다.
 * AI가 생성한 요약, 상세 설명, 하이라이트 등을 포함한다.
 */
const articlesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    id: z.string(),
    tool: z.enum([
      'eslint',
      'prettier',
      'typescript',
      'nextjs',
      'react',
      'astro',
      'nodejs',
      'webdev',
      'tailwindcss',
      'vite',
      'smashingmagazine',
      'csstricks',
      'searchenginejournal',
      'googlesearchcentral',
      'javascriptweekly',
    ]),
    title: z.string(),
    link: z.string().url(),
    pubDate: z.coerce.date(),
    summary: z.string(),
  }),
})

export const collections = {
  articles: articlesCollection,
}
