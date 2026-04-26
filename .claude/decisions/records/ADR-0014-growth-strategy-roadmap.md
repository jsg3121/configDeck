# ADR-0014: 서비스 성장 전략 및 통합 로드맵

- 상태: 승인됨
- 날짜: 2026-04-24
- 최종 수정: 2026-04-26
- 의사결정자: jsg3121

## 맥락 (Context)

ConfigDeck의 시장 진입 및 성장 전략을 수립하기 위해 두 가지 독립적인 분석을 수행했다:

1. **MI-0002 → BA-0002 → STR-0002 파이프라인**: 경쟁사 분석, SWOT, 전략 옵션 도출
2. **외부 레퍼런스 기반 분석 보고서**: 기능 확장, 차별화 킬러 기능, UX/SEO/마케팅 채널 제안

두 분석의 공통점과 차이점을 통합하여 단일 실행 로드맵을 확정할 필요가 있다.

### 두 분석의 공통 발견

- 스택 기반 복수 파일 조합 생성기는 시장에 직접 경쟁자가 없음
- Shareable URL(재방문 메커니즘)이 현재 가장 큰 약점
- 다국어(한/일) SEO가 영어권 경쟁자 대비 차별화 기회
- ESLint v9 전환 수요가 단기 트래픽 유입 레버

### 외부 분석에서 추가된 핵심 인사이트

| 항목 | 내용 | 전략적 가치 |
|------|------|------------|
| Import & Audit | 기존 설정 파일 분석/진단 기능 | 사용자층을 "신규 프로젝트"에서 "기존 프로젝트 개선"으로 확장 |
| CLI 지원 | `npx configdeck init` | HN/Reddit 등 개발자 커뮤니티 반응 극대화, README 바이럴 |
| 지원 파일 확장 | Tailwind, Husky, GitHub Actions, Biome | 검색 롱테일 키워드 확보 |
| 옵션 설명 UX | 툴팁, Popular choices | 체류시간 증가, 학습 가치 제공 |
| 마케팅 채널 | Product Hunt, HN, GeekNews | 런칭 모멘텀 설계 |

## 결정 (Decision)

두 분석을 통합한 **수정 로드맵**을 채택한다. 핵심 변경점:

1. **Shareable URL을 P0로 격상** (기존 P1 → P0)
2. **Import & Audit 기능을 단기(60일) 목표로 신규 추가**
3. **CLI 지원을 중기(90일) 목표로 신규 추가**
4. **지원 파일 확장 (Tailwind, Husky, GitHub Actions)을 단기 목표로 추가**

### 통합 로드맵

> **진행 상황 업데이트**: 2026-04-26 기준

| 기간 | 항목 | 우선순위 | 상태 |
|------|------|----------|------|
| **P0 (MVP)** | 파일별 생성기 9종 | P0 | ✅ 완료 |
| | 스택 프리셋 4개 | P0 | ✅ 완료 |
| | ESLint v9 마이그레이션 UI | P0 | ✅ 완료 |
| | 아티클 페이지 (66건) | P0 | ✅ 완료 |
| | 한국어/영어 i18n | P0 | ✅ 완료 |
| | SEO 메타 (JSON-LD/OG/hreflang) | P0 | ✅ 완료 |
| | **Shareable URL** | P0 | **미착수** |
| **P0.5 (60일)** | **Import & Audit 기능** | P0.5 | 미착수 |
| | **Tailwind config 생성기** | P1 | 미착수 |
| | **Husky + lint-staged + commitlint 세트** | P1 | 미착수 |
| | **GitHub Actions 워크플로우 생성기** | P1 | 미착수 |
| | 옵션별 툴팁 설명 | P1 | 미착수 |
| **P1 (90일)** | AI 도구 설정 파일 생성기 | P1 | 미착수 |
| | **CLI (`npx configdeck init`)** | P1 | 미착수 |
| | Popular choices 인디케이터 | P1 | 미착수 |
| **P1~P2 (장기)** | 일본어 지원 (네이티브 검수 후) | P1 | 미착수 |
| | VS Code Extension | P2 | 미착수 |
| | Product Hunt / HN 런칭 | P2 | 미착수 |
| | 사용자/팀 프리셋 저장 | P2 | 미착수 |

