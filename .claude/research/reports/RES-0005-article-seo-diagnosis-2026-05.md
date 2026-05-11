# ConfigDeck Article 하위 페이지 SEO 진단 보고서

> ⚠️ 주의: 이 보고서는 2026-05-11 기준이며, 이후 v1.5.2 핫픽스(article 전체 noindex + sitemap 제외)와 v1.6.0 콘텐츠 파이프라인 재설계로 일부 권고가 이미 적용되었거나 진행 중이다. 후속 작업 결정은 [SPEC-0007](../../ia/specs/features/SPEC-0007-article-content-model-redesign.md) 및 [ADR-0021](../../decisions/records/ADR-0021-article-editorial-commentary-model.md)에서 참조한다.

> 아티클 페이지들의 검색 노출 적합성 정밀 진단
>
> **분석일**: 2026년 5월 11일
> **분석 범위**: `/en/article/` 및 하위 페이지 다수 (typescript, searchenginejournal 등)
> **분석 방식**: 실제 HTML 메타데이터 + 본문 구조 + 내부 링크 직접 검증

---

## 0. 한눈에 보는 결론

| 영역 | 평가 | 비고 |
|------|------|------|
| 콘텐츠 분량 | ✅ 양호 | 자체 작성 long-form (코드 예시 포함) |
| 기본 메타데이터 | ⚠️ 보통 | title/description 있으나 키워드 정렬 부족 |
| 구조화 데이터 | ❌ 없음 | Article, BlogPosting, Breadcrumb 전부 누락 |
| URL 구조 | ❌ 문제 | 길고, 날짜 박힘, 잘림, 카테고리 중복 |
| 내부 링크 | ⚠️ 약함 | 도구로의 CTA는 있으나 양방향 링크 약함 |
| OG 이미지 | ❌ 동일 | 모든 페이지가 같은 og-image.png 사용 |
| hreflang | ❌ 누락 의심 | 아티클 페이지에서 발견되지 않음 |
| **콘텐츠 진정성** | ❌ **심각** | **"View Original" 링크 + 패러프레이즈 = Helpful Content 페널티 위험** |

### ⚠️ 가장 시급한 발견

가장 심각한 문제는 **콘텐츠 진정성(content originality) 이슈**입니다. 이전 분석에서 "외부 RSS 큐레이션"이라고 평가했던 게 사실 더 정확했어야 했어요. 본문이 자체 작성된 것처럼 보이지만, 실제로는:

1. 각 글마다 **"View Original" 링크로 원본 출처를 명시**하고 있음
2. 본문 구성과 핵심 주장이 원본과 동일하며 **패러프레이즈에 가까운 구조**
3. AI가 자동 생성한 콘텐츠로 보이는 패턴 (코드 예시가 일반적이고 검증 안 된 내용 포함)

이 조합은 **Google Helpful Content Update의 직접 페널티 대상**입니다.

> 구글은 2024년부터 "독자에게 새로운 가치를 제공하지 않는 paraphrased/AI-generated content"에 강한 페널티를 부여하고 있어요. ConfigDeck 아티클은 현재 이 패턴에 정확히 부합합니다.

---

## 1. 아티클 페이지 메타데이터 진단

### 1.1 실측 데이터 (TypeScript 7.0 Beta 글 기준)

```yaml
canonical: https://configdeck.dev/en/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta
title: "Announcing TypeScript 7.0 Beta — TypeScript | ConfigDeck"
description: "TypeScript 7.0 Beta represents a groundbreaking release built on..."
og:type: article
og:image: https://configdeck.dev/og-image.png  ← 모든 페이지 동일
og:locale: en_US
og:locale:alternate: ko_KR
twitter:card: summary_large_image
article:published_time: 2026-04-21T18:24:17.000Z
```

### 1.2 항목별 평가

#### ✅ 잘 된 부분

- `og:type: article` 정확히 설정 — 구글이 콘텐츠 유형을 정확히 인식
- `article:published_time` 메타 태그 포함 — 검색 결과에 발행일 노출 가능
- canonical URL 정확
- twitter:card `summary_large_image` 설정

