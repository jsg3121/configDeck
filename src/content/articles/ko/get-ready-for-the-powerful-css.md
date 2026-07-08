---
id: "https://css-tricks.com/?p=395508"
tool: "csstricks"
title: "강력한 CSS border-shape 속성을 맞이할 준비를 하자"
link: "https://css-tricks.com/get-ready-for-the-powerful-css-border-shape-property/"
pubDate: 2026-07-07T15:14:00.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/get-ready-for-the-powerful-css-border-shape-property/"
contentType: "commentary"
summary: "CSS-Tricks에서 새로운 border-shape 속성을 소개했다. clip-path와 같은 값을 받으면서도 border, box-shadow, outline 같은 장식 속성이 도형을 따라가도록 해주는 속성이다."
---

CSS-Tricks에서 새로운 CSS 속성인 `border-shape`를 심층적으로 다룬 글을 게시했다. 최근 Baseline이 된 `shape()` 함수, Chromium 전용인 `corner-shape` 속성에 이어 등장한 세 번째 도형 관련 기능이다.

## 무엇이 새로운가

`border-shape`의 핵심은 `clip-path`와 동일한 값(`shape()`, `polygon()` 등)을 받으면서도 요소를 "잘라내는" 대신 "형태를 바꾸는" 방식으로 동작한다는 것이다. 덕분에 `border`, `box-shadow`, `outline` 같은 장식 속성이 도형 경로를 따라간다. 기존에는 `clip-path`나 `mask`로 도형을 만들면 장식까지 함께 잘려나갔기 때문에 도형에 테두리를 입히는 것이 사실상 불가능했다. 또한 두 개의 `<basic-shape>` 값을 넘기면 외곽과 내부 경계 사이 영역에 테두리가 렌더링되는 "Fill 모드"가 되어, cutout 도형이나 breakout 배경 효과까지 구현할 수 있다. 현재 지원은 Chrome 전용이다.

## 설정 파일에 어떤 의미인가

`border-shape`는 순수 CSS 속성이므로 빌드 도구나 프로젝트 설정 파일에 직접적인 변경을 요구하지 않는다. 다만 몇 가지 실무적 고려가 있다.

- **PostCSS·Autoprefixer**: 아직 초기 단계 속성이므로 현재 PostCSS 플러그인 생태계에서 `border-shape`를 인식하거나 폴백을 생성해 주는 플러그인은 확인되지 않는다. Autoprefixer 설정의 `browserslist` 타겟에 따라 린터가 "알 수 없는 속성"으로 경고할 수 있다.
- **Stylelint**: `property-no-unknown` 규칙을 사용 중이라면 `border-shape`를 허용 목록에 추가해야 빌드 경고를 피할 수 있다.
- **`border-radius`와의 관계**: 원문에 따르면 `border-shape`가 적용되면 `border-radius`는 무시된다. 기존 디자인 시스템에서 `border-radius` 토큰에 의존하는 컴포넌트에 `border-shape`를 도입할 경우, 두 속성이 동시에 선언되어도 `border-radius`가 효과 없이 남는다는 점을 알아두어야 한다.

원문에서 빌드 도구나 기존 설정과의 상호작용은 자세히 다루지 않았다. 속성이 더 넓은 브라우저에 구현되고 정식 스펙이 확정되면 도구 지원 현황을 다시 정리하겠다.

## 다음 단계 제안

Chrome에서 데모를 직접 열어보는 것이 가장 빠른 체험 방법이다. 기존 프로젝트에서 `clip-path`로 도형을 만들고 테두리 때문에 별도 해킹을 하던 곳이 있다면, `border-shape`로 단순 치환해 보면 차이를 바로 체감할 수 있다. 프로덕션 적용은 브라우저 지원 범위가 넓어진 뒤로 미루되, 원문에 소개된 `shape()` 함수 시리즈와 SVG-to-CSS 변환기 링크를 함께 살펴보면 활용 가능성을 구체적으로 파악하는 데 도움이 된다.

---

**원문 전체 보기**: [Get Ready For the Powerful CSS border-shape Property!](https://css-tricks.com/get-ready-for-the-powerful-css-border-shape-property/) ([CSS-Tricks](https://css-tricks.com/get-ready-for-the-powerful-css-border-shape-property/))