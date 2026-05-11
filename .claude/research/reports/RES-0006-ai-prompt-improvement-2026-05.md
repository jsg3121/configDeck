# ConfigDeck AI 아티클 생성 프롬프트 개선 보고서

> ⚠️ 주의: 이 보고서는 2026-05-11 기준이며, v1.6.0에서 본 보고서의 권고(editorial commentary 모델, 자동 검증, isBasedOn schema 등)를 채택하여 구현 중이다. 채택·변형된 부분은 [SPEC-0007](../../ia/specs/features/SPEC-0007-article-content-model-redesign.md) 및 [ADR-0021](../../decisions/records/ADR-0021-article-editorial-commentary-model.md)에서 정리한다.

> AI 기반 자동 아티클 생성 시스템의 SEO 리스크 분석 및 프롬프트 재설계 가이드
>
> **작성일**: 2026년 5월 11일
> **대상 시스템**: RSS 피드 기반 자동 아티클 생성 파이프라인
> **목적**: Helpful Content Update 페널티 위험 제거 및 콘텐츠 품질 향상

---

## 0. Executive Summary

ConfigDeck은 현재 RSS 피드에서 가져온 외부 글을 AI로 가공해 매일 신규 아티클을 발행하고 있다. 이전 SEO 진단 보고서에서 식별된 콘텐츠 진정성(originality) 리스크의 **근본 원인은 프롬프트 자체의 요구사항**에 있다.

현재 프롬프트는 AI에게 "최소 800자, 4섹션 이상, 코드 예시 포함"을 강제한다. 이는 원문에 충분한 정보가 없을 때 AI가 **사실을 만들어내도록(fabricate) 강제하는 구조적 문제**다. 결과적으로 다음과 같은 위험이 발생한다:

- 실제 존재하지 않는 TypeScript 옵션·명령어 등장
- 검증되지 않은 성능 수치 ("40-60% 향상" 등) 삽입
- 원본의 단순 paraphrasing → Google Helpful Content System의 페널티 대상
- 사이트 도메인 권위 하락 → Generator 페이지의 검색 순위까지 동반 하락

본 보고서는 프롬프트의 **철학을 "포괄적 보도"에서 "편집자 코멘터리"로 전환**하는 것을 핵심 해결책으로 제시하며, 즉시 적용 가능한 새 프롬프트 코드와 보조 시스템 변경사항을 함께 제공한다.

### 한눈에 보는 변화

| 항목 | 현재 | 개선안 |
|------|------|--------|
| 포지셔닝 | 포괄적 보도 (primary reporting) | 편집자 코멘터리 (commentary) |
| 분량 강제 | 최소 800자 | 350-550 단어 |
| 섹션 수 | 4개 이상 강제 | 3개 고정 (목적별) |
| 코드 예시 | 필수 포함 | 검증 가능할 때만 |
| 출처 표기 | 상단 "View Original" | 하단 "Read full announcement" CTA |
| ConfigDeck 관점 | 없음 (단순 가공) | 전용 섹션 필수 |
| 금칙어 | 없음 | 12개+ (AI 클리셰 + 한글 클리셰) |
| 검증 단계 | 없음 | 자동 검증 + 재생성 트리거 |

---

## 1. 현재 프롬프트의 구조적 문제

### 1.1 문제 진단 — 요구사항이 fabrication을 강제한다

현재 프롬프트의 "작성 규칙" 섹션을 분석하면, **요구사항 자체가 거짓을 만들어내는 동기를 형성**하고 있다.

| 현재 요구사항 | AI의 실제 대응 | 결과 |
|------------|--------------|------|
| `최소 800자 이상의 충실한 콘텐츠` | 원문에 정보가 부족하면 추측으로 채움 | 사실 왜곡 |
| `4개 이상의 ## 섹션으로 구성` | 원문 구조를 그대로 모방 | Paraphrasing 패턴 |
| `각 섹션마다 구체적인 설명과 예시 포함` | 검증 불가능한 예시 생성 | 가짜 코드 |
| `필수 포함 내용: 실제 사용 예시 코드` | 존재하지 않는 옵션 발명 | 사용자 신뢰 파괴 |
| `필수 포함 내용: 업그레이드/마이그레이션 명령어` | 출처에 없어도 임의 작성 | 잘못된 명령어 |
| `필수 포함 내용: Breaking Changes 및 주의사항` | 추측으로 작성 | 허위 정보 |