#### ❌ 누락된 핵심 메타 태그

| 태그 | 현재 | 영향 |
|------|------|------|
| `article:author` | 없음 | 구글이 저자(E-E-A-T)를 식별 못함 |
| `article:modified_time` | 없음 | 콘텐츠 신선도(freshness) 신호 약함 |
| `article:section` | 없음 | 카테고리 신호 누락 |
| `article:tag` | 없음 | 토픽 클러스터링 안됨 |
| `hreflang` (article에) | 미확인 | 한국어 미러 페이지 정렬 안됨 |

#### ⚠️ 개선 필요한 부분

**1. og:image가 모든 페이지에서 동일**
- 현재: 모든 아티클이 `https://configdeck.dev/og-image.png` 사용
- 결과: SNS 공유 시 어느 글을 공유해도 같은 이미지 → 클릭률 저하
- 권장: 페이지별 동적 OG 이미지 (제목 + 카테고리 표시)

**2. Title 끝의 ` | ConfigDeck`이 무게 차지**
- 현재: `Announcing TypeScript 7.0 Beta — TypeScript | ConfigDeck` (52자)
- 모바일 SERP에서 일부 잘림
- 권장: `Announcing TypeScript 7.0 Beta — ConfigDeck` (단순화)

**3. Description이 본문 첫 문단 그대로**
- 현재: 본문 Summary 섹션과 메타 description이 동일
- 검색자 클릭 유도 카피가 부재
- 권장: "Migration guide and breaking changes inside" 같은 클릭 유도 문구 추가

---

## 2. URL 구조 진단 — ❌ 심각

### 2.1 현재 URL 패턴

```
/en/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta
/en/article/searchenginejournal/2026-04-26-searchenginejournal-ai-overview-ctr-fell-61-but-clicks-didnt-collapse-
```

### 2.2 문제점 분석

#### 문제 1: URL이 너무 길다 (108자 이상)

구글은 일반적으로 **URL을 80자 내외로 권장**합니다. 현재 URL은 SERP에서 잘려서 표시되고, 사용자 신뢰도와 클릭률에 부정적 영향을 줍니다.

#### 문제 2: 카테고리명이 슬러그에 중복

```
.../typescript/2026-04-21-typescript-announcing-typescript-70-beta
                          ^^^^^^^^^^ 이미 경로에 있는데 또 들어감
```

→ 키워드 스터핑(keyword stuffing)으로 오해받을 수 있음

#### 문제 3: 날짜가 URL에 박혀 있음

```
.../2026-04-21-typescript-announcing-typescript-70-beta
    ^^^^^^^^^^ 
```

- 사용자 인식: "오래된 정보" → 클릭률 저하
- 검색엔진: evergreen content로 평가하기 어려움
- 콘텐츠 업데이트해도 URL은 옛날 날짜로 남음

#### 문제 4: URL 끝이 잘려있음

```
.../ai-overview-ctr-fell-61-but-clicks-didnt-collapse-
                                                     ^ 하이픈으로 끝남
```

→ 슬러그 생성 로직에 버그 의심. SEO/UX 모두 부정적

### 2.3 권장 URL 구조

```
[현재] /en/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta
[권장] /en/article/typescript-7-0-beta-announcement
       또는
       /en/blog/typescript-7-beta
```

**변경 원칙**:
- 카테고리는 경로(`/typescript/`)로 한 번만
- 슬러그에 핵심 키워드만 (3~5단어)
- 날짜 제거 (메타 태그로만 표시)
- 끝 하이픈 제거

> ⚠️ 기존 URL 변경 시 **301 redirect 필수** (이미 색인된 URL 보호)

---

## 3. 콘텐츠 품질 진단 — ⚠️ 중대 리스크

### 3.1 현재 콘텐츠 패턴 (실측)

샘플 글 두 편을 직접 검토한 결과, 다음 패턴이 반복됨:

