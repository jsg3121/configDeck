---
id: "https://css-tricks.com/?p=393536"
tool: "csstricks"
title: "CSS letter-spacing으로 텍스트 등장 효과 만들기"
link: "https://css-tricks.com/revealing-text-with-css-letter-spacing/"
pubDate: 2026-05-27T12:37:33.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/revealing-text-with-css-letter-spacing/"
contentType: "commentary"
summary: "CSS-Tricks에서 letter-spacing 속성의 음수 값과 투명 색상을 조합해 순수 CSS만으로 텍스트 등장·토글·약어 확장 효과를 구현하는 기법을 소개했다."
---

CSS-Tricks에서 `letter-spacing` 속성을 활용한 텍스트 공개(reveal) 효과 시리즈를 게시했다. JavaScript 없이 CSS만으로 글자를 겹쳐 숨겼다가 풀어내는 세 가지 패턴을 다룬다.

## 무엇이 새로운가

핵심 아이디어는 단순하다. `letter-spacing: -1ch`로 글자를 한 점에 겹치고 `color: transparent`로 숨긴 뒤, 상태 변화(`:checked`, `:hover` 등) 시 `letter-spacing: 0ch`과 `color: black`으로 전환하면서 트랜지션을 건다. 원문은 세 가지 데모를 보여준다. 첫째, 체크박스 토글로 텍스트 정렬 위치(left·center·right)에서 글자가 펼쳐지는 효과. 둘째, 두 `<span>`을 교차 전환하여 라벨 텍스트를 바꾸는 UI — `overflow: clip`과 `text-indent` 음수 값을 함께 써서 첫 번째 텍스트를 밀어낸다. 셋째, `::first-letter`를 활용해 약어(UNICEF)의 첫 글자만 보이다가 hover 시 전체 단어를 펼치는 패턴이다. 모든 예제에서 `cubic-bezier(.8, -.5, .2, 1.4)` 같은 바운스 이징을 적용해 시각적 탄력을 준다.

## 설정 파일에 어떤 의미인가

이 글은 순수 CSS 기법 튜토리얼이므로, 빌드 도구나 프로젝트 설정 파일에 직접적인 영향은 없다. 별도의 라이브러리 의존성이나 PostCSS 플러그인이 필요하지 않고, 표준 CSS 속성만 사용한다. 다만 두 번째 데모에서 쓰인 `:checked + * &` 같은 네스팅 셀렉터는 CSS Nesting 명세에 해당하므로, 프로젝트의 브라우저 지원 범위에 따라 PostCSS nesting 플러그인이나 Sass 컴파일이 필요할 수 있다. Browserslist 설정이나 Autoprefixer 대상 범위를 확인해 두면 좋다. 그 외 breaking change나 마이그레이션 사항은 해당하지 않는다.

## 다음 단계 제안

원문의 CodePen 데모를 직접 열어 `letter-spacing` 음수 값의 한계를 확인해 보는 것이 가장 빠르다. 한글처럼 고정폭이 아닌 글꼴에서는 `-1ch` 값이 완벽하게 겹치지 않을 수 있으므로, 자신의 타이포그래피 환경에서 테스트가 필요하다. 접근성 측면에서는 `color: transparent` 상태의 텍스트가 스크린 리더에 여전히 노출된다는 점도 고려해야 한다 — 원문에서도 "추가적인 접근성 고려가 필요하다"고 언급하고 있다.

---

**원문 전체 보기**: [Revealing Text With CSS letter-spacing](https://css-tricks.com/revealing-text-with-css-letter-spacing/) ([CSS-Tricks](https://css-tricks.com/revealing-text-with-css-letter-spacing/))