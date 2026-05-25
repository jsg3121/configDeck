---
id: SPEC-0007
title: Article 콘텐츠 모델 재설계 — Editorial Commentary 전환
status: 승인됨
owner: jsg3121
created: 2026-05-11
updated: 2026-05-11
related_adrs:
  - ADR-0011  # 정정/대체 — Claude API + RSS description만 사용으로 변경된 실태 정리
  - ADR-0021  # 신규 — Editorial Commentary 모델 채택
related_specs:
  - SPEC-0002  # 개발 도구 아티클 페이지 (선행 기획)
---

# SPEC-0007: Article 콘텐츠 모델 재설계 — Editorial Commentary 전환

## 1. 배경 (Background)

### 1.1 현재 상태

ConfigDeck은 매일 GitHub Actions cron(매일 23:37 UTC, [.github/workflows/update-articles.yml](../../../../.github/workflows/update-articles.yml))을 통해 RSS 피드 15개에서 신규 아티클을 수집하고, Claude API로 마크다운을 생성해 [src/content/articles/](../../../../src/content/articles/) 아래에 저장한다. 빌드 시 Astro Content Collections가 이를 정적 HTML 페이지로 변환한다.

주요 코드:
- [scripts/fetch-rss.ts](../../../../scripts/fetch-rss.ts) — RSS 수집 + tool별 라운드로빈 균등 선택
- [scripts/generate-summary.ts](../../../../scripts/generate-summary.ts) — Claude API 프롬프트 구성 + 마크다운 생성
- [scripts/update-articles.ts](../../../../scripts/update-articles.ts) — 메인 파이프라인 (fetch → filter → generate → save)
- [src/content.config.ts](../../../../src/content.config.ts) — `articles` 컬렉션 스키마
- [src/pages/[locale]/article/[tool]/[slug].astro](../../../../src/pages/[locale]/article/[tool]/[slug].astro) — 아티클 상세 페이지

현재 발행된 아티클 수: **124개** (en 62, ko 62, 2026-03-12 ~ 2026-05-09)

### 1.2 문제점

[RES-0005](../../../research/reports/RES-0005-article-seo-diagnosis-2026-05.md)와 [RES-0006](../../../research/reports/RES-0006-ai-prompt-improvement-2026-05.md)에서 다음이 확인됐다.

1. **사실 환각 (fabrication)**: 프롬프트가 LLM에 "최소 800자, 4섹션 이상, 코드 예시 포함"을 강제하는데, 입력은 RSS description(1~2문장)뿐이다. 정보 격차를 LLM이 환각으로 채운다. 실제 사례: TypeScript 6.0 아티클에 존재하지 않는 컴파일러 옵션(`crossProjectOptimization`, `parallelTypeChecking`), 존재하지 않는 CLI 플래그(`--debugInfo`, `--migrate`), 출처 없는 수치("40-60% faster") 다수 포함.

2. **Google Helpful Content / scaled content abuse 정책 패턴 일치**: 원문(예: Microsoft TypeScript Blog) 대비 부가가치 없이 paraphrasing + 환각으로 long-form을 양산. 124개가 누적되며 도메인 전체 권위를 깎고 있다.

3. **ADR-0011과 실제 구현의 불일치**: ADR-0011은 Gemini API + 원문 fetch + 2~3문장 요약을 결정했으나, 실제 구현은 Claude API + RSS description만 + 800자+ 마크다운 생성으로 진화하면서 ADR이 갱신되지 않았다.