```markdown
# [원본 글의 제목 또는 유사 제목]

April 21, 2026 · [View Original →]  ← 원본 출처 명시

## Summary
[원본 글 요지 1~2문단 패러프레이즈]

## [원본 글의 H2 1]
[패러프레이즈된 본문 + AI 생성 코드 예시]

## [원본 글의 H2 2]
...

## Need a TypeScript config file?
Generate the latest config in seconds with ConfigDeck.
[Generate Config] ← 도구 CTA (좋음)
```

### 3.2 발견된 구체적 위험 신호

#### 🔴 위험 신호 1: "View Original" 링크 자체가 paraphrasing 선언

```html
<a href="https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/">
  View Original
</a>
```

이 링크 자체가 구글에게 **"이 콘텐츠는 다른 곳의 재가공"**이라고 직접 알려주는 신호입니다. 원본 사이트(Microsoft 공식 블로그)는 권위가 매우 높고, ConfigDeck은 신생 사이트이므로 **항상 원본이 우선 노출**됩니다.

#### 🔴 위험 신호 2: 사실 검증되지 않은 콘텐츠

TypeScript 7.0 Beta 글에 다음과 같은 구체적 수치가 나옴:

> "Compilation speed has improved by an average of 40-60% for medium to large projects, while memory consumption has been reduced by approximately 30%"

만약 이 수치가 **AI 생성으로 만들어진 가공된 숫자**라면 (그렇게 보일 가능성이 높음), 이는:
- E-E-A-T(전문성·경험·권위·신뢰) 점수 하락
- 만약 누군가 신고하면 수동 페널티 가능

또한 글에 포함된 다음 코드:

```typescript
{
  "compilerOptions": {
    "incremental": true,
    "parallelTypeChecking": true,         // ← 존재하지 않는 옵션 가능성
    "optimizedModuleResolution": true     // ← 존재하지 않는 옵션 가능성
  }
}
```

TypeScript 공식 옵션이 아닌 것들이 섞여 있을 가능성이 있습니다. **개발자가 이걸 따라하면 에러가 나고**, 이는 사이트 신뢰도에 직접 타격을 줍니다.

#### 🔴 위험 신호 3: AI 생성 콘텐츠 패턴

다음 표현 패턴이 반복됨:
- "represents a groundbreaking release"
- "transforming how developers..."
- "fundamental change in approach"
- "this requires immediate adjustments"

이는 **ChatGPT/Claude가 기사를 패러프레이즈할 때 전형적으로 쓰는 어휘**입니다. 구글의 SpamBrain은 이런 패턴을 학습해 분류하고 있으며, 2024년 3월 Core Update 이후 이런 콘텐츠가 **대량 색인 제외(deindexing)** 되는 사례가 보고되고 있습니다.

### 3.3 Helpful Content System 평가 시뮬레이션

구글 공식 가이드의 자가 평가 질문 중 다음에 모두 ❌ 답할 가능성:

| 자가 평가 질문 | 현재 평가 |
|---------------|---------|
| 콘텐츠가 원본 정보, 보고, 분석을 제공하는가? | ❌ 외부 글 재가공 |
| 다른 결과에서 발견할 수 있는 것 이상의 실질적 가치를 제공하는가? | ❌ 원본보다 단순 |
| 검색 결과에서 잘 나타나기 위해 만들어진 것 같은가? | ⚠️ 의심됨 |
| 콘텐츠가 명확한 1차 목적/포커스를 가지는가? | ⚠️ 카테고리 분산 |
| 정보 신뢰성을 위한 출처를 명확히 인용하는가? | ⚠️ View Original만 |
| 콘텐츠에서 사실 오류를 쉽게 발견할 수 있는가? | 🔴 위험 |

> **결론**: 현재 아티클 섹션은 구글 색인에서 점차 배제될 위험이 매우 높음. 또한 사이트 전체의 도메인 권위(Domain Authority)를 깎아 **Generator 페이지의 검색 순위까지 떨어뜨리는 부작용** 가능성.

---

## 4. 구조화 데이터 진단 — ❌ 전면 누락

### 4.1 누락된 Schema.org 구조화 데이터

