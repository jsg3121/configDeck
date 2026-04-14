# ADR-0008: 옵션 스키마 재설계 — 입력 타입 확장 및 옵션 정의 분리

- 상태: 승인됨
- 날짜: 2026-04-09
- 의사결정자: jsg3121

## 맥락 (Context)

ConfigDeck의 파일별 생성기는 현재 다음 제약을 갖는다.

1. **입력 타입 제한**: `src/types/generator.ts`의 `OptionInputType = 'radio' | 'checkbox'`로만 정의되어 있어, 숫자·문자열·배열·키-값 등 실제 설정 파일이 요구하는 입력을 표현할 수 없다. `OptionField { label, value, checked }` 구조는 boolean 선택 상태만 담는다.

2. **옵션 범위 제한**: 각 파일의 실제 공식 옵션 대비 지원 옵션이 극히 일부이다. (Prettier ~15%, TSConfig ~4%, ESLint <1%)

3. **데이터 집중**: `src/lib/data/files.ts` 한 파일이 모든 파일의 메타와 옵션 UI 데이터를 보유(440줄). 옵션 확장 시 수천 줄로 비대화가 예상된다.

4. **프리셋 하드코딩**: 프리셋 값이 `src/lib/schemas/*.ts`의 `getXxxPresetDefaults` 함수에 하드코딩되어 있어, 근거 링크·메타 정보 보관이 불가능하다.

SPEC-0001(파일 옵션 생성기 기능 보강)에서 위 제약을 해소하기 위한 기능 기획이 승인되었으며, 본 ADR은 그 기반이 되는 기술적 의사결정을 기록한다.

## 결정 (Decision)

### 결정 1: 옵션 입력 타입을 판별 유니온(Discriminated Union)으로 재설계

`OptionControl` 타입을 `type` 필드 기반 판별 유니온으로 정의하고, 7가지 입력 타입을 지원한다.

```ts
export type OptionControl =
  | RadioControl
  | CheckboxControl
  | SelectControl
  | NumberControl
  | TextControl
  | TagsControl
  | KeyValueControl

export interface BaseControl {
  key: string
  label: string
  labelEn: string
  description?: string
  descriptionEn?: string
  tier: 'core' | 'advanced'
  rationale?: string
  docsUrl?: string
}
```

각 타입은 `BaseControl`을 확장하며, 타입별로 필요한 필드(default, min/max, options, placeholder 등)를 추가한다.

### 결정 2: 옵션 정의와 파일 메타 분리

```
src/lib/data/
├── files.ts               # 파일 메타(slug, fileName, 설명)만 유지
└── options/
    ├── index.ts           # slug → 옵션 정의 맵
    ├── prettier.ts
    ├── tsconfig.ts
    ├── eslint.ts
    └── ... (파일당 1개)
src/lib/data/presets/
    ├── index.ts
    └── {file}-{preset}.ts  # 프리셋별 파일
```

각 파일의 옵션 정의 파일은 500줄 이하로 유지한다. 500줄을 초과하면 추가 분리한다(예: `tsconfig-lib-values.ts`).

### 결정 3: 프리셋을 데이터 구조로 분리

프리셋은 다음 구조의 객체로 정의한다.

```ts
export interface Preset<T> {
  name: string
  description: string
  source: string  // 근거 링크 (필수)
  values: T
}
```

`source` 필드는 필수이며, 공식 문서·검증된 템플릿 링크를 포함한다. (CLAUDE.md의 "근거 기반 논의" 원칙)

### 결정 4: "주요 옵션(core) + 전체 옵션(advanced)" 2단 구조

옵션은 `tier: 'core' | 'advanced'` 메타로 구분한다.

- **core**: 기본적으로 UI에 펼침 상태로 표시. 선정 시 `rationale` 필드 필수(선정 근거와 출처 기록)
- **advanced**: "전체 옵션 보기" 토글로 펼침. DOM에는 항상 렌더링되어 SEO 인덱싱 가능

선정 기준:
1. 공식 문서의 Recommended/Common 섹션 포함 여부
2. 주요 프리셋(Next.js, Vite, Astro, Airbnb, Standard 등)이 명시적으로 설정하는 옵션
3. 실사용 통계(State of JS, npm trends)
4. GitHub/Stack Overflow 언급 빈도

### 결정 5: UI 컨트롤 컴포넌트 분리

`src/components/generator/controls/` 하위에 입력 타입별 서브컴포넌트 7종을 배치한다. `OptionForm.svelte`는 `control.type` 판별 후 해당 컴포넌트를 렌더링하는 디스패처 역할만 수행한다.

### 결정 6: 점진적 파일 단위 마이그레이션

기존 `files.ts`/`schemas/`/`generators/` 구조에서 신규 구조로의 전환은 파일 단위로 순차 진행한다. 각 파일 완료 시점에 legacy 코드를 즉시 제거해 공존 기간을 최소화한다.

마이그레이션 순서: Prettier → EditorConfig → TSConfig → ESLint → Vite → Vitest → Next.js → .gitignore → .env.example

각 파일 완료 시점에 사용자 확인을 받는다.

## 근거 (Rationale)

### 판별 유니온 채택

- TypeScript 공식 핸드북은 타입별 필수 필드가 다른 경우 판별 유니온을 "표준 패턴"으로 제시한다 ([TypeScript Handbook - Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions))
- 대안인 "optional 필드 다수를 가진 단일 interface"는 타입 가드 없이 안전하게 사용할 수 없어 사실상 any와 유사해진다
- 컴파일 타임에 잘못된 필드 조합을 차단할 수 있어 리팩터링 안전성이 높다

