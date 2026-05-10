import type { Locale } from '@/i18n'
import type { CollectionEntry } from 'astro:content'

type AdvisoryEntry = CollectionEntry<'advisory'>

/**
 * 공지 배너에 노출할 advisory 1건을 선정한다.
 *
 * 정책 (사용자 합의 사항):
 * - 대상 로케일에 해당하는 콘텐츠만 (id가 `${locale}/`로 시작하는 항목)
 * - status === 'active' 만 (stale/superseded/archived 제외)
 * - severity === 'critical' | 'high' 만 (medium/low 제외 — 배너 피로도 회피)
 * - publishedAt 내림차순 정렬 후 최상단 1건
 * - 해당 조건을 만족하는 항목이 없으면 null 반환 → 배너 미노출
 *
 * @example
 * const banner = selectFeaturedAdvisory(allAdvisories, 'ko')
 * if (banner) {
 *   // 배너 표시
 * }
 */
export function selectFeaturedAdvisory(
  allAdvisories: AdvisoryEntry[],
  locale: Locale,
): AdvisoryEntry | null {
  const candidates = allAdvisories.filter((entry) => {
    if (!entry.id.startsWith(`${locale}/`)) return false
    if (entry.data.status !== 'active') return false
    if (entry.data.severity !== 'critical' && entry.data.severity !== 'high') return false
    return true
  })

  if (candidates.length === 0) return null

  return candidates.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())[0]
}

/**
 * advisory entry id에서 slug 부분만 추출한다.
 * 예: `ko/nextjs-cve-2025-29927` → `nextjs-cve-2025-29927`
 */
export function getAdvisorySlug(entry: AdvisoryEntry): string {
  const [, ...slugParts] = entry.id.split('/')
  return slugParts.join('/')
}