| 스키마 | 현재 | 효과 |
|--------|------|------|
| `Article` 또는 `BlogPosting` | ❌ 없음 | 검색 결과에 카드형 노출, 발행일·저자 노출 |
| `BreadcrumbList` | ❌ 없음 | SERP에 "Articles > TypeScript > 글제목" 빵부스러기 노출 |
| `WebSite` (SearchAction 포함) | 확인 필요 | 사이트 내 검색 노출 |
| `Organization` | 확인 필요 | 브랜드 SERP 패널 |

### 4.2 권장 구조화 데이터 (아티클 페이지용)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Announcing TypeScript 7.0 Beta",
  "description": "...",
  "image": "https://configdeck.dev/og/typescript-7-beta.png",
  "datePublished": "2026-04-21T18:24:17.000Z",
  "dateModified": "2026-04-21T18:24:17.000Z",
  "author": {
    "@type": "Organization",
    "name": "ConfigDeck",
    "url": "https://configdeck.dev"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ConfigDeck",
    "logo": {
      "@type": "ImageObject",
      "url": "https://configdeck.dev/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://configdeck.dev/en/article/typescript/..."
  },
  "isBasedOn": "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/"
}
</script>
```

> 💡 `isBasedOn` 속성을 명시하면 구글에게 "원본 출처를 적절히 표시한 derivative work"임을 알릴 수 있어, paraphrasing 페널티를 일부 완화할 수 있습니다.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://configdeck.dev/en/"},
    {"@type": "ListItem", "position": 2, "name": "Articles", "item": "https://configdeck.dev/en/article"},
    {"@type": "ListItem", "position": 3, "name": "TypeScript", "item": "https://configdeck.dev/en/article/typescript"},
    {"@type": "ListItem", "position": 4, "name": "Announcing TypeScript 7.0 Beta"}
  ]
}
</script>
```

---

## 5. 내부 링크 구조 진단

### 5.1 잘 된 부분

- ✅ **글 말미에 도구 CTA**: "Need a TypeScript config file? [Generate Config]" — 우수한 전환 동선
- ✅ **More [Category] Updates 섹션**: 같은 카테고리 내 다른 글로의 링크 → 토픽 클러스터 신호

### 5.2 부족한 부분

#### 문제 1: 본문 인라인 링크 부재

본문에서 자연스럽게 다른 페이지로 보내는 링크가 거의 없음. 예시:

```markdown
[현재]
Critical breaking changes include: Stricter null checks...

[권장]
Critical breaking changes include: Stricter null checks. 
If you're upgrading, our [tsconfig generator](/en/generator/tsconfig) 
can help you create a TS 7-compatible config quickly.
```

#### 문제 2: 카테고리 페이지로의 역방향 링크만 있음

각 글에서 카테고리 페이지(`/en/article/typescript`)로 링크가 있지만, 카테고리 페이지 → Generator 페이지 연결이 약합니다.

```markdown
[권장] 카테고리 페이지 상단에 다음 추가:
"Read TypeScript news, or jump straight to our 
[tsconfig.json Generator](/en/generator/tsconfig)."
```

#### 문제 3: 관련 글 알고리즘이 단순

현재 "More [Category] Updates"는 같은 카테고리의 최신 글만 보여줌. 권장:
- 같은 토픽의 글 (예: TypeScript 7.0 → TypeScript 6.0 글)
- 관련 도구 (예: TS 글 → ESLint + TS 글)

---

## 6. hreflang 검증 — 추가 확인 필요

### 6.1 확인 사항

- 메인 페이지(`/en/`)에는 hreflang이 정확히 설정되어 있음 (이전 분석에서 확인)
- **아티클 하위 페이지에 hreflang이 있는지 직접 확인 필요**

### 6.2 검증 방법

```bash
curl -s "https://configdeck.dev/en/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta" \
  | grep -i "hreflang"
```

→ 만약 결과가 비어있다면, **한국어 미러 페이지(`/ko/article/...`)에 hreflang 누락**으로 색인 충돌 가능성.

### 6.3 한국어 미러 페이지 존재 확인

각 영어 아티클에 대응하는 한국어 페이지가 실제로 있는지 확인:

```
/en/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta
/ko/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta  ← 존재?
```

