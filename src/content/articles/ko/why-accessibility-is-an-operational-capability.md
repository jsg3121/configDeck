---
id: "https://smashingmagazine.com/2026/06/why-accessibility-operational-capability-not-feature/"
tool: "smashingmagazine"
title: "접근성은 기능이 아니라 운영 역량이다"
link: "https://smashingmagazine.com/2026/06/why-accessibility-operational-capability-not-feature/"
pubDate: 2026-06-30T12:00:00.000Z
sourceName: "Smashing Magazine"
sourceUrl: "https://smashingmagazine.com/2026/06/why-accessibility-operational-capability-not-feature/"
contentType: "commentary"
summary: "Smashing Magazine이 접근성을 일회성 감사가 아닌 보안·관측성과 동급의 운영 역량으로 다뤄야 한다고 주장하며, AI 생성 UI가 접근성 부채를 대량 생산하는 구조적 원인을 분석했다."
---

Smashing Magazine이 접근성을 준수 체크리스트나 프로젝트 마감 감사 항목이 아니라, 보안·프라이버시·관측성과 같은 수준의 **운영 역량(operational capability)**으로 취급해야 한다는 장문의 글을 게재했다. AI 코드 생성 시대에 접근성 부채가 어떻게 산업적 규모로 쌓이는지를 구체 사례와 함께 다룬다.

## 무엇이 새로운가

핵심 논점은 두 가지다. 첫째, WebAIM Million 2026 보고서를 인용하며 상위 100만 개 홈페이지의 95.9%에서 WCAG 위반이 탐지되었고, 페이지당 평균 오류가 56.1건, 페이지 요소 수가 전년 대비 20% 이상 증가했다고 전한다 — AI 기반 개발과 "vibe coding"이 원인으로 지목된다. 둘째, AI 모델이 비시맨틱 마크업을 기본 출력하는 구조적 이유를 세 가지로 정리한다: GitHub 상의 React 코드 대부분이 비시맨틱 "soup"이라 학습 데이터가 그렇고, 평가자가 시각적 결과만 보고, `<div onClick>`이 `<button aria-expanded="true" ...>`보다 토큰이 적기 때문이다. Veracode의 2025 보안 보고서까지 연결해, AI 생성 코드에서 보안 취약점과 접근성 실패가 동일한 프로세스 부재에서 비롯된다고 주장한다.

글은 해법으로 디자인 시스템을 가장 높은 레버리지 지점으로 꼽으며, GOV.UK Design System을 예시로 든다. 접근성 요건을 Definition of Done에 포함하고, PR 리뷰에 접근성 점검을 명시적으로 넣고, 시맨틱 요소를 기본값으로 사용하는 워크플로를 제안한다.

## 설정 파일에 어떤 의미인가

이 글은 특정 도구의 릴리스나 설정 변경이 아니라 엔지니어링 프로세스에 관한 논의다. 하지만 개발 도구 설정 관점에서 직접 연결되는 지점이 있다. CI 파이프라인에 접근성 린터(예: eslint-plugin-jsx-a11y, axe-core 기반 테스트)를 통합하는 것은 결국 ESLint·테스트 러너 설정의 문제다. 원문이 "PR 리뷰에 접근성 점검 포함"과 "자동화 검사를 CI에 배치"를 구체적으로 언급하지만, 특정 도구의 설정 옵션이나 버전은 다루지 않는다. 기존 린트·CI 설정에 접근성 규칙을 어떻게 추가하는지는 각 도구의 공식 문서를 참고하는 편이 정확하다.

## 다음 단계 제안

당장 할 수 있는 일은 두 가지다. 하나, 팀의 CI 파이프라인에 접근성 자동 검사가 이미 들어가 있는지 확인하라 — 없다면 머지 전 단계에 한 줄 추가하는 것만으로 시작할 수 있다. 둘, AI로 생성한 컴포넌트의 접근성 트리를 브라우저 개발자 도구에서 직접 열어보라. 원문이 말하듯 "같은 픽셀이지만 하나는 문이고 하나는 문 그림"인지 확인하는 데 30초면 충분하다. 보다 깊은 맥락과 GOV.UK 사례 분석은 원문에서 확인할 수 있다.

---

**원문 전체 보기**: [Why Accessibility Is An Operational Capability, Not A Feature](https://smashingmagazine.com/2026/06/why-accessibility-operational-capability-not-feature/) ([Smashing Magazine](https://smashingmagazine.com/2026/06/why-accessibility-operational-capability-not-feature/))