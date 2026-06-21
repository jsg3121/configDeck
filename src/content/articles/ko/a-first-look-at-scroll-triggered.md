---
id: "https://css-tricks.com/?p=394364"
tool: "csstricks"
title: "스크롤 트리거 애니메이션 첫 살펴보기"
link: "https://css-tricks.com/css-scroll-triggered-animations-first-look/"
pubDate: 2026-06-19T13:03:17.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/css-scroll-triggered-animations-first-look/"
contentType: "commentary"
summary: "Chrome 146에서 CSS 스크롤 트리거 애니메이션이 처음 출시되었다. CSS-Tricks가 기존 스크롤 드리븐 애니메이션과의 차이점, 새로운 timeline-trigger·animation-trigger 속성의 사용법을 정리했다."
---

CSS-Tricks가 Chrome 146에 최초로 탑재된 CSS 스크롤 트리거 애니메이션(scroll-triggered animations)을 다루는 상세 가이드를 공개했다. 기존 스크롤 드리븐 애니메이션과의 개념적 차이부터 실제 속성 조합까지 코드와 함께 설명한다.

## 무엇이 새로운가

핵심은 `animation-timeline: view()` 대신 `timeline-trigger: view()`를 사용한다는 점이다. 스크롤 드리븐 애니메이션이 스크롤 진행도에 따라 애니메이션 진행률을 동기화하는 반면, 스크롤 트리거 애니메이션은 특정 스크롤 임계값을 넘는 순간 고정 duration으로 애니메이션을 재생한다 — JavaScript의 Intersection Observer API에 해당하는 CSS 네이티브 방식이라고 원문은 설명한다. `animation-trigger` 속성에 `play-forwards`, `play-backwards`, `play-once`, `play`, `pause`, `reset`, `replay` 등의 `<animation-action>` 키워드를 조합할 수 있으며, `animation-fill-mode`와 timeline range(`entry`, `exit` 퍼센트)를 함께 사용해 진입·이탈 시 동작을 세밀하게 제어한다. 현재 Chrome 146에서만 지원되며, 다른 브라우저 지원 일정은 원문에서 언급되지 않았다.

## 설정 파일에 어떤 의미인가

이번 기능은 순수 CSS 속성 추가이므로 빌드 도구나 번들러 설정을 직접 변경할 필요는 없다. 다만 몇 가지 실무적 고려 사항이 있다.

- **PostCSS·Autoprefixer**: `timeline-trigger`, `animation-trigger` 같은 신규 속성을 아직 인식하지 못할 가능성이 높다. 프리픽서나 린터가 이 속성을 "unknown property"로 경고할 수 있으므로, stylelint 설정에서 해당 속성을 허용 목록에 추가하거나 무시 규칙을 적용해야 할 수 있다.
- **CSS Modules·Tailwind**: 커스텀 유틸리티나 플러그인으로 래핑하려면 브라우저 지원이 확대될 때까지 `@supports` 쿼리로 감싸는 것이 안전하다.
- **크로스 브라우저 폴백**: Chrome 단독 지원이므로 프로덕션에서는 Intersection Observer 기반 JS 폴백을 병행하는 전략이 현실적이다. 원문에서 다른 브라우저의 구현 로드맵은 다루지 않았으므로, 공식 스펙 진행 상황을 별도로 확인해야 한다.

## 다음 단계 제안

Chrome 146으로 업데이트한 뒤 원문의 인라인 데모를 직접 확인해 보는 것이 가장 빠른 학습 경로다. 특히 `play-once`와 `play-forwards play-backwards` 조합의 차이를 브라우저에서 눈으로 비교하면 개념이 명확해진다. 프로덕션 적용은 크로스 브라우저 지원이 확대된 뒤로 미루되, 프로토타입이나 내부 도구에서 먼저 시험해 보길 권한다.

---

**원문 전체 보기**: [A First Look at Scroll-Triggered Animations](https://css-tricks.com/css-scroll-triggered-animations-first-look/) ([CSS-Tricks](https://css-tricks.com/css-scroll-triggered-animations-first-look/))