/**
 * FileGenerator 전용 비즈니스 로직 모듈
 * 파일별 생성기의 프리셋 변경, URL 동기화 로직을 담당한다.
 */

import { buildEmptyValues, buildGeneratorOptions } from '@/lib/modules/optionBuilder'
import { getPresetDefaultsBySlug } from '@/lib/schemas'
import { encodeFileGeneratorUrl } from '@/lib/utils/shareUrl'

/**
 * 프리셋 변경 시 옵션 값과 touched 키를 업데이트한다.
 * @param fileSlug - 파일 slug
 * @param presetName - 선택된 프리셋 이름
 * @returns 업데이트된 옵션 값, touched 키, generator 옵션
 */
export const applyPreset = (
  fileSlug: string,
  presetName: string,
): {
  optionValues: Record<string, unknown>
  touchedKeys: Set<string>
  generatorOptions: Record<string, unknown>
} => {
  const defaults = getPresetDefaultsBySlug(fileSlug, presetName) as Record<string, unknown>
  const optionValues = { ...buildEmptyValues(fileSlug), ...defaults }
  const touchedKeys = new Set(Object.keys(defaults))
  const generatorOptions = buildGeneratorOptions(optionValues, touchedKeys)

  return { optionValues, touchedKeys, generatorOptions }
}

/**
 * 옵션 변경을 처리하고 업데이트된 상태를 반환한다.
 * @param currentValues - 현재 옵션 값 맵
 * @param currentTouched - 현재 touched 키 Set
 * @param key - 변경된 옵션 키
 * @param value - 새로운 값
 * @returns 업데이트된 옵션 값, touched 키, generator 옵션
 */
export const updateOption = (
  currentValues: Record<string, unknown>,
  currentTouched: Set<string>,
  key: string,
  value: unknown,
): {
  optionValues: Record<string, unknown>
  touchedKeys: Set<string>
  generatorOptions: Record<string, unknown>
} => {
  const optionValues = { ...currentValues, [key]: value }
  const touchedKeys = new Set([...currentTouched, key])
  const generatorOptions = buildGeneratorOptions(optionValues, touchedKeys)

  return { optionValues, touchedKeys, generatorOptions }
}

/**
 * 현재 옵션 상태를 URL에 반영한다 (히스토리 교체).
 * @param fileSlug - 파일 slug
 * @param selectedPreset - 선택된 프리셋 (없으면 undefined)
 * @param generatorOptions - 현재 generator 옵션
 * @param defaults - 기본값 맵
 */
export const syncUrlWithOptions = (
  fileSlug: string,
  selectedPreset: string | null,
  generatorOptions: Record<string, unknown>,
  defaults: Record<string, unknown>,
): void => {
  const baseUrl = window.location.pathname
  const result = encodeFileGeneratorUrl(
    baseUrl,
    { slug: fileSlug, preset: selectedPreset ?? undefined, options: generatorOptions },
    defaults,
  )
  window.history.replaceState(null, '', result.url)
}

/**
 * 공유 URL을 생성한다.
 * @param fileSlug - 파일 slug
 * @param selectedPreset - 선택된 프리셋 (없으면 undefined)
 * @param generatorOptions - 현재 generator 옵션
 * @param defaults - 기본값 맵
 * @returns 공유 URL과 경고 메시지
 */
export const buildShareUrl = (
  fileSlug: string,
  selectedPreset: string | null,
  generatorOptions: Record<string, unknown>,
  defaults: Record<string, unknown>,
): { url: string; warning?: string } => {
  if (typeof window === 'undefined') return { url: '', warning: undefined }

  const baseUrl = window.location.origin + window.location.pathname
  return encodeFileGeneratorUrl(
    baseUrl,
    { slug: fileSlug, preset: selectedPreset ?? undefined, options: generatorOptions },
    defaults,
  )
}
