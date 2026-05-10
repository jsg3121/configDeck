/**
 * Advisory 다국어 frontmatter 일치 검증 (ADR-0020 §결과/후속 조치).
 *
 * 동일 slug의 ko/en advisory frontmatter에서 진단 룰셋 + 시점·상태 필드가 일치하는지 검사한다.
 * 불일치하는 경우 사용자가 같은 페이지의 한국어/영어 버전에서 다른 진단 결과를 받게 되므로
 * 빌드 타임에 차단해야 한다.
 *
 * title과 summary는 로케일별로 의도적으로 다르므로 검증 대상이 아니다.
 */
import type { CollectionEntry } from 'astro:content'

type AdvisoryEntry = CollectionEntry<'advisory'>

const LOCALE_INVARIANT_FIELDS = [
  'severity',
  'cvssScore',
  'ecosystem',
  'package',
  'status',
  'supersededBy',
] as const

/**
 * `${locale}/${slug}` 형태의 entry id에서 slug만 추출한다.
 * (예: "ko/nextjs-cve-2025-29927" → "nextjs-cve-2025-29927")
 */
const stripLocalePrefix = (entryId: string): string => {
  const slashIndex = entryId.indexOf('/')
  return slashIndex >= 0 ? entryId.slice(slashIndex + 1) : entryId
}

const isoString = (date: Date | undefined): string | undefined =>
  date instanceof Date ? date.toISOString() : undefined

const arrayOfRangesEqual = (a: { range: string }[], b: { range: string }[]): boolean => {
  if (a.length !== b.length) return false
  return a.every((item, index) => item.range === b[index].range)
}

const arrayOfStringsEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

/**
 * 동일 slug를 가진 두 advisory entry의 frontmatter가 진단 일관성을 유지하는지 검증한다.
 * 일치하지 않으면 Error를 throw하여 빌드를 실패시킨다.
 */
export const assertAdvisoryLocaleConsistency = (entries: AdvisoryEntry[]): void => {
  const groupedBySlug = new Map<string, AdvisoryEntry[]>()
  for (const entry of entries) {
    const slug = stripLocalePrefix(entry.id)
    const bucket = groupedBySlug.get(slug)
    if (bucket) {
      bucket.push(entry)
    } else {
      groupedBySlug.set(slug, [entry])
    }
  }

  for (const [slug, group] of groupedBySlug) {
    if (group.length < 2) continue
    const [base, ...rest] = group
    for (const other of rest) {
      // 단순 필드
      for (const field of LOCALE_INVARIANT_FIELDS) {
        if (base.data[field] !== other.data[field]) {
          throw new Error(
            `[advisory consistency] slug "${slug}": field "${field}" differs between ${base.id} (${String(
              base.data[field],
            )}) and ${other.id} (${String(other.data[field])}).`,
          )
        }
      }

      // 날짜 필드 (Date 비교 대신 ISO 문자열 비교로 안전 처리)
      const dateFields: ['publishedAt', 'updatedAt', 'sunsetAt'] = [
        'publishedAt',
        'updatedAt',
        'sunsetAt',
      ]
      for (const field of dateFields) {
        const lhs = isoString(base.data[field])
        const rhs = isoString(other.data[field])
        if (lhs !== rhs) {
          throw new Error(
            `[advisory consistency] slug "${slug}": field "${field}" differs between ${base.id} (${
              lhs ?? '—'
            }) and ${other.id} (${rhs ?? '—'}).`,
          )
        }
      }

      // 배열 필드 — affected
      if (!arrayOfRangesEqual(base.data.affected, other.data.affected)) {
        throw new Error(
          `[advisory consistency] slug "${slug}": "affected" ranges differ between ${base.id} and ${other.id}.`,
        )
      }

      // 배열 필드 — patched
      if (!arrayOfStringsEqual(base.data.patched, other.data.patched)) {
        throw new Error(
          `[advisory consistency] slug "${slug}": "patched" versions differ between ${base.id} and ${other.id}.`,
        )
      }
    }
  }
}

/**
 * advisory entry의 id에서 locale 부분(예: "ko/")을 제거한 slug를 반환한다.
 * 페이지 라우팅에서 재사용하기 위해 export.
 */
export const getAdvisorySlug = stripLocalePrefix
