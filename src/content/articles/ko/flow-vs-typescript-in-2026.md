---
id: "https://javascriptweekly.com/issues/790"
tool: "javascriptweekly"
title: "2026년 Flow vs TypeScript, 그리고 이번 주 주요 릴리스 정리"
link: "https://javascriptweekly.com/issues/790"
pubDate: 2026-06-16T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/790"
contentType: "commentary"
summary: "JavaScript Weekly 790호는 Meta의 Flow와 TypeScript 비교 글을 헤드라인으로, ESLint v10.5.0·Playwright 1.61·Biome 2.5 등 다수의 릴리스 소식을 함께 전한다."
---

JavaScript Weekly 790호의 메인 기사는 Meta의 George Zahariev가 쓴 "2026년 TypeScript 사용자를 위한 Flow" 비교 글이다. 이 외에도 ESLint, Playwright, Biome, React Native 등 설정 파일에 영향을 줄 수 있는 릴리스가 여럿 묶여 있어 한 번에 훑기 좋은 호다.

## 무엇이 새로운가

Flow 관련 글의 핵심은, Flow의 구문이 TypeScript에 상당히 수렴했지만 여전히 차이가 있다는 것이다. Flow의 기본 설정이 더 엄격하여 TypeScript strict 모드에서도 허용하는 일부 충돌 가능 패턴을 거부하며, exhaustive match 표현식 같은 독자적 기능도 있다.

릴리스 소식 중 눈에 띄는 것들: **ESLint v10.5.0**은 코어 규칙 5개가 에디터에서 다른 문제를 가리지 않도록 더 좁은 범위만 하이라이트한다. **Playwright 1.61**은 패스키 등록·테스트와 localStorage/sessionStorage를 위한 WebStorage API를 추가했다. **Biome 2.5**는 린트 규칙이 500개를 넘겼다. **React Native 0.86**은 Android 15+ 엣지 투 엣지 지원을 포함한다.

TanStack Table v9 베타가 `tsc` 진단을 활용해 타입 검사 작업량을 62–86% 줄인 사례도 소개됐다. 타입이 무거운 라이브러리를 작성하는 사람이라면 원문의 상세 분석을 읽어볼 만하다.

## 설정 파일에 어떤 의미인가

**ESLint v10.5.0** — 코어 규칙의 하이라이트 범위 변경은 `.eslintrc` 또는 `eslint.config.*`의 규칙 설정 자체를 바꾸지는 않지만, 에디터 통합 경험이 달라진다. 기존에 `off`로 꺼뒀던 규칙이 이제 다른 문제를 가리지 않을 수 있으므로 다시 켜볼 여지가 있다.

**Biome 2.5** — 500개 이상의 린트 규칙은 ESLint+Prettier 조합을 Biome 단독으로 대체하려는 팀에게 의미 있는 수치다. 다만 원문에 breaking change 여부는 언급되지 않았으므로, 업그레이드 전 Biome 공식 릴리스 노트를 확인하는 게 안전하다.

**Flow vs TypeScript** — Flow를 쓰는 프로젝트(주로 Meta 생태계)의 `.flowconfig`와 TypeScript의 `tsconfig.json`은 기본 엄격도가 다르다는 점이 원문에서 강조된다. 두 시스템 간 마이그레이션 경로나 구체적 설정 매핑은 원문에서도 상세히 다루지 않으므로, Meta의 Flow 공식 문서를 병행 참조해야 한다.

**SvelteKit 3.0, Vue 3.6, Vite 8.1, Astro 7.0** 등이 베타/프리릴리스 단계로 언급됐지만, 설정 변경 사항에 대한 구체 정보는 이번 호에 포함되지 않았다. 각 프로젝트의 마이그레이션 가이드가 나오면 별도로 정리할 예정이다.

## 다음 단계 제안

이번 호는 "지금 당장 설정을 바꿔야 하는" 긴급한 내용보다, 다가오는 메이저 릴리스들의 윤곽을 미리 파악하는 데 유용하다. ESLint나 Biome를 쓰고 있다면 마이너 업데이트를 먼저 적용해 보고, SvelteKit 3.0·Vite 8.1 등 프리릴리스는 사이드 브랜치에서 호환성을 확인해 두는 정도가 현실적이다. TanStack의 타입 최적화 사례는 자체 라이브러리의 `tsc --diagnostics` 결과를 한번 돌려보는 계기로 삼을 만하다.

---

**원문 전체 보기**: [Flow vs TypeScript in 2026](https://javascriptweekly.com/issues/790) ([JavaScript Weekly](https://javascriptweekly.com/issues/790))