### 서비스 정체성 전환

이 로드맵이 완료되면 ConfigDeck의 정체성이 전환된다:

- **현재**: "설정 파일 생성기" (신규 프로젝트 시작 시 1회 사용)
- **목표**: "설정 관리 허브" (신규 프로젝트 + 기존 프로젝트 개선 + 주기적 점검)

## 근거 (Rationale)

### 1. Shareable URL P0 격상

- 전환 비용 0인 서비스에서 재방문 메커니즘 없이는 SEO 투자 효과가 일회성
- 블로그/Stack Overflow/팀 위키에 링크가 퍼지면 SEO + 레퍼럴 복리 효과
- 구현 비용 대비 장기 ROI가 가장 높음

### 2. Import & Audit 기능 추가

- 현재는 "처음부터 만들기"만 지원 → 기존 프로젝트 사용자(다수)를 놓치고 있음
- "ConfigDeck으로 내 설정 점검해봤는데" 형태의 공유가 바이럴 트리거
- gitignore.io 등 단일 파일 생성기와의 결정적 차별점

### 3. CLI 지원 추가

- 개발자 커뮤니티(HN, Reddit)에서 CLI 도구가 웹 전용 도구보다 반응이 좋음
- README/팀 위키에 명령어가 퍼지면서 자체 확산
- 웹과 CLI 양쪽 채널에서 사용자 유입

### 4. 지원 파일 확장

- 검색 롱테일 키워드 확보 (tailwind config 생성기, husky 설정 등)
- 프론트엔드 개발자 대부분이 사용하는 도구 커버리지 확대
- 스택 프리셋의 완성도 향상

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| Import & Audit 없이 생성 기능만 강화 | 사용자층이 "신규 프로젝트 시작"에 한정되어 시장 규모 제한 |
| CLI 없이 웹 전용 유지 | 개발자 커뮤니티 바이럴 기회 상실, README 확산 불가 |
| Shareable URL을 P1 유지 | 재방문 메커니즘 없이 SEO 투자 효과 반감 |
| 일본어 지원을 앞당김 | 번역 품질 확보 수단 없이 진행 시 신뢰도 훼손 리스크 |

## 결과 (Consequences)

### 후속 조치

1. **SPEC 작성 필요**:
   - SPEC-0003: Import & Audit 기능
   - SPEC-0004: CLI (`npx configdeck`)
   - SPEC-0005: Tailwind/Husky/GitHub Actions 생성기

2. **기획서 업데이트**:
   - `configDeckIA.md`의 기능 우선순위(P0/P1/P2) 섹션 수정

3. **KPI 추가**:
   - Import & Audit 사용 수 (월간)
   - CLI 다운로드 수 (npm weekly downloads)
   - Shareable URL 생성 수 (월간)

### 리스크

| 리스크 | 완화 방안 |
|--------|----------|
| 1인 운영으로 60일 내 Import & Audit 구현 어려움 | MVP 범위 최소화 (ESLint만 먼저 지원) |
| CLI 유지보수 부담 증가 | 웹과 로직 공유, 생성 엔진 단일화 |
| 지원 파일 증가로 콘텐츠 노후화 가속 | ADR-0011 AI 자동화 파이프라인 조기 가동 |

## 참고 자료 (References)

- [MI-0002: 경쟁사 분석](.claude/research/reports/MI-0002-competitor-analysis-2026-04.md)
- [BA-0002: 경쟁력 분석](.claude/research/reports/BA-0002-configdeck-competitiveness-2026-04.md)
- [STR-0002: 전략 보고서](.claude/research/reports/STR-0002-configdeck-strategy-2026-04.md)
- ConfigDeck 성장전략 분석보고서 (외부 레퍼런스 기반)
- [ADR-0005: 공유 링크 기능](.claude/decisions/records/ADR-0005-share-link.md) — Shareable URL 관련 기존 결정
