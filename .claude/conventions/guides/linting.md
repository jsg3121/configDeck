# 린팅 및 포맷팅 컨벤션

Prettier와 ESLint를 사용하여 코드 스타일과 품질을 자동으로 관리한다.

## Prettier

### 기본 설정

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": [
    "prettier-plugin-astro",
    "prettier-plugin-svelte",
    "@ianvs/prettier-plugin-sort-imports"
  ],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    },
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

> **Why:** Prettier로 코드 포맷을 자동화하면 스타일 관련 논쟁을 없앨 수 있다. Astro/Svelte 전용 파서를 통해 `.astro`와 `.svelte` 파일도 포맷팅 대상에 포함한다.

**참고:**

- [Prettier - Options](https://prettier.io/docs/options)
- [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro)
- [prettier-plugin-svelte](https://github.com/sveltejs/prettier-plugin-svelte)

### 플러그인 순서

Prettier 플러그인은 순서가 중요하다. 파서 플러그인(astro, svelte)을 먼저, 변환 플러그인(sort-imports)을 나중에 배치한다.

```json
{
  "plugins": [
    "prettier-plugin-astro",
    "prettier-plugin-svelte",
    "@ianvs/prettier-plugin-sort-imports"
  ]
}
```

## import 정렬 규칙

`@ianvs/prettier-plugin-sort-imports`를 사용하여 경로 depth 기준으로 자동 정렬한다.

### 정렬 순서

1. 빌트인 모듈 (node:fs 등)
2. 서드파티 패키지
3. 프로젝트 절대 경로 (기능별 그룹)
4. 상대 경로 (먼 것 → 가까운 것)

```typescript
// BAD: 정렬 없는 import
import { generateConfig } from './generateConfig';
import type { ConfigOption } from '@/types/config';
import { format } from 'prettier';
import { z } from 'zod';
import Layout from '@/layouts/Layout.astro';

// GOOD: depth 기준 정렬
import { format } from 'prettier';
import { z } from 'zod';

import Layout from '@/layouts/Layout.astro';
import type { ConfigOption } from '@/types/config';

import { generateConfig } from './generateConfig';
```

### import 정렬 설정

```json
{
  "importOrder": [
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/layouts/(.*)$",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^@/types/(.*)$",
    "^@/styles/(.*)$",
    "^@/i18n/(.*)$",
    "",
    "^\\.\\./",
    "^\\./"
  ]
}
```

> **Why:** import 순서가 일관되면 코드 리뷰 시 불필요한 diff를 줄이고, 의존성 구조를 한눈에 파악할 수 있다. Prettier로 자동화하면 수동 관리 부담도 없다.

**참고:** [@ianvs/prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports)

## ESLint

### 기본 방향

Astro 공식 ESLint 설정을 기반으로 하되, TypeScript와 Svelte 규칙을 추가한다. ESLint는 flat config(`eslint.config.mjs`) 형식을 사용한다.

### 핵심 규칙

| 규칙 | 설정 | 이유 |
|------|------|------|
| `no-console` | warn | 디버깅용 console은 커밋 전 제거. 의도적 사용 시 eslint-disable 주석 |
| `no-unused-vars` | error | 사용하지 않는 변수는 코드 가독성을 해친다 |
| `prefer-const` | error | 재할당 없는 변수는 `const`로 선언 (coding.md 규칙과 동일) |
| `no-var` | error | `var`는 사용하지 않는다 |
| `eqeqeq` | error | `===`/`!==`만 사용 |
| `@typescript-eslint/no-explicit-any` | error | `any` 타입 사용 금지 (coding.md 규칙과 동일) |
| `@typescript-eslint/consistent-type-imports` | error | `import type`을 사용하여 타입 임포트를 명시적으로 구분 |
| `@typescript-eslint/no-non-null-assertion` | warn | `!` 연산자 지양. 타입 가드를 대신 사용 |

```typescript
// BAD: 일반 import로 타입 가져오기
import { ConfigOption } from '@/types/config';

// GOOD: import type으로 타입 명시
import type { ConfigOption } from '@/types/config';
```

> **Why:** `import type`은 빌드 시 완전히 제거되어 번들 크기에 영향을 주지 않는다. 또한 코드를 읽을 때 해당 import가 런타임 값인지 타입인지 즉시 구분할 수 있다.

### ESLint 설정 예시

```javascript
// eslint.config.mjs
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.strict,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
];
```

**참고:**

- [ESLint - Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [eslint-plugin-astro](https://github.com/ota-meshi/eslint-plugin-astro)
- [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)
- [typescript-eslint - Configurations](https://typescript-eslint.io/getting-started/)

## 참고 자료

- [Prettier - Options](https://prettier.io/docs/options)
- [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro)
- [prettier-plugin-svelte](https://github.com/sveltejs/prettier-plugin-svelte)
- [@ianvs/prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports)
- [ESLint - Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [eslint-plugin-astro](https://github.com/ota-meshi/eslint-plugin-astro)
- [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)
- [typescript-eslint](https://typescript-eslint.io/getting-started/)
