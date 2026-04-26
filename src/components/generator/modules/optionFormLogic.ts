/**
 * OptionForm 전용 비즈니스 로직 모듈
 * 옵션 검색, 섹션 필터링, 하이라이트 로직을 담당한다.
 */

import type { NewOptionSection, OptionControl } from '@/types/generator'

/**
 * 섹션 내 advanced 옵션 수를 계산한다.
 * @param section - 옵션 섹션
 * @returns advanced tier 컨트롤 개수
 */
export const getAdvancedCount = (section: NewOptionSection): number => {
  return section.controls.filter((c) => c.tier === 'advanced').length
}

/**
 * 전체 섹션에서 advanced 옵션 총 수를 계산한다.
 * @param sections - 옵션 섹션 목록
 * @returns 전체 advanced tier 컨트롤 개수
 */
export const getTotalAdvancedCount = (sections: NewOptionSection[]): number => {
  return sections.reduce((sum, section) => sum + getAdvancedCount(section), 0)
}

/**
 * 검색어로 옵션을 필터링한다.
 * @param sections - 옵션 섹션 목록
 * @param query - 검색어
 * @param locale - 현재 로케일
 * @returns 매칭된 컨트롤과 섹션 타이틀 목록
 */
export const searchOptions = (
  sections: NewOptionSection[],
  query: string,
  locale: string,
): Array<{ control: OptionControl; sectionTitle: string }> => {
  const trimmedQuery = query.trim().toLowerCase()
  if (trimmedQuery.length < 2) return []

  return sections.flatMap((section) =>
    section.controls
      .filter((control) => {
        return (
          control.key.toLowerCase().includes(trimmedQuery) ||
          control.label.toLowerCase().includes(trimmedQuery) ||
          control.labelEn.toLowerCase().includes(trimmedQuery) ||
          control.description.toLowerCase().includes(trimmedQuery) ||
          control.descriptionEn.toLowerCase().includes(trimmedQuery)
        )
      })
      .map((control) => ({
        control,
        sectionTitle: locale === 'ko' ? section.title : section.titleEn,
      })),
  )
}

/**
 * 특정 컨트롤이 advanced tier인지 확인한다.
 * @param sections - 옵션 섹션 목록
 * @param key - 컨트롤 키
 * @returns advanced tier 여부
 */
export const isAdvancedOption = (sections: NewOptionSection[], key: string): boolean => {
  const control = sections.flatMap((s) => s.controls).find((c) => c.key === key)
  return control?.tier === 'advanced'
}

/**
 * 선택된 옵션으로 스크롤하고 하이라이트를 적용한다.
 * @param key - 컨트롤 키
 * @param setHighlight - 하이라이트 상태 설정 함수
 * @param highlightDuration - 하이라이트 유지 시간 (ms)
 */
export const scrollToOptionAndHighlight = (
  key: string,
  setHighlight: (key: string | null) => void,
  highlightDuration = 2000,
): void => {
  requestAnimationFrame(() => {
    const element = document.getElementById(`control-${key}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlight(key)
      setTimeout(() => {
        setHighlight(null)
      }, highlightDuration)
    }
  })
}

/**
 * 컨트롤의 현재 값을 조회한다. 없으면 default를 사용한다.
 * @param values - 현재 옵션 값 맵
 * @param control - 옵션 컨트롤
 * @returns 현재 값 또는 기본값
 */
export const getControlValue = (
  values: Record<string, unknown>,
  control: OptionControl,
): unknown => {
  if (control.key in values) return values[control.key]
  return control.default
}
