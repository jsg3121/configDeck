# qa/

QA(품질 검증) 관련 하네스를 정의하는 폴더이다.

## 이 폴더의 역할

- QA 리포트 템플릿 및 가이드라인 제공
- qa-agent의 검증 프로세스 표준화
- 품질 기준 및 통과 조건 정의

## 폴더 구조

```
qa/
├── index.md              # 이 파일. QA 하네스 개요
├── templates/            # 리포트 템플릿
│   └── report.md         # QA 리포트 템플릿
├── guides/               # QA 가이드라인
│   └── quality-gates.md  # 품질 게이트 기준
└── reports/              # 생성된 QA 리포트 (gitignore)
```

## QA 파이프라인

```
┌─────────────────────────────────────────────────────────────┐
│                      qa-agent                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│   │  unit-tester  │  │  e2e-tester   │  │static-analyzer│  │
│   │    Vitest     │  │  Playwright   │  │ ESLint/TS     │  │
│   └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
│                         ▼                                   │
│              ┌─────────────────────┐                        │
│              │    QA 리포트 생성    │                        │
│              │  qa/reports/*.md    │                        │
│              └─────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 테스트 종류

| 종류 | 도구 | 담당 에이전트 | 대상 |
|------|------|---------------|------|
| 단위 테스트 | Vitest | unit-tester | 설정 생성 로직, 유틸리티 |
| E2E 테스트 | Playwright | e2e-tester | 페이지, 사용자 플로우 |
| 정적 분석 | ESLint/TS | static-analyzer | 코드 품질, 타입 안전성 |

## 이슈 심각도

| 심각도 | 기호 | 기준 | PR 병합 |
|--------|------|------|---------|
| 심각 | 🔴 | 기능 동작 불가, 빌드 실패 | 차단 |
| 권장 | 🟡 | 품질 저하, 잠재적 문제 | 권고 수정 |
| 참고 | 🔵 | 개선 가능 | 선택적 |

## 품질 게이트

PR 병합 전 통과해야 하는 기준:

1. **빌드 성공**: `pnpm build` 에러 없음
2. **단위 테스트 통과**: `pnpm test` 전체 통과
3. **E2E 테스트 통과**: `pnpm test:e2e` 전체 통과
4. **린트 통과**: `pnpm lint` 에러 없음
5. **타입 검사 통과**: `pnpm astro check` 에러 없음

## QA 실행 방법

### 전체 QA

```
qa-agent를 호출하여 전체 검증 실행
```

### 개별 테스트

```bash
# 단위 테스트
pnpm test

# E2E 테스트
pnpm build && pnpm test:e2e

# 정적 분석
pnpm lint && pnpm format:check && pnpm astro check
```

## 관련 문서

- `tests/index.md` — 테스트 폴더 구조 및 작성 가이드
- `.claude/agents/qa-agent.md` — qa-agent 정의
- `.claude/agents/unit-tester.md` — 단위 테스트 에이전트
- `.claude/agents/e2e-tester.md` — E2E 테스트 에이전트
- `.claude/agents/static-analyzer.md` — 정적 분석 에이전트
