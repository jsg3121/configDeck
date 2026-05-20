---
id: "https://css-tricks.com/?p=393399"
tool: "csstricks"
title: "크로스 문서 뷰 트랜지션: 아무도 언급하지 않는 함정들"
link: "https://css-tricks.com/cross-document-view-transitions-part-1/"
pubDate: 2026-05-18T13:47:19.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/cross-document-view-transitions-part-1/"
contentType: "commentary"
summary: "CSS-Tricks에서 크로스 문서 뷰 트랜지션의 실질적인 구현 과정과 흔한 실수들을 정리한 2부작 시리즈의 첫 번째 글을 게시했다. 더 이상 유효하지 않은 meta 태그 방식 대신 CSS @view-transition at-rule 기반 opt-in과 디버깅 포인트를 다룬다."
---

CSS-Tricks에서 크로스 문서 뷰 트랜지션(cross-document view transitions)의 실전 적용기를 2부작으로 연재하기 시작했다. Part 1은 deprecated된 meta 태그 방식에서 현재 CSS at-rule 방식으로의 전환, 그리고 구현 과정에서 마주치는 구체적인 함정들을 다룬다.

## 무엇이 새로운가

핵심은 `<meta name="view-transition" content="same-origin">` 태그가 deprecated되었다는 것이다. 현재 올바른 opt-in 방식은 CSS에서 `@view-transition { navigation: auto; }`를 선언하는 것이다. 원문에 따르면 기존 meta 태그는 Chrome 111에서 도입됐다가 Chrome 126 즈음부터 CSS at-rule로 대체되었고, 이전 문법은 콘솔 경고 없이 조용히 무시된다. CSS 기반 opt-in의 장점은 `@media (prefers-reduced-motion: no-preference)`나 뷰포트 너비 조건과 조합할 수 있다는 점이다. 또한 양쪽 페이지가 모두 opt-in해야 트랜지션이 발생하므로, 404 페이지나 로그인 리다이렉트 같은 곳은 별도 JavaScript 없이 자연스럽게 제외된다. 2026년 기준 Chromium 계열과 Safari 18.2+에서 지원되며 Firefox는 작업 중이라고 한다.

## 설정 파일에 어떤 의미인가

MPA(멀티 페이지 애플리케이션) 프로젝트의 CSS에 직접적인 변경이 필요하다. 기존에 meta 태그로 뷰 트랜지션을 활성화했다면, HTML `<head>`에서 해당 태그를 제거하고 CSS 파일에 `@view-transition` at-rule을 추가해야 한다. 빌드 도구나 프레임워크 설정 차원의 변경은 아니고 순수 CSS 레벨이지만, 템플릿 엔진이나 정적 사이트 생성기에서 `<head>`를 일괄 관리하는 경우 meta 태그 잔재를 찾아 정리하는 작업이 필요하다. `navigation: auto`는 사용자가 직접 클릭한 same-origin 네비게이션에만 적용되고, `window.location.href` 같은 프로그래밍 방식 이동이나 POST form submission에는 발동하지 않는다는 점도 설정 의도를 잡을 때 중요하다. Part 2에서 `view-transition-name` 대량 관리와 `view-transition-class` 패턴을 다룰 예정이라고 하니, 스타일시트 구조에 관한 구체적인 설정 전략은 후속편을 확인하는 편이 낫다.

## 다음 단계 제안

지금 당장 할 수 있는 일은 프로젝트에서 `view-transition` meta 태그를 grep으로 검색해 제거하고, 공유 CSS에 `@view-transition { navigation: auto; }`를 추가하는 것이다. 원문에 포함된 `pagereveal` 이벤트 리스너 스니펫을 활용하면 트랜지션이 실제로 발동하는지, 타임아웃으로 조용히 죽는지를 콘솔에서 바로 확인할 수 있다. `prefers-reduced-motion` 미디어 쿼리로 감싸는 것도 잊지 말자. Part 2가 다음 주에 나온다고 하니, 대규모 요소에 대한 네이밍 전략은 그때 다시 점검하면 된다.

---

**원문 전체 보기**: [Cross-Document View Transitions: The Gotchas Nobody Mentions](https://css-tricks.com/cross-document-view-transitions-part-1/) ([CSS-Tricks](https://css-tricks.com/cross-document-view-transitions-part-1/))