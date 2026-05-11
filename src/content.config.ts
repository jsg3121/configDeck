import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * 아티클 컬렉션 스키마
 *
 * RSS에서 수집한 개발 도구 업데이트를 Editorial Commentary 형식으로 저장한다
 * (SPEC-0007 / ADR-0021).
 *
 * 기존 124개의 환각 형식 아티클은 v1.6.0 페이즈 4(2026-05-11)에서 모두 삭제되었고,
 * 이 시점부터 신규 발행되는 모든 article은 새 파이프라인(generate-summary)이 만든
 * Editorial Commentary 형식이다. 따라서 `sourceName`/`sourceUrl`/`contentType`을
 * required로 전환하여 누락 시 빌드 단계에서 즉시 차단한다.
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
    // ↓ SPEC-0007 Editorial Commentary 모델 — 모두 required
    sourceName: z.string(),
    sourceUrl: z.string().url(),
    contentType: z.enum(['commentary', 'original', 'tutorial']).default('commentary'),
  }),
})

/**
 * Advisory 컬렉션 스키마 (SPEC-0006 / ADR-0020).
 *
 * 프레임워크 보안 권고(CVE)·마이그레이션 가이드를 저장한다.
 * frontmatter `affected[].range`/`patched[]`가 진단 룰셋의 single source of truth로 작동하며,
 * 진단 컴포넌트(`AdvisoryDiagnosis.svelte`)가 이 데이터를 직접 소비한다.
 *
 * 다국어는 articles 컬렉션과 동일하게 `{locale}/{slug}.md` 폴더 구조를 따른다.
 * 진단 룰셋(affected/patched/severity/cvssScore/status/날짜 필드)은 로케일 간 동일해야 하며,
 * 본문(MDX)과 title/summary만 로케일별로 다르다. 빌드 타임 검증은 페이지의 getStaticPaths에서 수행한다.
 */
const advisoryCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/advisory' }),
  schema: z.object({
    cveId: z.string().optional(),
    ghsaId: z.string().optional(),
    title: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    cvssScore: z.number().min(0).max(10).optional(),
    ecosystem: z.literal('npm'),
    package: z.string(),
    affected: z.array(z.object({ range: z.string() })),
    patched: z.array(z.string()),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    sunsetAt: z.coerce.date().optional(),
    status: z.enum(['active', 'stale', 'superseded', 'archived']).default('active'),
    supersededBy: z.string().optional(),
    references: z.array(z.object({ label: z.string(), url: z.string().url() })),
    credits: z.array(z.object({ name: z.string(), url: z.string().url().optional() })).optional(),
    cwe: z.array(z.string()).optional(),
    summary: z.string(),
  }),
})

export const collections = {
  articles: articlesCollection,
  advisory: advisoryCollection,
}
