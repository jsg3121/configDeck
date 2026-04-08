/**
 * Prettier 설정 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** Prettier 생성 옵션 */
export interface PrettierOptions {
  singleQuote: boolean
  semi: boolean
  trailingComma: 'all' | 'es5' | 'none'
  tabWidth: number
  printWidth: number
}

/** 프리셋별 Prettier 기본 옵션을 반환한다 */
export const getPrettierPresetDefaults = (presetName: string): PrettierOptions => {
  switch (presetName) {
    case 'Minimal':
      return { singleQuote: false, semi: true, trailingComma: 'es5', tabWidth: 2, printWidth: 80 }
    case 'Opinionated':
      return { singleQuote: true, semi: false, trailingComma: 'all', tabWidth: 2, printWidth: 100 }
    default:
      return { singleQuote: true, semi: false, trailingComma: 'all', tabWidth: 2, printWidth: 100 }
  }
}
