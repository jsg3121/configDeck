# ADR-0003: 패키지 매니저 선택 — pnpm

- 상태: 승인됨
- 날짜: 2026-04-06
- 의사결정자: jsg3121

## 맥락 (Context)

ConfigDeck 프로젝트의 패키지 매니저를 선택해야 한다. 후보는 npm, yarn, pnpm 세 가지이며, 의사결정자는 npm 경험이 풍부하고 yarn은 거의, pnpm은 전혀 사용 경험이 없다.

프로젝트는 Astro + Svelte 기반이며 (ADR-0002), 서버 사이드 기능 없이 정적 사이트로 운영될 예정이다.

## 결정 (Decision)

**pnpm**을 패키지 매니저로 채택한다.

## 근거 (Rationale)

### 성능

pnpm 공식 벤치마크 기준, 클린 설치 시 npm 31.3초 vs pnpm 7.6초로 약 4배 빠르다. 이는 파일을 복사하지 않고 content-addressable store에서 하드링크하는 구조적 차이에서 비롯된다.

### 디스크 효율

동일 패키지를 여러 프로젝트에서 사용해도 store에 한 벌만 저장되고 하드링크로 연결된다. 유사 스택 프로젝트 5개 기준 npm ~1.25GB vs pnpm ~300-400MB 수준.

### 생태계 정합성

Astro 공식 리포지토리 자체가 pnpm을 사용하며, 공식 문서에서 pnpm 명령어를 기본 예시로 안내한다. Vue, Vite, SvelteKit 등 본 프로젝트가 의존하는 주요 도구들도 pnpm을 채택하고 있다.

### 낮은 전환 비용

npm과 명령어 차이가 미미하다:
- `npm install <pkg>` → `pnpm add <pkg>`
- `npm run dev` → `pnpm dev`
- `npx <cmd>` → `pnpm dlx <cmd>`

### 엄격한 의존성 관리

pnpm의 비평탄(non-flat) node_modules 구조는 `package.json`에 명시하지 않은 패키지(phantom dependency)에 접근할 수 없게 한다. 이는 의존성의 명시성과 재현성을 보장한다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| npm | 성능과 디스크 효율에서 열세. 단 익숙함과 기본 탑재라는 장점은 있음 |
| yarn classic (v1) | 사실상 유지보수 모드. npm 대비 뚜렷한 이점 없음 |
| yarn berry (v3/v4) | PnP(Plug'n'Play) 방식이 node_modules를 제거해 혁신적이나, 라이브러리 호환성 이슈가 빈번하고 IDE 연동에 별도 SDK 설정이 필요. Astro와의 PnP 관련 이슈도 보고됨 |

## 결과 (Consequences)

- `pnpm-lock.yaml`이 lockfile로 사용된다 (`package-lock.json` 대체)
- `package.json`에 `"packageManager": "pnpm@<version>"` 필드를 명시한다
- CI/CD에서 `pnpm/action-setup` 액션을 사용한다
- phantom dependency로 인한 에러 발생 시 해당 패키지를 명시적으로 추가한다

## 참고 자료 (References)

- [Motivation | pnpm](https://pnpm.io/motivation) — pnpm의 핵심 동기: 디스크 절약, 속도, phantom dependency 방지
- [Benchmarks | pnpm](https://pnpm.io/benchmarks) — npm/yarn/pnpm 설치 속도 벤치마크
- [Symlinked node_modules structure | pnpm](https://pnpm.io/symlinked-node-modules-structure) — 심볼릭링크 기반 node_modules 구조 설명
- [Install Astro | Docs](https://docs.astro.build/en/install-and-setup/) — Astro 공식 설치 가이드 (pnpm 명령어 포함)
- [pnpm vs npm vs yarn vs Bun: The 2026 Package Manager Showdown](https://dev.to/pockit_tools/pnpm-vs-npm-vs-yarn-vs-bun-the-2026-package-manager-showdown-51dc) — 2026년 기준 패키지 매니저 종합 비교
- [npm vs Yarn vs pnpm — Which Package Manager Should You Use in 2025?](https://dev.to/hamzakhan/npm-vs-yarn-vs-pnpm-which-package-manager-should-you-use-in-2025-2f1g) — 2025년 기준 선택 가이드
