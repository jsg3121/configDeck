# 메타태그 가이드라인

## 기본 메타태그

모든 페이지에 다음 메타태그를 포함한다.

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{페이지 제목} | ConfigDeck</title>
  <meta name="description" content="{페이지 설명 (120~160자)}" />
  <link rel="canonical" href="{현재 페이지의 정규 URL}" />
</head>
```

### title 규칙

- 형식: `{페이지 고유 제목} | ConfigDeck`
- 길이: 60자 이내 (Google 검색결과 표시 제한)
- 각 페이지마다 고유한 title을 사용한다

### description 규칙

- 길이: 120~160자
- 페이지의 핵심 내용과 사용자 가치를 요약한다
- 각 페이지마다 고유한 description을 사용한다

### 페이지 유형별 패턴

```
홈:
  title: "ConfigDeck — Dev Config File Generator"
  description: "Generate ESLint, Prettier, TypeScript, and other config files for your project. Select your stack, customize options, and download instantly."

파일별 랜딩 (/files/eslint-config):
  title: "ESLint Config Generator — ConfigDeck"
  description: "Generate ESLint flat config for React, Vue, Next.js and more. Choose rules, plugins, and strictness level, then download your eslint.config.mjs."

스택별 랜딩 (/stacks/frontend/react):
  title: "React Project Config Files — ConfigDeck"
  description: "Generate all config files for a React project: ESLint, Prettier, TypeScript, Vite, and more. One click setup with best practice defaults."

블로그:
  title: "{포스트 제목} — ConfigDeck Blog"
  description: "{포스트 요약}"
```

**참고:** [Google - Meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)

## Open Graph / Twitter Card

소셜 미디어 공유 시 표시되는 정보를 제어한다.

```html
<!-- Open Graph -->
<meta property="og:title" content="{제목}" />
<meta property="og:description" content="{설명}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{정규 URL}" />
<meta property="og:image" content="{OG 이미지 URL}" />
<meta property="og:locale" content="en" />
<meta property="og:locale:alternate" content="ko" />
<meta property="og:site_name" content="ConfigDeck" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{제목}" />
<meta name="twitter:description" content="{설명}" />
<meta name="twitter:image" content="{OG 이미지 URL}" />
```

### OG 이미지 규격

- 크기: 1200x630px (권장)
- 형식: PNG 또는 JPG
- 페이지 유형별 OG 이미지를 별도 제작하거나, 동적 생성을 검토한다

> **Why:** OG/Twitter Card 태그가 없으면 소셜 미디어에서 공유 시 임의의 텍스트/이미지가 표시된다. 적절한 메타태그는 클릭률(CTR)에 직접 영향을 준다.

**참고:**

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards)

## 다국어 (hreflang)

ConfigDeck은 영어/한국어를 지원하므로 모든 페이지에 hreflang 태그를 포함한다.

```html
<!-- /en/files/eslint-config 페이지에서 -->
<link rel="alternate" hreflang="en" href="https://config-deck.dev/en/files/eslint-config" />
<link rel="alternate" hreflang="ko" href="https://config-deck.dev/ko/files/eslint-config" />
<link rel="alternate" hreflang="x-default" href="https://config-deck.dev/en/files/eslint-config" />
```

### hreflang 규칙

- **자기 참조 필수**: 현재 페이지의 언어도 반드시 포함한다
- **양방향 참조 필수**: en 페이지가 ko를 가리키면, ko 페이지도 en을 가리켜야 한다
- **x-default**: 언어 감지/선택 페이지 또는 기본 언어 페이지를 지정한다 (ConfigDeck은 영어를 기본으로)
- 향후 일본어/포르투갈어 추가 시 모든 페이지의 hreflang 세트를 확장한다

> **Why:** hreflang이 없으면 Google이 같은 콘텐츠의 다국어 버전을 중복 콘텐츠로 판단하거나, 잘못된 언어 버전을 검색 결과에 노출할 수 있다.

**참고:** [Google - Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)

## canonical URL

각 페이지는 자기 자신을 canonical URL로 지정한다.

```html
<!-- /en/files/eslint-config -->
<link rel="canonical" href="https://config-deck.dev/en/files/eslint-config" />

<!-- /ko/files/eslint-config -->
<link rel="canonical" href="https://config-deck.dev/ko/files/eslint-config" />
```

### canonical 규칙

- 다국어 페이지: 각 언어 버전이 **자기 자신을 canonical**로 지정 (언어별 콘텐츠가 다르므로)
- HTTPS, 트레일링 슬래시 등 URL 형식을 일관되게 유지한다
- 쿼리 파라미터가 포함된 URL(공유 링크 등)은 파라미터 없는 기본 URL을 canonical로 지정한다

**참고:** [Google - Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)

## Astro에서의 구현

Layout 컴포넌트에서 props로 메타태그 데이터를 받아 `<head>`에 주입하는 패턴을 사용한다.

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  alternateUrls?: { lang: string; url: string }[];
}

const { title, description, ogImage, canonicalUrl, alternateUrls } = Astro.props;
const siteUrl = 'https://config-deck.dev';
const canonical = canonicalUrl ?? new URL(Astro.url.pathname, siteUrl).href;
---

<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | ConfigDeck</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    {alternateUrls?.map(({ lang, url }) => (
      <link rel="alternate" hreflang={lang} href={url} />
    ))}

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="og:site_name" content="ConfigDeck" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {ogImage && <meta name="twitter:image" content={ogImage} />}
  </head>
  <body>
    <slot />
  </body>
</html>
```

> **Why:** Layout 컴포넌트에서 메타태그를 관리하면 모든 페이지에서 일관된 SEO 태그가 보장되고, 누락을 방지할 수 있다.

**참고:** [Astro - Head Tags](https://docs.astro.build/en/guides/head-tags/)

## 참고 자료

- [Google - Meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards)
- [Google - Localized versions (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google - Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Astro - Head Tags](https://docs.astro.build/en/guides/head-tags/)