### 1.2 실제 발견된 문제 사례

이전 진단에서 검토한 TypeScript 7.0 Beta 글의 일부:

```typescript
// 글에 포함된 코드 예시
{
  "compilerOptions": {
    "incremental": true,
    "parallelTypeChecking": true,         // 존재 여부 불명
    "optimizedModuleResolution": true     // 존재 여부 불명
  }
}
```

또한 같은 글에 등장하는 구체적 수치:

> "Compilation speed has improved by an average of 40-60% for medium to large projects, while memory consumption has been reduced by approximately 30%"

→ 원본 발표에서 직접 인용한 수치가 아닌, **AI가 그럴듯하게 만들어낸 수치일 가능성이 높음**. 이런 수치가 원본 사실과 다르면 사이트 신뢰성이 즉시 파괴된다.

### 1.3 AI 탐지 패턴 노출

생성된 글에 다음과 같은 표현이 반복적으로 등장:

- "represents a groundbreaking release"
- "fundamentally changing how developers..."
- "this requires immediate adjustments"
- "transforming the developer experience"

이는 ChatGPT/Claude 류 모델이 기사를 paraphrase할 때 사용하는 전형적 패턴이며, **Google SpamBrain의 학습된 분류 신호**다. 2024년 3월 Core Update 이후 이런 패턴의 콘텐츠가 대량 색인 제외되는 사례가 보고되었다.

### 1.4 ConfigDeck 고유 가치 부재

현재 프롬프트는 "원문을 ConfigDeck 사이트에 옮겨오는" 작업만 지시할 뿐, **ConfigDeck이 이 정보를 다루기에 적합한 이유**를 콘텐츠에 담도록 요구하지 않는다.

같은 TypeScript 7.0 뉴스를 다루는 다른 사이트(Microsoft 공식 블로그, Stack Overflow Blog, JavaScript Weekly 등)와 ConfigDeck 글의 차이가 없다면, 구글이 굳이 ConfigDeck을 상위 노출할 이유가 없다.

### 1.5 종합 진단

> 현재 프롬프트는 **"좋은 콘텐츠를 만드는 지시"** 처럼 보이지만, 실제로는 **"가짜를 만들어내야만 충족할 수 있는 지시"** 다. AI는 원문에 정보가 부족해도 800자, 4섹션, 코드 예시를 채워야 하므로, 빈 공간을 fabrication으로 채울 수밖에 없는 구조다.

---

## 2. 개선 방향 — 철학의 전환

### 2.1 핵심 전략: 편집자 코멘터리(Editorial Commentary) 모델

**기존 발상**: ConfigDeck이 뉴스를 "보도"한다  
**전환 후**: ConfigDeck이 뉴스에 대한 "관점"을 제공한다

이 차이가 결정적이다. 다음을 비교해보자.

| 기존 패턴 | 코멘터리 패턴 |
|---------|------------|
| TypeScript 7.0이 뭔지 설명 | TypeScript 7.0이 발표됐다 (한 줄) |
| 기능을 일일이 나열 | 설정 파일 작성자에게 무엇이 바뀌는지 |
| 가짜 코드 예시 | 실제 ConfigDeck Generator로의 연결 |
| 800자+ 분량 강제 | 짧고 정확하면 더 좋음 |
| "혁신적인 변화" 같은 수식 | 검증 가능한 사실만 |

### 2.2 구조 변화

새 구조는 **3섹션 고정**으로 단순화한다.

```
[Opening — 2문장 사실 진술]

## What's actually new
[원문 핵심 — 짧고 정직하게]

## What it means for your config
[ConfigDeck 고유 가치 — 설정 파일 관점에서의 의미]

## Recommended next step
[실용적 행동 + Generator CTA]

[Read full announcement → 원본 링크]
```

