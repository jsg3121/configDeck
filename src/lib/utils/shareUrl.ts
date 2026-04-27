/**
 * Shareable URL 인코딩/디코딩 유틸리티
 * ADR-0005에 따라 URL 쿼리 파라미터로 옵션 상태를 인코딩한다.
 *
 * 전략:
 * 1. 기본값과 동일한 옵션은 제외하여 URL 길이 최소화
 * 2. base64url 인코딩으로 특수문자 이슈 방지
 * 3. URL 길이가 2000자를 초과하면 경고 반환
 */

const URL_LENGTH_WARNING_THRESHOLD = 2000

interface FileOptions {
  slug: string
  preset?: string
  options: Record<string, unknown>
}

interface StackOptions {
  stackSlug: string
  files: Array<{
    slug: string
    enabled: boolean
    options: Record<string, unknown>
  }>
}

interface EncodeResult {
  url: string
  warning?: string
}

/**
 * base64url 인코딩 (URL-safe)
 * UTF-8 → 바이트 배열 → base64 → URL-safe 변환
 *
 * deprecated된 unescape/escape 대신 TextEncoder를 사용한다.
 * MDN: Base64 - The "Unicode Problem" 권장 패턴
 */
const base64UrlEncode = (str: string): string => {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * base64url 디코딩
 */
const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  if (pad) {
    base64 += '='.repeat(4 - pad)
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

/**
 * 기본값과 다른 옵션만 필터링
 */
const filterNonDefaultOptions = (
  options: Record<string, unknown>,
  defaults: Record<string, unknown>,
): Record<string, unknown> => {
  const filtered: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(options)) {
    const defaultValue = defaults[key]
    if (!isEqual(value, defaultValue)) {
      filtered[key] = value
    }
  }
  return filtered
}

/**
 * 깊은 비교 (배열, 객체 포함)
 */
const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (a === null || b === null) return a === b
  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((val, i) => isEqual(val, b[i]))
  }

  if (typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false
    const aObj = a as Record<string, unknown>
    const bObj = b as Record<string, unknown>
    const aKeys = Object.keys(aObj)
    const bKeys = Object.keys(bObj)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every((key) => isEqual(aObj[key], bObj[key]))
  }

  return false
}

/**
 * 파일 생성기용 URL 인코딩
 */
export const encodeFileGeneratorUrl = (
  baseUrl: string,
  fileOptions: FileOptions,
  defaults: Record<string, unknown>,
): EncodeResult => {
  const filteredOptions = filterNonDefaultOptions(fileOptions.options, defaults)

  const params = new URLSearchParams()

  if (fileOptions.preset) {
    params.set('preset', fileOptions.preset)
  }

  if (Object.keys(filteredOptions).length > 0) {
    const encoded = base64UrlEncode(JSON.stringify(filteredOptions))
    params.set('o', encoded)
  }

  const queryString = params.toString()
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl

  const result: EncodeResult = { url }
  if (url.length > URL_LENGTH_WARNING_THRESHOLD) {
    result.warning = 'URL이 2000자를 초과합니다. 일부 메신저에서 잘릴 수 있습니다.'
  }

  return result
}

/**
 * 스택 생성기용 URL 인코딩
 */
export const encodeStackGeneratorUrl = (
  baseUrl: string,
  stackOptions: StackOptions,
  fileDefaults: Record<string, Record<string, unknown>>,
): EncodeResult => {
  const payload: Record<string, unknown> = {}

  const disabledFiles = stackOptions.files.filter((f) => !f.enabled).map((f) => f.slug)
  if (disabledFiles.length > 0) {
    payload.disabled = disabledFiles
  }

  const fileOpts: Record<string, Record<string, unknown>> = {}
  for (const file of stackOptions.files) {
    if (!file.enabled) continue
    const defaults = fileDefaults[file.slug] ?? {}
    const filtered = filterNonDefaultOptions(file.options, defaults)
    if (Object.keys(filtered).length > 0) {
      fileOpts[file.slug] = filtered
    }
  }

  if (Object.keys(fileOpts).length > 0) {
    payload.files = fileOpts
  }

  const params = new URLSearchParams()

  if (Object.keys(payload).length > 0) {
    const encoded = base64UrlEncode(JSON.stringify(payload))
    params.set('o', encoded)
  }

  const queryString = params.toString()
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl

  const result: EncodeResult = { url }
  if (url.length > URL_LENGTH_WARNING_THRESHOLD) {
    result.warning = 'URL이 2000자를 초과합니다. 일부 메신저에서 잘릴 수 있습니다.'
  }

  return result
}

/**
 * 파일 생성기용 URL 디코딩
 */
export const decodeFileGeneratorUrl = (
  searchParams: URLSearchParams,
): { preset?: string; options: Record<string, unknown> } => {
  const preset = searchParams.get('preset') ?? undefined
  const encoded = searchParams.get('o')

  let options: Record<string, unknown> = {}
  if (encoded) {
    try {
      const parsed = JSON.parse(base64UrlDecode(encoded))
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        options = parsed as Record<string, unknown>
      }
    } catch {
      console.warn('Failed to decode share URL options')
    }
  }

  return { preset, options }
}

/**
 * 스택 생성기용 URL 디코딩
 */
export const decodeStackGeneratorUrl = (
  searchParams: URLSearchParams,
): { disabled: string[]; fileOptions: Record<string, Record<string, unknown>> } => {
  const encoded = searchParams.get('o')

  let disabled: string[] = []
  let fileOptions: Record<string, Record<string, unknown>> = {}

  if (encoded) {
    try {
      const parsed = JSON.parse(base64UrlDecode(encoded))
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const payload = parsed as {
          disabled?: string[]
          files?: Record<string, Record<string, unknown>>
        }
        disabled = Array.isArray(payload.disabled) ? payload.disabled : []
        fileOptions =
          payload.files && typeof payload.files === 'object' && !Array.isArray(payload.files)
            ? payload.files
            : {}
      }
    } catch {
      console.warn('Failed to decode share URL options')
    }
  }

  return { disabled, fileOptions }
}
