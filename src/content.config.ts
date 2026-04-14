import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * 아티클 컬렉션 스키마
 *
 * RSS에서 수집한 개발 도구 업데이트를 저장한다.
 */
const articlesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    id: z.string(),
    tool: z.enum(['eslint', 'prettier', 'typescript', 'nextjs', 'react', 'astro', 'nodejs']),
    title: z.string(),
    link: z.string().url(),
    pubDate: z.coerce.date(),
  }),
})

export const collections = {
  articles: articlesCollection,
}