이 구조의 핵심:
- **What's actually new**: 원문에 없는 건 안 쓴다. 짧아도 OK.
- **What it means for your config**: ConfigDeck만 쓸 수 있는 관점. 이 섹션이 없으면 글 자체를 발행하지 않는다.
- **Recommended next step**: ConfigDeck 도구로의 자연스러운 동선.

### 2.3 fabrication 방지 원칙

명시적 금지를 통해 AI의 "빈 공간 채우기" 본능을 차단한다.

1. **No invented specifics**: 원문에 없는 숫자·옵션·명령어는 절대 작성 금지
2. **Higher-level fallback**: 구체적 정보가 없으면 추상화 — "성능 개선이 포함됐다 (원문 참조)"
3. **Code optional**: 검증된 코드만 포함. 없으면 생략. 짧은 글이 가짜 코드보다 낫다.
4. **Banned clichés**: AI 탐지 키워드 12개+ 금지 (영문 + 한국어)
5. **Self-check 필수**: 생성 후 자가 검증 단계 의무화

### 2.4 출처 처리의 정직한 전환

**현재 문제**: 글 상단 "View Original" 링크 → 구글에게 "이 글은 재가공"이라고 먼저 선언

**개선**:
- 글 상단: "Commentary on a [Source] announcement" — 코멘터리임을 명확히 하되 부정적 인상 없이
- 글 하단: **"Read the full announcement on [Source]" CTA를 강하게 배치** — 어차피 독자의 자연스러운 행동
- Schema.org: `isBasedOn` 속성으로 구글에게 정직한 derivative work임을 명시

---

## 3. 새 프롬프트 — 드롭인 교체 코드

기존 함수 시그니처는 그대로 유지된다. 호출 코드 변경 불필요.

```typescript
const buildPrompt = (item: RSSItem, locale: Locale): string => {
  const toolName = getToolName(item.tool)
  const isKorean = locale === 'ko'
  const cleanedTitle = cleanTitle(item.title)
  const sourceName = getSourceName(item.tool, item.link)
  const generatorUrl = getGeneratorUrl(item.tool, locale)

  const titleValue = isKorean
    ? '여기에 번역된 제목 작성'
    : cleanedTitle.replace(/"/g, '\\"')

  const lang = isKorean ? 'Korean (한국어)' : 'English'

  // 언어별 차이가 있는 부분만 분기, 시스템 명령은 영어 유지
  // (AI의 명령 준수율이 영어 시스템 프롬프트에서 더 높음)
  const finalTitleInstruction = isKorean
    ? 'frontmatter title은 원문 제목을 자연스러운 한국어로 번역. 직역체나 영어 단어 그대로 두기 금지.'
    : 'Use the original title as-is, lightly edited for natural English only if needed.'

  return `You are an editor for ConfigDeck, a developer tooling site. You write SHORT EDITORIAL COMMENTARY on third-party announcements — you do NOT rewrite, paraphrase, or "comprehensively cover" the original article.

Think of yourself as a senior dev writing a 4-minute newsletter blurb: honest, specific, value-adding. Not a content farm.

# Absolute rules (violating these = task failure)

## Rule 1: You comment, you don't report
The original article is the source of truth. ConfigDeck's role is to add a developer-tooling perspective on top. If a reader wants the full story, they click through to the original — and that's the desired outcome.

## Rule 2: NEVER fabricate specifics
If a specific number, version, config option, command, or feature is NOT in the "Source excerpt" below, DO NOT mention it. Omission is always safer than invention.

