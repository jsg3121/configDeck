# ConfigDeck

> 개발자가 프로젝트 시작 시 필요한 설정 파일을 스택 기반으로 조합·생성·다운로드할 수 있는 다국어 웹 서비스

[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20Code-blueviolet)](https://claude.ai/code)
[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro)](https://astro.build)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

## 소개

ConfigDeck은 프로젝트 초기 설정에 드는 시간을 줄여주는 설정 파일 생성기입니다.

- ESLint, Prettier, TypeScript, Vite 등 9종의 설정 파일 지원
- 스택별 프리셋으로 한 번에 여러 파일 생성
- 레거시 설정을 최신 형식으로 마이그레이션
- 한국어/영어 다국어 지원

## 핵심 기능

| 기능              | 설명                                                          |
| ----------------- | ------------------------------------------------------------- |
| **파일별 생성기** | 옵션을 선택하고 실시간 미리보기로 확인 후 복사/다운로드       |
| **스택별 프리셋** | React+Vite, Next.js, Astro 등 스택에 맞는 설정을 한 번에 생성 |
| **마이그레이션**  | `.eslintrc` → `eslint.config.mjs` 등 레거시 형식 변환         |
| **ZIP 다운로드**  | 여러 설정 파일을 한 번에 묶어서 다운로드                      |

### 지원 설정 파일

- `.gitignore`
- `.editorconfig`
- `.env.example`
- `tsconfig.json`
- `eslint.config.mjs`
- `prettier.config.mjs`
- `vite.config.ts`
- `vitest.config.ts`
- `next.config.js`

## 기술 스택

| 영역            | 기술                | 선택 이유                                  |
| --------------- | ------------------- | ------------------------------------------ |
| 메타 프레임워크 | Astro 6             | SSG 기반 정적 사이트, 콘텐츠 페이지 JS 0KB |
| 인터랙티브 UI   | Svelte 5 (Runes)    | 가벼운 번들, 직관적인 반응성               |
| 스타일링        | Tailwind CSS 4      | 유틸리티 우선, CSS 기반 테마 설정          |
| 언어            | TypeScript          | strict 모드, 타입 안전성 확보              |
| 테스트          | Vitest + Playwright | 단위 테스트 + E2E 테스트                   |
| 배포            | Cloudflare Pages    | 정적 출력, 글로벌 CDN                      |

## 시작하기

### 요구 사항

- Node.js 22.12.0 이상
- pnpm 9.x 이상

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/jsg3121/configDeck.git
cd configDeck

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

### 스크립트

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm preview      # 빌드 결과 미리보기
pnpm lint         # ESLint 검사
pnpm format       # Prettier 포맷팅
pnpm test         # 단위 테스트 실행
pnpm test:e2e     # E2E 테스트 실행
```

---

## AI-Driven Development

> **이 프로젝트는 Claude Code와 AI 하네스 시스템을 활용하여 인간의 직접적인 코드 작성을 최소화하고 개발되었습니다.**

### 개발 방식

ConfigDeck은 전통적인 개발 방식이 아닌, AI 에이전트가 주도하고 인간이 방향을 설정하는 방식으로 개발되었습니다. 기획, 의사결정, 코드 작성, 테스트, 품질 검증까지 전 과정에서 AI가 핵심 역할을 수행했습니다.

### 하네스(Harness) 시스템

`.claude/` 디렉토리에 구축된 하네스 시스템이 AI 에이전트의 행동을 안내합니다.

```
.claude/
├── CLAUDE.md              # 프로젝트 컨텍스트 및 규칙
├── settings.json          # Claude Code 권한/자동화 설정
├── ia/                    # 기획 문서 (서비스 IA, 기능 SPEC)
├── decisions/             # ADR (Architecture Decision Records)
├── conventions/           # 코딩/스타일링/워크플로우 규칙
├── seo/                   # SEO 가이드라인
├── research/              # 리서치 보고서
├── skills/                # 커스텀 스킬 (9종)
├── agents/                # 전문 에이전트 (12종)
├── qa/                    # QA 하네스 및 리포트
└── hooks/                 # 자동화 Hook 스크립트
```

**총 74개의 하네스 문서**가 AI의 일관된 작업을 지원합니다.

### 전문 에이전트

역할별로 전문화된 12종의 에이전트가 복잡한 작업을 분담합니다.

| 분류     | 에이전트              | 역할                                 |
| -------- | --------------------- | ------------------------------------ |
| 기획     | `product-planner`     | 기능 기획서(SPEC) 작성 및 관리       |
| 개발     | `config-maker`        | 설정 파일 스키마, 옵션, 생성 로직    |
|          | `ui-publisher`        | Astro/Svelte 컴포넌트 구현           |
|          | `ux-designer`         | 사용자 플로우, 레이아웃, 반응형 설계 |
|          | `seo-specialist`      | 시맨틱 HTML, 메타태그, 구조화 데이터 |
| QA       | `qa-agent`            | QA 오케스트레이터                    |
|          | `unit-tester`         | Vitest 단위 테스트                   |
|          | `e2e-tester`          | Playwright E2E 테스트                |
|          | `static-analyzer`     | ESLint/TypeScript 정적 분석          |
| 비즈니스 | `market-intelligence` | 시장 조사, 경쟁사 분석               |
|          | `business-analyst`    | 경쟁력, 포지셔닝 분석                |
|          | `strategy-planner`    | 전략 방향 도출                       |

### 에이전트 협업 패턴

에이전트들은 작업 유형에 따라 다양한 패턴으로 협업합니다.

**Pipeline (순차 실행)**

```
product-planner → ux-designer → ui-publisher → qa-agent
(기획)           (설계)         (구현)          (검증)
```

**Fan-out/Fan-in (병렬 조사)**

```
config-maker (ESLint)  ─┐
config-maker (Prettier) ─┼→ 통합
config-maker (TSConfig) ─┘
```

**QA 오케스트레이션**

```
         qa-agent
            │
    ┌───────┼───────┐
    ▼       ▼       ▼
unit-tester e2e   static
    │       │       │
    └───────┴───────┘
            ▼
       QA 리포트
```

### 커스텀 스킬

반복 작업을 자동화하는 9종의 스킬이 슬래시 명령어로 호출됩니다.

| 스킬                 | 용도                                    |
| -------------------- | --------------------------------------- |
| `/research`          | 기술 비교, 라이브러리 선택 등 외부 조사 |
| `/create-pr`         | PR 생성 (템플릿 기반, 라벨 자동 매핑)   |
| `/component-builder` | Astro/Svelte 컴포넌트 스캐폴딩          |
| `/lint-check`        | Prettier/ESLint 전체 검사               |
| `/code-review`       | PR 전 코드 리뷰                         |
| `/a11y-check`        | 접근성(WCAG) 검사                       |
| `/seo-audit`         | SEO 감사 (메타태그, JSON-LD, hreflang)  |
| `/test-writer`       | Vitest 단위 테스트 작성                 |
| `/e2e-test`          | Playwright E2E 테스트 작성              |

### 의사결정 추적 (ADR)

모든 주요 기술 결정은 ADR(Architecture Decision Record)로 기록되어 AI와 인간 모두 결정의 맥락을 이해할 수 있습니다.

현재 기록된 ADR:

- ADR-0001: ADR 도입
- ADR-0002: 프레임워크 선택 (Astro + Svelte)
- ADR-0003: 패키지 매니저 선택 (pnpm)
- ADR-0004: 배포 플랫폼 (Cloudflare Pages)
- ADR-0006: 생성기 중심 IA 재설계
- ADR-0007: 페이지 구조 재설계
- ADR-0008: 옵션 스키마 재설계
- ADR-0010: 아티클 콘텐츠 전략
- ADR-0011: AI 요약 자동화

### Why-First 원칙

하네스 문서는 단순히 규칙을 나열하지 않고, **왜 그런지(Why)**를 함께 설명합니다. AI가 엣지 케이스에서도 올바르게 판단할 수 있도록 하기 위함입니다.

```markdown
# Bad

- 컴포넌트 파일명은 PascalCase를 사용한다

# Good

- 컴포넌트 파일명은 PascalCase를 사용한다
  → Astro/Svelte 컴포넌트와 일반 유틸 파일을 파일명만으로 즉시 구분하기 위함
```

### 자동화 Hook

`settings.json`에 정의된 Hook이 코드 품질을 자동으로 유지합니다.

- **PostToolUse**: 파일 저장 시 자동 포맷팅
- **Stop**: 작업 완료 전 빌드/lint 검증

---

## 프로젝트 구조

```
configDeck/
├── src/
│   ├── components/         # UI 컴포넌트
│   │   ├── common/         # 공통 (Header, Footer)
│   │   ├── home/           # 홈 페이지 섹션
│   │   └── generator/      # 생성기 관련
│   ├── lib/
│   │   ├── data/           # 옵션, 프리셋, 파일 정의
│   │   ├── generators/     # 설정 파일 생성 로직
│   │   ├── migration/      # 레거시 마이그레이션
│   │   └── schemas/        # 옵션 스키마
│   ├── pages/              # Astro 페이지
│   ├── i18n/               # 다국어 지원
│   └── types/              # TypeScript 타입
├── tests/
│   ├── unit/               # Vitest 단위 테스트
│   └── e2e/                # Playwright E2E 테스트
├── .claude/                # AI 하네스 시스템
└── public/                 # 정적 자산
```

## 기여하기

이 프로젝트는 AI-Driven 개발 방식을 실험하고 있습니다. 기여 시 `.claude/` 디렉토리의 하네스 문서를 참고해 주세요.

1. 이슈를 먼저 생성하여 논의
2. 포크 후 기능 브랜치에서 작업
3. PR 생성 (`.claude/conventions/templates/pr-template.md` 참고)
