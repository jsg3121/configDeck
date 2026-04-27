/**
 * StackGenerator 전용 비즈니스 로직 모듈
 * 스택별 생성기의 상태 초기화, 파일별 옵션 관리, ZIP 다운로드 로직을 담당한다.
 */

import type { StackFile } from '@/lib/data/stacks'
import { buildEmptyValues, buildGeneratorOptions } from '@/lib/modules/optionBuilder'
import { getPresetDefaultsBySlug } from '@/lib/schemas'

/**
 * 파일 목록을 기반으로 초기 상태를 생성한다.
 * @param files - 스택에 포함된 파일 목록
 * @returns 파일별 옵션 값과 touched 키 맵
 */
export const initializeFileStates = (
  files: StackFile[],
): {
  values: Record<string, Record<string, unknown>>
  touched: Record<string, Set<string>>
} => {
  const values: Record<string, Record<string, unknown>> = {}
  const touched: Record<string, Set<string>> = {}

  for (const file of files) {
    const presetValues = getPresetDefaultsBySlug(file.slug, file.preset) as Record<string, unknown>
    values[file.slug] = { ...buildEmptyValues(file.slug), ...presetValues }
    touched[file.slug] = new Set(Object.keys(presetValues))
  }

  return { values, touched }
}

/**
 * 특정 파일의 generator 옵션을 계산한다.
 * @param slug - 파일 slug
 * @param fileOptionValues - 전체 파일별 옵션 값 맵
 * @param fileTouchedKeys - 전체 파일별 touched 키 맵
 * @returns 해당 파일의 generator 옵션
 */
export const getFileGeneratorOptions = (
  slug: string,
  fileOptionValues: Record<string, Record<string, unknown>>,
  fileTouchedKeys: Record<string, Set<string>>,
): Record<string, unknown> => {
  const values = fileOptionValues[slug]
  const touched = fileTouchedKeys[slug]
  if (!values || !touched) return {}
  return buildGeneratorOptions(values, touched)
}

/**
 * 파일 목록에서 프리셋 기본값 맵을 생성한다.
 * @param files - 스택에 포함된 파일 목록
 * @returns 파일 slug별 프리셋 기본값 맵
 */
export const buildFileDefaults = (files: StackFile[]): Record<string, Record<string, unknown>> => {
  const defaults: Record<string, Record<string, unknown>> = {}
  for (const file of files) {
    defaults[file.slug] = getPresetDefaultsBySlug(file.slug, file.preset) as Record<string, unknown>
  }
  return defaults
}

/**
 * 생성된 파일들을 ZIP으로 다운로드한다.
 * @param generatedFiles - 파일명과 코드 내용 맵
 */
export const downloadFilesAsZip = async (generatedFiles: Record<string, string>): Promise<void> => {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  for (const [fileName, code] of Object.entries(generatedFiles)) {
    zip.file(fileName, code)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'config-files.zip'
  anchor.click()
  URL.revokeObjectURL(url)
}
