---
id: "http://css-tricks.com/?page_id=244261"
tool: "csstricks"
title: "CSS writing-mode 속성 완전 정리"
link: "https://css-tricks.com/almanac/properties/w/writing-mode/"
pubDate: 2026-07-21T09:39:10.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/properties/w/writing-mode/"
contentType: "commentary"
summary: "CSS-Tricks가 writing-mode 속성에 대한 알마낙 레퍼런스를 게시했다. 텍스트 방향뿐 아니라 CSS 레이아웃의 블록·인라인 축 전환까지 다루고 있어, 로지컬 프로퍼티를 이해하는 데 좋은 출발점이다."
---

CSS-Tricks 알마낙에 `writing-mode` 속성을 상세히 설명하는 레퍼런스가 올라왔다. 단순 텍스트 방향 전환이 아니라, 이 속성이 CSS 레이아웃 모델 전체에 어떤 영향을 미치는지를 집중적으로 풀어낸 글이다.

## 무엇이 새로운가

이 글 자체가 신규 기능 발표는 아니다. CSS Writing Modes Level 4 스펙에 정의된 `writing-mode` 속성의 동작 원리를 체계적으로 정리한 레퍼런스다. 값은 `horizontal-tb`, `vertical-rl`, `vertical-lr`, `sideways-rl`, `sideways-lr` 다섯 가지이며, 각 값이 블록 축과 인라인 축을 어떻게 재정의하는지 설명한다. 핵심 포인트는 `writing-mode`가 바뀌면 Flexbox의 `row`/`column`, Grid의 행·열, `inline-size`·`block-size` 같은 로지컬 프로퍼티의 물리적 매핑이 모두 전환된다는 점이다. 인터랙티브 데모도 포함되어 있어 언어·`writing-mode`·`direction` 조합을 직접 바꿔볼 수 있다. 브라우저 지원은 모던 브라우저에서 폭넓게 가능하다고 명시되어 있다.

## 설정 파일에 어떤 의미인가

`writing-mode`는 순수 CSS 속성이므로 빌드 도구나 프레임워크 설정 파일을 직접 변경할 일은 없다. 다만 개발자 도구 설정 관점에서 몇 가지 짚을 부분이 있다.

- **Stylelint 규칙**: `writing-mode` 변경 시 물리적 프로퍼티(`width`, `margin-left` 등)와 로지컬 프로퍼티(`inline-size`, `margin-inline-start`)가 혼재되기 쉽다. Stylelint의 `liberty/use-logical-spec` 같은 플러그인을 설정해 두면 일관성을 강제할 수 있다.
- **Tailwind CSS**: Tailwind v3 이후 로지컬 프로퍼티 유틸리티(`ms-*`, `me-*`, `ps-*` 등)가 추가되었다. `writing-mode`를 적극 활용하는 프로젝트라면 `tailwind.config`에서 물리적 방향 유틸리티 대신 로지컬 유틸리티를 기본으로 쓰도록 팀 컨벤션을 잡는 것이 좋다.
- **Breaking change 여부**: 이 속성 자체가 새로 생긴 것이 아니므로 마이그레이션이나 설정 변경은 필요 없다.

원문에서 빌드 설정이나 프레임워크 통합에 대한 내용은 별도로 다루지 않았다. 로지컬 프로퍼티 린트 설정에 관심이 있다면 각 도구의 공식 문서를 함께 참고하길 권한다.

## 다음 단계 제안

CJK 다국어 프로젝트가 아니더라도, 원문의 인터랙티브 데모를 직접 조작해 보면 블록 축·인라인 축 개념이 체감된다. 이 개념을 잡아 두면 `inline-size`, `margin-block-start` 같은 로지컬 프로퍼티를 쓸 때 훨씬 자연스럽다. 기존 프로젝트에서 물리적 프로퍼티를 로지컬 프로퍼티로 점진 전환할 계획이 있다면, 이 글을 팀 위키에 레퍼런스로 걸어 두는 것만으로도 충분히 유용하다.

---

**원문 전체 보기**: [writing-mode](https://css-tricks.com/almanac/properties/w/writing-mode/) ([CSS-Tricks](https://css-tricks.com/almanac/properties/w/writing-mode/))