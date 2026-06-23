---
id: "https://astro.build/blog/astro-7/"
tool: "astro"
title: "Astro 7.0 — Rust 컴파일러·Sätteri 마크다운·Vite 8로 빌드 속도 대폭 개선"
link: "https://astro.build/blog/astro-7/"
pubDate: 2026-06-22T00:00:00.000Z
sourceName: "Astro Blog"
sourceUrl: "https://astro.build/blog/astro-7/"
contentType: "commentary"
summary: "Astro 7은 .astro 컴파일러를 Rust로 재작성하고, 마크다운/MDX 파이프라인을 Sätteri로 교체하며, Vite 8(Rolldown 번들러)을 채택해 벤치마크 기준 빌드 시간을 15–61% 단축했다."
---

Astro Blog에서 Astro 7.0을 공식 발표했다. 핵심 테마는 속도이며, 컴파일러·마크다운 처리·번들링·렌더링 전 단계에 걸쳐 Rust 기반 네이티브 코드를 도입한 릴리스다.

## 무엇이 새로운가

`.astro` 컴파일러가 기존 Go에서 Rust로 완전 재작성됐다. 내부적으로 oxc 파서와 Lightning CSS를 사용하며, 플랫폼별 네이티브 바이너리를 제공하고 WASM 폴백을 지원한다. 마크다운·MDX 파이프라인은 코어 팀 멤버가 만든 Sätteri로 교체됐는데, GFM·스마트 구두점·Heading ID·컨테이너 디렉티브·수학 표현식·위키링크 등을 별도 remark 플러그인 없이 내장 지원한다. 번들러 단에서는 Vite 8이 들어오면서 esbuild+Rollup 조합을 Rolldown 단일 번들러로 통합했다. 렌더링 엔진도 큐 기반으로 교체됐고, 라우트 캐싱이 안정화되어 Netlify·Vercel·Cloudflare용 실험적 CDN 캐시 프로바이더가 추가됐다. 그 외 `src/fetch.ts` 진입점을 통한 Advanced Routing과, 코딩 에이전트 감지·백그라운드 dev 서버·JSON 로깅 등 AI 지원 기능도 포함됐다.

## 설정 파일에 어떤 의미인가

**마크다운 설정이 바뀐다.** Sätteri가 기본값이 되면서 `astro.config` 안의 `markdown.processor` 옵션을 통해 기능 플래그(`directive`, `math`, `headingAttributes` 등)를 켜는 방식으로 전환된다. 기존에 `remark-gfm`, `remark-smartypants` 같은 플러그인을 일일이 설정하던 부분이 내장으로 대체되므로, 마이그레이션 시 불필요한 의존성과 설정 줄을 정리할 수 있다. remark·rehype 플러그인에 의존하는 프로젝트라면 `@astrojs/markdown-remark`를 명시적으로 지정해 unified 파이프라인을 유지할 수 있다.

**Vite 설정 호환성.** Vite 8에 호환 레이어가 포함돼 기존 `esbuild`·`rollupOptions` 설정을 Rolldown 등가물로 자동 변환한다고 원문은 설명한다. 커스텀 Vite 플러그인도 Rollup 플러그인 API를 그대로 지원하므로 대부분 동작하겠지만, 엣지 케이스는 직접 확인이 필요하다.

**컴파일러 breaking change 세 가지**를 주의해야 한다. (1) HTML 자동 보정이 제거돼 마크업이 있는 그대로 처리된다. (2) 닫히지 않은 태그·미종료 속성이 에러를 발생시킨다. (3) JSX 스타일 공백 처리로 인라인 요소 사이 줄바꿈이 더 이상 공백을 생성하지 않는다 — 기존에 이를 의도적으로 활용한 컴포넌트가 있다면 `{' '}` 표현식을 추가해야 한다.

## 다음 단계 제안

`npx @astrojs/upgrade` CLI로 기존 프로젝트를 업그레이드한 뒤, 공식 마이그레이션 가이드를 따라 컴파일러 breaking change 세 항목을 점검하는 것이 우선이다. 마크다운 플러그인 목록을 검토해 Sätteri 내장 기능으로 대체 가능한 항목을 정리하면 설정이 한결 간결해진다. 새 프로젝트를 시작한다면 [Astro 설정 생성](/ko/generator/astro)에서 Astro 7 기준 설정 파일을 빠르게 만들어 볼 수 있다.

---

**원문 전체 보기**: [Astro 7.0](https://astro.build/blog/astro-7/) ([Astro Blog](https://astro.build/blog/astro-7/))