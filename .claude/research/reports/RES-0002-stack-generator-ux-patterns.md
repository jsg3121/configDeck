# RES-0002: 스택 단위 설정 파일 생성기 UX 패턴 조사

- **조사일**: 2026-04-13
- **목적**: 여러 설정 파일(config files)을 프레임워크/스택 단위로 한 번에 생성하는 개발자 도구의 UX 패턴을 분석하여, ConfigDeck 스택 생성기의 UX 설계 근거로 활용

---

## 요약

7개 서비스를 조사한 결과, 스택/프레임워크 단위 프로젝트 생성 도구의 UX 패턴은 크게 4가지로 분류된다:

1. **단일 폼 + 실시간 미리보기**: 한 페이지에서 옵션을 선택하면 즉시 결과를 보여주는 방식 (createapp.dev, PureDevTools)
2. **메타데이터 폼 + 검색 기반 의존성 선택**: 프로젝트 기본 정보를 입력하고, 의존성/기능을 검색으로 추가하는 방식 (Spring Initializr)
3. **CLI 대화형 프롬프트**: 터미널에서 순차적 질문에 응답하며 프로젝트를 구성하는 방식 (Create T3 App, Yeoman)
4. **IDE 통합 폼**: 에디터 내에서 시각적 폼으로 생성 명령을 실행하는 방식 (Nx Console)

ConfigDeck은 "스택 기반 다중 설정 파일 생성"이라는 고유한 포지션이므로, **단일 폼 + 파일 트리 + 실시간 미리보기** 조합이 가장 적합하다. 특히 createapp.dev의 파일 트리 탐색 패턴과 PureDevTools의 프리셋 + 세부 옵션 패턴을 결합하는 것을 추천한다.

---

## 서비스별 분석

### 1. Spring Initializr (start.spring.io)

