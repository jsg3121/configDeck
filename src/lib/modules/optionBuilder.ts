/**
 * 옵션 값 빌더 모듈
 * 설정 파일 생성기에서 사용하는 옵션 값 초기화 및 동기화 로직을 담당한다.
 */

import { getOptionDefinition } from '@/lib/data/options'

/**
 * 파일 slug에 해당하는 모든 control의 빈 값(초기 상태)으로 구성된 맵을 생성한다.
 * @param slug - 설정 파일의 slug (예: 'eslint', 'prettier')
 * @returns 각 control key에 대한 초기값 맵
 */
export const buildEmptyValues = (slug: string): Record<string, unknown> => {
  const definition = getOptionDefinition(slug)
  if (!definition) return {}

  const empty: Record<string, unknown> = {}
  for (const section of definition.sections) {
    for (const control of section.controls) {
      switch (control.type) {
        case 'checkbox':
          empty[control.key] = false
          break
        case 'number':
          empty[control.key] = null
          break
        case 'radio':
        case 'select':
        case 'text':
          empty[control.key] = ''
          break
        case 'tags':
          empty[control.key] = []
          break
        case 'key-value':
          empty[control.key] = {}
          break
      }
    }
  }
  return empty
}

/**
 * touched 키 기반으로 옵션 값을 필터링하여 generator에 전달할 옵션을 생성한다.
 * @param values - 전체 옵션 값 맵
 * @param touchedKeys - 사용자가 변경한 키 Set
 * @returns touched 키에 해당하는 옵션만 포함된 맵
 */
export const buildGeneratorOptions = (
  values: Record<string, unknown>,
  touchedKeys: Set<string>,
): Record<string, unknown> => {
  const opts: Record<string, unknown> = {}
  for (const key of touchedKeys) {
    if (key in values) {
      opts[key] = values[key]
    }
  }
  return opts
}
