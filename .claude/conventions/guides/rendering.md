# 렌더링 전략 컨벤션

## 기본 원칙

ConfigDeck은 **SSG(Static Site Generation)를 기본 렌더링 모드**로 사용한다 (ADR-0002). Astro v5에서는 `output: 'static'`이 기본값이며, 이는 모든 페이지를 빌드 시점에 프리렌더링한다.

> **Why:** 프리렌더링된 HTML은 검색엔진이 즉시 인덱싱할 수 있고, CDN에서 직접 제공되어 TTFB가 빠르다. ConfigDeck의 핵심 기능(설정 생성, 다운로드)이 모두 클라이언트에서 완결되므로 SSR이 불필요하다.

## Astro v5 렌더링 모드

```
output: 'static' (기본값, ConfigDeck이 사용하는 모드)
├── 모든 페이지 → 빌드 시 프리렌더링 (HTML 파일 생성)
└── 개별 페이지에서 prerender = false → 온디맨드 렌더링 (필요 시)
```

Astro v5에서는 `output: 'hybrid'`가 제거되었고, 기존 hybrid 동작(대부분 정적 + 일부 동적)은 `static` 모드에 통합되었다.

**참고:** [Astro - On-demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/)

## 페이지 유형별 렌더링 전략

### SSG (프리렌더링) — 기본

대부분의 페이지는 빌드 시 정적 HTML로 생성한다.

- **홈 페이지**: 서비스 소개, 프리셋 목록 → SSG
- **생성기 페이지**: 페이지 셸은 SSG, 인터랙션은 Svelte 아일랜드
- **파일별 랜딩**: `/files/eslint-config` 등 → SSG + `generateStaticParams`
- **스택별 랜딩**: `/stacks/frontend/react` 등 → SSG
- **블로그/문서**: Content Collections 기반 → SSG
- **FAQ**: 정적 콘텐츠 → SSG

```astro
---
// 대부분의 페이지 — prerender 설정 불필요 (기본값 true)
// src/pages/en/files/[slug].astro

export const getStaticPaths = () => {
  return [
    { params: { slug: 'eslint-config' } },
    { params: { slug: 'prettier-config' } },
    { params: { slug: 'tsconfig' } },
  ]
}
---
```

### SSG + Svelte 아일랜드 — 인터랙티브 페이지

생성기처럼 인터랙션이 필요한 페이지는 페이지 자체는 SSG로 렌더링하고, 인터랙티브 영역만 Svelte 아일랜드로 hydration한다.

```astro
---
// src/pages/en/generator.astro — SSG로 렌더링
import BaseLayout from '@/layouts/BaseLayout.astro'
import ConfigGenerator from '@/components/generator/ConfigGenerator.svelte'
---

<BaseLayout title="Config Generator">
  <main>
    <h1>설정 파일 생성기</h1>
    <!-- 이 부분만 클라이언트에서 hydration -->
    <ConfigGenerator client:load />
  </main>
</BaseLayout>
```

> **Why:** 페이지 셸(내비게이션, 레이아웃, heading)은 SSG로 즉시 렌더링되어 SEO에 유리하고, 인터랙티브 영역만 hydration되어 초기 로딩이 빠르다.

### 온디맨드 렌더링 (SSR) — 현재 불필요

ConfigDeck은 로그인, DB 연동, 사용자별 맞춤 콘텐츠가 없으므로 SSR이 필요하지 않다 (ADR-0002). 향후 필요해지면 개별 페이지에서 `prerender = false`로 전환한다.

```astro
---
// 현재는 사용하지 않음. 향후 필요 시 예시:
// src/pages/api/share.ts
export const prerender = false  // 이 엔드포인트만 서버에서 처리

export const GET = async ({ url }) => {
  // 공유 링크 단축 등 서버 사이드 로직
}
---
```

## SEO와 렌더링 전략

| 렌더링 | SEO 영향 | ConfigDeck 적용 |
|--------|---------|----------------|
| SSG | 최적. 완성된 HTML이 CDN에서 제공되어 TTFB가 빠르고 크롤링에 유리 | 모든 페이지 기본값 |
| SSG + 아일랜드 | 페이지 셸은 SSG와 동일하게 크롤링 가능. JS 의존 콘텐츠는 인덱싱 불확실 | 생성기 페이지 |
| SSR | CSR보다 유리하나 SSG보다 느림. 동적 콘텐츠가 필수인 경우에만 사용 | 현재 미사용 |
| CSR | 검색엔진 인덱싱 불확실. 사용하지 않는다 | 사용 금지 |

### 아일랜드 내부 콘텐츠의 SEO

Svelte 아일랜드 내부의 콘텐츠는 SSR이 아닌 한 초기 HTML에 포함되지 않을 수 있다. SEO에 중요한 텍스트(heading, 설명 등)는 아일랜드 바깥 Astro 영역에 배치한다.

```astro
<!-- BAD: SEO 중요 텍스트가 아일랜드 내부 -->
<ConfigGenerator client:load />
<!-- h1, 설명 등이 Svelte 내부에 있으면 크롤러가 읽지 못할 수 있음 -->

<!-- GOOD: SEO 텍스트는 Astro 영역에, 인터랙션만 아일랜드 -->
<h1>ESLint Config Generator</h1>
<p>Generate a customized ESLint configuration for your project.</p>
<ConfigGenerator client:load />
```

## 참고 자료

- [Astro - On-demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Astro - Routing Reference (prerender)](https://docs.astro.build/en/reference/routing-reference/)
- [Astro - Upgrade to v5](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [Astro - Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)
