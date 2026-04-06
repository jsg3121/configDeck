# 시맨틱 HTML 가이드라인

## 기본 원칙

HTML 태그는 시각적 표현이 아니라 **콘텐츠의 의미**를 기준으로 선택한다. 시맨틱 마크업은 검색엔진이 페이지 구조를 이해하고, 스크린 리더가 콘텐츠를 올바르게 전달하는 데 직접적으로 기여한다.

> **Why:** Google은 시맨틱 마크업을 통해 페이지의 주제 구조를 파악한다. `<div>` 나열보다 의미 있는 태그를 사용하면 검색엔진의 콘텐츠 이해도가 향상된다.

**참고:** [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## 섹셔닝 태그 사용 기준

### 태그별 역할

- `<header>` — 페이지 또는 섹션의 소개 콘텐츠, 내비게이션 보조
- `<nav>` — 사이트 주요 내비게이션 링크 블록. 모든 링크 그룹에 사용하지 않는다
- `<main>` — 문서의 주요 콘텐츠. **페이지당 하나만** 존재해야 한다
- `<article>` — 독립적으로 배포/재사용 가능한 콘텐츠 단위 (블로그 포스트, 설정 파일 가이드 등)
- `<section>` — 주제별 그룹핑. heading을 포함해야 한다. 단순 스타일링 래퍼로 사용 금지
- `<aside>` — 주요 콘텐츠와 간접적으로 관련된 부가 정보 (관련 링크, 추천 preset 등)
- `<footer>` — 페이지 또는 섹션의 바닥글

```html
<!-- BAD: 의미 없는 div 나열 -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">
  <div class="sidebar">...</div>
</div>
<div class="footer">...</div>

<!-- GOOD: 시맨틱 태그 사용 -->
<header>
  <nav>...</nav>
</header>
<main>
  <aside>...</aside>
</main>
<footer>...</footer>
```

**참고:** [HTML Living Standard - Sections](https://html.spec.whatwg.org/multipage/sections.html)

## Heading 계층 규칙

- `<h1>`은 **페이지당 하나**만 사용한다 — 페이지의 핵심 주제를 나타낸다
- heading은 **순차적 계층**을 유지한다 — h1 → h2 → h3 순서로, 레벨을 건너뛰지 않는다
- heading을 **폰트 크기 조절 목적**으로 사용하지 않는다 — 스타일은 Tailwind로 처리한다

```html
<!-- BAD: h1 중복, 레벨 건너뜀 -->
<h1>ConfigDeck</h1>
<h1>ESLint Config Generator</h1>
<h4>옵션 선택</h4>

<!-- GOOD: 계층적 heading -->
<h1>ESLint Config Generator</h1>
<h2>옵션 선택</h2>
<h3>규칙 설정</h3>
<h3>플러그인 선택</h3>
<h2>미리보기</h2>
```

> **Why:** Google은 heading 태그를 통해 페이지의 주제 구조를 파악한다. 계층이 깨지면 콘텐츠 구조 파악이 어려워진다.

**참고:** [Google - Use headings to outline the page](https://developers.google.com/search/docs/fundamentals/seo-starter-guide#use-headings)

## 페이지 유형별 마크업 구조

### 홈 페이지

```html
<header>
  <nav><!-- 글로벌 내비게이션 --></nav>
</header>
<main>
  <section><!-- 히어로: 서비스 소개 + CTA --></section>
  <section>
    <h2>인기 프리셋</h2>
    <!-- 프리셋 목록 -->
  </section>
  <section>
    <h2>지원하는 설정 파일</h2>
    <!-- 파일 목록 -->
  </section>
</main>
<footer><!-- 저작권, 링크 --></footer>
```

### 생성기 페이지

```html
<header>
  <nav><!-- 글로벌 내비게이션 --></nav>
</header>
<main>
  <h1>설정 파일 생성기</h1>
  <section>
    <h2>스택 선택</h2>
    <!-- Svelte 아일랜드: 옵션 선택 UI -->
  </section>
  <section>
    <h2>미리보기</h2>
    <!-- Svelte 아일랜드: 코드 미리보기 -->
  </section>
  <aside>
    <h2>추천 프리셋</h2>
    <!-- 관련 프리셋 링크 -->
  </aside>
</main>
<footer><!-- 저작권, 링크 --></footer>
```

### 파일별 랜딩 페이지 (/files/eslint-config)

```html
<header>
  <nav><!-- 글로벌 내비게이션 --></nav>
</header>
<main>
  <article>
    <h1>ESLint Config Generator</h1>
    <section>
      <h2>ESLint란?</h2>
      <p><!-- 설명 --></p>
    </section>
    <section>
      <h2>자주 사용하는 옵션</h2>
      <!-- 옵션 설명 -->
    </section>
    <section>
      <h2>예시 출력</h2>
      <pre><code><!-- 코드 예시 --></code></pre>
    </section>
  </article>
  <aside>
    <h2>관련 설정 파일</h2>
    <!-- Prettier, TSConfig 등 링크 -->
  </aside>
</main>
<footer><!-- 저작권, 링크 --></footer>
```

### 블로그 포스트

```html
<header>
  <nav><!-- 글로벌 내비게이션 --></nav>
</header>
<main>
  <article>
    <h1>ESLint flat config 마이그레이션 가이드</h1>
    <time datetime="2026-04-06">2026년 4월 6일</time>
    <section>
      <h2>기존 설정의 문제점</h2>
      <!-- 내용 -->
    </section>
    <section>
      <h2>flat config로 전환하기</h2>
      <!-- 내용 -->
    </section>
  </article>
</main>
<footer><!-- 저작권, 링크 --></footer>
```

## 접근성 기본 규칙

시맨틱 마크업과 함께 기본 접근성 규칙도 준수한다.

- 이미지에는 반드시 `alt` 속성을 포함한다 — 장식용 이미지는 `alt=""`
- 인터랙티브 요소에 `aria-label`을 제공한다 — 텍스트가 없는 아이콘 버튼 등
- 폼 요소에 `<label>`을 연결한다
- 색상만으로 정보를 전달하지 않는다

> **Why:** 접근성과 SEO는 상호 보완적이다. 스크린 리더가 이해할 수 있는 마크업은 검색엔진도 잘 이해한다.

## 참고 자료

- [MDN - Semantics in HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html)
- [HTML Living Standard - Sections](https://html.spec.whatwg.org/multipage/sections.html)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [MDN - Content Sectioning Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning)
