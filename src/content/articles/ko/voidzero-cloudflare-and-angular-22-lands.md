---
id: "https://javascriptweekly.com/issues/789"
tool: "javascriptweekly"
title: "VoidZero가 Cloudflare에 합류, 그리고 Angular 22 출시"
link: "https://javascriptweekly.com/issues/789"
pubDate: 2026-06-09T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/789"
contentType: "commentary"
summary: "Vite·Vitest·Rolldown·Oxc를 만들던 VoidZero가 Cloudflare에 합류하고, Cloudflare는 Vite 생태계 메인테이너를 위한 100만 달러 펀드를 조성한다. 이번 호에는 Safari 27 베타, Electron 43 베타, React Compiler Rust 포트 등 굵직한 소식이 함께 실렸다."
---

JavaScript Weekly 789호의 헤드라인은 VoidZero의 Cloudflare 합류다. Evan You가 설립한 VoidZero — Vite, Vitest, Rolldown, Oxc 등을 개발해 온 회사 — 가 Cloudflare에 합류하며, Evan You 본인이 수익화의 어려움을 솔직하게 언급했다.

## 무엇이 새로운가

VoidZero 합류에도 불구하고 모든 프로젝트는 MIT 라이선스를 유지하며, Evan You와 팀이 계속 프로젝트를 이끈다. Cloudflare는 Vite 생태계 메인테이너·기여자를 지원하는 100만 달러 규모의 펀드를 신설한다고 Vite 팀 포스트에서 밝혔다. 그 외 주목할 릴리스로는 Safari 27 베타(표준 준수 ESM 로더 재작성, WASM JSPI 지원), Electron 43 베타(내장 Node.js 스냅샷·V8 바이트코드 캐싱·링크타임 최적화로 성능 개선), React Compiler Rust 포트 테스트 준비 완료(Meta가 이미 "좋은 결과"를 보고 있다고 언급) 등이 있다. TanStack Table v9 베타, Node-RED 5.0, Rolldown 1.1, pnpm 11.5 등도 함께 릴리스됐다.

## 설정 파일에 어떤 의미인가

VoidZero → Cloudflare 합류가 `vite.config.*`나 `vitest.config.*` 파일 구조에 당장 영향을 주진 않는다. 라이선스와 거버넌스가 유지되므로 기존 설정을 급히 마이그레이션할 필요는 없다. 다만 Rolldown이 Vite의 번들러로 본격 통합되는 시점에는 Rollup 플러그인 호환성이나 빌드 설정 옵션에 변화가 올 수 있다 — 이 부분은 원문에서도 구체적으로 다루지 않았으므로 공식 마이그레이션 가이드가 나오면 별도로 정리하겠다.

eslint-plugin-functional 10.0이 릴리스됐는데, 뮤테이션을 금지하고 함수형 패턴을 강제하는 ESLint 규칙 셋이다. 기존에 이 플러그인을 `.eslintrc`나 `eslint.config.*`에서 사용 중이라면 메이저 버전 업그레이드에 따른 규칙 변경 여부를 확인해야 한다. ts-loader 9.6은 webpack 4 지원을 다시 추가했으므로, 레거시 webpack 4 프로젝트에서 TypeScript 로더 설정을 유지해야 하는 팀에게는 반가운 소식이다.

## 다음 단계 제안

Vite·Vitest를 프로덕션에서 사용 중이라면, 당장 바꿀 건 없지만 Cloudflare 합류 이후 로드맵 변화를 Evan You의 원문 포스트에서 직접 확인해 두는 것이 좋다. eslint-plugin-functional이나 ts-loader를 쓰고 있다면 CHANGELOG를 훑어보고 breaking change 유무를 체크한 뒤 잠금 파일을 업데이트하자. Safari 27 베타의 ESM 로더 재작성은 top-level await 관련 이슈를 겪었던 팀이라면 테스트해 볼 가치가 있다.

---

**원문 전체 보기**: [VoidZero → Cloudflare, and Angular 22 lands](https://javascriptweekly.com/issues/789) ([JavaScript Weekly](https://javascriptweekly.com/issues/789))