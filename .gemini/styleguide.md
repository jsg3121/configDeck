# ConfigDeck 코드 리뷰 가이드

이 문서는 Gemini Code Assist가 ConfigDeck PR을 리뷰할 때 따라야 할 프로젝트별 규칙이다.
세부 규칙은 `.claude/conventions/guides/`와 `.claude/decisions/records/`에 정의돼 있으며, 이 문서는 리뷰 관점에서 가장 자주 위반되거나 영향이 큰 항목만 추린다.

---

## 1. 언어 및 타입 안전성

- **TypeScript strict 모드 위반은 항상 지적한다.**
  - `any`, `as unknown as`, `@ts-ignore`, `@ts-expect-error`(사유 주석 없을 때) 사용은 모두 차단 사유다.
  - 타입을 모르는 외부 데이터는 zod 등 런타임 검증으로 좁힌 뒤 사용해야 한다.
  - Why: ConfigDeck은 설정 파일 스키마 생성이 핵심 기능이라 타입 정확성이 곧 제품 정확성이다.

- **`as` 캐스팅은 지양한다.** 불가피하다면 그 줄 위에 사유 주석이 있어야 한다.

- 새로 추가되는 공개 함수/컴포넌트 props는 명시적 타입 시그니처를 가져야 한다.

## 2. Astro / Svelte 5 렌더링 전략

- **불필요한 `client:*` 디렉티브 사용을 지적한다.**
  - 정적 콘텐츠는 Astro 컴포넌트로, 상호작용이 필요한 부분만 Svelte 아일랜드(`client:load`, `client:visible`, `client:idle`)로 분리한다.
  - 페이지 전체를 `client:load`로 감싸는 패턴은 거의 항상 잘못이다.
  - Why: ConfigDeck은 SEO 유입이 핵심이므로 JS 0KB 원칙을 깨면 LCP/INP가 무너진다.

- **Svelte 5 컴포넌트는 Runes(`$state`, `$derived`, `$effect`, `$props`)를 사용한다.**
  - 레거시 `export let`, reactive `$:`, store auto-subscribe(`$store`) 신규 도입은 지적한다.
  - `$effect` 안에서 `$state`를 직접 갱신하는 무한 루프 위험을 점검한다.

- `$state`를 가진 객체를 `structuredClone`으로 복제하면 `DataCloneError`가 난다. 깊은 복제가 필요하면 `$state.snapshot()`을 먼저 호출하도록 안내한다.

## 3. 스타일링 (Tailwind v4)

- **`@apply` 사용은 원칙적으로 지적한다.**
  - 유틸리티 클래스로 직접 작성하는 것이 우선이며, `@apply`는 디자인 토큰/컴포넌트 추상화에만 제한적으로 허용된다.
  - Why: `@apply`는 Tailwind v4의 CSS 기반 `@theme` 설계와 충돌하고, 번들 사이즈/추적성을 해친다.

- 인라인 `style="..."` 속성 신규 도입은 사유가 없으면 지적한다.

- 색상/간격/폰트는 `@theme`에 정의된 토큰을 사용해야 하며, 매직 넘버(`text-[#3a3a3a]`, `mt-[13px]`)는 디자인 토큰 등록 권고와 함께 지적한다.

## 4. SEO 및 접근성

- **새로 추가되는 페이지(`src/pages/**/*.astro`)는 다음을 점검한다.**
  - `<title>`, `<meta name="description">`, OG 태그(`og:title`, `og:description`, `og:image`)
  - 다국어 페이지는 `hreflang` 링크 (실제 존재하는 locale만 출력)
  - 적절한 시맨틱 태그 사용 (`<main>`, `<article>`, `<nav>`, `<section>`)
  - 구조화 데이터(JSON-LD)가 필요한 페이지 유형인지

- 이미지 `<img>`/`<Image>`는 의미가 있으면 `alt` 필수, 장식용이면 `alt=""` 명시.

- 클릭 가능한 요소는 키보드 접근(`tabindex`, `role`, 키보드 이벤트 핸들러) 확인.

- 자세한 규칙은 `.claude/seo/guides/`와 `.claude/conventions/guides/rendering.md` 참조.

## 5. import 순서 및 코드 스타일

- `@ianvs/prettier-plugin-sort-imports` 규칙을 따른다. 순서가 깨진 import는 지적하되, 포맷터가 자동 수정 가능하므로 차단 사유로 보지 않는다.
- 미사용 import/변수는 ESLint가 잡지만, 신규 코드에서 발견 시 지적한다.

## 6. 의사결정 및 컨벤션 충돌

- 변경이 기존 ADR(`.claude/decisions/records/`)이나 컨벤션을 명시적으로 위반하는 것 같으면, 해당 문서를 인용하며 지적한다.
- 새 라이브러리/도구 추가 PR이 ADR 없이 들어오면 "ADR 작성 또는 기존 ADR 갱신이 필요해 보입니다"라고 코멘트한다.

## 7. 보안

- 외부 입력(URL 파라미터, 사용자 입력, 외부 API 응답)을 DOM에 그대로 삽입하는 패턴(`{@html ...}`, `innerHTML`)은 항상 지적한다.
- 환경 변수, API 키, 토큰이 코드/주석/문서에 하드코딩돼 있으면 즉시 차단 코멘트.
- 외부 fetch 결과를 검증 없이 그대로 신뢰하는 코드는 지적한다.

## 8. 테스트

- 새 기능 PR에 테스트가 없으면 "단위 또는 E2E 테스트 추가가 필요해 보입니다"라고 코멘트한다.
- 단위 테스트는 Vitest, E2E는 Playwright를 사용한다. 다른 프레임워크 도입은 ADR 필요.

## 9. 리뷰 톤

- 한국어로 코멘트한다. 코드 식별자/기술 용어는 원문 그대로 둔다.
- 코멘트 한 줄당 한 가지 이슈만 다룬다.
- 차단 사유(must fix)와 제안(nit/suggestion)을 명확히 구분한다.
- 단순 취향 차이는 코멘트하지 않는다. 규칙·문서로 뒷받침되는 항목만 지적한다.

## 10. 자동 생성 PR 처리

- 브랜치명이 `articles/auto-update-*`인 PR은 본문(`src/content/articles/**`)이 `ignore_patterns`로 제외돼 있다.
- 이런 PR에서는 다음만 점검한다:
  - 워크플로우 변경(`.github/workflows/update-articles.yml`)이 함께 들어왔는지
  - 스크립트(`scripts/update-articles.ts`, `scripts/article-helpers.ts` 등) 변경이 함께 들어왔는지
  - 아티클 외 파일이 의도치 않게 포함됐는지
- 본문 품질은 `scripts/validate-article.ts`가 담당하므로 리뷰 대상이 아니다.
