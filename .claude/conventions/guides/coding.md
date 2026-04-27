# 코딩 컨벤션

## 디렉토리 구조

Astro 공식 권장 구조를 기반으로 한다.

```
src/
├── pages/           # 파일 기반 라우팅 (필수)
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── common/      # 공통 컴포넌트
│   └── {feature}/   # 기능별 컴포넌트
├── layouts/         # 페이지 레이아웃
├── content/         # Content Collections (블로그, 문서)
├── assets/          # Astro가 처리하는 이미지, 폰트 등
├── styles/          # 글로벌 CSS
├── lib/             # 유틸리티, 헬퍼, 설정 생성 로직
│   ├── utils/       # 범용 유틸 함수
│   ├── generators/  # 설정 파일 생성 로직
│   └── schemas/     # 설정 파일 옵션 스키마
├── i18n/            # 다국어 번역 파일
└── types/           # 공유 TypeScript 타입 정의
```

> **Why:** Astro 공식 프로젝트 구조에서 `src/pages/`만 필수이고 나머지는 컨벤션이다. 기능별로 하위 폴더를 나누면 파일이 많아져도 탐색이 용이하다.

**참고:** [Astro - Project Structure](https://docs.astro.build/en/basics/project-structure/)

## 컴포넌트 작성 기준

### 컴포넌트 파일 크기 제한

컴포넌트 파일 하나는 **150~200줄 미만**을 유지한다. 이 기준을 초과하면 기능 단위로 하위 컴포넌트를 분리한다.

```
# BAD: 300줄짜리 모놀리식 페이지 컴포넌트
src/pages/[locale]/generator/index.astro  (300줄)
  └── 스택 프리셋 섹션 + 개별 파일 카드 섹션 + 카테고리 구분 + 아이콘 정의 모두 포함

# GOOD: 기능 단위로 분리하여 각 파일 150~200줄 미만
src/pages/[locale]/generator/index.astro  (80줄)
  ├── 섹션 조합 + 레이아웃만 담당
  └── import:
      ├── StackPresetSection.astro   (60줄) — 스택 프리셋 카드 그리드
      ├── FileCardSection.astro      (80줄) — 개별 파일 카드 + 카테고리 구분
      └── FileCard.astro             (30줄) — 단일 파일 카드 컴포넌트
```

**분리 기준:**
- 시각적으로 독립된 섹션 (예: 히어로, 프리셋, FAQ)
- 반복되는 카드/리스트 아이템
- 재사용 가능성이 있는 UI 패턴 (예: 코드 미리보기, 옵션 폼)

**분리하지 않는 경우:**
- 분리해도 한쪽에서만 사용되고 라인 수가 이미 150줄 미만인 경우
- 분리 시 props 전달이 과도하게 복잡해지는 경우 (props 5개 이상이면 재고)

> **Why:** 파일이 길어지면 코드 탐색과 수정이 어려워진다. 150~200줄 미만이면 한 화면에서 전체 흐름을 파악할 수 있고, 기능 단위 분리는 재사용성과 테스트 용이성도 높인다.

### Astro vs Svelte 사용 구분

- **`.astro` 컴포넌트**: 정적 콘텐츠, 레이아웃, 페이지 셸. 클라이언트 JS가 불필요한 모든 UI.
- **`.svelte` 컴포넌트**: 사용자 인터랙션이 필요한 UI. 체크박스, 실시간 미리보기, 코드 에디터 등.

```astro
<!-- BAD: 정적 콘텐츠에 Svelte를 사용 -->
---
import StaticCard from '../components/StaticCard.svelte';
---
<StaticCard client:load title="ESLint" />

<!-- GOOD: 정적 콘텐츠는 Astro 컴포넌트로 -->
---
import StaticCard from '../components/StaticCard.astro';
---
<StaticCard title="ESLint" />
```

> **Why:** Astro 컴포넌트는 JS 0KB로 렌더링된다. 인터랙션이 없는 UI에 Svelte를 쓰면 불필요한 번들이 클라이언트에 전송된다.

### client: 디렉티브 선택 기준

Svelte 컴포넌트를 Astro에서 사용할 때, 최소한의 hydration 디렉티브를 선택한다.

| 디렉티브 | 시점 | 사용 케이스 |
|----------|------|------------|
| (없음) | hydration 없음 | HTML만 필요한 경우 (정적 렌더링) |
| `client:load` | 페이지 로드 즉시 | 즉시 인터랙션 필요한 핵심 UI (설정 생성기) |
| `client:idle` | 브라우저 idle 시 | 중요하지 않은 인터랙티브 요소 |
| `client:visible` | 뷰포트 진입 시 | 스크롤 아래 콘텐츠 |
| `client:media="(쿼리)"` | 미디어 쿼리 매칭 시 | 특정 화면 크기에서만 필요한 UI |

```astro
<!-- BAD: 모든 Svelte 컴포넌트에 client:load -->
<ConfigGenerator client:load />
<Footer client:load />
<NewsletterSignup client:load />

<!-- GOOD: 각 컴포넌트에 적합한 디렉티브 선택 -->
<ConfigGenerator client:load />
<Footer />  <!-- 인터랙션 불필요 → hydration 없음 -->
<NewsletterSignup client:visible />  <!-- 스크롤 아래 → visible -->
```

> **Why:** `client:load`를 남용하면 Astro의 아일랜드 아키텍처 장점이 사라진다. 가능한 한 hydration을 지연시켜 초기 로딩 성능을 최적화한다.

**참고:** [Astro - Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)

### Svelte 5 Runes 사용 규칙

```svelte
<!-- BAD: Svelte 4 레거시 문법 -->
<script lang="ts">
  export let title: string;
  let count = 0;
  $: doubled = count * 2;
</script>

<!-- GOOD: Svelte 5 Runes -->
<script lang="ts">
  let { title }: { title: string } = $props();
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

- `$state()`: 컴포넌트 내부 상태. 불변 데이터는 `$state.raw()` 사용
- `$derived()`: 순수 계산에만 사용. 부수효과 금지
- `$effect()`: DOM 조작, 외부 라이브러리 연동 등 부수효과에만 사용. 남용 지양
- `$props()`: 구조분해 할당과 함께 사용하여 기본값 지정

> **Why:** Svelte 5의 Runes는 컴파일러가 의존성을 자동 추적한다. 레거시 문법(`$:`, `export let`)은 지양하고 Runes로 통일하여 코드베이스 일관성을 유지한다.

**참고:** [Svelte 5 - What are runes?](https://svelte.dev/docs/svelte/what-are-runes)

## 네이밍 컨벤션

### 파일명

| 대상 | 규칙 | 예시 |
|------|------|------|
| Astro/Svelte 컴포넌트 | PascalCase | `ConfigGenerator.svelte`, `FileCard.astro` |
| 유틸 함수, 공통 함수 | camelCase | `generateEslintConfig.ts`, `formatCode.ts` |
| 페이지 | kebab-case (Astro 라우팅) | `src/pages/files/eslint-config.astro` |
| 타입 정의 | camelCase | `configTypes.ts` |
| 상수/스키마 | camelCase | `eslintSchema.ts` |

```
# BAD
src/components/config-generator.svelte    # 컴포넌트인데 kebab-case
src/lib/utils/FormatCode.ts               # 유틸인데 PascalCase

# GOOD
src/components/ConfigGenerator.svelte     # 컴포넌트 → PascalCase
src/lib/utils/formatCode.ts               # 유틸 함수 → camelCase
```

> **Why:** 파일명만으로 컴포넌트(.astro/.svelte)인지 유틸/로직 파일(.ts)인지 즉시 구분하기 위함이다.

### 변수/함수/타입명

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수, 함수 | camelCase | `configOptions`, `generateConfig` |
| 타입, 인터페이스 | PascalCase | `ConfigOption`, `GeneratorState` |
| 상수 (불변 값) | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `DEFAULT_INDENT` |
| 이벤트 핸들러 | handle + 동사 | `handleOptionChange`, `handleDownload` |

### 명시적이고 직관적인 이름 사용

변수명과 함수명은 축약어를 지양하고, 이름만으로 의도를 파악할 수 있도록 작성한다.

```typescript
// BAD: 축약어, 모호한 이름
const t = (locale: Locale, key: string): string => { ... }
const lp = (locale: Locale, path: string): string => { ... }
const obj = { name: 'eslint' }
const val = getConfig()
const cb = () => {}

// GOOD: 명시적이고 직관적인 이름
const getTranslation = (locale: Locale, translationKey: string): string => { ... }
const buildLocalizedPath = (locale: Locale, pagePath: string): string => { ... }
const fileMetadata = { name: 'eslint' }
const generatedConfigValue = getConfig()
const onChangeCallback = () => {}
```

> **Why:** 1인 개발에서 시간이 지난 후 코드를 다시 볼 때, 이름만 보고 의도를 즉시 파악할 수 있어야 한다. 코드 리뷰나 유지보수 시 맥락 없이도 이해 가능한 코드가 좋은 코드다.

## 코드 분리 기준

### 비즈니스 로직 분리

Svelte 컴포넌트에서 비즈니스 로직은 별도 모듈로 분리한다. 컴포넌트는 UI 렌더링과 이벤트 바인딩에 집중하고, 로직은 테스트와 재사용이 용이한 순수 함수로 관리한다.

**분리 위치:**
- **단일 컴포넌트 전용** → 같은 위치에 `modules/` 폴더
- **2곳 이상 사용** → `src/lib/`로 이동

```
src/components/generator/
├── StackGenerator.svelte
├── CodePreview.svelte
├── modules/                      # 이 폴더 내 컴포넌트 전용 모듈
│   ├── stackLogic.ts             # StackGenerator 전용 로직
│   └── previewFormatter.ts       # CodePreview 전용 로직
└── ...

src/lib/
├── utils/                        # 범용 유틸리티 (순수 함수)
│   ├── formatCode.ts             # 코드 포맷팅
│   ├── parseJson.ts              # JSON 파싱
│   └── shareUrl.ts               # URL 인코딩/디코딩
└── modules/                      # 도메인 로직 (비즈니스 규칙)
    ├── configGenerator.ts        # 설정 파일 생성 로직
    └── optionResolver.ts         # 옵션 의존성 해결 로직
```

### utils vs modules 구분

| 폴더 | 역할 | 특징 | 예시 |
|------|------|------|------|
| `utils/` | 범용 유틸리티 | 도메인 무관, 어디서든 사용 가능 | `formatCode`, `debounce`, `deepClone` |
| `modules/` | 도메인 로직 | ConfigDeck 비즈니스 규칙 포함 | `generateEslintConfig`, `resolveOptionDeps` |

```typescript
// utils/ — 범용, 도메인 무관
const formatCode = (code: string, indent: number): string => { ... }
const debounce = <T>(fn: T, delay: number): T => { ... }

// modules/ — 도메인 로직, ConfigDeck 규칙 포함
const generateEslintConfig = (options: EslintOptions): string => { ... }
const resolveOptionDependencies = (selected: string[]): string[] => { ... }
```

> **Why:** utils와 modules를 분리하면 "이 함수가 프로젝트 특화인지, 범용인지"를 파일 위치만으로 즉시 파악할 수 있다. 범용 유틸은 다른 프로젝트에도 복사해서 쓸 수 있고, 도메인 로직은 ConfigDeck 맥락을 알아야 이해할 수 있음을 명시한다.

### 공통 분리 시점

**두 곳 이상의 서로 다른 영역이나 기능에서 사용되면 공통으로 분리한다.**

```
# BAD: 한 곳에서만 쓰는 함수를 공통으로 분리
src/lib/utils/formatEslintPreview.ts  ← ESLint 생성기에서만 사용

# GOOD: 한 곳에서만 쓰는 로직은 해당 컴포넌트 modules/에 유지
src/components/generator/modules/formatEslintPreview.ts

# GOOD: 두 곳 이상에서 쓰이면 src/lib/로 분리
src/lib/utils/formatCode.ts  ← ESLint, Prettier, TSConfig 미리보기에서 공통 사용
```

> **Why:** 과도한 추상화는 코드 탐색을 어렵게 한다. 실제로 재사용되는 시점에 분리해야 불필요한 추상화 계층을 방지할 수 있다.

## TypeScript 규칙

### strict 모드 필수

`tsconfig.json`에서 `strict: true`를 활성화한다. 이는 `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes` 등을 모두 포함한다.

**참고:** [TypeScript - strict](https://www.typescriptlang.org/tsconfig/#strict)

### any 타입 사용 금지

`any`는 TypeScript의 타입 안전성을 완전히 무력화한다. 어떤 상황에서도 사용하지 않는다.

```typescript
// BAD: any 사용
const processConfig = (options: any) => {
  return options.rules;
};

// GOOD: 정확한 타입 정의
interface EslintOptions {
  rules: Record<string, RuleSeverity>;
  extends: string[];
}

const processConfig = (options: EslintOptions) => {
  return options.rules;
};
```

타입을 모르는 외부 데이터는 `unknown`을 사용하고, 타입 가드로 좁힌다.

```typescript
// BAD
const parseInput = (data: any) => data.value;

// GOOD
const parseInput = (data: unknown) => {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid input');
};
```

### 타입 단언(as) 지양

`as`를 사용한 타입 단언은 컴파일러의 타입 검사를 우회한다. 어쩔 수 없는 경우가 아니라면 사용하지 않는다.

```typescript
// BAD: as로 타입 단언
const element = document.getElementById('app') as HTMLDivElement;
element.textContent = 'hello';

// GOOD: 타입 가드로 안전하게 좁히기
const element = document.getElementById('app');
if (element instanceof HTMLDivElement) {
  element.textContent = 'hello';
}
```

허용되는 예외:
- 외부 라이브러리의 타입 정의가 불완전한 경우
- Svelte의 `$props()` 등 프레임워크 API에서 타입 추론이 불가능한 경우

이 경우에도 반드시 주석으로 이유를 명시한다.

```typescript
// as 허용 — Svelte $props()에서 제네릭 타입 추론 한계
let { items } = $props() as { items: ConfigItem[] };
```

### const 우선 사용

변수 선언 시 `const`를 기본으로 사용한다. 재할당이 반드시 필요한 경우에만 `let`을 사용한다. `var`는 사용하지 않는다.

```typescript
// BAD: 재할당이 없는데 let 사용
let config = generateConfig(options);
let items = [1, 2, 3];
let user = { name: 'jsg3121' };

// GOOD: 재할당이 없으면 const
const config = generateConfig(options);
const items = [1, 2, 3];
const user = { name: 'jsg3121' };

// GOOD: 재할당이 필요한 경우에만 let
let count = 0;
count += 1;

let current = items[0];
for (const item of items) {
  current = item;
}
```

> **Why:** `const`는 변수가 재할당되지 않음을 보장하여, 코드를 읽을 때 값의 변경 여부를 추적할 필요가 없다. 의도치 않은 재할당 버그도 방지한다. Svelte 5의 `$state()`는 `let`으로 선언해야 하므로 이 경우는 예외이다.

### 화살표 함수 사용

함수 선언 시 화살표 함수를 사용한다.

```typescript
// BAD: function 선언
function generateConfig(options: ConfigOptions): string {
  return JSON.stringify(options, null, 2);
}

// GOOD: 화살표 함수
const generateConfig = (options: ConfigOptions): string => {
  return JSON.stringify(options, null, 2);
};
```

> **Why:** 화살표 함수는 `this` 바인딩이 렉시컬 스코프를 따르므로, 콜백이나 이벤트 핸들러에서의 `this` 혼란을 방지한다. 프로젝트 전체에서 함수 선언 스타일을 통일하여 일관성을 유지한다.

### JSDoc으로 함수 설명 (한글 최우선)

모든 함수에는 JSDoc 주석으로 역할을 설명한다. **JSDoc은 한글을 최우선으로 작성한다.** 기술 용어(locale, path, SEO, config 등)는 원문을 유지한다. **모든 함수에 `@param`과 `@returns`를 필수로 작성한다.**

```typescript
// BAD: 영어로만 작성, @param/@returns 누락
/**
 * Merge base ESLint rules with user overrides.
 */
const mergeRules = (base: Rules, overrides: Rules): Rules => {
  return { ...base, ...overrides };
};

// GOOD: 한글로 작성, @param/@returns 포함
/**
 * 기본 ESLint 규칙에 사용자 오버라이드를 병합한다.
 * 동일 키가 있으면 overrides가 우선한다.
 * @param base - 기본 규칙 객체
 * @param overrides - 사용자 오버라이드 규칙 객체
 * @returns 병합된 규칙 객체
 */
const mergeRules = (base: Rules, overrides: Rules): Rules => {
  return { ...base, ...overrides };
};

// GOOD: 모든 매개변수와 반환값 설명
/**
 * 설정 파일의 들여쓰기를 변환한다.
 * @param content - 원본 설정 파일 문자열
 * @param size - 들여쓰기 크기 (스페이스 수)
 * @returns 들여쓰기가 변환된 문자열
 */
const convertIndent = (content: string, size: number): string => {
  // ...
};
```

> **Why:** 한국어 네이티브 개발자가 주 사용자이므로, JSDoc을 한글로 작성하면 함수의 역할과 의도를 가장 빠르게 파악할 수 있다. 기술 용어는 번역하면 오히려 혼란을 주므로 원문을 유지한다. `@param`과 `@returns`를 항상 작성하면 IDE 자동완성과 타입 힌트에서 함수 사용법을 즉시 파악할 수 있다.

## 참고 자료

- [Astro - Project Structure](https://docs.astro.build/en/basics/project-structure/)
- [Astro - Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Astro + Svelte Integration](https://docs.astro.build/en/guides/integrations-guide/svelte/)
- [Svelte 5 - What are runes?](https://svelte.dev/docs/svelte/what-are-runes)
- [TypeScript - strict](https://www.typescriptlang.org/tsconfig/#strict)
