---
id: "https://css-tricks.com/?p=395357"
tool: "csstricks"
title: "CSS-Tricks !important #12: Safari 테스팅, ::checkmark, HTML 앵커 포지셔닝 등"
link: "https://css-tricks.com/whats-important-12/"
pubDate: 2026-05-29T13:25:38.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-12/"
contentType: "commentary"
summary: "CSS-Tricks의 뉴스레터 12호가 Safari 크로스 브라우저 테스팅, ::checkmark 의사 요소, data 속성 기반 앵커 연결 기법, 그리고 Firefox 151의 컨테이너 스타일 쿼리 Baseline 진입 등을 다뤘다."
---

CSS-Tricks의 정기 큐레이션 시리즈 "What's !important" 12호가 공개됐다. Safari가 없는 환경에서의 테스트 방법부터 새로운 CSS 의사 요소, 앵커 포지셔닝의 HTML 대안까지 폭넓은 주제를 짧게 소개하고 있다.

## 무엇이 새로운가

이번 호에서 눈에 띄는 항목은 크게 다섯 가지다. 첫째, Declan Chidlow가 Apple 기기 없이 Safari를 테스트하는 방법을 정리했다. 둘째, Sunkanmi Fafowora가 `::checkmark` 의사 요소를 소개했는데, 체크박스뿐 아니라 라디오와 select의 체크 상태 표시까지 대상으로 삼는다는 점이 주목할 만하다. 셋째, `border-shape`와 `shape()` 함수를 조합하면 `clip-path` 단독 사용보다 더 다양한 형태를 쉽게 전환할 수 있다는 Temani Afif의 팁이 실렸다. 넷째, CSS-Tricks의 Daniel Schwarz 본인이 `anchor` HTML 속성이 드롭된 것에 대응해 `data-*` 속성과 고급 `attr()`를 활용하는 앵커 연결 대안 기법을 시연했다. 다섯째, Firefox 151에서 컨테이너 스타일 쿼리가 Baseline에 진입했고, Document Picture-in-Picture API가 데스크톱 한정(Safari 미지원)으로 추가됐다.

추가로 `sibling-index()`와 `sibling-count()` 함수에 대한 가이드, State of CSS 2026 설문 안내도 포함되어 있다. 설문 측은 올해 다루는 기능 수를 의도적으로 줄였다고 밝혔다.

## 설정 파일에 어떤 의미인가

이번 호의 내용 대부분은 CSS 언어 기능과 브라우저 호환성에 관한 것이므로, 빌드 도구나 린터 설정에 직접적인 변경을 요구하지는 않는다. 다만 몇 가지 간접적인 접점이 있다.

- **Safari 테스트 파이프라인**: CI에서 Safari(WebKit) 테스트를 돌리고 있다면 Playwright의 WebKit 엔진 옵션이나 BrowserStack 같은 클라우드 서비스 설정을 다시 점검할 시점이다. 원문에서 구체적 도구별 설정까지 다루지는 않으므로, 실제 테스트 매트릭스 변경은 각 도구 문서를 참고해야 한다.
- **`anchor` 속성 드롭**: CSS Anchor Positioning을 `anchor` HTML 속성에 의존해 설계한 프로젝트가 있다면, `data-*` + `attr()` 패턴으로 마이그레이션을 고려해야 한다. 다만 고급 `attr()`의 브라우저 지원 범위가 아직 제한적이므로 PostCSS 플러그인이나 폴리필 설정이 필요할 수 있다 — 원문에서 이 부분은 상세히 다루지 않았다.
- **컨테이너 스타일 쿼리 Baseline 진입**: Stylelint 등에서 컨테이너 스타일 쿼리를 경고로 잡고 있었다면 규칙을 완화해도 될 시점이다.

## 다음 단계 제안

프론트엔드 CSS 테스트 매트릭스를 관리하는 팀이라면 Safari 테스트 관련 원문 링크를 먼저 읽고, 현재 CI 설정에서 WebKit 커버리지가 실제로 동작하는지 확인해 보길 권한다. `::checkmark`나 `sibling-index()` 같은 신규 기능은 아직 브라우저 지원이 완전하지 않으므로, State of CSS 2026 설문에 참여해 커뮤니티가 어떤 기능에 우선순위를 두는지 파악하는 것도 좋은 출발점이다.

---

**원문 전체 보기**: [What's !important #12: Safari Testing, ::checkmark, HTML Anchor Positioning, and More](https://css-tricks.com/whats-important-12/) ([CSS-Tricks](https://css-tricks.com/whats-important-12/))