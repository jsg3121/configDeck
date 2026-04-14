---
id: SPEC-0002
title: 개발 도구 아티클 페이지
status: 승인됨
owner: jsg3121
created: 2026-04-13
updated: 2026-04-13
related_adrs:
  - ADR-0010  # 아티클 콘텐츠 수집 및 갱신 전략
  - ADR-0011  # 아티클 AI 요약 자동화 전략 (Gemini API)
related_specs: []
---

# SPEC-0002: 개발 도구 아티클 페이지

## 1. 배경 (Background)

### 1.1 현재 상태

ConfigDeck은 현재 메인 홈과 설정 파일 생성기 페이지만 존재한다. 기존 IA에 `/blog`가 계획되어 있었으나, 구현되지 않은 상태이다.

### 1.2 문제점

1. **재방문 유인 부족**: 설정 파일 생성은 일회성 작업. 생성 후 재방문할 이유가 없다
2. **SEO 유입 한계**: 생성기 페이지만으로는 롱테일 키워드 커버리지가 제한적
3. **수익화 어려움**: 생성기 페이지에 광고를 과하게 넣으면 UX가 저하됨
4. **개발자 정보 접근성**: 도구별 업데이트 확인을 위해 여러 사이트를 방문해야 함

### 1.3 사용자 요구

- ConfigDeck이 제공하는 설정 파일(ESLint, Prettier, TypeScript 등)의 최신 업데이트/뉴스를 한 곳에서 확인하고 싶다
- 구글 애드센스 등 광고를 통한 수익화 가능한 콘텐츠 페이지 필요

## 2. 목표 (Goals)

### 2.1 달성하려는 것 (In Scope)

- `/article` 메인 피드 페이지 (전체 도구 최신 아티클 목록)
- `/article/{tool}` 도구별 하위 페이지 (7개 도구)
- RSS 자동 수집 + Gemini AI 요약 생성 파이프라인
- 매일 자동 갱신 (GitHub Actions cron)
- 애드센스 광고 배치 (상용 배포 후 트래픽 확인 시점에 추가)
- 다국어 지원 (`/{locale}/article`)
- 생성기 페이지로의 내부 링크 (관련 도구 CTA)

### 2.2 다루지 않는 것 (Out of Scope)

- 사용자 개인화 피드 (구독, 북마크, 알림)
- 댓글/토론 기능
- 사용자 투고 콘텐츠
- 실시간 알림 (이메일, 푸시)
- 기존 `/blog` 경로 (이 기획에서 `/article`로 대체)

## 3. 제안 (Proposal)

### 3.1 개요

개발 도구(ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js)의 공식 RSS/Atom 피드를 매일 자동 수집하고, Gemini API를 사용해 한국어/영어 요약을 생성하여 정적 페이지로 배포한다. 기존 IA의 `/blog`를 `/article`로 대체한다.

### 3.2 상세 설계

#### 3.2.1 페이지 구조

```
/{locale}/article/              # 전체 피드 (모든 도구 최신 아티클)
/{locale}/article/eslint        # ESLint 전용
/{locale}/article/prettier      # Prettier 전용
/{locale}/article/typescript    # TypeScript 전용
/{locale}/article/nextjs        # Next.js 전용
/{locale}/article/react         # React 전용
/{locale}/article/astro         # Astro 전용
/{locale}/article/nodejs        # Node.js 전용
```

#### 3.2.2 지원 도구 및 RSS 피드 URL

| 도구 | 피드 URL | 비고 |
|------|---------|------|
| ESLint | `https://eslint.org/feed.xml` | 공식 블로그 |
| Prettier | `https://prettier.io/blog/atom.xml` | 공식 블로그 |
| TypeScript | `https://devblogs.microsoft.com/typescript/feed/` | MS DevBlogs |
| Next.js | `https://nextjs.org/feed.xml` | 공식 블로그 |
| React | `https://react.dev/rss.xml` | 공식 블로그 |
| Astro | `https://astro.build/rss.xml` | 공식 블로그 |
| Node.js | `https://nodejs.org/en/feed/blog.xml` | 공식 블로그 |

#### 3.2.3 아티클 카드 구조

