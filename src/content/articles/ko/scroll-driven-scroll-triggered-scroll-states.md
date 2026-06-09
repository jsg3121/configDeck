---
id: "https://css-tricks.com/?p=393503"
tool: "csstricks"
title: "스크롤 기반 애니메이션, 스크롤 트리거, 스크롤 상태, 뷰 전환 — 개념 구분 정리"
link: "https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/"
pubDate: 2026-06-08T13:00:34.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/"
contentType: "commentary"
summary: "CSS-Tricks에서 스크롤 기반 애니메이션, 스크롤 트리거 애니메이션, 컨테이너 쿼리 스크롤 상태, 뷰 전환 네 가지 개념의 차이를 정리한 글이다. 이름이 비슷해 혼동하기 쉬운 CSS 기능들을 한눈에 비교할 수 있다."
---

CSS-Tricks에서 스크롤과 관련된 네 가지 CSS 기능 — scroll-driven animations, scroll-triggered animations, container query scroll states, view transitions — 의 개념 차이를 정리한 글을 게시했다. 저자 자신도 용어를 혼용해 왔다고 인정하면서, 각 기능이 무엇을 하고 어떻게 다른지 비교표까지 포함해 설명한다.

## 무엇이 새로운가

이 글 자체가 새로운 기능 발표는 아니다. 이미 존재하거나 작업 초안(working draft) 단계에 있는 네 가지 CSS 기능의 경계를 명확히 구분하는 것이 목적이다. 핵심 차이는 이렇다: **scroll-driven animation**은 스크롤 진행률과 애니메이션 진행률이 1:1로 연결되어, 스크롤을 멈추면 애니메이션도 멈춘다. 반면 **scroll-triggered animation**은 요소가 "trigger activation range"라 불리는 임계점을 지나면 애니메이션이 끝까지 실행된다. **Container query scroll state**는 CSS Conditional Rules Module Level 5 작업 초안에 포함된 기능으로, 컨테이너가 특정 스크롤 조건(예: `stuck: top`)에 도달하면 스타일을 업데이트한다. **View transition**은 스크롤과 무관하며, 같은 문서 내 상태 전환과 문서 간 전환 두 가지 시나리오를 다루는 CSS+JS API다.

## 설정 파일에 어떤 의미인가

이 네 가지 기능은 대부분 순수 CSS 또는 CSS+JS API 영역이라, 빌드 도구나 번들러의 설정 파일에 직접적인 변경을 요구하지는 않는다. 다만 한 가지 실무적인 고려가 있다: `animation-timeline: scroll()` 같은 최신 CSS 프로퍼티를 사용할 경우 PostCSS autoprefixer나 Browserslist 설정에서 지원 대상 브라우저 범위를 확인해야 한다. Container query scroll state는 아직 작업 초안 단계이므로 lint 도구(예: Stylelint)가 해당 구문을 오류로 잡을 수 있다. 이 경우 Stylelint 설정에서 해당 규칙을 명시적으로 허용해야 할 수 있지만, 구체적인 설정 방법은 원문에서 다루지 않으므로 공식 스펙 안정화 후 별도 정리가 필요하다.

## 다음 단계 제안

네 개념이 헷갈리는 사람이라면 원문의 비교표를 한 번 훑어보는 것만으로 충분히 정리된다. 그 다음에는 자신의 프로젝트에서 실제로 필요한 것이 스크롤 진행률 연동인지, 단순 진입 트리거인지, 혹은 sticky 상태 감지인지 판단하고, 해당 기능의 브라우저 지원 현황을 Can I Use에서 확인하는 순서가 현실적이다.

---

**원문 전체 보기**: [Scroll-Driven, Scroll-Triggered, Scroll States, and View Transitions](https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/) ([CSS-Tricks](https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/))