만약 한국어 페이지가 없는데 hreflang으로 `ko` URL을 가리키고 있다면 → **soft 404 또는 cross-language 오류**

---

## 7. 우선순위별 액션 플랜

### 🚨 [P0 - 긴급] 콘텐츠 품질 문제 해결

**가장 시급함**. 이대로 두면 사이트 전체 도메인 권위 하락 위험.

#### 옵션 A: 콘텐츠 전면 재구성 (권장)

각 아티클에 다음 요소 중 **최소 2개 이상** 추가하여 "실질적 가치" 부여:

1. **개발자 관점 분석**: "What this means for ConfigDeck users", "How to migrate your config"
2. **실전 코드 예시**: 실제 작동하는, 검증된 코드 (현재 코드는 검증 필요)
3. **원본에 없는 추가 정보**: 관련 도구 비교, 마이그레이션 체크리스트
4. **ConfigDeck 도구 연계**: 본문 내 자연스러운 도구 사용 예시

#### 옵션 B: 외부 큐레이션으로 명확히 전환

자체 작성 시도를 포기하고, 원본 글의 **짧은 요약(2~3문장) + 원본 링크**만 제공:

```markdown
# TypeScript 7.0 Beta

📰 [TypeScript Blog] · April 21, 2026

TypeScript 7.0 Beta brings a complete compiler rewrite with significant 
performance improvements. The team reports faster compilation times and 
reduced memory consumption.

[→ Read full announcement on Microsoft TypeScript Blog](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/)

---

## Want to try TS 7.0 in a new project?
Generate a fresh tsconfig.json with our [TypeScript Config Generator](/en/generator/tsconfig).
```

이 경우 페이지 분량은 줄지만 **honest content**가 되어 페널티 위험이 사라짐.

#### 옵션 C: noindex 처리

가장 보수적 옵션. 모든 아티클 페이지에:

```html
<meta name="robots" content="noindex, follow">
```

→ 구글이 색인하지 않으므로 sitemap에서도 제거. follow는 유지하므로 내부 링크 권위는 흐름.

**옵션 선택 가이드**:
- 자체 콘텐츠 제작 리소스가 있다 → **옵션 A**
- 리소스 부족하지만 정보 허브로 유지하고 싶다 → **옵션 B**
- 일단 도메인 권위 보호가 최우선이다 → **옵션 C** (임시) 후 A로 전환

### 🔴 [P0] URL 구조 개편

```
[변경 전] /en/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta
[변경 후] /en/article/typescript/typescript-7-beta
```

**필수 조건**: 모든 기존 URL → 새 URL로 **301 permanent redirect** 설정. 누락 시 색인된 페이지 모두 잃음.

### 🟡 [P1] 구조화 데이터 추가

- `BlogPosting` schema (모든 아티클)
- `BreadcrumbList` schema (모든 하위 페이지)
- `isBasedOn` 속성으로 원본 출처 명시 (paraphrasing 페널티 완화)

### 🟡 [P1] 메타데이터 보강

- `article:author`, `article:modified_time`, `article:section`, `article:tag` 추가
- hreflang을 아티클 페이지에도 확실히 적용 (또는 KO 미러 없으면 hreflang 제거)
- 페이지별 OG 이미지 동적 생성 (Astro는 `astro-og-canvas` 사용 가능)

### 🟢 [P2] 내부 링크 강화

- 본문 인라인 링크로 Generator 페이지 자연스럽게 연결
- 카테고리 페이지에서 관련 Generator로의 명확한 동선
- 관련 글 추천 알고리즘 개선

---

## 8. 카테고리 페이지 별도 분석

### 8.1 현재 운영 중인 카테고리 (15개)

```
ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js, 
web.dev, Tailwind CSS, Vite, Smashing Magazine, CSS-Tricks, 
Search Engine Journal, Google Search Central, JavaScript Weekly
```

### 8.2 분류 체계 문제

현재 카테고리가 **두 가지 분류 기준이 섞임**:

