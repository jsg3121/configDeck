---
id: "https://css-tricks.com/?p=394879"
tool: "csstricks"
title: "CSS-Tricks What's !important #11: 3D 복셀 씬, 플라잉 포커스, CSS 신규 문법 등"
link: "https://css-tricks.com/whats-important-11/"
pubDate: 2026-05-15T13:16:34.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-11/"
contentType: "commentary"
summary: "CSS-Tricks의 큐레이션 뉴스레터 11호가 나왔다. Heerich.js, of <selector> 문법, 범위 문법, 스크롤 기반 애니메이션, Chrome 148·Safari 26.5 업데이트 등을 다루고 있다."
---

CSS-Tricks가 What's !important 시리즈 11번째 이슈를 발행했다. 3D 복셀 엔진 Heerich.js부터 CSS 신규 문법, 브라우저 최신 업데이트까지 폭넓은 웹 프론트엔드 소식을 큐레이션하고 있다.

## 무엇이 새로운가

Heerich.js는 조각가 Erwin Heerich에서 영감을 받은 소형 3D 복셀 엔진으로, SVG로 렌더링되며 CSS 변수를 통해 스타일링이 가능하다. Polypane은 스니펫 스토어를 출시하면서, 컴포넌트를 클릭해 불필요한 마크업 없이 기본 HTML을 복사할 수 있는 "1-Click De-crapulator" 기능을 선보였다. CSS 쪽에서는 `:nth-child(n of selector)` 문법이 Baseline 지원에 도달했고, CSS 네스팅과 조합해 사용할 수 있다는 점이 소개됐다. 미디어·컨테이너 쿼리의 범위 문법(range syntax)도 다뤄지는데, 컨테이너 스타일 쿼리용 범위 문법은 브라우저별로 별도 출하되고 있어 지원 현황을 주의 깊게 확인해야 한다. 브라우저 업데이트로는 Chrome 148의 이름 전용 컨테이너 쿼리(Baseline), `revert-rule` 키워드, `at-rule()` 함수, `<video>`/`<audio>` loading 속성 등이 있고, Safari 26.5에서는 `:open` 의사 클래스(Baseline)와 `random()` 함수 업데이트가 포함됐다.

## 설정 파일에 어떤 의미인가

이번 뉴스레터 내용 자체는 CSS·브라우저 기능 위주이므로, 빌드 도구나 Lint 설정 파일에 직접적인 변경을 요구하지는 않는다. 다만 몇 가지 간접 영향은 짚을 수 있다. 범위 문법(range syntax)을 프로젝트에 도입한다면, Stylelint 같은 CSS 린터의 규칙이 해당 문법을 올바르게 파싱하는지 확인할 필요가 있다. 컨테이너 쿼리 범위 문법의 경우 브라우저별 지원이 엇갈리고 있어, Browserslist 설정이나 PostCSS 플러그인 구성에서 타깃 브라우저를 점검하는 것이 좋다. `of <selector>` 문법이 Baseline에 도달했다는 점은, autoprefixer나 폴리필 설정에서 해당 기능을 불필요하게 변환하고 있지 않은지 확인해볼 계기가 된다. Chrome 148의 `revert-rule`이나 `at-rule()` 함수는 아직 크로스 브라우저 지원이 부족하므로, 프로덕션 설정에 반영하기에는 이르다.

## 다음 단계 제안

프로젝트의 Browserslist 설정과 Stylelint 규칙을 현재 타깃 브라우저에 맞춰 한 번 점검해보길 권한다. 특히 컨테이너 쿼리나 범위 문법을 이미 사용 중이라면, 원문에서 언급된 브라우저별 지원 현황 표를 참고해 불필요한 폴백이나 누락된 폴백이 없는지 확인하는 것이 실질적으로 도움이 된다.

---

**원문 전체 보기**: [What's !important #11: 3D Voxel Scenes, Flying Focus, CSS Syntaxes, and More](https://css-tricks.com/whats-important-11/) ([CSS-Tricks](https://css-tricks.com/whats-important-11/))