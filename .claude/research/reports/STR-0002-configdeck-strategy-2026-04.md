# STR-0002: ConfigDeck 시장 진입 및 성장 전략 (2026-04)

- 수립일: 2026-04-24
- 최종 수정: 2026-05-04
- 에이전트: strategy-planner
- 참조: MI-0002, BA-0002, ADR-0014, ADR-0017/0018/0019, SPEC-0003 (Shareable URL), SPEC-0004 (Import & Audit), SPEC-0005 (AI 도구 설정 파일 + Agent Skills)

---

## 상황 요약 (Context)

### 핵심 시장 기회

- **경쟁 공백**: 스택 기반 복수 파일 조합 생성기가 시장에 없음
- **ESLint v9 전환 수요**: flat config 마이그레이션 수요 집중
- **다국어 공백**: 영어권 경쟁자가 한국어/일본어 미지원
- **AI 도구 설정 파일**: .cursorrules, copilot-instructions.md 등 신규 수요
- **Gist 복붙 관행 대체**: 구조화된 도구로 대체 가능

### 핵심 위협

- AI 코드 생성 도구의 대체재 압력
- Zero-config 트렌드 (Biome, Oxc)
- 복제 용이성 (진입 장벽 낮음)
- 전환 비용 0 (사용자 이탈 용이)

### 자사 강점

- S1: 스택 기반 복수 파일 조합 — 시장 유일
- S2: ESLint v9 마이그레이션 기능 내장
- S3: SEO 최적화 IA 설계
- S4: 다국어 지원 (한/영)
- S5: 운영비 0원 (Cloudflare Pages)

### 제약 조건

- 1인 운영 체계 — 콘텐츠 업데이트 속도 한계
- 신규 도메인 — SEO 신뢰도 0에서 시작
- 저장/공유/재방문 메커니즘 MVP 미포함

---

## 전략 옵션

| 옵션 | 방향 | 전제 조건 | 리스크 | 기대 효과 |
|------|------|----------|--------|----------|
| A | SEO 선점 집중 (ESLint v9 수요 포착) | 아티클 10건+, 마이그레이션 기능 MVP | 수요 일시적, 콘텐츠 노후화 | 6개월 내 유기 검색 트래픽 확보 |
| B | AI 도구 설정 파일 선점 | AI 도구 스펙 안정화, 키워드 수요 검증 | 스펙 불안정, 키워드 미성숙 | 블루오션 선점, AI 개발자 유입 |
| C | 한/일 다국어 SEO 집중 | 일본어 번역 품질 확보, 커뮤니티 채널 | 번역 리스크, 1인 운영 부담 | 롱테일 키워드 독점, 아시아 레퍼런스 |

---

## 권고 방향

### 권고 옵션: A + B 복합

**이유**: 
- A만: ESLint v9 전환 완료 후 유입 급감
- B만: 키워드 성숙 전 초기 트래픽 없음
- C: 번역 품질 확보 수단 없이 리스크 과대

A+B 복합 전략은 단기(ESLint v9 수요)와 중기(AI 도구 설정 파일)를 동시에 커버한다.

**핵심 포지셔닝**: "개발자가 새 프로젝트를 시작할 때, 그리고 기존 설정을 최신화할 때 매번 돌아오는 도구"

---

## 실행 로드맵

> **진행 상황 업데이트**: 2026-05-04 기준 (1.5.0 릴리즈 완료)