| 분류 기준 | 예시 | 평가 |
|---------|------|------|
| 도구/기술명 | ESLint, TypeScript, React | ✅ 사용자 친화적 |
| 출처/매체명 | Smashing Magazine, CSS-Tricks, SEJ | ❌ 사용자 가치 낮음 |

**문제**:
- 사용자는 "TypeScript에 관한 글"을 찾지 "Smashing Magazine 글"을 찾지 않음
- 출처별 분류는 ConfigDeck의 큐레이션/패러프레이즈 성격을 노출함
- 토픽 클러스터링이 약해져 SEO 권위 분산

### 8.3 권장 카테고리 재편

```
[기술 카테고리만 유지]
- ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js, Tailwind, Vite

[제거 또는 통합]
- "Smashing Magazine", "CSS-Tricks" → "Web Development"으로 통합
- "Search Engine Journal" → 제거 (SEO는 ConfigDeck 핵심 주제 아님)
- "JavaScript Weekly" → "JavaScript"로 변경

[신규 추가 권장]
- Migration Guide (TypeScript migration, ESLint v9 migration 등)
- Best Practices
```

이렇게 정리하면 각 카테고리가 **ConfigDeck의 Generator 도구와 1:1 매핑**되어 SEO 효과가 집중됩니다.

---

## 9. 빠른 진단 체크리스트

직접 검증 가능한 항목들:

```bash
# 1. hreflang 확인
curl -s "https://configdeck.dev/en/article/typescript/2026-04-21-typescript-announcing-typescript-70-beta" | grep -i hreflang

# 2. 구조화 데이터 확인
curl -s "[아티클 URL]" | grep -i "application/ld+json"

# 3. sitemap에 아티클 포함 여부
curl -s "https://configdeck.dev/sitemap-index.xml"

# 4. robots.txt 검토
curl -s "https://configdeck.dev/robots.txt"
```

추가로 Google Search Console에서:

```
□ 페이지 인덱싱 > 아티클 페이지가 색인되어 있는지 확인
□ 페이지 인덱싱 > "크롤링되었으나 색인 생성되지 않음" 페이지 개수 확인 ← 이게 많으면 Helpful Content 신호
□ 향상 > 구조화 데이터 오류 확인
□ 실적 > 아티클 페이지의 평균 CTR 확인 ← 0.5% 미만이면 콘텐츠 품질 문제
```

---

## 10. 종합 결론

### 현재 상태 요약

아티클 섹션은 **기술적 메타데이터는 평균 수준**이지만, **콘텐츠 진정성과 URL 구조에서 심각한 SEO 리스크**를 안고 있습니다.

특히 우려되는 점은 이 리스크가 단순히 "아티클 페이지가 노출 안 됨"으로 끝나지 않는다는 것입니다. 구글의 **사이트 단위 품질 평가 시스템**은 저품질 페이지가 다수일 경우 **사이트 전체의 평가를 낮춥니다**. 즉, 현재 아티클 섹션의 문제가 **Generator 페이지의 검색 순위까지 끌어내리고 있을 가능성**이 있어요.

### 권장 순서

1. **이번 주**: 옵션 C(noindex)로 일단 도메인 권위 보호 → 시간 벌기
2. **2~3주 내**: URL 구조 개편 + 301 redirect + 구조화 데이터 추가
3. **1~2개월 내**: 옵션 A 또는 B로 콘텐츠 전략 전환
4. **지속**: 카테고리 체계 재편

### 마지막 점검

이전 분석에서 "기술적 SEO 토대는 양호하다"고 평가했던 부분은 메인·Generator 페이지 한정이었습니다. 아티클 페이지까지 포함해 보면 **전체 사이트 차원에서는 추가 작업이 필요**한 상황입니다.

다만 **좋은 소식**은 Generator와 Migrate & Audit 같은 핵심 기능 페이지는 여전히 견고하다는 점이에요. 아티클 문제만 빠르게 정리하면 사이트 전체 권위가 회복되고, 핵심 페이지들의 노출도 개선될 가능성이 높습니다.

---

**작성일**: 2026-05-11
**검토 권장 시점**: 콘텐츠 전략 변경 후 6주 (구글 재크롤링 + 평가 반영 기간)
