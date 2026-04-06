# RES-0001: ConfigDeck UI/UX 레퍼런스 분석

- **조사일**: 2026-04-06
- **목적**: ConfigDeck과 유사한 설정 파일 생성 서비스들의 UI/UX 패턴을 분석하여 디자인 방향 수립의 근거로 활용

---

## 요약

설정 파일 생성 서비스들의 UI 패턴은 크게 3가지로 분류된다: (1) **분할 패널형** (좌측 옵션 + 우측 미리보기), (2) **선형 폼형** (위에서 아래로 순차 선택), (3) **스텝 위자드형** (단계별 진행). ConfigDeck은 "스택 기반 다중 파일 생성"이라는 차별점이 있으므로, 단일 파일 생성기와 프로젝트 스캐폴더의 패턴을 조합한 하이브리드 UI가 적합하다.

---

## 1. 설정 파일 생성기 서비스

### gitignore.io (Toptal)

- **URL**: [toptal.com/developers/gitignore](https://www.toptal.com/developers/gitignore)
- **UI 구조**: 단일 입력 + 결과 페이지
- **옵션 선택**: 자동완성 검색창에 OS/IDE/언어 태그를 입력하는 방식. 선택된 항목이 태그 칩으로 표시
- **결과**: "Create" 클릭 시 별도 페이지에 텍스트 출력
- **참고 패턴**: 태그 기반 자동완성 검색은 .gitignore처럼 카테고리가 많은 파일에 효과적

### ESLint Config Generator (Shubhdeep)

- **URL**: [eslint-config-generator.shubhdeepchhabra.in](https://eslint-config-generator.shubhdeepchhabra.in/)
- **UI 구조**: 단일 페이지 선형 폼
- **옵션 선택**: 라디오(Format: CommonJS/ESM), 체크박스(ecmaFeatures, rules), 토글(섹션 표시/숨김)
- **결과**: "Show config" 버튼으로 생성 결과 표시
- **참고 패턴**: **프로그레시브 디스클로저** — "Include ~ config" 체크박스로 필요한 섹션만 펼치는 방식이 복잡한 옵션 관리에 효과적

### Prettier Config

- **URL**: [prettier-config.dev/en](https://prettier-config.dev/en)
- **UI 구조**: 헤더 + 메인 폼 + 사이드 미리보기
- **옵션 선택**: 토글(Tabs, Semicolons), 드롭다운(Trailing Commas), 숫자 입력(Print Width), 멀티 셀렉트(Plugins)
- **결과**: 실시간 설정 미리보기 + Copy Config 버튼 + FAB(Generate Config)
- **참고 패턴**: 다양한 입력 컨트롤 조합 + 다크/라이트 테마 + 검색으로 옵션 찾기

### TSConfig Guide

- **URL**: [tsconfig.guide](https://tsconfig.guide/)
- **UI 구조**: **2분할 레이아웃** (좌측 옵션 / 우측 JSON 미리보기)
- **옵션 선택**: 4개 토글로 핵심 설정만 제공 (strict, tsc, DOM, comments)
- **결과**: 우측에 실시간 tsconfig.json 코드 미리보기
- **참고 패턴**: **최소 옵션으로 최적 결과** — 복잡한 tsconfig를 4개 질문으로 축소한 단순화 전략

### PureDevTools TSConfig Generator

- **URL**: [puredevtools.tools/tsconfig-generator](https://puredevtools.tools/tsconfig-generator/)
- **UI 구조**: **좌측 폼 + 우측 실시간 미리보기** (분할 패널)
- **옵션 선택**: 프리셋 버튼 4개(React/Node.js/Library/Next.js) + 드롭다운(target, module) + 체크박스(strict 옵션) + 텍스트 입력(paths) + 동적 추가 버튼(path alias)
- **결과**: 우측 패널에 실시간 JSON + Copy/Reset 버튼
- **참고 패턴**: **프리셋 → 세부 조정** 2단계 플로우가 ConfigDeck과 가장 유사. 클라이언트 전용 처리 강조

---

## 2. 프로젝트 스캐폴딩 도구

### Spring Initializr

- **URL**: [start.spring.io](https://start.spring.io/)
- **UI 구조**: **좌측 메타데이터 폼 + 우측 의존성 검색**
- **옵션 선택**: 라디오(빌드 도구, 언어), 드롭다운(Spring Boot 버전), 텍스트(Group, Artifact), 검색+자동완성(Dependencies)
- **결과**: "Generate" 버튼 → ZIP 다운로드
- **참고 패턴**: **의존성 검색 UI** — 수백 개 의존성을 검색+카테고리로 관리. "Switch to full version"으로 고급 옵션 숨김/표시. 프로젝트 설정 빌더의 사실상 표준

### Create T3 App

- **URL**: [create.t3.gg](https://create.t3.gg/)
- **UI 구조**: 문서/소개 중심 (실제 생성은 CLI)
- **옵션 선택**: 웹 UI 없음 — CLI 대화형 선택
- **참고 패턴**: "Take what you want and nothing more" 모듈식 철학. 각 기술을 카드형으로 소개하며 독립적 선택 가능

### ScaffoldHub

- **URL**: [scaffoldhub.io](https://www.scaffoldhub.io/)
- **UI 구조**: **3단계 위자드** (모델링 → 미리보기 → 다운로드)
- **옵션 선택**: 시각적 데이터 모델링 도구
- **결과**: 브라우저 내 실시간 프로젝트 미리보기 + 소스 코드 다운로드
- **참고 패턴**: **브라우저 내 실시간 미리보기** — 다운로드 전에 결과를 직접 확인할 수 있는 UX

### Shadcn UI Builder (2026)

- **URL**: [ui.shadcn.com/create](https://ui.shadcn.com/)
- **UI 구조**: **비주얼 커스터마이저** + 실시간 미리보기
- **옵션 선택**: 프레임워크 택일, 컴포넌트 기반 선택, 테마/색상/폰트/아이콘 등 시각적 조정, shuffle로 랜덤 조합 탐색
- **결과**: 맞춤형 CLI 명령어 생성
- **참고 패턴**: **의사결정을 코드 작성 전에 시각적으로 완료**하는 접근. shuffle 기능으로 영감 제공

### Initializr (HTML5 Boilerplate)

- **URL**: [initializr.com](https://www.initializr.com/)
- **UI 구조**: **2단계** (프리셋 선택 → 세부 커스터마이징)
- **옵션 선택**: 3개 프리셋 카드 + 체크박스 기반 세부 옵션
- **참고 패턴**: **프리셋 우선 → 세부 조정** 흐름이 ConfigDeck의 "프리셋 페이지 → 커스터마이징" 플로우와 일치

---

## 3. UI 패턴 비교

| 패턴 | 대표 서비스 | 장점 | 단점 | ConfigDeck 적합도 |
|------|-----------|------|------|-------------------|
| **분할 패널** (옵션+미리보기) | TSConfig Guide, PureDevTools | 실시간 피드백, 직관적 | 모바일 대응 어려움 | **높음** (생성기 페이지) |
| **선형 폼** | ESLint Generator | 순차적 이해 용이 | 긴 스크롤, 전체 파악 어려움 | 중간 (개별 파일 옵션) |
| **프리셋 → 커스터마이즈** | Initializr, PureDevTools | 빠른 시작, 유연성 겸비 | 프리셋 설계가 핵심 | **높음** (프리셋 기능) |
| **검색 기반 선택** | Spring Initializr, gitignore.io | 대량 옵션 관리 | 초보자 진입 장벽 | 중간 (파일/스택 검색) |
| **스텝 위자드** | ScaffoldHub | 복잡한 과정 단순화 | 자유로운 탐색 제한 | 중간 (온보딩용) |

---

## 4. ConfigDeck 적용 추천

### 생성기 메인 페이지

**Spring Initializr 스타일** — 좌측에 파트/스택/파일 선택 폼, 우측에 선택된 파일 목록과 미리보기 패널. 모바일에서는 상하 배치

### 개별 파일 옵션

**PureDevTools 스타일** — 프리셋 버튼 + 세부 옵션 폼 + 실시간 코드 미리보기 분할 패널

### 프리셋 페이지

**Initializr 스타일** — 카드형 프리셋 목록 → 선택 시 포함 파일 보기 + 커스터마이징 진입

### 공통 UX 요소

- **프로그레시브 디스클로저**: ESLint Generator처럼 고급 옵션은 기본 숨김 → 필요 시 펼치기
- **다크/라이트 테마**: Prettier Config 참고
- **복사 버튼 + 토스트 알림**: 현대적 피드백 UX
- **클라이언트 전용 처리**: 서버 전송 없이 브라우저에서 생성 (PureDevTools 참고)

### 핵심 레퍼런스

**PureDevTools TSConfig Generator**가 ConfigDeck과 가장 유사한 구조(프리셋 → 세부옵션 → 실시간 미리보기 → 복사)이므로 핵심 레퍼런스로 삼을 것을 추천한다.

---

## 참고 자료

- [gitignore.io](https://www.toptal.com/developers/gitignore) — 태그 기반 자동완성 검색 패턴
- [ESLint Config Generator](https://eslint-config-generator.shubhdeepchhabra.in/) — 프로그레시브 디스클로저 폼
- [Prettier Config](https://prettier-config.dev/en) — 다양한 입력 컨트롤 조합 + 실시간 미리보기
- [TSConfig Guide](https://tsconfig.guide/) — 최소 토글 기반 분할 패널
- [PureDevTools TSConfig Generator](https://puredevtools.tools/tsconfig-generator/) — 프리셋 + 폼 + 실시간 미리보기 (ConfigDeck 핵심 레퍼런스)
- [Spring Initializr](https://start.spring.io/) — 프로젝트 메타데이터 + 의존성 검색 패턴
- [Spring Initializr New UI Blog](https://spring.io/blog/2019/03/05/spring-initializr-new-ui/) — UI 디자인 의사결정 설명
- [ScaffoldHub](https://www.scaffoldhub.io/) — 브라우저 내 실시간 미리보기
- [Shadcn UI Builder](https://ui.shadcn.com/) — 비주얼 커스터마이저 + shuffle 기능
- [Initializr](https://www.initializr.com/) — 프리셋 우선 2단계 플로우