| 기간 | 항목 | 우선순위 | 상태 |
|------|------|----------|------|
| **P0 (MVP)** | 파일별 생성기 9종 (ESLint, Prettier, TSConfig, Vite, Vitest, Next.js, EditorConfig, .env.example, .gitignore) | P0 | ✅ 완료 |
| | 스택 프리셋 4개 | P0 | ✅ 완료 |
| | ESLint v9 마이그레이션 UI | P0 | ✅ 완료 |
| | 아티클 페이지 (66건) | P0 | ✅ 완료 |
| | 한국어/영어 i18n | P0 | ✅ 완료 |
| | SEO 메타 (JSON-LD/OG/hreflang) | P0 | ✅ 완료 |
| | Shareable URL (SPEC-0003) | P0 | ✅ 완료 (1.2.0) |
| **P0.5 (60일)** | Import & Audit 기능 (SPEC-0004) | P0.5 | ✅ 완료 (1.3.0/1.4.0 — ESLint/Prettier/TSConfig 3종 + 마이그레이션 허브) |
| | Tailwind config 생성기 | P1 | 미착수 |
| | Husky + lint-staged + commitlint | P1 | 미착수 |
| | GitHub Actions 워크플로우 | P1 | 미착수 |
| | 옵션별 툴팁 설명 | P1 | 미착수 |
| **P1 (90일)** | AI 도구 설정 파일 생성기 (SPEC-0005 Phase A) | P1 | ✅ 완료 (1.5.0 — AGENTS.md/Cursor MDC/Copilot/CLAUDE.md + Agent Skills 8종 + 카탈로그 허브 + 5개 SEO 랜딩) |
| | SPEC-0005 Phase B (Copilot path-specific, Cursor MDC 사용자 토픽 지정, 스택별 Skills 확장, Shareable URL 연동) | P1 | 미착수 |
| | CLI (`npx configdeck init`) | P1 | 미착수 |
| | Popular choices 인디케이터 | P1 | 미착수 |
| **P1~P2 (장기)** | 일본어 지원 (SPEC-0005 Phase C 포함) | P1 | 미착수 |
| | OG 이미지 페이지별 분리 (1.5.0 후속) | P1 | 미착수 |
| | FAQPage/HowTo JSON-LD (1.5.0 후속, 5개 자식 랜딩) | P1 | 미착수 |
| | `?focus` 파라미터 E2E 테스트 (1.5.0 후속) | P1 | 미착수 |
| | VS Code Extension | P2 | 미착수 |
| | Product Hunt / HN 런칭 | P2 | 미착수 |
| | 사용자/팀 프리셋 저장 | P2 | 미착수 |

### 1.5.0 누적 완료 사항 (2026-05-04 기준)

P0 + P0.5 핵심 + **P1 핵심(AI 도구 설정 파일)**이 모두 완료되어 **MVP + 두 차례 확장 사이클이 마감**된 상태:

- **1.2.0** — 파일별 생성기 9종, 스택 프리셋, 아티클(66건), i18n, SEO 메타, **Shareable URL**
- **1.3.0** — Import & Audit Phase A/B (ESLint 마이그레이션 라이브러리 + 공통 Inspector 인터페이스 + Audit-only 흐름 + E2E)
- **1.4.0** — Import & Audit Phase C (Prettier/TSConfig 인스펙터 + 마이그레이션 허브 페이지 + 도구 유형 검증 + SEO 보강)
- **1.5.0** — SPEC-0005 Phase A: AI 도구 설정 파일 생성기 (AGENTS.md/Cursor MDC/Copilot instructions/CLAUDE.md) + Agent Skills SKILL.md 8종 + ADR-0019 IA 재설계(`/ai-config` 카탈로그 허브 + `/ai-config/generator` 통합 생성기 + `?focus` 파라미터) + 5개 도구별 SEO 랜딩 + i18n(Skills 8 / Best Practices 26 / Boundaries 15)

남은 우선순위 후보:

- **P0.5 잔여 4종** (스택 외연 확장): Tailwind, Husky+lint-staged+commitlint, GitHub Actions 워크플로우, 옵션 툴팁
- **SPEC-0005 Phase B** (1.5.0 모멘텀 유지): Copilot path-specific instructions, Cursor MDC 사용자 토픽 지정, 스택별 Skills 카탈로그 확장, Shareable URL 연동
- **P1 신규 채널**: CLI(`npx configdeck init`), Popular choices 인디케이터
- **1.5.0 후속**: OG 이미지 페이지별 분리, FAQPage/HowTo JSON-LD, `?focus` 파라미터 E2E
- **장기**: 일본어 지원(SPEC-0005 Phase C 포함), VS Code Extension, Product Hunt/HN 런칭

---

## 모니터링 지표 (KPI)

| 지표 | 현재값 | 30일 목표 | 90일 목표 | 주기 |
|------|--------|----------|----------|------|
| 유기 검색 클릭수 | 0 | 500/월 | 3,000/월 | 주간 |
| 색인 페이지 수 | 0 | 30 | 100 | 월간 |
| 파일 생성/다운로드 수 | 0 | 200/월 | 1,000/월 | 주간 |
| 아티클 게시 수 | 66건 | - | 100건 | 월간 |
| ESLint 마이그레이션 사용 | 0 | 100/월 | 500/월 | 월간 |
| Shareable URL 생성 수 | 0 | 50/월 | 300/월 | 월간 |
| 평균 세션 시간 | - | 2분+ | 3분+ | 월간 |
| 재방문율 | - | 측정 시작 | 20%+ | 월간 |
| 핵심 키워드 순위 | - | 색인 완료 | 10위 이내 | 월간 |