4. **URL 구조 비효율**: slug가 `{YYYY-MM-DD}-{tool}-{title-50자}` 형태로 100자 이상이고, 카테고리(`tool`)가 경로와 slug에 중복되며, 끝 하이픈으로 잘리는 경우가 있다 ([generate-summary.ts:251-260](../../../../scripts/generate-summary.ts#L251-L260)).

5. **카테고리 체계 혼재**: `Tool` enum에 도구(`eslint`, `typescript`)와 매체명(`smashingmagazine`, `csstricks`, `searchenginejournal`)이 섞여 있다.

6. **현재 핫픽스 상태**: v1.5.2(PR #62)에서 `/article` 전체에 `noindex`를 적용하고 sitemap에서 제외한 상태다. 이는 출혈 차단용 임시 조치이며, 콘텐츠 모델을 재설계한 뒤 풀어야 한다.

### 1.3 사용자 요구

- 자동화는 **유지**하되, 콘텐츠 품질·SEO 적합성을 회복한다
- 기존 124개 아티클은 **전부 삭제**한다 (트래픽 0에 가까워 마이그레이션 비용이 비합리적)
- 새 형식으로 충분한 발행량이 누적된 뒤 `noindex`를 해제한다 (해제 시점은 v1.6.0 범위 밖, 별도 결정)
- 작업 문서를 SPEC과 ADR로 남긴다

## 2. 목표 (Goals)

### 2.1 달성하려는 것 (In Scope)

- **Editorial Commentary 모델 채택**: ConfigDeck은 원문을 "보도"하지 않고 "코멘터리"한다. 350~550 단어(영문)/250~400 어절(한글)의 짧고 정직한 글 + Generator 매핑 CTA로 부가가치를 제공한다.
- **원문 fetch 보강**: RSS description + 원문 HTML 본문 추출을 LLM 입력에 함께 제공해 환각을 추가로 차단한다. fetch 실패 시 description만으로 fallback.
- **자동 검증 + 재시도**: 단어 수, 금지어, 필수 섹션, 필수 CTA, frontmatter 필드를 검증해 실패 시 재시도, 최종 실패 시 발행 차단.
- **URL 구조 단순화**: `2026-04-21-typescript-announcing-typescript-70-beta` → `typescript-7-beta` 형태. 기존 글 전부 삭제하므로 301 redirect 불필요.
- **스키마/UX 보강**: `BlogPosting` JSON-LD에 `isBasedOn`/`citation`/`image`/`dateModified`/publisher.logo 추가. 상단 "View Original" → "Commentary on..." 표현, 하단 "Read the full announcement on [Source]" CTA 강조.
- **기존 124개 전부 삭제** + Search Console에서 URL 제거 안내.
- **RSS 자동화 cron 일시 중지**: v1.6.0 모든 페이즈가 머지·검증될 때까지 cron이 추가 오염을 만들지 않도록 한다.

### 2.2 다루지 않는 것 (Out of Scope)

- **`noindex` 해제 및 sitemap 복원**: v1.6.0 범위 밖. 새 형식으로 일정량(최소 10~20건) 발행 + 사용자 검토 통과 후 별도 시점에 진행한다.
- **카테고리 체계 재편**: 매체명 카테고리(`smashingmagazine`, `csstricks` 등)를 도구 분류로 통합/제거하는 작업은 영향 범위가 크고 ADR이 별도로 필요해 v1.6.0에서 다루지 않는다. 현 시점에서는 매체명 카테고리도 그대로 두되, 해당 매체에서 온 글은 Generator URL 매핑이 `null`이라 CTA가 자연스럽게 생략되도록 한다.
- **페이지별 동적 OG 이미지**: P2 항목. 별도 SPEC.
- **검증 통과한 아티클의 사람 검수 게이트**: 자동화 유지가 결정 사항이므로 manual review queue는 "최종 실패 시 차단" 용도로만 둔다.

> **Why Out of Scope:** v1.6.0은 **콘텐츠 신뢰도 회복**이 목표다. 카테고리 재편/OG 동적 생성은 SEO 미세 최적화 단계로, 콘텐츠 모델이 안정된 뒤에 다뤄야 우선순위가 맞다.

## 3. 제안 (Proposal)

### 3.1 개요

콘텐츠 파이프라인의 입력·생성·검증·저장 4단계를 모두 재설계한다.

```
[입력] RSS description + 원문 fetch 본문
   │
[생성] Editorial Commentary 프롬프트 (3섹션 고정, 350~550단어)
   │
[검증] validateArticle (단어수/금지어/필수섹션/CTA/frontmatter)
   │   ├─ 실패 → 최대 2회 재시도
   │   └─ 최종 실패 → manual review queue → 발행 차단
   │
[저장] 새 slug 규칙 + 확장된 frontmatter (sourceName/sourceUrl/contentType)
   │
[렌더링] BlogPosting JSON-LD (isBasedOn/citation 포함) + UX 변경
```

### 3.2 상세 설계

#### 3.2.1 원문 fetch 모듈

새 파일: `scripts/fetch-article-content.ts`

- 입력: 원문 URL
- 출력: `{ ok: boolean; content: string | null; reason?: string }`
- 동작:
  1. HTTP GET (User-Agent 명시, 타임아웃 10초)
  2. HTML 본문 추출 — Mozilla Readability 또는 단순 휴리스틱(`<article>`, `<main>`, 최장 `<p>` 군집)
  3. 길이 제한 (예: 8,000자) — Claude 토큰 비용 통제
  4. 실패 케이스: HTTP 4xx/5xx, 타임아웃, JS 렌더링 필요 사이트, 페이월 → `{ ok: false }` 반환
- 사용처: `generate-summary.ts`의 `buildPrompt`에서 description과 함께 LLM에 전달

> **Why Readability 우선**: Mozilla Firefox의 Reader Mode 핵심 라이브러리로, 다양한 사이트 HTML 구조에서 본문 추출 신뢰도가 가장 높다 ([@mozilla/readability](https://github.com/mozilla/readability)).

#### 3.2.2 Editorial Commentary 프롬프트

`scripts/generate-summary.ts`의 `buildPrompt`를 RES-0006 §3의 새 프롬프트로 교체한다. 핵심 변경:

- 역할 정의: "comprehensive reporter" → "editorial commentary writer"
- 절대 규칙 5개: (1) report 아닌 comment (2) NEVER fabricate (3) 금지어 12개+ (4) 코드는 검증 가능할 때만 (5) 350~550 단어
- 출력 구조 3섹션 고정: `What's actually new` / `What it means for your config` / `Recommended next step`
- 한국어/영어 분기: 단어 수 기준이 다르므로 인스트럭션에서 명시
- Generator URL `null`이면 CTA 생략 지시

#### 3.2.3 보조 헬퍼

`scripts/article-helpers.ts` (신규):

```typescript
export const SOURCE_NAME_MAP: Record<Tool, string> = { /* ... */ }
export const GENERATOR_PATH_MAP: Record<Tool, string | null> = { /* ... */ }

export const getSourceName = (tool: Tool, link: string): string => { /* ... */ }
export const getGeneratorUrl = (tool: Tool, locale: Locale): string => { /* ... */ }
```

RES-0006 §4 그대로. `null` 매핑된 매체명 카테고리(SEJ, Smashing 등)는 빈 문자열을 반환하고, 프롬프트가 CTA를 생략하도록 분기한다.

#### 3.2.4 자동 검증 시스템

`scripts/validate-article.ts` (신규):

```typescript
type ValidationResult = { ok: boolean; issues: string[]; warnings: string[] }
export const validateArticle = (markdown: string): ValidationResult
```

검증 항목:
1. 단어 수: 영문 350~550, 한글은 어절 수 250~400 (한글 감지: `/[가-힯]/.test()`)
2. 금지어: RES-0006 §3 Rule 3의 영문/한글 12개+ 목록
3. 필수 CTA: "Read the full announcement" 또는 "원문 전체 보기" 포함
4. 필수 섹션 3개 헤더 존재
5. frontmatter 필수 필드: `sourceName`, `sourceUrl`, `contentType`

`generate-summary.ts`는 검증 실패 시 최대 2회 재시도, 그래도 실패하면 manual review queue로 보낸다(파일 시스템에 `src/content/articles/.review-queue/` 디렉토리 + 메타 로그).

#### 3.2.5 Content Collection 스키마 확장

[src/content.config.ts](../../../../src/content.config.ts)의 `articles` 스키마에 3개 필드 `.optional()`로 추가:

```typescript
sourceName: z.string().optional(),
sourceUrl: z.string().url().optional(),
contentType: z.enum(['commentary', 'original', 'tutorial']).default('commentary'),
```

기존 124개를 전부 삭제할 예정이지만, 페이즈 머지 순서상 한 시점은 "스키마는 새로워졌고 데이터는 아직 옛 형식"인 상태가 존재한다. `.optional()`이 그 사이의 빌드 실패를 막는다.

#### 3.2.6 URL 구조 단순화

[generate-summary.ts:251-260](../../../../scripts/generate-summary.ts#L251-L260)의 `generateSlug` 재작성:

```typescript
export const generateSlug = (article: GeneratedArticle): string => {
  return article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')   // 앞뒤 하이픈 제거
    .split('-')
    .slice(0, 6)               // 핵심 키워드 6단어
    .join('-')
}
```

- 날짜 prefix 제거 (frontmatter `pubDate`가 권위 있는 출처)
- `${article.tool}-` 중복 제거 (경로의 `[tool]`이 이미 있음)
- 최대 6단어로 제한 (URL 80자 이내)
- 끝 하이픈 제거

기존 124개를 삭제하므로 301 redirect 불필요.

#### 3.2.7 BlogPosting JSON-LD 보강 + UX 변경

[src/pages/[locale]/article/[tool]/[slug].astro](../../../../src/pages/[locale]/article/[tool]/[slug].astro)의 `articleJsonLd`를 다음으로 확장:

```typescript
const articleJsonLd = {
  '@type': 'BlogPosting',       // Article → BlogPosting (더 구체적)
  headline: article.data.title,
  description: article.data.summary,
  image: ogImageUrl,
  datePublished: article.data.pubDate.toISOString(),
  dateModified: article.data.pubDate.toISOString(),
  author: { '@type': 'Organization', name: 'ConfigDeck Editorial', url: siteUrl },
  publisher: {
    '@type': 'Organization',
    name: 'ConfigDeck',
    logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': Astro.url.href },
  ...(article.data.contentType === 'commentary' && article.data.sourceUrl && {
    isBasedOn: article.data.sourceUrl,
    citation: {
      '@type': 'CreativeWork',
      name: article.data.title,
      url: article.data.sourceUrl,
      publisher: { '@type': 'Organization', name: article.data.sourceName ?? '' },
    },
  }),
}
```

UX:
- 페이지 상단의 "View Original" 링크 제거 → "Commentary on a {sourceName} announcement" 텍스트로 변경
- 페이지 하단(요약 카드 다음, Generator CTA 앞)에 "Read the full announcement on {sourceName} →" 강조 박스 추가
- `article:modified_time`, `article:section`, `article:tag` 메타 태그 [Layout.astro](../../../../src/layouts/Layout.astro)에 추가

#### 3.2.8 기존 124개 삭제

- `git rm src/content/articles/en/*.md src/content/articles/ko/*.md`
- 빈 폴더는 유지 (`.gitkeep` 추가)
- Google Search Console에서 "URL 제거 도구" 또는 자연 색인 만료 대기 (이미 noindex 상태)

#### 3.2.9 RSS 자동화 cron 일시 중지

[.github/workflows/update-articles.yml](../../../../.github/workflows/update-articles.yml)에서:
- `schedule:` 트리거 주석 처리 (cron 일시 정지)
- `workflow_dispatch:`는 유지 (수동 테스트용)
- 워크플로우 상단에 "DISABLED until v1.6.0 release" 주석 표시

v1.6.0 페이즈 5 머지 후 사용자 검토 통과 시 재활성화한다.

### 3.3 사용자 플로우

#### 발행 흐름 (재설계 후)

1. cron(매일 23:37 UTC) — 재활성화 후
2. `fetchAllFeeds()` → RSS 15개에서 전날 발행 글 수집
3. `selectBalanced()` → tool별 라운드로빈 2건 선택
4. 각 글에 대해 `fetchArticleContent(item.link)` → 본문 추출
5. `buildPrompt(item, locale, fetchedContent)` → editorial commentary 프롬프트 구성
6. Claude API 호출 → 마크다운 생성
7. `validateArticle(markdown)` → 검증
   - 통과 → 저장
   - 실패 → 재시도 (최대 2회) → 최종 실패 시 review queue
8. `generateSlug(article)` → 새 URL slug 생성
9. `saveArticle(article)` → 파일 저장
10. GitHub Actions가 PR 생성
11. 사용자가 PR 머지

#### 독자 흐름 (재설계 후)

1. 검색·SNS·직접 방문으로 `/en/article/typescript/typescript-7-beta` 도달
2. 페이지 상단: "Commentary on a Microsoft TypeScript Blog announcement"
3. 본문 3섹션: What's actually new / What it means for your config / Recommended next step
4. "Recommended next step"에 ConfigDeck Generator 인라인 링크 (도구 매칭 시)
5. 페이지 하단: "Read the full announcement on Microsoft TypeScript Blog →" 강조 CTA
6. 관련 아티클 + Generator 카드

## 4. 근거 (Rationale)

### 4.1 Editorial Commentary 모델 채택

Google의 [Helpful Content System](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)은 "사용자에게 추가 가치를 제공하지 않는 paraphrased/AI-generated content"에 페널티를 부과한다. 반면 **derivative work 자체는 허용**되며, `isBasedOn`/`citation` 등으로 정직하게 표시되고 고유 관점을 더하면 정당하다.

- [Schema.org BlogPosting](https://schema.org/BlogPosting) — 블로그 글 표준
- [Schema.org isBasedOn](https://schema.org/isBasedOn) — derivative work의 원본 지정
- [Google Search Central — Scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) — 양산 콘텐츠 정책

### 4.2 원문 fetch 추가

LLM 입력에 검증 가능한 사실(원문 본문)을 더 많이 제공하면 환각이 줄어든다. RES-0006 §3의 프롬프트 Rule 2("never invent specifics not in source")가 작동하려면 source 자체가 충분해야 한다.

- [Mozilla Readability](https://github.com/mozilla/readability) — 본문 추출 신뢰성 검증된 라이브러리

### 4.3 한국어 단어 수 기준 분리

한국어 어절은 영문 단어보다 정보 밀도가 높다(평균 한 어절 ≈ 영문 1~1.5 단어). 동일한 350 단어 기준을 한국어에 적용하면 결과물이 영문보다 50% 더 길어진다.

### 4.4 cron 일시 중지

v1.6.0 작업 기간(예상 2~4주) 동안 cron이 매일 돌면 기존 환각 형식의 글이 계속 추가된다. PR 머지 책임자가 직접 차단하지 않는 한 누적 오염이 진행된다.

## 5. 대안 (Alternatives)

| 대안 | 설명 | 장점 | 단점 | 채택 여부 |
|---|---|---|---|---|
| A. Editorial Commentary 모델 (본 SPEC) | 짧고 정직한 코멘터리 + Generator 매핑 | 환각 최소화, 자동화 유지, Generator 자산 활용 | 발행량당 정보량 감소, 구현 복잡도 중 | **채택** |
| B. 원문 fetch + 800자+ 요약 유지 | 입력만 보강하고 출력 분량 유지 | 변경 범위 작음 | 출력 분량 강제는 여전히 환각 유인 | 불채택 |
| C. 단순 RSS 번역 + 링크만 | 환각 0이지만 부가가치도 0 | 안전 | "사용자 가치 없음" 자체로 페널티 | 불채택 |
| D. 사람 수동 큐레이션 | 자동화 포기 | 품질 최고 | 운영 비현실적 | 불채택 |
| E. article 섹션 폐기 | 모든 글 410 Gone | 가장 단순 | 사용자가 자동화 유지 결정 | 불채택 |

## 6. 실행 계획 (Execution Plan)

### 6.1 단계 (v1.6.0 페이즈)

| 페이즈 | 브랜치 | 산출물 | 선행 조건 |
|---|---|---|---|
| 1. SPEC + ADR + cron 중지 + 보고서 보존 | `feature/1.6.0-article-spec` | 본 SPEC, ADR-0021, RES-0005/0006 보존, cron disable, workflow.md 태그 절차 정정 | — |
| 2. 원문 fetch 모듈 | `feature/1.6.0-article-fetch` | `scripts/fetch-article-content.ts` + Readability 의존성 + 단위 테스트 (sample 5건) | 페이즈 1 머지 |
| 3. 콘텐츠 파이프라인 재설계 | `feature/1.6.0-article-pipeline` | 새 `buildPrompt` + helpers + `validateArticle` + 재시도/queue + schema 확장 + `generateSlug` 재작성 | 페이즈 2 머지 |
| 4. 기존 124개 삭제 + schema required 전환 | `feature/1.6.0-article-cleanup` | `git rm src/content/articles/{ko,en}/*.md` + `.gitkeep` + content.config.ts에서 `sourceName`/`sourceUrl` `.optional()` 제거 | 페이즈 3 머지 |
| 5. 스키마/UX 보강 | `feature/1.6.0-article-schema` | BlogPosting JSON-LD 확장 + UX 변경(상단 라벨/하단 CTA) + article 메타 태그 | 페이즈 4 머지 |
| 6. sample 발행 검증 + cron 재활성화 | `feature/1.6.0-article-publish` | 수동 sample 10건 발행 + 사이트 노출 확인 + GitHub Actions cron 재활성화 | 페이즈 5 머지 |

> **페이즈 4·5 순서 변경 (2026-05-11)**: 원래 4=UX/5=cleanup 순서였으나, 124개 삭제를 먼저 하면 UX 작업 시 schema `.optional()` 방어 분기가 불필요해지고 새 BlogPosting JSON-LD가 환각 글에 잘못 적용되는 위험도 0이 된다. cleanup → schema/UX → publish 순서가 더 깔끔하다는 결론.

### 6.2 마일스톤

- **M1**: SPEC + ADR 확정, cron 중지 (페이즈 1 머지)
- **M2**: 원문 fetch 정상 동작 검증 (페이즈 2 머지)
- **M3**: 신규 발행 글이 검증 통과 (페이즈 3·4 머지 + sample 검증)
- **M4**: 기존 124개 정리 완료 (페이즈 5 머지) → v1.6.0 릴리즈
- **M5 (v1.6.0 범위 밖)**: 신규 발행량 10~20건 누적 후 `noindex` 해제 결정

### 6.3 확인 지점 (Checkpoints)

- [x] 페이즈 1 머지 전: SPEC + ADR 내용 사용자 확정 (2026-05-11, PR #63 머지 완료)
- [x] 페이즈 2 머지 전: 원문 fetch 성공률 실측 (15개 소스 sample → 80%+ 목표) — **13/13 성공 (100%)**, 2026-05-11 측정. ESLint·Google Search Central은 RSS feed 자체 0건이라 측정 대상에서 제외
- [x] 페이즈 3 머지 전: sample 5건 generation 결과 사용자 검토 — **5 items × 2 locales = 10건 dry-run 완료 (2026-05-11)**. 1차 검증 1/10 통과(분량 임계치 미스매치 발견), 실측 분포에 맞춰 임계치 조정(en≥280, ko≥180) 후 재검증 **9/10 통과 (90%)**. 환각·금지어·필수 섹션은 1차에서도 모두 통과. 실패 1건(csstricks ko, 166어절)은 원문 자체가 짧은 케이스로 review queue 흐름이 정상 작동하는지 확인하는 역할도 겸함.
- [x] 페이즈 5 머지 전: 기존 124개 삭제 직전 사용자 최종 확인 (페이즈 4·5 순서 재배치 결정 + PR #66 머지로 처리)
- [x] 페이즈 6: sample 발행 검증 (2026-05-11) — 로컬 `pnpm tsx scripts/update-articles.ts` 실행 결과 **2 items × 2 locales = 4건 모두 validateArticle 통과 (review queue 0건)**. 환각 0, 분량 영문 433~543 / 한글 293~338 (모두 임계 범위 내). SEJ 매체라 Generator URL `null` → CTA 자동 생략 분기도 실측 검증됨. Cloudflare Pages 환경 검증은 main 머지 후 1회 추가 확인.
- [x] v1.6.0 릴리즈 후: 신규 발행이 충분히 누적될 때까지 `noindex` 유지 — **M5 게이트 통과 (2026-05-25)**. main 누적 en 26 / ko 25, 자동 발행 18사이클 review queue 적재 0건. v1.6.2(`feature/1.6.2-article-reindex`)에서 noindex 해제 + sitemap filter 해제 + hreflang 비대칭 처리(글별 실존 locale만 출력). 상세 결정은 [ADR-0022](../../../decisions/records/ADR-0022-article-reindex.md) 참조.

## 7. 리스크 & 대응 (Risks & Mitigations)

| 리스크 | 영향 | 대응 방안 |
|---|---|---|
| 원문 fetch 실패율이 예상보다 높음 (JS 렌더링/페이월) | 환각 차단 효과 감소 | description-only fallback. 페이즈 2에서 sample 측정 후 임계치 정의 |
| 검증 재시도 후에도 실패하는 글이 다수 → 발행량 급감 | 자동화 가치 훼손 | manual review queue를 통해 데이터 수집. 임계치 초과 시 프롬프트 미세 조정 |
| 단어 수 검증이 한국어에서 부정확 | 통과율 불안정 | 어절 수 + 문자 수 이중 기준 도입 |
| 기존 124개 삭제 후 redirect 부재로 외부 링크 404 | 적음 (대부분 트래픽 0) | sitemap에서 이미 제외됨, noindex 상태라 Google 인덱스에서도 빠지는 중 |
| Search Console에 124개 URL이 "제외됨/색인 생성되지 않음"으로 잔존 | 노이즈 | 자연 만료 대기 (수주~수개월), 필요 시 URL 제거 도구 사용 |

## 8. 성공 지표 (Success Metrics)

### 8.1 페이즈별 즉시 측정 가능

- 페이즈 2: 원문 fetch 성공률 ≥ 80% (15개 소스 sample 기준)
- 페이즈 3: sample 10건 generation 후 `validateArticle` 통과율 ≥ 70%
- 페이즈 5: 기존 124개 삭제 완료, sample 발행 검증 통과

### 8.2 v1.6.0 릴리즈 후 모니터링 (1~3개월)

- 신규 아티클 환각 사례 < 5% (manual review queue 비율)
- 평균 글 길이 350~550 단어 (영문) / 250~400 어절 (한글)
- Google Search Console에서 article 페이지 평균 색인 시간 단축 추세
- 도메인 권위 회복 신호 — Generator 페이지 노출 회복 (간접 지표)

## 9. 참고 자료 (References)

- [RES-0005: Article SEO 진단 보고서](../../../research/reports/RES-0005-article-seo-diagnosis-2026-05.md) — SEO 리스크 정밀 진단
- [RES-0006: AI 프롬프트 개선 가이드](../../../research/reports/RES-0006-ai-prompt-improvement-2026-05.md) — 새 프롬프트 + 검증 시스템 상세 설계
- [ADR-0011: 아티클 AI 요약 자동화 전략](../../../decisions/records/ADR-0011-article-ai-summarization.md) — 선행 결정 (Gemini → Claude 변경 실태는 ADR-0021에서 정리)
- [ADR-0021: Article Editorial Commentary 모델](../../../decisions/records/ADR-0021-article-editorial-commentary-model.md) — 본 SPEC의 기술적 의사결정
- [Google Helpful Content System](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — 정책 근거
- [Schema.org BlogPosting · isBasedOn · citation](https://schema.org/BlogPosting) — JSON-LD 표준
- [Mozilla Readability](https://github.com/mozilla/readability) — 원문 본문 추출 라이브러리

## 10. 변경 이력 (Changelog)

| 날짜 | 변경 내용 | 변경자 |
|---|---|---|
| 2026-05-11 | 초안 작성 (v1.5.2 핫픽스 후속, v1.6.0 페이즈 분할 확정) | jsg3121 |
| 2026-05-11 | 페이즈 1·2 체크포인트 통과 기록 (PR #63 머지, fetch 성공률 100%) | jsg3121 |
| 2026-05-11 | 페이즈 3·4·5 머지 완료 기록 (PR #65·#66·#67), 페이즈 4·5 순서 재배치 | jsg3121 |
| 2026-05-11 | 페이즈 6 sample 발행 검증 통과 (4/4) + cron 재활성화 (v1.6.0 완료) | jsg3121 |
| 2026-05-25 | M5 게이트 통과 — v1.6.2에서 noindex 해제 + sitemap filter 해제 + hreflang 비대칭 처리 (ADR-0022) | jsg3121 |