```
┌─────────────────────────────────────────────────────────┐
│ [ESLint 아이콘] ESLint                      2026-04-13  │
├─────────────────────────────────────────────────────────┤
│ ESLint v9.2.0 Released                                  │  ← 원문 제목
├─────────────────────────────────────────────────────────┤
│ 이번 릴리스에서는 새로운 규칙 3개가 추가되었으며,        │  ← AI 생성 요약
│ TypeScript 5.5 지원이 개선되었습니다. flat config의      │    (한국어/영어)
│ 성능도 20% 향상되어 대규모 프로젝트에서...               │
├─────────────────────────────────────────────────────────┤
│ 🔗 원문 보기 →                  [ESLint 설정 생성하기]  │  ← CTA
└─────────────────────────────────────────────────────────┘
```

#### 3.2.4 자동화 파이프라인

```
GitHub Actions (매일 09:00 UTC)
  │
  ├─ 1. articles/auto-update-{날짜} 브랜치 생성 (main 기준)
  │
  ├─ 2. RSS 피드 7개 fetch (병렬)
  │
  ├─ 3. 기존 아티클과 diff → 신규 항목 추출
  │
  ├─ 4. 신규 항목 있을 경우:
  │     ├─ 원문 URL fetch → 본문 추출
  │     ├─ Gemini API 호출 → 한국어/영어 요약 생성
  │     ├─ Markdown 파일 생성 (src/content/articles/)
  │     └─ commit & push (articles/auto-update-{날짜} 브랜치)
  │
  └─ 5. PR 생성 (articles/auto-update-{날짜} → main)
        └─ 제목: "chore(articles): {날짜} 아티클 업데이트"
        └─ 수동 머지 (리뷰 후 머지)
```

**PR 기반 운영 방식:**

- 초기에는 수동 머지로 AI 요약 품질 검증
- 안정화 후 자동 머지(auto-merge)로 전환 가능
- PR 단위로 버전 관리 및 롤백 용이

#### 3.2.5 광고 배치 전략

Google Better Ads Standards 준수:
- 뷰포트 15% 초과 금지
- min-height 컨테이너로 CLS(레이아웃 시프트) 방지
- 인피드 광고: 5번째 카드마다 1개

```
┌─────────────────────────────────────┐
│  헤더 배너 (728x90 또는 반응형)      │
├─────────────────────────────────────┤
│  아티클 카드 1                       │
│  아티클 카드 2                       │
│  아티클 카드 3                       │
│  아티클 카드 4                       │
│  아티클 카드 5                       │
├─────────────────────────────────────┤
│  인피드 광고 (네이티브)              │
├─────────────────────────────────────┤
│  아티클 카드 6~10                    │
│  ...                                │
└─────────────────────────────────────┘
```

### 3.3 사용자 플로우

1. 사용자가 `/article` 접속
2. 최신 아티클 목록 확인 (모든 도구 통합, 날짜순 정렬)
3. 관심 도구 탭 클릭 → `/article/eslint` 등 필터링
4. 아티클 카드에서 AI 요약 읽음
5. "원문 보기" 클릭 → 외부 공식 사이트로 이동
6. 또는 "설정 생성하기" CTA 클릭 → 생성기 페이지로 이동

## 4. 근거 (Rationale)

- **RSS 자동 수집 + AI 요약**: 완전 자동화로 운영 부담 최소화. 저작권 위험 회피를 위해 원문 재게시 대신 AI 요약 사용 ([ADR-0010](../../../decisions/records/ADR-0010-article-content-strategy.md))
- **Gemini API 선택**: 한국어 요약 품질이 핵심. 무료 티어로 월 60개 아티클 충분히 커버 ([ADR-0011](../../../decisions/records/ADR-0011-article-ai-summarization.md))
- **정적 페이지 배포**: ADR-0004에서 Cloudflare Pages SSG 방식으로 결정. 일 1회 빌드로 충분
- **`/blog` → `/article` 대체**: 뉴스/업데이트는 블로그보다 주기성과 도구 중심 구조가 강함. 아티클 개념이 더 적합

## 5. 대안 (Alternatives)

| 대안 | 설명 | 장점 | 단점 | 채택 여부 |
|------|------|------|------|-----------|
| 수동 큐레이션 | 편집자가 직접 아티클 작성 | 품질 보장 | 운영 부담 과대 | 불채택 |
| RSS 원문 재게시 | 원문 description 그대로 게시 | 완전 자동화 | 저작권 위험, 애드센스 위반 | 불채택 |
| `/blog` 유지 | 기존 경로 사용 | 변경 최소화 | 아티클 성격과 맞지 않음 | 불채택 |
| Cloudflare Workers AI | Gemini 대신 사용 | 인프라 통합 | 한국어 품질 낮음 | 불채택 (fallback 고려) |