- **URL**: [start.spring.io](https://start.spring.io/)
- **유형**: Java/Spring 프로젝트 생성기
- **스택/프레임워크 선택 방식**: 라디오 버튼(빌드 도구: Maven/Gradle, 언어: Java/Kotlin/Groovy), 드롭다운(Spring Boot 버전)
- **옵션 표시 방식**: 단일 폼. 좌측에 프로젝트 메타데이터(Group, Artifact, Name, Description, Package name, Packaging, Java version), 우측에 의존성 검색 패널. "ADD DEPENDENCIES" 버튼으로 검색 모달을 열어 카테고리별 의존성을 탐색/추가
- **파일별 커스터마이즈**: 불가. 프리셋 기반으로 프로젝트 구조를 통째로 생성. 개별 설정 파일의 세부 옵션 조정 기능 없음
- **미리보기 방식**: 미리보기 없음. "Explore" 버튼으로 생성될 프로젝트 구조를 트리 형태로 확인 가능하나 파일 내용은 볼 수 없음
- **다운로드 방식**: "GENERATE" 버튼 클릭 시 ZIP 파일 다운로드. 단축키 Ctrl+Enter 지원
- **특이사항**: 2026년 기준 TUI(Terminal UI) 버전도 출시됨. Tambu UI + GraalVM 기반으로 터미널에서도 동일한 경험 제공. 이전 설정을 기억하는 기능 포함

### 2. Create T3 App (create.t3.gg)

- **URL**: [create.t3.gg](https://create.t3.gg/)
- **유형**: Next.js 풀스택 프로젝트 생성기
- **스택/프레임워크 선택 방식**: 웹 UI 없음. CLI에서 Clack 프롬프트 라이브러리를 사용한 대화형 질문 방식. 각 기술(Prisma, Tailwind, tRPC 등)을 개별적으로 선택/해제
- **옵션 표시 방식**: CLI 순차 프롬프트. 이전 선택에 따라 조건부 프롬프트 표시 (예: DB 선택 시에만 dbProvider 질문 등장)
- **파일별 커스터마이즈**: 불가. "Take what you want and nothing more" 철학으로 모듈 단위 on/off만 가능. 개별 설정 파일의 옵션 조정 불가
- **미리보기 방식**: 없음. 생성 후 직접 확인
- **다운로드 방식**: CLI로 로컬 디렉토리에 직접 생성. `npm create t3-app@latest` 명령어 사용
- **특이사항**: 비대화형 모드(CI용)도 지원. 플래그로 모든 옵션을 지정 가능

### 3. createapp.dev

- **URL**: [createapp.dev](https://createapp.dev/)
- **유형**: Webpack/Parcel/Snowpack 설정 생성기
- **스택/프레임워크 선택 방식**: 로고 카드 형태로 번들러(webpack, Parcel, Snowpack) 선택. 메인 라이브러리(No library, React, Svelte, Vue)도 카드/아이콘으로 선택
- **옵션 표시 방식**: 단일 폼 + 파일 트리 + 코드 미리보기. 상단에 라이브러리/번들러 선택 카드, 중간에 "+" 버튼으로 기능 추가(UI library, Test framework, Transpiler, Styling, Image handling, Utilities, Linting, Optimization, Plugins), 하단에 생성된 파일 트리와 코드 미리보기
- **파일별 커스터마이즈**: 제한적. 기능 토글 수준의 on/off만 가능하며, 생성된 설정 파일의 세부 옵션 수정은 불가
- **미리보기 방식**: 실시간. 옵션 변경 시 파일 트리와 코드 미리보기가 즉시 업데이트. 파일 트리에서 파일을 클릭하면 해당 파일의 내용을 코드 블록으로 표시
- **다운로드 방식**: "Download project" 버튼으로 ZIP 파일 다운로드
- **특이사항**: **ConfigDeck 스택 생성기와 가장 유사한 구조**. 여러 설정 파일을 한 번에 생성하고, 파일 트리로 탐색하며, 각 파일의 내용을 미리볼 수 있음. 생성 파일 수: 약 6개(dist/index.html, src/index.js, .gitignore, README.md, package.json, webpack.config.js)

### 4. Astro (astro.new / astro.build)

- **URL**: [astro.new](https://astro.new/)
- **유형**: Astro 프로젝트 템플릿 선택기
- **스택/프레임워크 선택 방식**: 카드 그리드. 각 템플릿(Just the Basics, Blog, Starlight, Starlog, Portfolio, Empty Project)이 프리뷰 이미지와 제목이 있는 카드로 표시
- **옵션 표시 방식**: 템플릿 선택 전용 UI. 카테고리 탭(Getting Started, Frameworks, Integrations, Templates)으로 분류
- **파일별 커스터마이즈**: 불가. 템플릿 선택만 가능하며 커스터마이징 없음
- **미리보기 방식**: 각 템플릿마다 "Preview" 링크로 라이브 미리보기 제공
- **다운로드 방식**: 3가지 경로 — CLI 명령어 복사, 온라인 에디터에서 열기(StackBlitz, Firebase Studio, CodeSandbox), GitHub 소스 코드 확인
- **특이사항**: 생성기가 아닌 템플릿 갤러리에 가까움. 커스터마이징보다 빠른 시작에 초점

### 5. Nx Console (nx.dev)

- **URL**: [nx.dev](https://nx.dev/) / VSCode/JetBrains 확장
- **유형**: 모노레포 생성기 (IDE 확장)
- **스택/프레임워크 선택 방식**: IDE 내 시각적 폼. Command Palette(`Shift+Cmd+P` → `nx: generate (ui)`)로 생성기 목록을 표시하고, 생성기를 선택하면 해당 스키마 기반의 폼이 나타남
- **옵션 표시 방식**: 스키마 기반 자동 생성 폼. 생성기가 정의한 JSON Schema에서 필수/선택 필드를 자동으로 추출하여 폼 UI로 렌더링
- **파일별 커스터마이즈**: 생성기 스키마 수준의 옵션만 조정 가능. 생성될 파일의 세부 내용을 직접 수정하는 기능은 없음
- **미리보기 방식**: **Dry-run 미리보기**. 폼 값 변경 시 자동으로 `--dry-run` 모드를 실행하여 터미널에 영향받는 파일 목록을 표시. 실제 파일 변경 전에 결과를 확인 가능
- **다운로드 방식**: IDE 내에서 직접 파일 생성. 다운로드 개념이 아닌 워크스페이스 내 코드 생성
- **특이사항**: 2026년 기준 MCP(Model Context Protocol) 서버 도입. AI 에이전트에게 워크스페이스 구조, 프로젝트 의존성, 태스크 설정 등의 컨텍스트를 제공. Q1 2026 로드맵에 Claude Code 플러그인 포함

### 6. Yeoman (yeoman.io)

- **URL**: [yeoman.io](https://yeoman.io/)
- **유형**: 프로젝트 스캐폴딩 프레임워크
- **스택/프레임워크 선택 방식**: CLI 전용. `yo` 명령어 실행 시 설치된 생성기 목록에서 선택. 5,600개 이상의 커뮤니티 생성기 중 선택
- **옵션 표시 방식**: Inquirer.js 기반 대화형 프롬프트. 생성기마다 고유한 질문 세트를 정의하며, 텍스트 입력, 리스트 선택, 체크박스, 확인(Y/N) 등 다양한 프롬프트 타입 지원
- **파일별 커스터마이즈**: 생성기가 정의한 프롬프트 범위 내에서만 가능. 생성기마다 커스터마이즈 수준이 다름
- **미리보기 방식**: 없음. 생성 후 직접 확인
- **다운로드 방식**: CLI로 로컬 디렉토리에 직접 생성. 빌드 도구 설정과 패키지 매니저 의존성을 함께 설치
- **특이사항**: UI 어댑터 추상화 레이어가 있어 IDE나 웹 UI에서도 동일한 생성기를 실행할 수 있는 구조. 하지만 실제로 웹 UI 어댑터는 널리 사용되지 않음

### 7. PureDevTools (puredevtools.tools)

- **URL**: [puredevtools.tools](https://puredevtools.tools/)
- **유형**: 488개 이상의 개발자 도구 모음 (TSConfig, ESLint, Prettier, Vite, EditorConfig 등 설정 생성기 포함)

#### TSConfig Generator
- **스택/프레임워크 선택 방식**: 수평 버튼 탭(React, Node.js, Library, Next.js)으로 프리셋 선택
- **옵션 표시 방식**: 섹션별 구분. Compiler Options(드롭다운: target, module, jsx), Strict Mode(토글 스위치), Path Options(텍스트 입력 + 동적 추가 버튼), Declaration & Source Maps(토글), Include/Exclude(glob 패턴 입력). 아코디언 접기/펼침 없이 전체 섹션이 노출
- **파일별 커스터마이즈**: 가능. 모든 옵션을 개별적으로 세밀하게 조정 가능
- **미리보기 방식**: 실시간. 옵션 변경 시 즉시 tsconfig.json 미리보기 업데이트
- **다운로드 방식**: Copy 버튼(클립보드 복사) + Reset 버튼. 파일 다운로드는 없음
- **레이아웃**: 단일 컬럼 폼 + 하단 미리보기

#### ESLint Config Generator
- **스택/프레임워크 선택 방식**: 토글 버튼(설정 형식: .eslintrc.json vs eslint.config.js), 드롭다운/라디오(프레임워크: Vanilla JS/TS, React, Vue, Next.js)
- **옵션 표시 방식**: 섹션별 구분. Format & Framework, Environments(체크박스), Rule Categories(Possible Errors, Best Practices, Stylistic, ES6+), Plugins(체크박스: TypeScript, React, Import, Prettier), Ignore Patterns(텍스트 영역)
- **파일별 커스터마이즈**: 가능. 룰 카테고리와 플러그인을 개별 선택
- **미리보기 방식**: 실시간. 설정 변경 시 자동으로 코드 출력 업데이트
- **다운로드 방식**: Copy 버튼 + npm install 명령어 Copy
- **레이아웃**: 상단 컨트롤 → 하단 코드 출력의 수직 흐름

- **특이사항**: "Every tool runs in your browser. Nothing is uploaded. Ever." — 완전한 클라이언트 사이드 처리. Command Palette(Cmd+K)로 도구 검색 가능. 개별 설정 파일 생성기는 독립적으로 존재하며 스택 단위 통합 생성 기능은 없음

---

## UX 패턴 비교표

| 항목 | Spring Initializr | Create T3 App | createapp.dev | Astro | Nx Console | Yeoman | PureDevTools |
|------|-------------------|---------------|---------------|-------|------------|--------|-------------|
| **인터페이스** | 웹 UI | CLI | 웹 UI | 웹 UI | IDE 확장 | CLI | 웹 UI |
| **스택 선택** | 라디오 + 드롭다운 | CLI 프롬프트 | 카드/아이콘 | 카드 그리드 | 폼 (스키마 기반) | CLI 프롬프트 | 버튼 탭 (프리셋) |
| **옵션 표시** | 단일 폼 + 검색 모달 | 순차 프롬프트 | 단일 폼 + 파일 트리 | 템플릿 카드 | 스키마 기반 폼 | 순차 프롬프트 | 섹션별 폼 |
| **파일별 커스터마이즈** | 불가 | 불가 | 제한적 (토글) | 불가 | 제한적 (스키마) | 생성기 의존 | **가능** (세밀 조정) |
| **미리보기** | 프로젝트 구조만 | 없음 | **실시간 코드** | 라이브 프리뷰 | Dry-run (파일 목록) | 없음 | **실시간 코드** |
| **다운로드** | ZIP | CLI 로컬 생성 | ZIP | CLI/에디터/코드 | IDE 내 생성 | CLI 로컬 생성 | 클립보드 복사 |
| **다중 파일 생성** | O (프로젝트 전체) | O (프로젝트 전체) | **O (파일 트리)** | O (템플릿 전체) | O (생성기 단위) | O (생성기 단위) | X (파일별 독립) |
| **조건부 옵션** | X | **O** (이전 선택 기반) | O (기능 추가 방식) | X | O (스키마 기반) | O (프롬프트 기반) | X |

---

## ConfigDeck 스택 생성기에 적용할 수 있는 추천 패턴

### 핵심 벤치마크: createapp.dev

createapp.dev는 ConfigDeck의 스택 생성기와 가장 유사한 구조를 가진다. 핵심 차이는:
- createapp.dev: 번들러 중심으로 프로젝트 전체를 생성 (설정 파일 + 소스 코드)
- ConfigDeck: 스택 기반으로 설정 파일만 조합/생성 (소스 코드 없음)

따라서 createapp.dev의 패턴을 기본 골격으로 삼되, PureDevTools의 파일별 세밀 조정 기능을 결합하는 것이 적합하다.

### 추천 패턴 1: 스택 선택 UI

| 비교 대상 | 패턴 | 추천 여부 |
|-----------|------|-----------|
| Spring Initializr | 라디오 + 검색 모달 | 의존성이 수백 개일 때 적합. ConfigDeck은 설정 파일 수가 적으므로 과함 |
| createapp.dev | 카드/아이콘 선택 | **추천**. 시각적으로 명확하고 선택지가 제한적일 때 효과적 |
| Astro | 카드 그리드 (템플릿) | 프리셋 페이지에 적합. 스택 생성기 자체보다는 프리셋 선택에 활용 |
| PureDevTools | 수평 버튼 탭 | **추천**. 프리셋 전환에 적합. 컴팩트하고 전환이 빠름 |

**추천**: 프리셋 선택은 **수평 버튼 탭** (PureDevTools), 개별 설정 파일 추가/제거는 **카드/아이콘 토글** (createapp.dev) 방식 조합

### 추천 패턴 2: 다중 파일 옵션 표시

| 비교 대상 | 패턴 | 추천 여부 |
|-----------|------|-----------|
| createapp.dev | 단일 폼 + 파일 트리 | **핵심 참고**. 좌측에 옵션, 하단에 파일 트리와 미리보기 |
| PureDevTools | 섹션별 폼 (단일 파일) | 파일별 상세 옵션 UI에 참고 |
| Spring Initializr | 폼 + 검색 모달 | ConfigDeck 규모에는 과함 |
| Nx Console | 스키마 기반 자동 폼 | 기술적으로 참고. ConfigDeck의 옵션 스키마에서 폼을 자동 생성하는 아이디어 |

**추천**: createapp.dev 스타일의 **좌측 옵션 패널 + 우측 파일 트리/미리보기** 분할 레이아웃. 파일 트리에서 파일을 선택하면 해당 파일의 옵션 폼 또는 미리보기로 전환

### 추천 패턴 3: 파일별 커스터마이즈

| 비교 대상 | 패턴 | 추천 여부 |
|-----------|------|-----------|
| PureDevTools | 프리셋 → 세부 옵션 조정 | **핵심 참고**. 프리셋으로 빠른 시작, 세부 옵션으로 미세 조정 |
| createapp.dev | 기능 토글만 (세부 조정 불가) | ConfigDeck은 이보다 더 세밀한 조정 필요 |
| Create T3 App | 모듈 on/off만 | ConfigDeck의 차별점이 될 수 없음 |

**추천**: **2단계 플로우** — (1) 스택 프리셋 선택으로 기본 설정 파일 세트 생성 → (2) 파일별 세부 옵션 조정 (PureDevTools 스타일 폼)

### 추천 패턴 4: 미리보기

| 비교 대상 | 패턴 | 추천 여부 |
|-----------|------|-----------|
| createapp.dev | 파일 트리 + 코드 미리보기 | **핵심 참고**. 파일별로 생성될 코드를 실시간으로 확인 |
| PureDevTools | 실시간 코드 미리보기 | **필수 적용**. 옵션 변경 즉시 결과 반영 |
| Nx Console | Dry-run (파일 목록) | 보조 기능으로 참고. 생성될 파일 목록 표시 |
| Spring Initializr | 프로젝트 구조 탐색 | 파일 트리 구조 표시에 참고 |

**추천**: createapp.dev + PureDevTools 조합 — **파일 트리에서 파일을 선택하면 실시간 코드 미리보기를 표시**. 구문 강조(Syntax Highlighting) 필수

### 추천 패턴 5: 다운로드

| 비교 대상 | 패턴 | 추천 여부 |
|-----------|------|-----------|
| createapp.dev | ZIP 다운로드 | **추천**. 여러 파일을 한 번에 받을 때 가장 직관적 |
| PureDevTools | 클립보드 복사 | **추천 (병행)**. 단일 파일만 빠르게 복사할 때 유용 |
| Astro | CLI 명령어 복사 | 보조 기능으로 제공 가능 |

**추천**: **ZIP 다운로드(기본) + 파일별 클립보드 복사(보조)** 병행

### 추천 패턴 6: 조건부 옵션 (Create T3 App에서 차용)

Create T3 App의 "이전 선택에 따라 다음 옵션이 달라지는" 패턴은 ConfigDeck에도 적용 가능하다. 예를 들어:
- TypeScript를 선택하면 tsconfig.json 옵션이 추가됨
- ESLint를 선택하면 Prettier와의 연동 옵션이 나타남
- React를 선택하면 JSX 관련 ESLint 규칙이 자동 활성화됨

---

## 종합 추천 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│  스택 프리셋 선택 (수평 버튼 탭)                          │
│  [React + TS] [Vue + TS] [Node.js] [Next.js] [Custom]  │
├──────────────────────┬──────────────────────────────────┤
│  설정 파일 목록       │  미리보기 / 옵션 패널             │
│  ┌────────────────┐  │  ┌────────────────────────────┐  │
│  │ ☑ .prettierrc  │  │  │  [미리보기] [옵션]  (탭)    │  │
│  │ ☑ tsconfig.json│  │  │                            │  │
│  │ ☑ .eslintrc    │  │  │  {                          │  │
│  │ ☐ .editorconfig│  │  │    "semi": true,            │  │
│  │ ☐ .gitignore   │  │  │    "tabWidth": 2,           │  │
│  │                │  │  │    "singleQuote": true       │  │
│  │ [+ 파일 추가]   │  │  │  }                          │  │
│  └────────────────┘  │  │                            │  │
│                      │  │  [Copy]                     │  │
│                      │  └────────────────────────────┘  │
├──────────────────────┴──────────────────────────────────┤
│  [ZIP 다운로드]  [개별 파일 복사]                         │
└─────────────────────────────────────────────────────────┘
```

### 핵심 UX 원칙

1. **프리셋 우선, 세부 조정 가능** (PureDevTools + createapp.dev): 빠른 시작과 세밀한 커스터마이즈를 모두 지원
2. **실시간 피드백** (PureDevTools): 옵션 변경 즉시 미리보기 반영
3. **파일 단위 탐색** (createapp.dev): 생성될 파일 목록을 트리로 보여주고, 클릭하면 내용 확인
4. **조건부 옵션** (Create T3 App): 스택/파일 선택에 따라 관련 옵션만 표시
5. **클라이언트 전용 처리** (PureDevTools): 서버 전송 없이 브라우저에서 모든 생성 처리
6. **다중 다운로드 방식** (createapp.dev + PureDevTools): ZIP 전체 다운로드와 파일별 복사 병행

---

## 참고 자료

- [Spring Initializr](https://start.spring.io/) — 프로젝트 메타데이터 + 의존성 검색 패턴
- [Spring Initializr TUI Blog](https://www.danvega.dev/blog/2026/03/14/spring-initializr-tui) — 터미널 UI 구현 사례
- [Create T3 App](https://create.t3.gg/) — 모듈식 CLI 대화형 프롬프트
- [Create T3 App CLI Usage (DeepWiki)](https://deepwiki.com/t3-oss/create-t3-app/2.2-cli-usage-and-options) — CLI 옵션 상세
- [createapp.dev](https://createapp.dev/) — 다중 파일 생성 + 파일 트리 + 실시간 미리보기
- [Astro Templates](https://astro.new/) — 카드 그리드 기반 템플릿 선택
- [Nx Console](https://nx.dev/) — IDE 통합 스키마 기반 폼 + Dry-run 미리보기
- [Nx Console Generate Command](https://nx.dev/docs/guides/nx-console/console-generate-command) — 생성 UI 상세
- [Nx Console VSCode Extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) — 확장 기능 상세
- [Yeoman](https://yeoman.io/) — Inquirer.js 기반 CLI 프롬프트 + UI 어댑터 추상화
- [Yeoman User Interactions](https://yeoman.io/authoring/user-interactions.html) — 프롬프트 타입 상세
- [PureDevTools](https://puredevtools.tools/) — 클라이언트 전용 도구 모음
- [PureDevTools TSConfig Generator](https://puredevtools.tools/tsconfig-generator/) — 프리셋 + 세부 옵션 + 실시간 미리보기
- [PureDevTools ESLint Generator](https://puredevtools.tools/eslint-config-generator/) — 섹션별 폼 + 실시간 미리보기
