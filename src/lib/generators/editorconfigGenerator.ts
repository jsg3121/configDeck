/**
 * .editorconfig 코드를 생성한다.
 */
import type { EditorconfigOptions } from '@/lib/schemas'

/** .editorconfig 전체 코드를 생성한다 */
export const generateEditorconfig = (options: EditorconfigOptions): string => {
  const lines: string[] = []

  lines.push('root = true')
  lines.push('')
  lines.push('[*]')
  lines.push(`indent_style = ${options.indentStyle}`)
  lines.push(`indent_size = ${options.indentSize}`)
  lines.push(`end_of_line = ${options.endOfLine}`)
  lines.push('charset = utf-8')

  if (options.trimTrailingWhitespace) {
    lines.push('trim_trailing_whitespace = true')
  }
  if (options.insertFinalNewline) {
    lines.push('insert_final_newline = true')
  }

  // markdown은 trailing whitespace 보존
  lines.push('')
  lines.push('[*.md]')
  lines.push('trim_trailing_whitespace = false')

  return lines.join('\n')
}
