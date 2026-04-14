/**
 * .editorconfig 코드를 생성한다.
 * 신규 옵션 구조 기반으로, 사용자가 설정한(touched) 옵션만 출력한다.
 */

/** .editorconfig 전체 코드를 생성한다 */
export const generateEditorconfig = (options: Record<string, unknown>): string => {
  const lines: string[] = []

  lines.push('root = true')
  lines.push('')
  lines.push('[*]')

  // 옵션이 존재하는 것만 출력 (touched 키만 전달됨)
  if ('indent_style' in options) {
    lines.push(`indent_style = ${options.indent_style}`)
  }
  if ('indent_size' in options) {
    lines.push(`indent_size = ${options.indent_size}`)
  }
  if ('tab_width' in options) {
    lines.push(`tab_width = ${options.tab_width}`)
  }
  if ('end_of_line' in options) {
    lines.push(`end_of_line = ${options.end_of_line}`)
  }
  if ('charset' in options) {
    lines.push(`charset = ${options.charset}`)
  }
  if ('trim_trailing_whitespace' in options) {
    lines.push(`trim_trailing_whitespace = ${options.trim_trailing_whitespace}`)
  }
  if ('insert_final_newline' in options) {
    lines.push(`insert_final_newline = ${options.insert_final_newline}`)
  }
  if ('max_line_length' in options) {
    lines.push(`max_line_length = ${options.max_line_length}`)
  }

  // trim_trailing_whitespace가 true이면 markdown 예외 섹션 추가
  if (options.trim_trailing_whitespace === true) {
    lines.push('')
    lines.push('[*.md]')
    lines.push('trim_trailing_whitespace = false')
  }

  return lines.join('\n')
}
