/**
 * 생성기 전체에서 공유하는 타입을 정의한다.
 */

// ---------------------------------------------------------------------------
// 옵션 컨트롤 타입 — 판별 유니온 (Discriminated Union)
// ref: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// ---------------------------------------------------------------------------

/** 옵션의 표시 계층. core는 기본 펼침, advanced는 "전체 옵션 보기" 토글 뒤에 배치 */
export type OptionTier = 'core' | 'advanced'

/** 모든 옵션 컨트롤이 공유하는 기본 필드 */
export interface BaseControl {
  /** 옵션 식별자. 직렬화 및 값 매핑에 사용한다 */
  key: string
  /** UI에 표시할 한글 라벨 */
  label: string
  /** UI에 표시할 영문 라벨 */
  labelEn: string
  /** 옵션의 의미를 설명하는 짧은 안내 문구 (한글). UI 보조 텍스트/툴팁으로 노출 */
  description: string
  /** 옵션의 의미를 설명하는 짧은 안내 문구 (영문) */
  descriptionEn: string
  /** 주요/전체 옵션 구분 */
  tier: OptionTier
  /** core 옵션의 선정 근거 (선정 이유 + 출처). tier가 'core'이면 필수 작성 권장 */
  rationale?: string
  /** 공식 문서 링크. 툴팁에서 "자세히 보기"로 연결 */
  docsUrl?: string
}

/** 선택지 하나의 구조 (radio, select에서 사용) */
export interface SelectOption {
  /** 사용자에게 표시되는 라벨 */
  label: string
  /** 직렬화 시 사용되는 값 */
  value: string
}

/** 라디오 — 그룹 내 단일 선택 */
export interface RadioControl extends BaseControl {
  type: 'radio'
  options: SelectOption[]
  default: string
}

/** 체크박스 — 단일 boolean 토글 */
export interface CheckboxControl extends BaseControl {
  type: 'checkbox'
  default: boolean
}

/** 드롭다운 — 옵션이 많은 단일 선택 */
export interface SelectControl extends BaseControl {
  type: 'select'
  options: SelectOption[]
  default: string
}

/** 숫자 입력 — 직접 입력 + 자주 쓰는 값 버튼 */
export interface NumberControl extends BaseControl {
  type: 'number'
  default: number
  min?: number
  max?: number
  step?: number
  /** 입력 ��드 우측에 표시할 단위 (예: 'px', 'ms') */
  unit?: string
  /** 자주 사용하는 값을 버튼으로 표시. 예: [80, 100, 120] */
  quickValues?: number[]
}

/** 문자열 입력 — 한 줄 텍스트 */
export interface TextControl extends BaseControl {
  type: 'text'
  default: string
  placeholder?: string
  /** 입력값 유효성 검증 정규식 */
  pattern?: string
}

/** 태그 — 문자열 배열 입력 (칩 UI). 예: TSConfig lib, include */
export interface TagsControl extends BaseControl {
  type: 'tags'
  default: string[]
  /** 자동완성 제안 목록 */
  suggestions?: string[]
  /** 최대 태그 수 */
  maxItems?: number
}

/** 키-값 쌍 리스트 — 행 추가/삭제. 예: TSConfig paths */
export interface KeyValueControl extends BaseControl {
  type: 'key-value'
  default: Record<string, string>
  keyPlaceholder?: string
  valuePlaceholder?: string
}

/** 모든 옵션 컨트롤의 판별 유니온 */
export type OptionControl =
  | RadioControl
  | CheckboxControl
  | SelectControl
  | NumberControl
  | TextControl
  | TagsControl
  | KeyValueControl

/** 옵션 컨트롤의 type 리터럴 유니온 */
export type OptionControlType = OptionControl['type']

// ---------------------------------------------------------------------------
// 신규 옵션 섹션
// ---------------------------------------------------------------------------

/** 신규 옵션 섹션 — 한 섹션 안에 여러 타입의 컨트롤이 공존 가능 */
export interface NewOptionSection {
  /** 섹션 한글 제목 */
  title: string
  /** 섹션 영문 제목 */
  titleEn: string
  /** 섹션 한글 설명 */
  description?: string
  /** 섹션 영문 설명 */
  descriptionEn?: string
  /** 이 섹션에 포함된 옵션 컨트롤 목록 */
  controls: OptionControl[]
}

// ---------------------------------------------------------------------------
// 파일별 옵션 정의
// ---------------------------------------------------------------------------

/** 파일 하나의 전체 옵션 정의 */
export interface FileOptionDefinition {
  /** 파일의 slug (files.ts의 slug와 일치해야 한다) */
  slug: string
  /** 옵션 섹션 목록 */
  sections: NewOptionSection[]
}

// ---------------------------------------------------------------------------
// 프리셋
// ---------------------------------------------------------------------------

/** 프리셋 하나의 구조 */
export interface Preset {
  /** 프리셋 이름 (예: 'Next.js 14 App Router') */
  name: string
  /** 프리셋 설명 */
  description: string
  /** 근거 링크 — 공식 문서/검증된 템플릿 출처. 필수 */
  source: string
  /** 이 프리셋이 적용하는 옵션 값 맵 (key → value) */
  values: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// 생성 엔진 출력
// ---------------------------------------------------------------------------

/** 생성 엔진의 출력 구조 */
export interface GeneratorOutput {
  /** 생성된 파일명 (예: eslint.config.mjs) */
  fileName: string
  /** 생성된 코드 문자열 */
  code: string
  /** 코드 하이라이팅용 언어 힌트 (예: javascript, json) */
  language: string
}
