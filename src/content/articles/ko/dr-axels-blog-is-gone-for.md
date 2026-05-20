---
id: "https://javascriptweekly.com/issues/786"
tool: "javascriptweekly"
title: "npm 설치 스크립트 옵트인 전환 제안, Bun Rust 재작성 병합, 그리고 Axel 박사의 블로그 폐쇄"
link: "https://javascriptweekly.com/issues/786"
pubDate: 2026-05-19T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/786"
contentType: "commentary"
summary: "npm 설치 스크립트를 옵트인 방식으로 전환하자는 RFC가 제출되었고, Bun의 Rust 재작성이 병합되었으며, Dr. Axel Rauschmayer가 AI 크롤러 부담으로 블로그와 무료 도서를 내렸다. Angular 22 RC, Deno 2.8 예고 등 다수의 릴리스 소식도 포함된다."
---

JavaScript Weekly 786호는 npm 보안 모델에 대한 RFC, Bun의 Rust 포팅 병합, Dr. Axel Rauschmayer의 블로그 폐쇄 등 생태계 전반의 굵직한 소식을 한꺼번에 다룬다. 릴리스 측면에서는 Angular 22 RC, Bun 1.3.14, ESLint Config Inspector 3.0, TypeORM 1.0, Rolldown 1.0.1 등이 눈에 띈다.

## 무엇이 새로운가

가장 무게감 있는 소식은 GitHub 소속 Jamie Magee가 제출한 RFC다. npm은 주요 패키지 매니저 중 유일하게 의존성 설치 스크립트(예: `postinstall`)를 기본으로 실행하는데, 이것이 보안 취약점이 되고 있으니 옵트인 방식으로 전환하자는 제안이다. TanStack 패키지가 지난주 npm 공급망 공격을 당한 직후 나온 글이라 타이밍이 절묘하다 — TanStack 팀이 사후 대응으로 공급망 보안 강화 방안을 공개한 것도 같은 호에 실려 있다.

Bun은 Rust 기반 재작성 브랜치를 메인에 병합했다. 이전에는 그 중요성을 낮춰 말한 적 있었지만 결국 합쳐졌고, AI로 포팅된 코드 품질에 대한 의문이 Hacker News에서 활발히 논의되고 있다. Deno 팀은 2.8 출시를 예고하며 Node.js 호환성 개선, `import defer`, TypeScript 6.0.3 지원을 언급했다.

Dr. Axel Rauschmayer는 AI 크롤러의 과도한 부하 때문에 블로그와 무료 JavaScript 도서를 웹에서 내렸다. 유료 도서는 여전히 구매 가능하다.

## 설정 파일에 어떤 의미인가

npm 설치 스크립트 옵트인 RFC가 실제 반영되면, `.npmrc` 설정이나 `package.json`의 스크립트 관련 동작 방식이 달라질 가능성이 높다. 현재도 `ignore-scripts=true`를 `.npmrc`에 설정하고 필요한 패키지만 허용 목록으로 관리하는 팀이 있는데, 이 RFC가 채택되면 그 반대 — 기본이 실행 안 함이고, 명시적으로 허용해야 하는 구조로 바뀔 수 있다. 다만 RFC 단계이므로 구체적인 설정 키나 CLI 플래그는 아직 확정되지 않았다. 원문의 RFC 링크에서 진행 상황을 추적하는 것이 현실적이다.

Angular 22 RC는 `OnPush` 변경 감지 전략이 기본값이 되고 시그널 기반 폼이 도입된다고 한다. 기존 Angular 프로젝트에서 `ChangeDetectionStrategy`를 명시하지 않았던 컴포넌트는 동작 변화가 있을 수 있으므로, 정식 출시(6월 초 예정) 전에 RC로 검증해 볼 가치가 있다.

ESLint Config Inspector 3.0은 flat config 구조를 시각적으로 탐색할 수 있는 도구다. ESLint flat config로 마이그레이션한 뒤 규칙 충돌이나 적용 범위를 파악하기 어려웠다면 유용하다.

## 다음 단계 제안

보안 관점에서 가장 즉각적인 행동은 현재 프로젝트의 `.npmrc`에서 `ignore-scripts` 설정 상태를 확인하고, CI 파이프라인에서 설치 스크립트가 무조건 실행되고 있는지 점검하는 것이다. 원문에서 소개된 `npq` 같은 감사 도구도 한번 살펴볼 만하다. Angular 22 RC를 사용 중이라면 `OnPush` 기본 전환이 기존 템플릿에 미치는 영향을 로컬에서 먼저 확인해 두자.

---

**원문 전체 보기**: [Dr. Axel's blog is gone (for now)](https://javascriptweekly.com/issues/786) ([JavaScript Weekly](https://javascriptweekly.com/issues/786))