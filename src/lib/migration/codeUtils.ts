/**
 * 설정 파일 파서/감사기에서 공유하는 코드 처리 유틸리티.
 *
 * 모든 함수는 **문자열 리터럴 내부를 인식**하며 동작하므로
 * 다음과 같은 안전성 보장이 가능하다.
 *   - URL이나 "/*" 패턴이 문자열 값에 들어 있어도 주석으로 오인하지 않는다
 *   - { key: ... } 같은 객체 리터럴 패턴이 문자열 값에 있어도 변환되지 않는다
 *   - "\\\\" (이스케이프된 백슬래시) 뒤의 따옴표를 정확히 종료로 판별한다
 *
 * Gemini Code Assist가 PR #32에서 지적한 1.2.0부터의 잠재 결함을 해소하기 위해
 * 1.4.0 사이클에 도입했다. ESLint/Prettier inspector가 함께 사용한다.
 */

/**
 * 인덱스 i 직전(i 미포함)의 연속된 백슬래시 개수를 센다.
 * 짝수 → 백슬래시 자체가 모두 이스케이프되어 i 위치는 일반 문자
 * 홀수 → i 위치 문자가 이스케이프됨
 */
const countTrailingBackslashes = (code: string, i: number): number => {
  let count = 0
  let j = i - 1
  while (j >= 0 && code[j] === '\\') {
    count++
    j--
  }
  return count
}

/** 인덱스 i 위치 문자가 이스케이프된 상태인지 판별 (앞선 백슬래시가 홀수) */
const isEscaped = (code: string, i: number): boolean => {
  return countTrailingBackslashes(code, i) % 2 === 1
}

/**
 * 코드에서 주석을 제거한다. 문자열 리터럴 내부의 //, /* 는 보존한다.
 *
 * 백슬래시 이스케이프 처리:
 *   - "hello\""   → 종료 따옴표 아님 (이스케이프된 따옴표)
 *   - "path\\\\"  → 종료 따옴표 임 (백슬래시가 모두 이스케이프됨)
 */
export const stripCommentsFromCode = (code: string): string => {
  let result = ''
  let i = 0
  let inString: '"' | "'" | '`' | null = null
  while (i < code.length) {
    const ch = code[i]
    const next = code[i + 1]

    if (inString) {
      result += ch
      // 종료 따옴표 판별: 현재 문자가 같은 인용부호이고, 이스케이프되지 않았어야 함
      if (ch === inString && !isEscaped(code, i)) inString = null
      i++
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch
      result += ch
      i++
      continue
    }

    // 한 줄 주석
    if (ch === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i++
      continue
    }

    // 블록 주석
    if (ch === '/' && next === '*') {
      i += 2
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++
      i += 2
      continue
    }

    result += ch
    i++
  }
  return result
}

/**
 * JSON-like 입력을 정규 JSON으로 정리한다.
 *   - 문자열-안전 주석 제거
 *   - trailing comma 제거 (문자열 안의 ", }" 같은 패턴은 보호됨 — 정규식이지만
 *     문자열 리터럴이 이미 stripCommentsFromCode 단계에서 그대로 보존되므로
 *     여기서는 단순 trailing comma만 노린다)
 */
export const cleanJsonLikeInput = (input: string): string => {
  const withoutComments = stripCommentsFromCode(input)
  return withoutComments.replace(/,(\s*[}\]])/g, '$1')
}

/**
 * JS 객체 리터럴을 JSON 호환 문자열로 변환한다.
 *   - 작은따옴표 문자열 → 큰따옴표 문자열
 *   - 따옴표 없는 객체 키(식별자) → 큰따옴표 키
 *
 * **문자열 리터럴 내부는 변환하지 않는다.**
 * 정규식이 아닌 1-pass 파싱으로 처리해 다음 케이스의 회귀를 방지한다.
 *   "msg": "value with { key: pattern }"  → "key:" 부분이 잘못 변환되는 일 없음
 */
export const jsObjectToJson = (input: string): string => {
  let result = ''
  let i = 0
  while (i < input.length) {
    const ch = input[i]

    // 큰따옴표 문자열은 그대로 통과
    if (ch === '"') {
      const start = i
      i++
      while (i < input.length && !(input[i] === '"' && !isEscaped(input, i))) i++
      i++ // 종료 따옴표 포함
      result += input.slice(start, i)
      continue
    }

    // 작은따옴표 문자열 → 큰따옴표로 변환
    if (ch === "'") {
      i++
      const start = i
      while (i < input.length && !(input[i] === "'" && !isEscaped(input, i))) i++
      const inner = input.slice(start, i)
      // 내부의 큰따옴표는 이스케이프, 이스케이프된 작은따옴표는 일반 작은따옴표로 복원
      const escaped = inner.replace(/"/g, '\\"').replace(/\\'/g, "'")
      result += `"${escaped}"`
      i++ // 종료 작은따옴표 건너뛰기
      continue
    }

    // 백틱 문자열은 본 컨텍스트(설정 파일)에서는 거의 안 나오지만 보호적으로 통과
    if (ch === '`') {
      const start = i
      i++
      while (i < input.length && !(input[i] === '`' && !isEscaped(input, i))) i++
      i++
      result += input.slice(start, i)
      continue
    }

    // 식별자 키 → 큰따옴표 키 변환은 [, 또는 { 직후의 식별자에만 적용
    // 직전 의미 있는(공백 제외) 토큰이 [ , { 인 경우만 키로 인식
    if (/[A-Za-z_$]/.test(ch)) {
      const before = lastNonSpaceChar(result)
      if (before === '{' || before === ',') {
        // 식별자 끝 인덱스 찾기
        let j = i
        while (j < input.length && /[A-Za-z0-9_$]/.test(input[j])) j++
        // 식별자 다음 (공백 무시) ':' 가 있어야 키
        let k = j
        while (k < input.length && /\s/.test(input[k])) k++
        if (input[k] === ':') {
          const ident = input.slice(i, j)
          result += `"${ident}"`
          i = j
          continue
        }
      }
    }

    result += ch
    i++
  }

  return result
}

/** 결과 문자열의 마지막 비공백 문자 — 객체 키 컨텍스트 판별용 */
const lastNonSpaceChar = (s: string): string | null => {
  for (let i = s.length - 1; i >= 0; i--) {
    if (!/\s/.test(s[i])) return s[i]
  }
  return null
}