Examples of forbidden fabrication:
- ❌ Performance numbers ("40-60% faster") unless quoted from source
- ❌ Config options like \`parallelTypeChecking\` unless documented to exist
- ❌ Migration commands you're not 100% sure are real
- ❌ Version numbers or release dates not in the source

If you don't have specifics, write at a higher level:
"The announcement details performance improvements; see the original for benchmarks."

## Rule 3: Banned clichés (rewrite if any appear)
English:
- "groundbreaking" / "revolutionary" / "transformative" / "game-changing"
- "fundamentally changes" / "represents a significant shift"
- "developers need to understand" / "this requires immediate attention"
- "in today's rapidly evolving landscape"
- "Critical takeaways include" / "Key insights"

Korean equivalents:
- "획기적인" / "혁신적인" / "근본적으로 바꾸는"
- "주목해야 할" / "반드시 알아야 할"
- "급변하는 시대" / "주요 시사점"

## Rule 4: No fabricated code blocks
Include a code example ONLY if you can write something definitively correct from documented behavior. When in doubt, omit. A short article without code is much better than a long article with broken code.

## Rule 5: Length is 350-550 words total
Cut filler. Every sentence must add information a developer doesn't already get from the headline.

# Source material

- Topic/tool: ${toolName}
- Original publication: ${sourceName}
- Original title: ${cleanedTitle}
- Original URL: ${item.link}
${item.description ? `- Source excerpt:\n"""\n${item.description}\n"""` : '- Source excerpt: (none available — keep commentary short and high-level)'}

# Output language
Write the article body in ${lang}.
${finalTitleInstruction}

# Output structure

Output ONLY the markdown document below. No preamble, no explanation.

\`\`\`markdown
---
id: "${item.id}"
tool: "${item.tool}"
title: "${titleValue}"
link: "${item.link}"
pubDate: ${item.pubDate.toISOString()}
sourceName: "${sourceName}"
sourceUrl: "${item.link}"
contentType: "commentary"
summary: "[1-2 sentences. Factual. No hype. No clichés. ${isKorean ? 'Korean.' : 'English.'}]"
---

[Opening — 2 sentences. State what was announced, factually. Name the source.]

## What's actually new

[3-5 sentences. Stick strictly to what the source excerpt says. If the excerpt is limited, keep this section short and point readers to the original. Do NOT pad with generic explanations of the tool itself.]

## What it means for your config

[This is the ConfigDeck-unique value. Concrete questions to address (only if you have the info to answer them — don't guess):

- Does this change how config files for ${toolName} should be written?
- Is a migration needed? What's the path?
- Does it interact with related configs (e.g., ESLint+Prettier, TS+Next)?
- Are there breaking changes config writers should watch for?

If the source doesn't give enough info to answer concretely, say so honestly:
"The announcement doesn't yet detail interaction with existing configs — we'll revisit once the docs land."

DO NOT invent answers to fill the section.]

## Recommended next step

[1 paragraph. Practical guidance for a developer reading this. Natural inline link to one relevant ConfigDeck tool when (and only when) it genuinely helps:

- For new ${toolName} config → "[Generate a ${toolName} config](${generatorUrl})"
- For migration → "[Audit your config](/[locale]/migration)"
- For unrelated news (e.g., SEO articles, general web platform news) → Omit the tool link entirely. Forced CTAs hurt credibility.]

---

**Read the full announcement on ${sourceName}** → [${cleanedTitle}](${item.link})
\`\`\`

# Self-check before outputting

Run through this mentally:
1. Did I invent any specific number, option, or command not in the source? (If yes → remove)
2. Did I use any banned cliché? (If yes → rewrite that sentence)
3. Is my "What it means for your config" section adding something the source doesn't say? (If no → this article isn't worth publishing in current form; keep it short and honest)
4. Is the "Read the full announcement" link prominent? (Must be the last line)
5. Total word count 350-550? (If over → cut filler)

Output the markdown now. Nothing else.`
}
```

---

## 4. 보조 헬퍼 추가

새 프롬프트가 참조하는 두 헬퍼 함수를 추가해야 한다.

### 4.1 출처명 매핑

```typescript
// 도구/피드 식별자 → 사람이 읽는 출처명
const SOURCE_NAME_MAP: Record<string, string> = {
  typescript: 'Microsoft TypeScript Blog',
  eslint: 'ESLint Blog',
  prettier: 'Prettier Blog',
  nextjs: 'Next.js Blog',
  react: 'React Blog',
  astro: 'Astro Blog',
  nodejs: 'Node.js Blog',
  webdev: 'web.dev',
  tailwindcss: 'Tailwind CSS Blog',
  vite: 'Vite Blog',
  smashingmagazine: 'Smashing Magazine',
  csstricks: 'CSS-Tricks',
  searchenginejournal: 'Search Engine Journal',
  googlesearchcentral: 'Google Search Central',
  javascriptweekly: 'JavaScript Weekly',
}

