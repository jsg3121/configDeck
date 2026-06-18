---
id: "https://css-tricks.com/?p=395567"
tool: "csstricks"
title: "ariaNotify()의 유혹 — 강력하지만 신중하게 써야 할 스크린 리더 알림 API"
link: "https://css-tricks.com/the-siren-song-of-arianotify/"
pubDate: 2026-06-17T15:32:30.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/the-siren-song-of-arianotify/"
contentType: "commentary"
summary: "WAI-ARIA 1.3 명세에 정의된 ariaNotify() 메서드를 소개하며, 기존 라이브 리전의 구조적 한계를 짚고 새 API의 올바른 사용 맥락을 강조하는 CSS-Tricks 글에 대한 코멘터리."
---

CSS-Tricks에서 WAI-ARIA 1.3 명세에 새로 정의된 `ariaNotify()` 메서드를 깊이 있게 다룬 글을 게시했다. 글의 핵심 메시지는 이 API가 오래된 문제를 깔끔하게 해결하지만, "다른 어떤 방법으로도 풀 수 없는 문제"에만 써야 한다는 것이다.

## 무엇이 새로운가

`ariaNotify()`는 `Document` 또는 `Element` 인터페이스에서 호출할 수 있는 메서드로, 첫 번째 인자로 문자열을, 두 번째 인자로 선택적 설정 객체를 받는다. 호출하면 스크린 리더가 해당 문자열을 음성으로 전달한다. 기존에는 `aria-live` 속성을 가진 숨겨진 요소를 DOM에 미리 배치해 두고, 텍스트를 갈아끼우는 방식으로 같은 효과를 흉내 냈다. 원문은 이 접근법의 문제를 상세히 나열한다 — 브라우저·스크린 리더 조합별 비일관적 동작, `display: none`에서 토글하는 패턴과의 근본적 불일치, 정리되지 않은 숨겨진 텍스트가 보조 기술 사용자에게 혼란을 주는 부작용 등이다. `ariaNotify()`는 이 모든 우회 경로를 단일 API 호출로 대체한다. 다만 `document.ariaNotify()`로 호출하면 `<html>` 요소의 `lang` 속성이 사용되고, 특정 요소에서 호출하면 가장 가까운 조상의 `lang`이 적용된다는 차이가 있다.

## 설정 파일에 어떤 의미인가

`ariaNotify()`는 브라우저 런타임 API이므로 빌드 도구나 설정 파일에 직접적인 변경을 요구하지 않는다. 다만 접근성 린팅 도구(eslint-plugin-jsx-a11y 등)가 라이브 리전 관련 규칙을 업데이트하거나, `ariaNotify()` 사용 시 기존 라이브 리전 마크업이 불필요해졌다는 경고를 추가할 가능성은 있다. 아직 원문에서 특정 린터나 프레임워크의 대응 계획은 언급하지 않았으므로, 관련 도구 체인의 변경 사항은 공식 릴리스 노트를 따로 확인하는 편이 좋다. TypeScript 프로젝트에서는 `lib` 설정에 최신 DOM 타입이 포함되어야 `ariaNotify` 타입 정의가 인식될 텐데, 이 역시 아직 구체적 정보가 부족하다.

## 다음 단계 제안

원문이 강하게 권고하듯, 이 API를 알게 되었다고 해서 기존 라이브 리전을 즉시 전부 교체하려 하기보다는, 현재 프로젝트에서 라이브 리전을 "가짜 알림 API"로 쓰고 있는 지점을 먼저 식별해 목록화하는 것이 실질적인 첫 걸음이다. 브라우저 지원 범위가 충분히 넓어진 시점에, 가장 불안정한 우회 구현부터 순차적으로 마이그레이션하면 된다. 그 전에 원문의 라이브 리전 문제점 분석 자체가 기존 접근성 코드 리뷰에 좋은 체크리스트가 되므로 일독을 권한다.

---

**원문 전체 보기**: [The Siren Song of ariaNotify()](https://css-tricks.com/the-siren-song-of-arianotify/) ([CSS-Tricks](https://css-tricks.com/the-siren-song-of-arianotify/))