---

## 핵심 가정 및 리스크

| 가정 | 리스크 | 완화 방안 |
|------|--------|----------|
| ESLint v9 전환 수요 상반기 집중 | 이미 전환 완료 비율 높을 가능성 | 키워드 수요 주간 모니터링, 메시지 전환 |
| 신규 도메인 6개월 내 SEO 순위 달성 | 6~12개월 소요 가능 | 콘텐츠 품질 우선, 커뮤니티 초기 노출 병행 |
| AI 도구 스펙 3개월 내 안정 유지 | 스펙 변경 시 즉시 구식 | 스펙 변경 알림, "최종 확인일" 표시 |
| 1인 운영 월 5~10건 아티클 생산 | 생산 속도 미달 | AI 요약 자동화 파이프라인 조기 가동 |
| URL 공유 기능이 재방문 유도 | 공유 없으면 단발 사용 | ✅ 1.2.0 구현 완료. 재방문율 KPI로 가설 검증 단계 |
| AI 도구 설정 파일 수요가 키워드까지 성숙 | 키워드 미성숙 시 1.5.0 유입 지연 | ✅ 1.5.0 출시(2026-05-02) 완료. RES-0003 §3.1 키워드 성숙도 모니터링으로 가설 검증 단계 |
| 일본어 LLM 번역 품질 충분 | 부자연스러움, 오역 | 네이티브 검수 필수, 품질 미달 시 출시 보류 |
| Zero-config 2년 내 주류 아님 | ESLint/Prettier 사용 급감 | Biome 생성기 중기 로드맵 포함 |

---

## 미결 질문 대응

| 질문 | 판단 |
|------|------|
| 콘텐츠 업데이트 체계 | ADR-0011 AI 자동화 즉시 가동, 그 전까지 월 2회 수동 |
| 출시 타이밍 | 지금이 최적. MVP 완성 즉시 출시, 미완성은 점진 추가 |
| 재방문 메커니즘 | ✅ Shareable URL 1.2.0 구현 완료. KPI 모니터링 단계로 전환 |
| AI 포지셔닝 | "대안"이 아닌 "AI 도구와 함께 쓰는 보완재" |
| 수익화 시점 | 10K MAU 달성 후. 조기 수익화 압박 없음 |
| 일본어 진입 조건 | 네이티브 검수 + 한국어 1,000/월 트래픽 달성 후 |

---

## 참고 자료

- ConfigDeck 서비스 기획서: `.claude/ia/specs/configDeckIA.md`
- MI-0002: 경쟁사 분석
- BA-0002: 경쟁력 분석
- ADR-0010 (아티클 콘텐츠 전략), ADR-0011 (AI 요약 자동화)
- ADR-0017 (AI 도구 설정 파일 형식 우선순위), ADR-0018 (Agent Skills 카탈로그), ADR-0019 (AI Config IA 재설계)
- SPEC-0002 (개발 도구 아티클 페이지)
- SPEC-0005 (AI 도구 설정 파일 + Agent Skills 생성기) — Phase A 1.5.0 완료, Phase B/C 잔여
- RES-0003 (AI 코딩 도구 설정 파일 생성기 시장 리서치)

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|------|
| 2026-04-24 | 초안 수립 (P0/P0.5/P1/P2 로드맵, KPI, 가정/리스크 정의) |
| 2026-04-30 | 1.4.0 릴리즈 반영 (P0.5 Import & Audit 완료) |
| 2026-05-04 | 1.5.0 릴리즈 반영. P1 "AI 도구 설정 파일 생성기"를 ✅ 완료 처리(SPEC-0005 Phase A, ADR-0017/0018/0019). 9종 생성기 정확 명칭 보정(Tailwind 미포함 — 이전 SPEC 기록 오류 수정). SPEC-0005 Phase B/C와 1.5.0 후속 작업(OG 이미지/FAQ·HowTo JSON-LD/`?focus` E2E)을 잔여 항목으로 분리. 가정·리스크 표에 "AI 도구 설정 파일 키워드 수요 성숙" 행 추가하고 가설 검증 단계로 전환. 참조 ADR/SPEC 목록 갱신. |