const getSourceName = (tool: string, link: string): string => {
  return SOURCE_NAME_MAP[tool] ?? new URL(link).hostname.replace('www.', '')
}
```

### 4.2 Generator URL 매핑

```typescript
// 도구 → 매칭되는 ConfigDeck Generator 경로
// null인 경우 CTA 생략 (예: SEO 뉴스에 도구 링크 강제 삽입 방지)
const GENERATOR_PATH_MAP: Record<string, string | null> = {
  typescript: '/generator/tsconfig',
  eslint: '/generator/eslint-config',
  prettier: '/generator/prettier-config',
  nextjs: '/generator/next-config',
  vite: '/generator/vite-config',
  nodejs: '/generator/nodejs',
  astro: '/generator/astro',
  react: '/generator/react-vite-ts',
  // 매칭되는 Generator 없음 → 자연스러운 CTA 불가
  webdev: null,
  tailwindcss: null,
  smashingmagazine: null,
  csstricks: null,
  searchenginejournal: null,
  googlesearchcentral: null,
  javascriptweekly: null,
}

const getGeneratorUrl = (tool: string, locale: Locale): string => {
  const path = GENERATOR_PATH_MAP[tool]
  return path ? `/${locale}${path}` : '' // 빈 문자열 → 프롬프트가 CTA 생략
}
```

---

## 5. Content Collection 스키마 변경

새 frontmatter 필드를 Astro 스키마에 추가한다.

```typescript
// src/content/config.ts (또는 content.config.ts)
import { defineCollection, z } from 'astro:content'

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    // 기존 필드
    id: z.string(),
    tool: z.string(),
    title: z.string(),
    link: z.string().url(),
    pubDate: z.coerce.date(),
    summary: z.string(),
    // 신규 필드
    sourceName: z.string(),
    sourceUrl: z.string().url(),
    contentType: z
      .enum(['commentary', 'original', 'tutorial'])
      .default('commentary'),
  }),
})

export const collections = { articles }
```

**참고**: 기존 아티클들은 새 필드(`sourceName`, `sourceUrl`, `contentType`)가 없으므로 마이그레이션 스크립트가 필요하다. 또는 스키마에 `.optional()`을 임시로 적용 후 점진적 마이그레이션.

---

## 6. 아티클 레이아웃 — Schema.org 구조화 데이터

`isBasedOn` 속성을 포함한 BlogPosting 스키마를 각 아티클 페이지에 추가한다. 이 부분이 **구글에게 "이건 정직한 derivative work"임을 명시**하는 핵심이다.

```astro
---
// src/layouts/ArticleLayout.astro
const { frontmatter } = Astro.props
const isCommentary = frontmatter.contentType === 'commentary'

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: frontmatter.title,
  description: frontmatter.summary,
  datePublished: frontmatter.pubDate.toISOString(),
  author: {
    '@type': 'Organization',
    name: 'ConfigDeck Editorial',
    url: 'https://configdeck.dev',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ConfigDeck',
    logo: {
      '@type': 'ImageObject',
      url: 'https://configdeck.dev/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': Astro.url.href,
  },
  // 코멘터리인 경우: 원본 출처를 정직하게 명시
  ...(isCommentary && {
    isBasedOn: frontmatter.sourceUrl,
    citation: {
      '@type': 'CreativeWork',
      name: frontmatter.title,
      url: frontmatter.sourceUrl,
      publisher: {
        '@type': 'Organization',
        name: frontmatter.sourceName,
      },
    },
  }),
}
---

