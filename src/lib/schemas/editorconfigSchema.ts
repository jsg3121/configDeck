/**
 * .editorconfig 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/** .editorconfig 생성 옵션 */
export interface EditorconfigOptions {
  indentStyle: 'space' | 'tab'
  indentSize: number
  endOfLine: 'lf' | 'crlf'
  trimTrailingWhitespace: boolean
  insertFinalNewline: boolean
}

/** 프리셋별 .editorconfig 기본 옵션을 반환한다 */
export const getEditorconfigPresetDefaults = (presetName: string): EditorconfigOptions => {
  switch (presetName) {
    case 'Tabs':
      return {
        indentStyle: 'tab',
        indentSize: 4,
        endOfLine: 'lf',
        trimTrailingWhitespace: true,
        insertFinalNewline: true,
      }
    case 'Minimal':
      return {
        indentStyle: 'space',
        indentSize: 2,
        endOfLine: 'lf',
        trimTrailingWhitespace: false,
        insertFinalNewline: false,
      }
    default:
      return {
        indentStyle: 'space',
        indentSize: 2,
        endOfLine: 'lf',
        trimTrailingWhitespace: true,
        insertFinalNewline: true,
      }
  }
}
