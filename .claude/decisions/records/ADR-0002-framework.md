# ADR-0002: 프레임워크 선택 — Astro + Svelte

- 상태: 승인됨
- 날짜: 2026-04-06
- 의사결정자: jsg3121

## 맥락 (Context)

ConfigDeck은 두 가지 성격의 페이지가 혼재한다.

- **콘텐츠 페이지 (~70%)**: 파일별/스택별 SEO 랜딩, 블로그, 문서, FAQ — 정적 HTML이 이상적
- **인터랙티브 페이지 (~30%)**: 설정 생성기 — 체크박스 옵션 선택, 실시간 미리보기, ZIP 다운로드 등 복잡한 클라이언트 인터랙션

또한 로그인, DB 연동 등 서버 사이드 기능은 불필요하며, 설정 생성/ZIP 다운로드 등 핵심 기능이 모두 클라이언트에서 완결된다.

후보로 Next.js와 Astro를 비교 검토했고, 인터랙티브 부분에 사용할 UI 프레임워크로 React, Svelte, Preact를 비교했다.

## 결정 (Decision)

**Astro + Svelte** 조합을 채택한다.

- 메타 프레임워크: **Astro**
- 인터랙티브 UI: **Svelte 5** (Astro 아일랜드로 통합)
- 콘텐츠 페이지: 순수 Astro 컴포넌트 (JS 0KB)

## 근거 (Rationale)

### Astro 선택 이유

| 관점 | 판단 |
|------|------|
| SSG/SEO | 태생이 정적 사이트 생성기. 콘텐츠 페이지에 JS 0KB 전송 가능 |
| 다국어 | Astro 4.0+ 빌트인 i18n 라우팅 지원 |
| 콘텐츠 관리 | Content Collections로 블로그/문서를 스키마 기반 관리 |
| 번들 크기 | Zero JS by default — Core Web Vitals에 유리 |
| 배포 유연성 | 정적 출력 기본이므로 Vercel, Netlify, Cloudflare Pages, S3 등 어디서든 배포 가능 |

### Next.js 불채택 이유

- 서버 사이드 기능(Server Actions, API Routes, Auth.js)을 사용할 계획이 없어 오버스펙
- 콘텐츠 페이지에도 React 런타임(~40KB+)이 포함되어 불필요한 번들 증가
- SSR이 필수가 아닌 프로젝트에서 Next.js의 핵심 장점이 발휘되지 않음

### Svelte 선택 이유 (React/Preact 대비)

| 관점 | 판단 |
|------|------|
| 번들 크기 | 컴파일러 기반으로 런타임 ~0KB — Astro의 "가벼움" 철학과 시너지 |
| Hydration | Virtual DOM diffing 없이 DOM에 직접 이벤트/반응성 연결 — 가볍고 빠름 |
| 폼 처리 | `bind:value`로 양방향 바인딩 내장 — 설정 생성기의 수십 개 옵션 UI에 적합 |
| 코드량 | React 대비 30~40% 적은 코드 |
| CSS | 컴포넌트 스코프 CSS 내장 (Tailwind와 병행 가능) |

### 감수하는 트레이드오프

- Svelte 생태계가 React 대비 작음 (npm 다운로드 기준 ~5-8%)
- `.svelte` 파일 문법 학습 필요 (JSX와 다른 템플릿 문법)
- 한국 내 Svelte 커뮤니티/레퍼런스가 적음

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| Next.js + React | 서버 기능 불필요, 콘텐츠 페이지에 불필요한 런타임 오버헤드 |
| Astro + React | React 런타임 ~40KB가 아일랜드에 포함되어 Astro의 가벼움 장점 희석 |
| Astro + Preact | Svelte보다 번들 크고, 양방향 바인딩 등 편의 기능 부족 |
| 순수 Astro (vanilla JS) | 수십 개 옵션 간 상태 동기화, 실시간 미리보기 등 복잡한 인터랙션을 vanilla JS로 구현하면 미니 프레임워크를 직접 만드는 꼴 |

## 결과 (Consequences)

- 콘텐츠 페이지는 `.astro` 파일로, 인터랙티브 UI는 `.svelte` 파일로 구현한다
- Astro 아일랜드 디렉티브(`client:load`, `client:visible` 등)로 hydration을 제어한다
- Svelte 5의 Runes(`$state`, `$derived`, `$effect`)를 상태 관리에 사용한다
- UI 컴포넌트 라이브러리는 Svelte 생태계(shadcn-svelte, Melt UI 등)에서 선택한다
