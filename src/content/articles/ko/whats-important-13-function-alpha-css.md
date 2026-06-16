---
id: "https://css-tricks.com/?p=395752"
tool: "csstricks"
title: "CSS @function, alpha(), Grid Lanes, 그리고 최근 웹 플랫폼 소식 정리"
link: "https://css-tricks.com/whats-important-13/"
pubDate: 2026-06-15T13:15:33.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-13/"
contentType: "commentary"
summary: "CSS-Tricks의 What's !important 13호가 CSS @function, alpha() 함수, Grid Lanes 가이드, dialog 개선 사항, Chrome 149 업데이트 등을 한 번에 정리했다. 개발 도구 설정 관점에서 눈여겨볼 포인트를 짚는다."
---

CSS-Tricks가 뉴스레터 시리즈 "What's !important" 13호를 발행했다. CSS `@function`, 새로운 `alpha()` 함수, WebKit의 Grid Lanes 가이드, `<dialog>` 개선, Chrome 149 Baseline 업데이트까지 최근 CSS 생태계의 주요 움직임을 묶어 소개한다.

## 무엇이 새로운가

`@function`은 올해 Baseline에 진입할 가능성이 가장 높은 CSS 기능으로 꼽혔다. Jane Ori의 단계별 설명과 함께 CSS-Tricks 자체 `@function` 문서도 공개됐다. `alpha()` 함수는 기존에 `oklch(from var(--color) l c h / 0.5)` 같은 장황한 구문 대신 `alpha(from var(--color) / 0.5)`로 투명도만 간결하게 조작할 수 있게 해 준다. 컬러 포맷에 의존하지 않으므로 의도가 더 명확하게 드러난다는 점이 핵심이다. WebKit은 기존 CSS masonry layout을 "Grid Lanes"로 재명명하고 필드 가이드를 출시했다. `<dialog>` 관련으로는 `closedby` 속성과 `overscroll-behavior: contain` 조합이 UX 문제를 해결하는 방법, 그리고 `@starting-style`을 활용한 애니메이션 패턴이 다뤄졌다. Chrome 149에서는 gap decorations, `image-rendering: crisp-edges`, `rect()`/`xywh()` for `shape-outside`가 Baseline에 도달했다.

## 설정 파일에 어떤 의미인가

이번 소식은 CSS 언어 자체의 변화이므로 빌드 도구나 프로젝트 설정 파일에 즉각적인 영향을 주는 항목은 제한적이다. 다만 몇 가지 짚을 점이 있다. `@function`이 Baseline에 안착하면 PostCSS나 Sass에서 커스텀 함수로 처리하던 로직 일부를 네이티브 CSS로 옮길 수 있고, 그에 따라 PostCSS 플러그인 체인이나 Sass 의존성을 줄일 여지가 생긴다. `alpha()` 역시 디자인 토큰을 CSS 변수로 관리하는 프로젝트에서 컬러 유틸리티 함수나 전처리기 믹스인 의존도를 낮출 수 있다. Stylelint 같은 린터를 사용 중이라면 `@function`이나 `alpha()` 구문을 아직 인식하지 못할 수 있으므로 규칙 업데이트 여부를 확인해야 한다. 구체적인 브라우저별 지원 범위와 설정 변경 경로는 원문과 각 기능의 공식 스펙에서 직접 확인하는 편이 정확하다.

## 다음 단계 제안

기존 프로젝트에서 CSS 변수로 컬러를 관리하고 있다면, `alpha()` 구문을 소규모 컴포넌트에서 먼저 실험해 보는 것을 권한다. `@function`은 아직 Baseline 확정 전이므로 프로덕션 적용보다는 CSS-Tricks의 문서와 Jane Ori의 워크스루를 읽으며 문법에 익숙해지는 단계가 적절하다. Grid Lanes 가이드도 masonry 레이아웃을 고려 중인 팀이라면 일독할 만하다. Chrome 149 Baseline 항목들은 폴리필이나 fallback 제거 시점을 판단하는 데 참고하면 된다.

---

**원문 전체 보기**: [What's !important #13: @function, alpha(), CSS Wordle, and More](https://css-tricks.com/whats-important-13/) ([CSS-Tricks](https://css-tricks.com/whats-important-13/))