---
id: "https://css-tricks.com/?p=395894"
tool: "csstricks"
title: "CSS-Tricks What's !important #14: Gap Decorations, random(), <select> 필드 사이징 등 최신 CSS 소식 정리"
link: "https://css-tricks.com/whats-important-14/"
pubDate: 2026-06-30T13:54:14.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-14/"
contentType: "commentary"
summary: "CSS-Tricks의 What's !important 14호는 CSS Gap Decorations, random() 함수 실험, field-sizing을 활용한 <select> 너비 조절, 그리고 최신 CSS 테마 설정 방법 등을 다룬다. 브라우저 업데이트는 Firefox 152의 field-sizing Baseline 진입 정도로 조용한 편이다."
---

CSS-Tricks가 뉴스레터 시리즈 What's !important 14호를 발행했다. CSS Gap Decorations, `random()` 함수 실험, `field-sizing`을 이용한 `<select>` 크기 조절, 그리고 현대적 CSS 테마 구성 방식까지 최근 2주간의 CSS 생태계 움직임을 압축해서 전달하고 있다.

## 무엇이 새로운가

Temani Afif가 CSS Gap Decorations 스타일링 방법을 소개했다. 여기서 'gap'은 flexbox, grid layout, multi-column layout에서 생기는 공간을 의미하며, 이제 이 공간 자체를 시각적으로 꾸밀 수 있는 방법이 논의되고 있다. Polypane은 아직 Safari 외에는 지원하지 않는 CSS `random()` 함수로 보케 효과, 꽃잎 떨어지기, 폴라로이드 더미, 오로라 애니메이션 등 다양한 실험 결과를 공유했다. Manuel Matuzović는 `field-sizing: content`를 사용해 `<select>` 요소의 너비를 선택된 `<option>`의 너비에 맞추는 방법을 설명했는데, Firefox 152가 이를 지원하면서 Baseline에 진입했다. 한 가지 주목할 점은 `size` 속성과 함께 사용할 경우 `field-sizing: content`가 `size`를 무시하고 모든 옵션을 표시한다는 점이다. Una Kravets는 `@property`, `light-dark()`, `contrast-color()`, `@container style()` 등 최근 Baseline에 진입한 기능들을 조합한 CSS 테마 설정 방식을 정리했다.

## 설정 파일에 어떤 의미인가

이번 호에서 다뤄진 내용 대부분은 CSS 속성과 함수 수준의 변화이므로, 빌드 도구나 린터의 설정 파일을 직접 변경해야 하는 상황은 아직 아니다. 다만 `field-sizing`이 Baseline에 진입했으므로, Autoprefixer나 Browserslist 설정에서 지원 대상 브라우저 버전을 관리하는 팀이라면 Firefox 152 이상을 포함 범위에 두고 있는지 확인해볼 만하다. `random()` 함수는 Safari만 지원하는 상태이므로 프로덕션 CSS에 도입하기엔 이르고, PostCSS 플러그인이나 폴리필 차원의 설정 변경도 현시점에서는 불필요하다. Stylelint 등의 CSS 린터에서 `field-sizing`이나 gap decoration 관련 속성을 unknown property로 경고하는 경우, 규칙 설정에서 허용 목록에 추가하는 정도가 실질적인 조치가 될 수 있다. 테마 관련 CSS 기능(`light-dark()`, `contrast-color()` 등)이 Baseline에 진입했다는 점은 디자인 시스템의 CSS 변수 구조를 재검토할 계기는 되지만, 구체적인 설정 마이그레이션 경로는 원문에서도 다루고 있지 않다.

## 다음 단계 제안

`field-sizing: content`는 Baseline에 진입한 만큼 실무에서 바로 테스트해볼 수 있다. 기존에 JavaScript로 `<select>` 너비를 동적 조절하던 코드가 있다면 대체 가능한지 확인해보자. `random()`이나 Gap Decorations는 실험 단계이므로, 원문의 데모 링크를 통해 동작 방식을 파악해 두되 프로덕션 도입은 브라우저 지원 현황을 추적한 뒤에 결정하는 편이 안전하다.

---

**원문 전체 보기**: [What's !important #14: Gap Decorations, random(), <select> field sizing, and More](https://css-tricks.com/whats-important-14/) ([CSS-Tricks](https://css-tricks.com/whats-important-14/))