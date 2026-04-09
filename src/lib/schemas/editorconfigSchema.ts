/**
 * .editorconfig 생성기의 옵션 타입과 프리셋 기본값을 정의한다.
 */

/**
 * .editorconfig 생성 옵션.
 * files.ts의 checkbox value가 toCamelCase 변환을 거쳐 아래 키와 매칭된다.
 * (indent-space → indentSpace, indent-2 → indent2, eol-lf → eolLf,
 *  trim-trailing → trimTrailing, final-newline → finalNewline)
 */
export interface EditorconfigOptions {
  /** true: space, false: tab */
  indentSpace: boolean
  /** true: 2, false: 4 */
  indent2: boolean
  /** true: lf, false: crlf */
  eolLf: boolean
  /** trim_trailing_whitespace = true 라인 포함 여부 */
  trimTrailing: boolean
  /** insert_final_newline = true 라인 포함 여부 */
  finalNewline: boolean
}

/** 프리셋별 .editorconfig 기본 옵션을 반환한다 */
export const getEditorconfigPresetDefaults = (presetName: string): EditorconfigOptions => {
  switch (presetName) {
    case 'Tabs':
      return {
        indentSpace: false,
        indent2: false,
        eolLf: true,
        trimTrailing: true,
        finalNewline: true,
      }
    case 'Minimal':
      return {
        indentSpace: true,
        indent2: true,
        eolLf: true,
        trimTrailing: false,
        finalNewline: false,
      }
    default:
      return {
        indentSpace: true,
        indent2: true,
        eolLf: true,
        trimTrailing: true,
        finalNewline: true,
      }
  }
}
