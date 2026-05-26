---
id: "https://css-tricks.com/?p=393441"
tool: "csstricks"
title: "크로스 문서 뷰 트랜지션: 수백 개 요소로 확장하기"
link: "https://css-tricks.com/cross-document-view-transitions-part-2/"
pubDate: 2026-05-25T13:46:54.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/cross-document-view-transitions-part-2/"
contentType: "commentary"
summary: "CSS-Tricks의 크로스 문서 뷰 트랜지션 시리즈 2편. view-transition-class를 활용해 수백 개 요소의 트랜지션 스타일링을 CSS 규칙 몇 줄로 해결하는 패턴을 다룬다."
---

CSS-Tricks에서 크로스 문서 뷰 트랜지션 시리즈의 두 번째 글을 발행했다. 튜토리얼에서 흔히 보이는 "요소 하나 전환" 패턴을 실제 제품 목록 수십~수백 개 규모로 확장할 때 부딪히는 문제와 해법을 집중적으로 다룬다.

## 무엇이 새로운가

핵심은 `view-transition-name`과 `view-transition-class`의 역할 구분이다. `name`은 페이지 A의 요소와 페이지 B의 요소를 1:1로 매칭하는 고유 식별자이고, `class`는 여러 요소의 애니메이션 스타일을 일괄 지정하는 훅이다. `::view-transition-group(*.card)` 같은 와일드카드 셀렉터를 쓰면, 제품이 몇 개든 트랜지션 CSS는 세 줄이면 충분하다. 글에서는 미래 해법으로 `ident()` 함수와 Chrome 138에 탑재된 `sibling-index()`도 소개하지만, `ident()`는 아직 어떤 브라우저에서도 출시되지 않았다. `view-transition-class` 자체는 Chrome 125, Edge, Safari 18.2+에서 지원되며, Firefox는 아직 미지원이다.

## 설정 파일에 어떤 의미인가

`view-transition-class`는 CSS 속성이므로 빌드 도구 설정에 직접적인 변경을 요구하지는 않는다. 다만 몇 가지 고려할 점이 있다. PostCSS나 Autoprefixer 같은 도구를 사용 중이라면, `::view-transition-group(*.card)` 와일드카드 셀렉터를 올바르게 파싱하는지 확인이 필요하다 — 비교적 최근 추가된 구문이라 플러그인 버전에 따라 무시되거나 에러를 낼 수 있다. CSS 린팅 도구(Stylelint 등)에서도 `view-transition-class`나 `view-transition-name`을 unknown property로 경고할 수 있으니, 해당 규칙을 허용 목록에 추가하는 것이 좋다. SSR 환경에서는 서버 쪽 템플릿이 인라인 스타일로 `view-transition-name`과 `view-transition-class`를 요소별로 출력하는 패턴을 원문이 제안하고 있으므로, CSP(Content Security Policy)에서 인라인 스타일 허용 여부도 점검해야 한다. 브라우저 호환성 측면에서 Firefox 미지원은 분명한 제약이므로, progressive enhancement 전략이 필수다.

## 다음 단계 제안

우선 원문의 데모 코드를 로컬에서 돌려보면서 `view-transition-class` 와일드카드 셀렉터가 본인의 빌드 파이프라인(PostCSS, Stylelint 등)에서 문제없이 처리되는지 확인하자. 기존에 JavaScript 루프나 CSS 전처리기로 `view-transition-name` 셀렉터를 대량 생성하고 있었다면, `view-transition-class`로 전환하는 것만으로 유지보수 비용이 크게 줄어든다. `ident()`가 브라우저에 탑재되면 한 단계 더 단순해질 테니, Chrome의 Intent to Prototype 진행 상황을 추적해두는 것도 좋다.

---

**원문 전체 보기**: [Cross-Document View Transitions: Scaling Across Hundreds of Elements](https://css-tricks.com/cross-document-view-transitions-part-2/) ([CSS-Tricks](https://css-tricks.com/cross-document-view-transitions-part-2/))