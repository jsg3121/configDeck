---
id: "http://css-tricks.com/?page_id=18170"
tool: "csstricks"
title: "pointer-events 속성 완전 정리 — 클릭·호버 대상 제어의 핵심"
link: "https://css-tricks.com/almanac/properties/p/pointer-events/"
pubDate: 2026-07-15T19:57:51.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/properties/p/pointer-events/"
contentType: "commentary"
summary: "CSS-Tricks가 pointer-events 속성에 대한 Almanac 레퍼런스를 공개했다. hit-testing 개념부터 SVG 전용 값, 상속 동작, 흔히 혼동되는 disabled·inert·user-select와의 차이까지 한 곳에 정리돼 있다."
---

CSS-Tricks Almanac에 `pointer-events` 속성 레퍼런스가 게시됐다. 단순 API 나열이 아니라, 브라우저가 포인터 이벤트를 발생시키기 전에 수행하는 hit-testing 과정부터 설명하면서 속성의 동작 원리를 풀어낸다.

## 무엇이 새로운가

원문은 `auto`와 `none` 두 가지 범용 키워드 외에 SVG 전용 값 9개(`visiblePainted`, `visibleFill`, `visibleStroke`, `visible`, `painted`, `fill`, `stroke`, `bounding-box`, `all`)를 각각 구분해서 설명한다. 특히 `pointer-events: none`이 요소를 "비활성화"하는 것이 아니라 hit-test 대상에서 제외할 뿐이라는 점을 강조한다. 키보드 포커스는 여전히 가능하고, 텍스트 선택도 막지 못한다. 폼 컨트롤 비활성화에는 `disabled` 속성을, 전체 비대화형 처리에는 `inert` 속성을, 텍스트 선택 방지에는 `user-select: none`을 써야 한다는 점을 명확히 구분해 준다. 상속 관련으로는 부모에 `none`을 설정하면 자식도 상속받지만, 자식이 `auto`로 되돌릴 수 있다는 점과, 이때 자식이 클릭되면 이벤트 버블링은 정상적으로 부모까지 전파된다는 점이 실무에서 놓치기 쉬운 부분이다.

## 설정 파일에 어떤 의미인가

`pointer-events`는 CSS 속성이므로 빌드 도구나 프레임워크 설정 파일에 직접적인 변경을 요구하지 않는다. 다만 Stylelint 같은 CSS 린터를 사용하는 팀이라면 `pointer-events: none`과 `inert` 또는 `disabled`의 혼용을 규칙으로 잡아주는 커스텀 룰을 고려해 볼 만하다. 접근성 관점에서 `pointer-events: none`만으로 요소를 비활성화했다고 착각하는 코드가 프로덕션에 들어가는 일이 생각보다 잦기 때문이다. 원문에서 빌드·번들러·프레임워크 설정과의 상호작용은 별도로 다루지 않으므로, 설정 파일 차원의 영향은 사실상 없다.

## 다음 단계 제안

모달 오버레이나 드롭다운 메뉴처럼 투명한 레이어가 클릭을 가로채는 문제를 겪고 있다면, 원문의 라이브 데모를 직접 조작해 보는 것이 가장 빠르다. SVG 기반 인터랙션을 다루는 프로젝트에서는 SVG 전용 값들이 fill·stroke·visibility 조합에 따라 hit 영역을 어떻게 바꾸는지 데모로 확인할 수 있다. 접근성 감사를 하고 있다면 기존 코드에서 `pointer-events: none`이 `disabled`나 `inert` 대신 쓰인 곳이 없는지 한 번 점검해 보길 권한다.

---

**원문 전체 보기**: [pointer-events](https://css-tricks.com/almanac/properties/p/pointer-events/) ([CSS-Tricks](https://css-tricks.com/almanac/properties/p/pointer-events/))