/**
 * 생성기 전체에서 공유하는 타입을 정의한다.
 */

/** 옵션 필드 하나의 구조 */
export interface OptionField {
  label: string
  value: string
  checked: boolean
}

/** 옵션 섹션의 입력 타입 */
export type OptionInputType = 'radio' | 'checkbox'

/** 옵션 섹션 (Language, Framework, Rules 등) */
export interface OptionSection {
  titleEn: string
  titleKo: string
  descriptionEn: string
  descriptionKo: string
  type: OptionInputType
  name?: string
  options: OptionField[]
}

/** 생성 엔진의 출력 구조 */
export interface GeneratorOutput {
  /** 생성된 파일명 (예: eslint.config.mjs) */
  fileName: string
  /** 생성된 코드 문자열 */
  code: string
  /** 코드 하이라이팅용 언어 힌트 (예: javascript, json) */
  language: string
}

/** 프리셋 기본값을 제공하는 함수 타입 */
export type PresetDefaultsProvider<T> = (presetName: string) => T
