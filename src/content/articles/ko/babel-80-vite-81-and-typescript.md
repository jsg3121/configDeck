---
id: "https://javascriptweekly.com/issues/791"
tool: "javascriptweekly"
title: "Babel 8.0, Vite 8.1, TypeScript 7.0 RC — 자바스크립트 생태계 주요 릴리스 총정리"
link: "https://javascriptweekly.com/issues/791"
pubDate: 2026-06-23T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/791"
contentType: "commentary"
summary: "Babel 8.0이 ESM 전용으로 전환되고, Vite 8.1이 실험적 번들 개발 모드를 추가했으며, TypeScript 7.0 RC가 Go 기반 컴파일러로 빌드 성능 향상을 예고한다. 설정 파일 관점에서 마이그레이션 포인트가 여럿 존재하는 이슈다."
---

JavaScript Weekly 791호가 Babel 8.0, TypeScript 7.0 RC, Vite 8.1, Astro 7.0 등 굵직한 릴리스를 한꺼번에 다뤘다. Deno 2.9의 데스크톱 앱 빌드 기능, TanStack Table v9의 메모리 최적화 사례 등도 함께 소개됐다.

## 무엇이 새로운가

**Babel 8.0**은 7.0 이후 8년 만의 메이저 업데이트로, ESM 전용으로 전환되며 기본 타겟이 기존 ES5에서 약 ES2023 수준으로 변경되었다. SWC, Oxc 같은 후발 도구의 부상에도 @babel 패키지의 주간 다운로드가 380배 증가했다고 원문은 밝히고 있다.

**TypeScript 7.0 RC**는 Go 기반 컴파일러로 약 10배의 빌드 성능 향상을 목표로 한다. **Vite 8.1**은 실험적 '번들 개발 모드'를 추가해 대규모 앱의 개발 서버 시작 속도와 풀 리로드를 크게 개선하고, WASM/ESM 통합 지원도 포함된다. **Astro 7.0**은 .astro 컴파일과 Markdown/MDX 처리를 Rust 파이프라인으로 전환해 빌드 시간을 단축했고, Advanced Routing으로 요청 파이프라인 전체를 제어할 수 있게 됐다.

그 밖에 **Deno 2.9**가 macOS·Windows·Linux용 자체 포함 데스크톱 앱 빌드를 지원하며, Electron과 달리 OS 기본 WebView 또는 번들 Chromium 중 선택이 가능하다. pnpm 11.7/11.8은 `--dry-run`, `--frozen-store` 옵션이 추가됐고, Node.js도 v26.3.1, v24.17.0, v22.23.0이 각각 릴리스됐다.

## 설정 파일에 어떤 의미인가

이번 이슈에서 설정 파일에 가장 직접적인 영향을 주는 것은 **Babel 8.0의 ESM 전용 전환**이다. CommonJS 기반으로 `babel.config.js`를 작성해 온 프로젝트라면 `.mjs` 확장자 변경이나 `package.json`의 `"type": "module"` 설정이 필요해질 수 있다. 기본 타겟이 ES2023급으로 올라가면서, `@babel/preset-env`의 `targets` 설정을 명시적으로 낮은 브라우저로 지정하지 않았던 프로젝트는 출력 코드가 달라질 여지가 있다.

**Vite 8.1**의 번들 개발 모드는 아직 실험적이므로 `vite.config.ts`에서 별도 플래그를 켜야 할 것으로 보이지만, 구체적 옵션명은 원문에 언급되지 않았다. **TypeScript 7.0 RC** 역시 Go 기반 컴파일러로의 전환이 `tsconfig.json` 옵션에 어떤 호환성 변화를 가져오는지는 이번 원문만으로는 확인하기 어렵다 — 공식 마이그레이션 가이드가 나오면 별도로 다룰 예정이다.

**pnpm**의 `--frozen-store` 옵션은 CI 환경에서 패키지 스토어를 읽기 전용으로 고정할 수 있어, lockfile 기반 재현 빌드 설정에 유용해 보인다.

## 다음 단계 제안

Babel 8.0 마이그레이션이 가장 시급한 액션 아이템이다. 기존 Babel 설정 파일이 CJS인 프로젝트라면, 업그레이드 전에 ESM 전환 계획을 먼저 세우는 것이 현실적이다. TypeScript 7.0은 아직 RC 단계이니 별도 브랜치에서 빌드 성능 차이를 체감해 보고, Vite 8.1의 번들 개발 모드는 대규모 프로젝트에서 실험적으로 활성화해 시작 속도 변화를 측정해 볼 만하다. 각 도구의 상세 마이그레이션 경로는 원문에 링크된 개별 릴리스 노트를 참고하길 권한다.

---

**원문 전체 보기**: [Babel 8.0, Vite 8.1, and TypeScript 7.0 RC](https://javascriptweekly.com/issues/791) ([JavaScript Weekly](https://javascriptweekly.com/issues/791))