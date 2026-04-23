---
id: "https://css-tricks.com/?p=392286"
tool: "csstricks"
title: "마크다운 컴포넌트로 Astro 개발 경험 향상하기"
link: "https://css-tricks.com/astro-markdown-component/"
pubDate: 2026-04-22T13:49:57.000Z
summary: "Astro에서 마크다운 컴포넌트를 활용하여 마크업 작성량을 줄이고 타이포그래피 기호를 자동 변환하는 방법을 소개합니다. 개발 효율성과 콘텐츠 품질을 동시에 향상시킬 수 있는 실용적인 접근법입니다."
---

## Astro 마크다운 컴포넌트의 필요성

Astro 프레임워크에서 콘텐츠 작성 시 반복적인 HTML 마크업을 줄이고 타이포그래피를 개선하기 위해 **마크다운 컴포넌트**를 활용할 수 있습니다. 이 접근법은 개발자가 더 빠르게 콘텐츠를 작성하면서도 일관된 스타일링과 타이포그래피를 유지할 수 있게 해줍니다.

마크다운 컴포넌트는 두 가지 주요 이점을 제공합니다. 첫째, HTML 마크업 작성량을 현저히 줄여주어 개발 속도를 향상시킵니다. 둘째, 타이포그래피 기호를 자동으로 변환해 콘텐츠의 품질을 높여줍니다.

## 마크다운 컴포넌트 기본 구현

Astro에서 마크다운 컴포넌트를 구현하기 위해서는 먼저 **marked** 라이브러리나 **remark** 같은 마크다운 파서를 설치해야 합니다.

```bash
npm install marked
```

기본적인 마크다운 컴포넌트를 생성해보겠습니다:

```astro
---
// MarkdownComponent.astro
import { marked } from 'marked';

interface Props {
  content: string;
  class?: string;
}

const { content, class: className = '' } = Astro.props;
const htmlContent = marked(content);
---

<div class={`markdown-content ${className}`} set:html={htmlContent} />

<style>
  .markdown-content {
    line-height: 1.6;
    font-family: system-ui, sans-serif;
  }
  
  .markdown-content h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #2563eb;
  }
  
  .markdown-content p {
    margin-bottom: 1rem;
  }
  
  .markdown-content code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
  }
</style>
```

## 타이포그래피 기호 자동 변환 기능

마크다운 컴포넌트의 핵심 기능 중 하나는 타이포그래피 기호를 자동으로 변환하는 것입니다. 이를 위해 **marked** 라이브러리의 옵션을 설정하거나 커스텀 변환 함수를 추가할 수 있습니다.

```astro
---
import { marked } from 'marked';

interface Props {
  content: string;
  enableTypography?: boolean;
}

const { content, enableTypography = true } = Astro.props;

// 타이포그래피 변환 함수
function enhanceTypography(text: string): string {
  if (!enableTypography) return text;
  
  return text
    .replace(/--/g, '–')  // em dash
    .replace(/\.\.\./g, '…')  // ellipsis
    .replace(/"/g, '"')  // opening quote
    .replace(/"/g, '"')  // closing quote
    .replace(/'/g, ''')  // apostrophe
    .replace(/\(c\)/gi, '©')  // copyright
    .replace(/\(tm\)/gi, '™')  // trademark
    .replace(/\(r\)/gi, '®');  // registered
}

// marked 설정
marked.setOptions({
  breaks: true,
  gfm: true,
});

let processedContent = content;
if (enableTypography) {
  processedContent = enhanceTypography(content);
}

const htmlContent = marked(processedContent);
---

<div class="markdown-content" set:html={htmlContent} />
```

## 실제 사용 예시와 활용 사례

마크다운 컴포넌트를 실제 Astro 페이지에서 사용하는 방법을 살펴보겠습니다:

```astro
---
// pages/blog/[slug].astro
import MarkdownComponent from '../../components/MarkdownComponent.astro';

const content = `
# 블로그 포스트 제목

이것은 "인용문"입니다... 그리고 이것은 **굵은 텍스트**입니다.

## 코드 예시

다음은 JavaScript 코드입니다:

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

(c) 2024 Your Company(tm)
`;
---

<html>
  <head>
    <title>Blog Post</title>
  </head>
  <body>
    <main>
      <MarkdownComponent 
        content={content} 
        enableTypography={true}
        class="blog-post" 
      />
    </main>
  </body>
</html>
```

더 복잡한 사용 사례로는 **프론트매터**와 함께 사용하는 방법이 있습니다:

```astro
---
import MarkdownComponent from '../components/MarkdownComponent.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---

{posts.map(post => (
  <article>
    <h1>{post.data.title}</h1>
    <MarkdownComponent 
      content={post.body} 
      class="post-content"
    />
  </article>
))}
```

## 고급 기능 및 커스터마이징

마크다운 컴포넌트를 더욱 강력하게 만들기 위해 추가 기능들을 구현할 수 있습니다:

```astro
---
import { marked } from 'marked';
import hljs from 'highlight.js';

interface Props {
  content: string;
  enableCodeHighlight?: boolean;
  customRenderer?: object;
}

const { content, enableCodeHighlight = true, customRenderer = {} } = Astro.props;

// 커스텀 렌더러 설정
const renderer = new marked.Renderer();

// 코드 하이라이팅 설정
if (enableCodeHighlight) {
  renderer.code = function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(code, { language: validLanguage });
    return `<pre><code class="hljs language-${validLanguage}">${highlighted.value}</code></pre>`;
  };
}

// 링크 처리 커스터마이징
renderer.link = function(href, title, text) {
  const isExternal = href.startsWith('http');
  const target = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
  const titleAttr = title ? `title="${title}"` : '';
  
  return `<a href="${href}" ${target} ${titleAttr}>${text}</a>`;
};

// 이미지 처리 개선
renderer.image = function(href, title, text) {
  return `
    <figure>
      <img src="${href}" alt="${text}" loading="lazy" />
      ${title ? `<figcaption>${title}</figcaption>` : ''}
    </figure>
  `;
};

marked.setOptions({
  renderer: renderer,
  ...customRenderer
});

const htmlContent = marked(content);
---

<div class="enhanced-markdown" set:html={htmlContent} />

<style>
  .enhanced-markdown figure {
    margin: 1.5rem 0;
    text-align: center;
  }
  
  .enhanced-markdown figcaption {
    font-style: italic;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  .enhanced-markdown pre {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
</style>
```

이러한 마크다운 컴포넌트를 통해 Astro 프로젝트의 콘텐츠 작성 효율성을 크게 향상시킬 수 있으며, 일관된 타이포그래피와 스타일링을 자동으로 적용할 수 있습니다.