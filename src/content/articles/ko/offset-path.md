---
id: "http://css-tricks.com/?page_id=243521"
tool: "csstricks"
title: "CSS offset-path 속성 정리: 경로 기반 애니메이션의 현재 상태"
link: "https://css-tricks.com/almanac/properties/o/offset-path/"
pubDate: 2026-06-03T15:02:38.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/properties/o/offset-path/"
contentType: "commentary"
summary: "CSS-Tricks가 offset-path 속성에 대한 Almanac 레퍼런스를 업데이트했다. 기존 motion-path에서 offset-path로의 네이밍 전환, 현재 지원되는 값, 관련 속성들을 정리하고 있다."
---

CSS-Tricks Almanac에서 `offset-path` 속성에 대한 레퍼런스 문서를 게시했다. 이 속성은 요소가 애니메이션 중 따라갈 이동 경로를 정의하는 CSS 속성이다.

## 무엇이 새로운가

핵심은 네이밍 변경이다. 원래 `motion-path`로 시작한 이 속성 및 관련 `motion-*` 계열이 스펙에서 `offset-*`으로 이름이 바뀌고 있다. CSS-Tricks는 현시점에서 두 구문을 모두 사용할 것을 권장한다. 스펙상 `offset-path`는 `path()`, `shape()`, `url()`, `none`, 그리고 `circle()`, `ellipse()`, `inset()`, `polygon()` 등 CSS Shapes 함수들을 값으로 받아야 하지만, 원문에 따르면 실제로 동작하는 값은 `path()`와 `none` 정도다. SVG 요소를 `url()`로 참조하는 것조차 작동하지 않는다고 명시하고 있다. 관련 속성으로 `offset-distance`, `offset-rotate`, `offset-anchor`가 함께 소개되어 있으며, `offset-rotate`의 `auto`, `reverse`, 각도 지정, 조합 사용법도 다루고 있다.

## 설정 파일에 어떤 의미인가

직접적인 빌드 설정이나 도구 설정 변경이 필요한 사안은 아니다. 다만 CSS 린팅 도구를 사용하는 프로젝트라면 주의할 점이 있다. Stylelint 같은 도구의 `property-no-unknown` 규칙이 `offset-path`나 `offset-distance`를 미지원 속성으로 잡을 수 있다. 또한 구 `motion-*` 구문과 신 `offset-*` 구문을 동시에 쓰면 `declaration-block-no-duplicate-properties` 같은 규칙에 걸릴 여지가 있으므로, 해당 규칙에 예외를 추가해야 할 수 있다. PostCSS Autoprefixer가 이 속성의 네이밍 전환을 자동 처리해 주는지 여부는 원문에서 다루지 않았으므로, 사용 중이라면 별도로 확인이 필요하다.

## 다음 단계 제안

경로 기반 CSS 애니메이션을 프로덕션에 도입하려는 경우, 우선 브라우저 지원 범위를 확인하고 `motion-path`/`offset-path` 이중 선언을 적용하는 것이 안전하다. 원문에는 SVG path 데이터를 CSS로 옮기는 구체적인 워크플로와 Web Animations API를 통한 JavaScript 제어 예시도 포함되어 있으니, 실제 구현 전에 원문의 데모들을 직접 확인해 보길 권한다.

---

**원문 전체 보기**: [offset-path](https://css-tricks.com/almanac/properties/o/offset-path/) ([CSS-Tricks](https://css-tricks.com/almanac/properties/o/offset-path/))