### 데이터 분리

- CLAUDE.md의 Progressive Disclosure 원칙(문서/코드 500줄 이하 유지)
- 현재 `files.ts` 440줄. 옵션 확장 시 단일 파일로는 유지보수 불가
- 파일별 분리는 Git 이력 추적, 리뷰 범위, 동적 import를 통한 코드 분할 가능성을 모두 개선

### 2단 구조(core + advanced)

- **인지 부하**: 초보자에게 80개 옵션을 동시 노출하면 이탈률 상승. Nielsen Norman Group의 [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) 원칙은 복잡한 UI에서 초심자와 전문가를 모두 수용하는 검증된 패턴
- **SEO 보존**: 접힌 콘텐츠도 DOM에 있으면 Google이 인덱싱한다 ([Google Search Central - Hidden content](https://developers.google.com/search/blog/2014/12/are-you-hiding-from-googlebot)). 따라서 SEO를 위해 전부 펼쳐둘 필요가 없다
- **레퍼런스**: [PureDevTools TSConfig Generator](https://puredevtools.tools/tsconfig-generator/)가 동일 전략 ("Show all options")을 사용해 검증된 UX 패턴

### 근거 기반 옵션 선정

- CLAUDE.md의 "근거 기반 논의" 원칙에 부합
- `rationale` 필드를 메타로 남기면 나중에 재검토할 때 판단 기준이 유지됨
- 선정 기준이 주관에 휘둘리는 리스크를 구조적으로 차단

### 점진 마이그레이션

- 사용자 명시 요청
- 리스크 분산: 한 파일의 실패가 다른 파일에 영향 없음
- 초기 파일(Prettier)에서 발견된 구조 이슈를 후속 파일에 즉시 반영 가능

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| 단일 interface에 optional 필드 확장 | 타입 안전성 손실. any와 유사해 컴파일 타임 검증 불가 |
| 전체 옵션 모두 펼침 (tier 구분 없음) | 초심자 인지 부하 과다, 이탈률 증가. 레퍼런스 서비스도 2단 구조 채택 |
| 주요 옵션만 UI + 나머지는 JSON 편집 탭 | 파워유저 경험 저하, SEO 불리 (JSON 편집기는 인덱싱 가치 없음) |
| 한 번에 전체 재작성 | 리스크 과다, 피드백 반영 불가, 사용자 요구와 상충 |
| 프리셋을 함수 기반으로 유지 | 근거 링크·메타 정보 보관 불가, 데이터로 분리하면 UI에서 근거 링크 노출 가능 |
| `files.ts` 단일 파일 유지 | 옵션 확장 후 수천 줄 예상, Progressive Disclosure 원칙 위배 |

## 결과 (Consequences)

### 긍정적

- 실제 파일 스펙과 1:1 매핑되는 옵션 UI 제공 가능
- 각 파일당 옵션 정의 파일이 500줄 이하로 유지되어 유지보수성 개선
- 프리셋에 근거 링크가 포함되어 사용자 신뢰도 상승 및 SEO 콘텐츠 강화
- 판별 유니온으로 컴파일 타임 타입 안전성 확보
- 동적 import로 파일별 옵션 코드 분할 가능 (초기 번들 크기 최적화 여지)

### 부정적

- 기존 `files.ts`, `schemas/`, `generators/`, `OptionForm.svelte`, `FileGenerator.svelte` 등 광범위한 리팩터링 필요
- 점진 마이그레이션 기간 동안 legacy와 신규 구조가 공존 → 일시적 복잡도 증가
- 주요 옵션 선정에 레퍼런스 조사 시간 소요 (파일당 추가 리서치 필요)

### 후속 조치

- SPEC-0001의 실행 계획에 따라 인프라 구축 → 파일 단위 마이그레이션 진행
- 각 파일 마이그레이션 완료 시 SPEC-0001의 Checkpoints에 따라 사용자 확인
- `src/types/generator.ts`, `src/lib/data/files.ts`, `src/lib/schemas/`, `src/lib/generators/`, `src/components/generator/OptionForm.svelte` 영향
- 기존 `OptionField`, `OptionSection` 타입은 마이그레이션 완료 시점까지 공존 후 제거
- 옵션 상태 URL 직렬화는 별도 SPEC/ADR로 분리 (이번 결정 범위 외)

## 참고 자료 (References)

- [SPEC-0001: 파일 옵션 생성기 기능 보강](../../ia/specs/features/SPEC-0001-option-generator-enhancement.md) — 이 결정이 지원하는 기능 기획
- [ADR-0007: 페이지 구조 재설계](ADR-0007-page-structure-redesign.md) — 선행 의사결정
- [TypeScript Handbook - Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) — 판별 유니온 공식 가이드
- [Nielsen Norman Group - Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) — 2단 구조의 UX 근거
- [Google Search Central - Hidden content and crawling](https://developers.google.com/search/blog/2014/12/are-you-hiding-from-googlebot) — 접힌 콘텐츠의 SEO 인덱싱
- [PureDevTools TSConfig Generator](https://puredevtools.tools/tsconfig-generator/) — "Show all options" UX 레퍼런스
- [Prettier Options](https://prettier.io/docs/en/options.html) — Prettier 공식 옵션 스펙
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig) — TSConfig 공식 옵션 스펙
- [ESLint Rules](https://eslint.org/docs/latest/rules/) — ESLint 공식 rule 카탈로그
