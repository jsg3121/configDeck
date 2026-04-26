# ConfigDeck 서비스 기획서

> **최종 수정**: 2026-04-24
> **관련 ADR**: ADR-0006 (생성기 중심 IA 재설계), ADR-0007 (페이지 구조 재설계), ADR-0010 (아티클 콘텐츠 전략), ADR-0011 (AI 요약 자동화), ADR-0014 (서비스 성장 전략 및 통합 로드맵)

---

## 1. 서비스 개요

### 한 줄 소개

개발자가 프로젝트 시작 시 필요한 설정 파일을 스택 기반으로 조합·생성·다운로드할 수 있는 다국어 웹 서비스

### 핵심 가치

| 가치 | 설명 |
|------|------|
| **빠름** | 설정 파일을 검색하고 복붙하는 시간을 줄임 |
| **정확함** | 최신 스택 기준으로 파일 구조를 제공 |
| **조합 가능** | 체크박스와 프리셋으로 필요한 옵션만 반영 |
| **다국어 지원** | 해외 개발자도 쉽게 사용 가능 |

---

## 2. 타겟 사용자

- **주 타겟**: 프론트엔드 개발자, 신규 프로젝트를 자주 세팅하는 개발자
- **세부**: 주니어(프리셋+설명), 미드/시니어(직접 선택+미리보기), 프리랜서(프리셋+공유), 팀 리드(표준 세팅)
- **2차 타겟**: 백엔드, 모바일, 교육/부트캠프

---

## 3. MVP 범위

**지원 파일**: `.gitignore`, `.editorconfig`, `.env.example`, `tsconfig.json`, `eslint.config.mjs`, `prettier.config.mjs`, `vite.config.ts`, `vitest.config.ts`, `next.config.js`

**지원 기능**: 파일별 옵션 선택 + 실시간 미리보기, 프리셋 3~5개, 코드 복사/파일 다운로드/ZIP 다운로드, 영어/한국어

---

## 4. 핵심 기능

| 기능 | 설명 |
|------|------|
| 파일 생성 | 옵션 조합에 맞는 설정 파일 생성 (복사/다운로드/ZIP) |
| 옵션 조합 | 파일별 세부 옵션을 체크박스, 드롭다운, 토글 등으로 제공 |
| 프리셋 | React+Vite+TS, Next.js+TS, Astro+TS, Node.js+TS |
| 설명 | 각 옵션의 효과, 사용 환경, 충돌 여부, 권장 조합 안내 |
| 마이그레이션 | 레거시 설정 → 최신 형식 변환 (상세: `references/migration-spec.md`) |
| 다국어 | UI/설명/문서 번역, 생성 파일 내부는 원문 유지 |

---

## 5. IA (정보 구조)

> **변경 이력**: ADR-0006, ADR-0007에 의해 재설계

```
/{locale}
├─ /                              # 홈
├─ /generator                     # 생성기 허브
│  ├─ /{file-name}               # 파일별 생성기 (SEO 랜딩 겸용)
│  └─ /{stack-name}              # 스택별 생성기 (SEO 랜딩 겸용)
├─ /article                       # 개발 도구 아티클 (SPEC-0002)
│  └─ /{tool}                    # 도구별 필터 (eslint, prettier, typescript 등)
├─ /docs                          # 문서/가이드
└─ /blog                          # 블로그 (미구현, 추후 /article과 통합 검토)
```

페이지 구조 상세 → `references/page-structure.md`

---

## 6. 사용자 플로우

| 플로우 | 경로 |
|--------|------|
| A. 직접 생성 | 홈 → 생성기 허브 → 파일 카드 → 옵션 설정 ↔ 미리보기 → 복사/다운로드 |
| B. 프리셋 사용 | 홈 → 생성기 허브 → 스택 카드 → 옵션 조정 ↔ 파일 탭 미리보기 → ZIP 다운로드 |
| C. 검색 유입 | 검색 → `/generator/{file}` 직접 진입 → 옵션 → 다운로드 |
| D. 마이그레이션 | 생성기 페이지 마이그레이션 탭 → 파일 업로드 → diff 확인 → 다운로드 |

---

## 7. 기능 우선순위

> **변경 이력**: ADR-0014에 의해 로드맵 재정의 (2026-04-24)

| 단계 | 내용 | 상태 |
|------|------|------|
| **P0 (MVP)** | 홈, 생성기 허브, 파일별 생성기 9종, 스택별 프리셋 4개, ESLint 마이그레이션, 2분할 레이아웃, 복사/다운로드/ZIP, 영어/한국어, SEO 메타(JSON-LD/OG/hreflang), 아티클 페이지 | ✅ 완료 |
| **P0 (잔여)** | Shareable URL (옵션 상태를 URL로 인코딩하여 공유) | 미착수 |
| **P0.5 (60일)** | Import & Audit (기존 설정 파일 분석/진단), Tailwind config, Husky+lint-staged+commitlint, GitHub Actions 워크플로우, 옵션별 툴팁 | 미착수 |
| **P1 (90일)** | AI 도구 설정 파일 (.cursorrules, copilot-instructions.md, CLAUDE.md), CLI (`npx configdeck init`), Popular choices 인디케이터 | 미착수 |
| **P1 (장기)** | 일본어 지원 (네이티브 검수 후) | 미착수 |
| **P2** | VS Code Extension, Product Hunt/HN 런칭, 사용자/팀 프리셋 저장 | 미착수 |

---

## 8. 엣지케이스

옵션 충돌, 마이그레이션 예외, 빈 상태, 모바일 제약, URL/공유 링크 처리 규칙은 `references/edge-cases.md` 참조

---

## 참조 문서

| 문서 | 내용 |
|------|------|
| `references/page-structure.md` | 페이지별 레이아웃, 구성, 반응형 전략 상세 |
| `references/migration-spec.md` | 마이그레이션 기능 동작 흐름, 지원 시나리오, UI 구성 |
| `references/edge-cases.md` | 엣지케이스 및 예외 처리 규칙 |
| `features/SPEC-0002-dev-tools-article-page.md` | 개발 도구 아티클 페이지 기획 |