<script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />
```

### 6.1 UX 차원 — "View Original" 배치 변경

현재 글 상단에 "View Original" 링크가 있는데, 이는 **"이 글은 재가공"이라고 먼저 선언**하는 부정적 효과가 있다. 변경 권장:

| 위치 | 현재 | 변경 후 |
|------|------|--------|
| 글 상단 | "April 21, 2026 · View Original" | "Commentary on a TypeScript Blog announcement" 같은 형태 |
| 글 하단 | (별도 강조 없음) | "Read the full announcement on [Source] →" 강하게 배치 |

상단을 "코멘터리임을 명확히 하되 부정적 인상 없이" 표기하고, 하단 CTA를 강조해 자연스러운 독자 동선(원문으로의 이동)을 유도한다.

---

## 7. 자동 검증 시스템

생성된 글의 품질 하한선을 자동으로 보장한다.

### 7.1 검증 스크립트

```typescript
const BANNED_PHRASES = [
  // English
  'groundbreaking',
  'revolutionary',
  'transformative',
  'game-changing',
  'fundamentally changes',
  'represents a significant shift',
  'developers need to understand',
  'in today\'s rapidly evolving',
  'critical takeaways include',
  // Korean
  '획기적',
  '혁신적',
  '근본적으로 바꾸',
  '주목해야',
  '반드시 알아야',
  '급변하는 시대',
  '주요 시사점',
]

type ValidationResult = {
  ok: boolean
  issues: string[]
  warnings: string[]
}

const validateArticle = (markdown: string): ValidationResult => {
  const issues: string[] = []
  const warnings: string[] = []

  // 1. 단어 수 검증
  const wordCount = markdown.split(/\s+/).filter(Boolean).length
  if (wordCount < 350) {
    issues.push(`Word count too low: ${wordCount} (min 350)`)
  } else if (wordCount > 600) {
    issues.push(`Word count too high: ${wordCount} (max 600)`)
  }

  // 2. 금칙어 검증
  const lower = markdown.toLowerCase()
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) {
      issues.push(`Banned phrase detected: "${phrase}"`)
    }
  }

  // 3. 필수 CTA 검증
  if (!markdown.includes('Read the full announcement')) {
    issues.push('Missing "Read the full announcement" CTA')
  }

  // 4. 필수 섹션 검증
  const requiredSections = [
    "What's actually new",
    'What it means for your config',
    'Recommended next step',
  ]
  for (const section of requiredSections) {
    if (!markdown.includes(`## ${section}`)) {
      warnings.push(`Missing recommended section: "## ${section}"`)
    }
  }

  // 5. frontmatter 필수 필드 검증
  const requiredFields = ['sourceName', 'sourceUrl', 'contentType']
  for (const field of requiredFields) {
    if (!markdown.includes(`${field}:`)) {
      issues.push(`Missing frontmatter field: ${field}`)
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    warnings,
  }
}
```

### 7.2 파이프라인 통합

```typescript
async function generateArticle(item: RSSItem, locale: Locale): Promise<string> {
  const MAX_RETRIES = 2
  
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    const prompt = buildPrompt(item, locale)
    const markdown = await callAI(prompt)
    const validation = validateArticle(markdown)
    
    if (validation.ok) {
      // 경고는 로깅만, 통과는 허용
      if (validation.warnings.length > 0) {
        console.warn(`[${item.id}] Warnings:`, validation.warnings)
      }
      return markdown
    }
    
    console.error(`[${item.id}] Attempt ${attempt} failed:`, validation.issues)
    
    if (attempt > MAX_RETRIES) {
      // 자동 재시도 실패 → 사람이 검토하는 큐로 보내기
      await queueForManualReview(item, markdown, validation)
      throw new Error(`Failed to generate valid article after ${MAX_RETRIES} retries`)
    }
  }
  
  throw new Error('Unreachable')
}
```

이렇게 하면:
- 1차 생성 실패 시 자동 재생성 (금칙어 사용, 분량 초과 등)
- 최종 실패 시 자동 발행 중단 + 사람 검토 큐로 이동
- **저품질 글이 자동으로 사이트에 올라가지 않음**

---

## 8. 적용 전후 비교

### 8.1 동일 뉴스 처리 시 출력 차이 (예시)

**입력**: TypeScript 7.0 Beta 발표 RSS 아이템

#### 기존 프롬프트 출력 (요약)

```markdown
# Announcing TypeScript 7.0 Beta

## Complete Foundation Rewrite
TypeScript 7.0 Beta marks a historic milestone... [추측성 설명]

## Performance Improvements and Benchmarks
Compilation speed has improved by an average of 40-60%... 
[검증되지 않은 수치]

[가짜 코드 블록 포함]

## New Language Features and Syntax
TypeScript 7.0 introduces several powerful language features...
[원문에 없는 기능 임의 작성]

