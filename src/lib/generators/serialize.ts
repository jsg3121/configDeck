/**
 * 설정 파일 생성 시 사용하는 공통 직렬화 유틸.
 * JSON, JS 객체 리터럴, INI, dotenv 포맷을 지원한다.
 */

// ---------------------------------------------------------------------------
// JSON 직렬화
// ---------------------------------------------------------------------------

/** JSON 직렬화 옵션 */
export interface SerializeJsonOptions {
  /** 들여쓰기 크기 (기본 2) */
  indent?: number
}

/** 객체를 JSON 문자열로 직렬화한다 */
export const serializeJson = (
  obj: Record<string, unknown>,
  options?: SerializeJsonOptions,
): string => {
  const indent = options?.indent ?? 2
  return JSON.stringify(obj, null, indent)
}

// ---------------------------------------------------------------------------
// JS 객체 리터럴 직렬화
// ---------------------------------------------------------------------------

/** JS 직렬화 옵션 */
export interface SerializeJsOptions {
  /** 들여쓰기 크기 (기본 2) */
  indent?: number
  /** export 방식 (기본 'export-default') */
  exportStyle?: 'export-default' | 'module-exports' | 'none'
  /** 파일 상단에 추가할 JSDoc 타입 힌트 */
  typeComment?: string
}

/** 값을 JS 리터럴 문자열로 변환한다 */
const valueToJs = (value: unknown, indent: number, depth: number): string => {
  const pad = ' '.repeat(indent * depth)
  const innerPad = ' '.repeat(indent * (depth + 1))

  if (value === null || value === undefined) return 'undefined'
  if (typeof value === 'string') return `'${value}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((v) => `${innerPad}${valueToJs(v, indent, depth + 1)}`)
    return `[\n${items.join(',\n')},\n${pad}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const lines = entries.map(([k, v]) => `${innerPad}${k}: ${valueToJs(v, indent, depth + 1)}`)
    return `{\n${lines.join(',\n')},\n${pad}}`
  }

  return String(value)
}

/** 객체를 JS 객체 리터럴 코드로 직렬화한다 */
export const serializeJs = (obj: Record<string, unknown>, options?: SerializeJsOptions): string => {
  const indent = options?.indent ?? 2
  const exportStyle = options?.exportStyle ?? 'export-default'

  const body = valueToJs(obj, indent, 0)

  const lines: string[] = []
  if (options?.typeComment) {
    lines.push(options.typeComment)
  }

  switch (exportStyle) {
    case 'export-default':
      lines.push(`export default ${body}`)
      break
    case 'module-exports':
      lines.push(`module.exports = ${body}`)
      break
    case 'none':
      lines.push(body)
      break
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// INI 직렬화 (.editorconfig 등)
// ---------------------------------------------------------------------------

/** INI 섹션 하나의 구조 */
export interface IniSection {
  /** 섹션 헤더 (예: '[*]', '[*.md]'). 빈 문자열이면 헤더 없음 */
  header: string
  /** key=value 엔트리 목록 */
  entries: Array<{ key: string; value: string }>
}

/** INI 섹션 목록을 문자열로 직렬화한다 */
export const serializeIni = (sections: IniSection[]): string => {
  const blocks = sections.map((section) => {
    const lines: string[] = []
    if (section.header) {
      lines.push(section.header)
    }
    for (const entry of section.entries) {
      lines.push(`${entry.key} = ${entry.value}`)
    }
    return lines.join('\n')
  })

  return blocks.join('\n\n')
}

// ---------------------------------------------------------------------------
// Dotenv 직렬화 (.env 등)
// ---------------------------------------------------------------------------

/** dotenv 블록 하나의 구조 */
export interface DotenvBlock {
  /** 블록 주석 헤더 (예: '# App') */
  header: string
  /** KEY=value 엔트리 목록 */
  entries: Array<{ key: string; value: string }>
}

/** dotenv 블록 목록을 문자열로 직렬화한다 */
export const serializeDotenv = (blocks: DotenvBlock[]): string => {
  const rendered = blocks.map((block) => {
    const lines: string[] = []
    if (block.header) {
      lines.push(block.header)
    }
    for (const entry of block.entries) {
      lines.push(`${entry.key}=${entry.value}`)
    }
    return lines.join('\n')
  })

  return rendered.join('\n\n')
}

// ---------------------------------------------------------------------------
// 공통 유틸
// ---------------------------------------------------------------------------

/**
 * 기본값과 같은 항목을 제거한다.
 * 설정 파일 생성 시 기본값은 생략하여 깨끗한 출력을 만든다.
 */
export const omitDefaults = (
  values: Record<string, unknown>,
  defaults: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(values)) {
    if (JSON.stringify(value) !== JSON.stringify(defaults[key])) {
      result[key] = value
    }
  }

  return result
}