## 6. 실행 계획 (Execution Plan)

### 6.1 단계

| 단계 | 작업 | 산출물 | 선행 조건 |
|------|------|--------|-----------|
| 1 | RSS 수집 스크립트 개발 | `scripts/fetch-rss.ts` | - |
| 2 | Gemini API 연동 | `scripts/generate-summary.ts` | Gemini API 키 |
| 3 | Content Collection 스키마 정의 | `src/content/config.ts` 수정 | - |
| 4 | 아티클 목록 페이지 구현 | `src/pages/[locale]/article/index.astro` | 3 |
| 5 | 도구별 필터 페이지 구현 | `src/pages/[locale]/article/[tool].astro` | 4 |
| 6 | GitHub Actions 워크플로우 | `.github/workflows/update-articles.yml` | 1, 2 |
| 7 | IA 문서 업데이트 (`/blog` → `/article`) | `configDeckIA.md` 수정 | - |
| 8 | (배포 후) 광고 컴포넌트 구현 | `src/components/AdUnit.astro` | 트래픽 확인 후 |

### 6.2 마일스톤

- **M1**: RSS 파이프라인 + 메인 피드 페이지 (1-4단계)
- **M2**: 도구별 페이지 + 자동 빌드 설정 (5-6단계)
- **M3**: 다국어 + SEO 최적화 + 상용 배포 (7단계)
- **M4**: 트래픽 확인 후 애드센스 신청 및 광고 배치 (8단계)

### 6.3 확인 지점 (Checkpoints)

- [ ] M1 완료 후: 아티클 목록 페이지 UI 검토
- [ ] M2 완료 후: 자동 빌드 동작 확인
- [ ] M3 완료 후: 상용 배포 및 SEO 인덱싱 확인
- [ ] M4 시작 전: 트래픽 수준 확인 후 애드센스 신청 여부 결정

## 7. 리스크 & 대응 (Risks & Mitigations)

| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| Gemini API 무료 티어 축소 | 운영 비용 발생 | Cloudflare Workers AI fallback 구현 |
| RSS 피드 구조 변경 | 파싱 실패 | 도구별 파서 분리, 모니터링 알림 |
| AI 요약 품질 불일치 | 사용자 신뢰 저하 | 프롬프트 튜닝, 품질 로그 수집 |
| 애드센스 미승인 | 수익화 불가 | 트래픽 확보 후 신청, 충분한 콘텐츠 축적 |

## 8. 성공 지표 (Success Metrics)

- **콘텐츠 양**: M1 완료 시 최소 20개 아티클 보유
- **자동화율**: 신규 아티클 100% 자동 생성 (수동 개입 없음)
- **페이지 노출**: 아티클 페이지 월간 1,000 PV (런칭 3개월 후)
- **SEO 유입**: 아티클 관련 키워드로 검색 유입 발생
- **애드센스 승인**: 콘텐츠 축적 후 애드센스 신청 및 승인

## 9. 참고 자료 (References)

- [ADR-0010: 아티클 콘텐츠 수집 및 갱신 전략](../../../decisions/records/ADR-0010-article-content-strategy.md) — RSS 수집, Snippet 방식 결정
- [ADR-0011: 아티클 AI 요약 자동화 전략](../../../decisions/records/ADR-0011-article-ai-summarization.md) — Gemini API 선택 근거
- [ADR-0004: 배포 환경 선택](../../../decisions/records/ADR-0004-deployment.md) — Cloudflare Pages 정적 배포
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) — 무료 티어 정책
- [Google AdSense AI Content Policy 2026](https://thehumanizeai.pro/articles/google-adsense-ai-content-policy-2026) — AI 콘텐츠 정책
- [Better Ads Standards](https://www.betterads.org/standards/) — 광고 배치 가이드라인

## 10. 변경 이력 (Changelog)

| 날짜 | 변경 내용 | 변경자 |
|------|----------|--------|
| 2026-04-13 | 초안 작성 | jsg3121 |
| 2026-04-13 | AI 요약 자동화 반영, 상태 승인됨으로 변경 | jsg3121 |
| 2026-04-13 | 광고 배치를 M4(배포 후 트래픽 확인 시점)로 분리 | jsg3121 |
| 2026-04-13 | 자동화 파이프라인을 PR 기반 수동 머지 방식으로 변경 | jsg3121 |
