# 구조화 데이터 가이드라인

## 기본 원칙

JSON-LD 형식으로 구조화 데이터를 삽입하여 Google이 콘텐츠의 유형과 속성을 정확히 파악할 수 있도록 한다.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "...",
  ...
}
</script>
```

> **Why:** 구조화 데이터는 Google 리치 리절트(별점, FAQ 아코디언, 단계별 가이드 등)의 표시 조건이며, 리치 리절트가 표시되지 않더라도 검색엔진의 콘텐츠 이해도를 높인다.

**참고:**

- [Schema.org](https://schema.org/)
- [Google - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

## ConfigDeck에 적합한 스키마 타입

### WebApplication — 서비스 자체

ConfigDeck을 웹 애플리케이션으로 설명한다. 홈 페이지에 삽입한다.

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ConfigDeck",
  "url": "https://config-deck.dev",
  "description": "Generate ESLint, Prettier, TypeScript and other config files for your project.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "browserRequirements": "Requires JavaScript",
  "inLanguage": ["en", "ko"]
}
```

**참고:** [Schema.org - WebApplication](https://schema.org/WebApplication)

### FAQPage — FAQ 페이지 및 파일별 랜딩

FAQ 페이지와 파일별 랜딩 페이지의 "자주 묻는 질문" 섹션에 적용한다.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ESLint flat config?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ESLint flat config (eslint.config.mjs) is the new default configuration format since ESLint v9, replacing .eslintrc."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use the generated config in a production project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All generated configs follow official best practices and are suitable for production use."
      }
    }
  ]
}
```

> **주의:** 2023년 8월부터 Google은 FAQPage 리치 리절트 표시를 대폭 축소했다. 그러나 구조화 데이터 자체는 Google의 콘텐츠 이해에 여전히 도움이 되므로 유지한다.

**참고:**

- [Schema.org - FAQPage](https://schema.org/FAQPage)
- [Google - FAQ Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

### HowTo — 문서/가이드 페이지

단계별 가이드 콘텐츠에 적용한다. 블로그나 문서 페이지의 "~하는 방법" 콘텐츠에 적합하다.

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to generate ESLint config with ConfigDeck",
  "description": "Step-by-step guide to create a customized ESLint configuration file.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Select your stack",
      "text": "Choose your development stack: React, Vue, Next.js, or Node."
    },
    {
      "@type": "HowToStep",
      "name": "Customize rules",
      "text": "Select ESLint rules, strictness level, and plugins."
    },
    {
      "@type": "HowToStep",
      "name": "Download",
      "text": "Preview the generated config and download as a file or copy to clipboard."
    }
  ]
}
```

**참고:**

- [Schema.org - HowTo](https://schema.org/HowTo)
- [Google - HowTo Structured Data](https://developers.google.com/search/docs/appearance/structured-data/how-to)

### SoftwareSourceCode — 생성된 코드 예시

파일별 랜딩 페이지의 예시 출력 코드에 적용할 수 있다.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "ESLint flat config example",
  "description": "Example ESLint flat config for React + TypeScript project",
  "programmingLanguage": "JavaScript",
  "codeSampleType": "full",
  "runtimePlatform": "Node.js"
}
```

**참고:** [Schema.org - SoftwareSourceCode](https://schema.org/SoftwareSourceCode)

## 페이지 유형별 적용 매핑

- **홈**: `WebApplication`
- **생성기**: 없음 (동적 인터랙티브 페이지이므로 구조화 데이터 효용이 낮음)
- **파일별 랜딩**: `FAQPage` (해당 파일 관련 FAQ가 있는 경우)
- **스택별 랜딩**: `FAQPage` (해당 스택 관련 FAQ가 있는 경우)
- **블로그/문서**: `HowTo` (단계별 가이드), `Article` (일반 블로그 포스트)
- **FAQ 페이지**: `FAQPage`

## Astro에서의 구현

Layout 또는 페이지 컴포넌트에서 JSON-LD를 `<head>`에 삽입한다.

```astro
---
// src/components/JsonLd.astro
interface Props {
  data: Record<string, unknown>;
}

const { data } = Astro.props;
const jsonLd = JSON.stringify({ "@context": "https://schema.org", ...data });
---

<script type="application/ld+json" set:html={jsonLd} />
```

사용 예:

```astro
---
import JsonLd from '@/components/JsonLd.astro';
---

<JsonLd data={{
  "@type": "WebApplication",
  "name": "ConfigDeck",
  "url": "https://config-deck.dev",
  "applicationCategory": "DeveloperApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}} />
```

## 검증

구조화 데이터를 구현한 후 배포 전에 반드시 검증한다.

- [Google Rich Results Test](https://search.google.com/test/rich-results) — 리치 리절트 자격 확인
- [Schema.org Validator](https://validator.schema.org/) — 스키마 문법 검증

## 참고 자료

- [Schema.org](https://schema.org/)
- [Google - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org - WebApplication](https://schema.org/WebApplication)
- [Google - FAQ Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Google - HowTo Structured Data](https://developers.google.com/search/docs/appearance/structured-data/how-to)
- [Schema.org - SoftwareSourceCode](https://schema.org/SoftwareSourceCode)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
