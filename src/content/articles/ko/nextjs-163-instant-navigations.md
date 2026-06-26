---
id: "/blog/next-16-3-instant-navigations"
tool: "nextjs"
title: "Next.js 16.3: 즉각 네비게이션으로 SPA 수준의 반응성 도입"
link: "https://nextjs.org/blog/next-16-3-instant-navigations"
pubDate: 2026-06-25T20:00:00.000Z
sourceName: "Next.js Blog"
sourceUrl: "https://nextjs.org/blog/next-16-3-instant-navigations"
contentType: "commentary"
summary: "Next.js 16.3 프리뷰가 공개됐다. 서버 컴포넌트 기반 앱에서도 SPA처럼 즉각적인 페이지 전환을 가능하게 하는 'Instant Navigations' 기능과 프리페칭 방식의 전면 재설계가 핵심이다."
---

Next.js Blog에서 Next.js 16.3 프리뷰 릴리스를 발표했다. 이번 릴리스의 주요 초점은 서버 컴포넌트 앱의 네비게이션 지연 문제를 해결하는 "Instant Navigations" 기능이다.

## 무엇이 새로운가

핵심은 서버 주도(server-driven) 모델을 유지하면서도 클라이언트 SPA 수준의 즉각적인 페이지 전환을 제공하는 것이다. 비동기 데이터를 기다리는 라우트에 대해 세 가지 선택지를 제시한다: `<Suspense>`로 **Stream**(로딩 상태를 즉시 표시), `'use cache'`로 **Cache**(캐시된 UI를 즉시 표시), 또는 **Block**(서버 응답을 기다림). 개발 환경에서는 느린 네비게이션을 에러로 표시하는 Instant Insights 패널이 추가됐고, Playwright용 `instant` 테스트 헬퍼도 함께 제공된다.

프리페칭 전략도 크게 바뀌었다. 기존에는 뷰포트 내 모든 링크마다 개별 프리페치 요청을 보냈지만, 16.3부터는 라우트 단위로 재사용 가능한 "shell"을 한 번만 프리페치한다. 예를 들어 사이드바에 채팅 링크가 20개 있어도 `/chat/[id]` 라우트에 대한 셸 하나만 가져온다. 특정 링크에 대해 더 많은 데이터를 프리페치하고 싶다면 `<Link prefetch={true}>`를 사용할 수 있다. Navigation Inspector라는 DevTools 도구도 추가되어 각 라우트의 셸을 시각적으로 확인할 수 있다.

## 설정 파일에 어떤 의미인가

두 가지 새로운 opt-in 플래그가 Next.js 설정 파일에 추가된다. 하나는 `cacheComponents`로, 동적 기본값 중심의 새로운 캐싱 동작을 활성화한다. 다른 하나는 `partialPrefetching`으로, 위에서 설명한 라우트 단위 셸 프리페칭을 켠다. 원문에 따르면 두 옵션 모두 향후 메이저 버전에서 기본값이 될 예정이다.

다만 원문에서는 설정 파일의 정확한 프로퍼티 형태나 기존 `next.config` 옵션과의 상호작용(예: 기존 `prefetch` 관련 설정, ISR/SSG 캐싱 옵션 등)에 대해 구체적으로 다루지 않았다. 프리뷰 단계이므로 안정 릴리스 시점에 공식 문서가 보강되면 설정 변경 사항을 다시 정리하겠다. Breaking change 여부도 아직 명시되지 않았다.

## 다음 단계 제안

`@preview` 태그로 npm에 이미 공개되어 있으므로, 기존 프로젝트에 설치해서 `cacheComponents`와 `partialPrefetching` 플래그를 켜고 개발 모드에서 Instant Insights 패널의 피드백을 확인해 보는 것이 가장 빠른 체험 방법이다. 기존 앱에 Cache Components를 처음 적용하는 경우 원문에서 안내하는 에이전트용 Skill을 활용할 수 있다. Next.js 설정 파일을 새로 구성하거나 점검하고 싶다면 [Next.js 설정 생성](/ko/generator/nextjs) 도구를 참고해도 좋다.

---

**원문 전체 보기**: [Next.js 16.3: Instant Navigations](https://nextjs.org/blog/next-16-3-instant-navigations) ([Next.js Blog](https://nextjs.org/blog/next-16-3-instant-navigations))