## Breaking Changes and Migration Guide
[추측성 마이그레이션 가이드]
```

#### 새 프롬프트 출력 (예상)

```markdown
TypeScript 7.0 Beta is now available, featuring a complete compiler 
rewrite. The TypeScript team announced this in their official blog.

## What's actually new

The 7.0 release rewrites the compiler foundation, with the team 
reporting performance improvements for medium-to-large projects. 
Specific benchmarks and the full feature list are detailed in the 
original announcement.

## What it means for your config

For most projects, your existing tsconfig.json should continue to work — 
this is a compiler-internal change, not a config-format change. However, 
if you're maintaining a large monorepo or using custom build pipelines, 
testing 7.0 Beta in a separate branch is worth scheduling.

The announcement doesn't yet detail breaking changes for tsconfig 
options specifically; we'll revisit once the migration docs are published.

## Recommended next step

If you're starting a new project, [generate a tsconfig.json](/en/generator/tsconfig)
with current best practices — these will likely remain valid in 7.0. 
For existing projects, hold off on upgrading until the stable release lands.

---

**Read the full announcement on Microsoft TypeScript Blog** → 
[Announcing TypeScript 7.0 Beta](https://devblogs.microsoft.com/...)
```

### 8.2 차이 요약

| 항목 | 기존 출력 | 새 출력 |
|------|---------|--------|
| 단어 수 | ~1,500 | ~250 |
| 추측성 수치 | 다수 포함 | 없음 |
| 가짜 코드 | 있음 | 없음 |
| ConfigDeck 관점 | 없음 | 전용 섹션 |
| Generator CTA | 글 말미 별도 박스 | 본문 자연스러운 인라인 |
| 정직성 신호 | View Original 링크 | isBasedOn + 명확한 CTA |

---

## 9. 단계적 적용 계획

한 번에 전체를 바꾸면 구글이 급격한 변화를 부정적으로 받아들일 수 있다. 단계적 적용을 권장한다.

### Phase 1: 신규 발행 전환 (1주차)

```
□ 새 buildPrompt 함수 배포
□ getSourceName, getGeneratorUrl 헬퍼 추가
□ Content Collection 스키마에 신규 필드 추가 (.optional()로 시작)
□ 자동 검증 시스템 활성화
□ 신규 발행 5~10편 생성 후 수동 검토
□ 검증 통과율, 분량 분포 모니터링
```

### Phase 2: 인프라 보강 (2주차)

```
□ ArticleLayout에 BlogPosting JSON-LD 추가
□ isBasedOn 속성 적용
□ "View Original" → 글 하단 CTA 패턴으로 UX 변경
□ 자동 재시도 + 수동 검토 큐 시스템 구축
```

### Phase 3: 기존 아티클 처리 (3~6주차)

기존 저품질 아티클 처리 옵션:

| 옵션 | 적용 대상 | 작업량 |
|------|---------|--------|
| **A. 재생성** | 트래픽이 있는 핵심 글 (상위 20%) | 높음 |
| **B. noindex 처리** | 트래픽 없는 글 (하위 50%) | 낮음 |
| **C. 점진적 삭제** | 완전 미사용 글 | 낮음 |

**권장 접근**: Search Console에서 노출 0인 글들은 즉시 B 또는 C로, 노출 있는 글은 A로 처리. 한 번에 너무 많은 변화는 피한다.

### Phase 4: 모니터링 (지속)

```
□ Search Console에서 색인 페이지 수 변화 추적
□ 평균 게재순위 변화 (개선 신호)
□ 평균 CTR 변화 (콘텐츠 품질 신호)
□ "크롤링됐으나 색인되지 않음" 페이지 수 감소 확인
□ 도메인 권위 회복 시 Generator 페이지 노출 동반 상승 확인
```

---

## 10. 예상 효과

### 10.1 정량 효과

| 지표 | 현재 | 6주 후 (예상) |
|------|------|-------------|
| 글당 평균 분량 | ~1,500 단어 | ~500 단어 |
| Fabrication 발생률 | 추정 30%+ | <5% (자동 검증 통과 글) |
| AI 탐지 패턴 노출 | 빈번 | 거의 없음 (금칙어 차단) |
| 자가 가치 콘텐츠 비율 | 0% | 100% (전용 섹션 강제) |
| 발행 페이지의 평균 색인 시간 | ? | 단축 예상 (품질 신호 개선) |

### 10.2 정성 효과

- **Helpful Content 페널티 위험 해소**: `isBasedOn` 명시 + 정직한 출처 표시로 derivative work의 정당성 확보
- **도메인 권위 회복**: 저품질 콘텐츠 감소 → 사이트 전체 평가 상승
- **Generator 페이지 동반 상승**: 도메인 권위가 회복되면 핵심 페이지 검색 노출 개선
- **사용자 신뢰 회복**: 가짜 코드·잘못된 정보 차단으로 개발자 신뢰도 향상
- **운영 비용 절감**: 짧은 글 → AI API 토큰 사용량 감소

### 10.3 잠재 리스크 및 대응

| 리스크 | 가능성 | 대응 |
|--------|------|------|
| 단기적으로 페이지뷰 감소 | 높음 | 의도된 결과. 품질 우선 전환의 일부 |
| 짧은 글에 대한 사용자 불만 | 낮음 | 명확한 가치 + 원문 링크로 보완 |
| 검증 실패율이 너무 높음 | 중간 | 프롬프트 미세 조정 후 재배포 |
| 기존 아티클 noindex 시 일시적 노출 감소 | 중간 | 점진적 적용으로 충격 분산 |

---

## 11. 핵심 권고

### 즉시 실행 (이번 주)

1. **새 `buildPrompt` 함수 배포** — 기존 함수와 1:1 교체
2. **보조 헬퍼 추가** — `getSourceName`, `getGeneratorUrl`
3. **자동 검증 시스템 가동** — 저품질 글의 자동 발행 차단

### 단기 (2주 내)

4. **Content Collection 스키마 업데이트** — 신규 필드 추가
5. **ArticleLayout에 BlogPosting JSON-LD 추가** — `isBasedOn` 명시
6. **출처 표시 UX 개편** — 상단 → 하단 CTA로 전환

### 중기 (1~2개월)

7. **기존 아티클 처리** — 트래픽별 차등 대응 (재생성/noindex/삭제)
8. **Search Console 모니터링** — 색인 페이지 수, 평균 순위, CTR 추적
9. **프롬프트 미세 조정** — 실제 출력 결과 기반 반복 개선

---

## 12. 결론

현재 프롬프트의 문제는 "AI가 잘못 답한다"가 아니라 **"AI가 잘못된 답을 만들어내도록 강제하고 있다"**는 데 있다. 800자 이상, 4섹션 이상, 코드 예시 필수 같은 요구는 원문에 정보가 부족한 상황에서 fabrication을 유일한 해결책으로 만든다.

이를 해결하는 핵심은 **포지셔닝 자체의 전환**이다. ConfigDeck이 모든 뉴스를 깊이 보도해야 한다는 발상을 버리고, **"우리는 코멘터리를 제공한다, 원문은 원문대로 존중한다"**는 정직한 모델로 전환하면, 짧고 가치 있는 콘텐츠가 자연스럽게 나온다.

또한 이 전환은 단순히 페널티 회피가 아니라 **ConfigDeck의 진짜 강점을 살리는 방향**이기도 하다. ConfigDeck은 "TypeScript에 대해 잘 아는 사이트"가 아니라 **"개발자 설정 파일에 대해 잘 아는 사이트"**다. 모든 뉴스를 "이게 당신의 설정 파일에 무엇을 의미하는가" 관점으로 다루는 것이 ConfigDeck만이 줄 수 있는 가치이며, 이것이 코멘터리 모델로 자연스럽게 실현된다.

새 프롬프트 + 자동 검증 + Schema.org 보강의 조합으로, ConfigDeck은 SEO 리스크를 해소하면서 동시에 **장기적인 콘텐츠 차별화 기반**을 마련할 수 있다.

---

**작성일**: 2026-05-11
**다음 점검 권장 시점**: 새 프롬프트 적용 4주 후 (검증 통과율 및 검색 지표 재측정)
