/**
 * Prettier config 코드를 생성한다.
 */
import type { PrettierOptions } from '@/lib/schemas'

/** Prettier config 전체 코드를 생성한다 */
export const generatePrettierConfig = (options: PrettierOptions): string => {
  const lines: string[] = []

  lines.push('/** @type {import("prettier").Config} */')
  lines.push('export default {')
  lines.push(`  singleQuote: ${options.singleQuote},`)
  lines.push(`  semi: ${options.semi},`)
  lines.push(`  trailingComma: '${options.trailingComma}',`)
  lines.push(`  tabWidth: ${options.tabWidth},`)
  lines.push(`  printWidth: ${options.printWidth},`)
  lines.push('}')

  return lines.join('\n')
}
