---
id: "https://css-tricks.com/?page_id=394786"
tool: "csstricks"
title: "CSS translateZ() 함수 알마낙 레퍼런스 정리"
link: "https://css-tricks.com/almanac/functions/t/translatez/"
pubDate: 2026-06-25T13:18:56.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/functions/t/translatez/"
contentType: "commentary"
summary: "CSS-Tricks가 translateZ() 함수에 대한 알마낙 레퍼런스를 게시했다. perspective와의 관계, GPU 가속 활용법까지 정리되어 있어 3D 트랜스폼을 다루는 프런트엔드 개발자에게 참고할 만하다."
---

CSS-Tricks가 자사 알마낙(Almanac) 시리즈로 `translateZ()` 함수에 대한 레퍼런스 문서를 게시했다. CSS Transform Module Level 2 스펙에 정의된 이 함수의 동작 원리, 구문, 그리고 실무 활용 팁을 다룬다.

## 무엇이 새로운가

이 문서 자체가 새로운 기능 발표는 아니고, 기존 CSS 스펙에 대한 정리 문서다. 다만 실무에서 자주 혼동되는 몇 가지 포인트를 명확히 짚어준다. 첫째, `translateZ()`는 `perspective` 속성이나 `perspective()` 함수 없이는 시각적 효과가 전혀 없다. 둘째, `perspective` 속성은 부모에 적용해 자식 전체에 투영을 부여하고, `perspective()` 함수는 개별 요소에 적용하되 반드시 3D 트랜스폼 함수 앞에 선언해야 한다. 셋째, `translateZ(0)`을 이용해 GPU 렌더링을 유도하는 성능 최적화 기법도 소개하고 있다 — 애니메이션 깜빡임이나 전환 끊김 문제를 완화하는 데 쓰이는 오래된 트릭이다.

## 설정 파일에 어떤 의미인가

`translateZ()`는 순수 CSS 속성이므로 빌드 도구나 설정 파일 자체에 직접적인 영향은 없다. 다만 몇 가지 간접적인 접점이 있다. Stylelint 같은 CSS 린터를 사용하는 프로젝트에서 `translateZ(0)` 같은 GPU 가속 핵을 허용할지 여부를 규칙으로 관리하는 경우가 있다. 예를 들어 `declaration-property-value-disallowed-list` 같은 룰에서 특정 트랜스폼 값을 제한하고 있다면, 이 패턴을 의도적으로 허용 목록에 추가해야 할 수 있다. 또한 PostCSS 플러그인 중 3D 트랜스폼 관련 벤더 프리픽스를 자동 처리하는 것들이 있는데, 원문에 따르면 `translateZ()`는 모든 모던 브라우저에서 지원되므로 프리픽스 설정이 불필요한 상태다. 이 외에 빌드나 번들러 설정과 관련된 내용은 원문에서 다루지 않고 있다.

## 다음 단계 제안

3D 트랜스폼을 프로젝트에서 사용 중이라면, 원문의 인터랙티브 데모를 통해 `perspective` 속성과 함수의 차이를 직접 확인해 보길 권한다. 특히 `translateZ(0)` GPU 가속 트릭을 쓰고 있다면, 현재 프로젝트의 Stylelint 규칙이 이를 허용하는지 한번 점검해 볼 만하다. `will-change` 속성이 같은 목적의 더 명시적인 대안이므로, 레거시 핵 대신 전환을 고려해 볼 시점이기도 하다.

---

**원문 전체 보기**: [translateZ()](https://css-tricks.com/almanac/functions/t/translatez/) ([CSS-Tricks](https://css-tricks.com/almanac/functions/t/translatez/))