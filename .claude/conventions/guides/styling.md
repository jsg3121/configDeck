# 스타일링 컨벤션

## 기본 원칙: 유틸리티 우선

Tailwind CSS의 유틸리티 클래스를 직접 사용하는 것을 최우선으로 한다. 커스텀 CSS 클래스는 최후의 수단이다.

```astro
<!-- BAD: 커스텀 CSS 클래스 남용 -->
<div class="card-wrapper">
  <h2 class="card-title">ESLint Config</h2>
</div>

<style>
  .card-wrapper {
    padding: 1.5rem;
    border-radius: 0.5rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
</style>

<!-- GOOD: Tailwind 유틸리티 클래스 직접 사용 -->
<div class="p-6 rounded-lg bg-white shadow-sm">
  <h2 class="text-xl font-semibold text-gray-800">ESLint Config</h2>
</div>
```

> **Why:** 유틸리티 클래스는 HTML만 보고 스타일을 파악할 수 있다. 별도 CSS 파일을 오가며 확인할 필요가 없어 개발 속도와 유지보수성이 높아진다.

**참고:** [Tailwind CSS - Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)

## @apply 사용 지양

`@apply`는 Tailwind의 유틸리티 우선 철학에 반하므로 가급적 사용하지 않는다.

```css
/* BAD: @apply로 커스텀 클래스 생성 */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
}

/* 이렇게 할 바에는 컴포넌트로 추출하는 것이 낫다 */
```

```astro
<!-- GOOD: 반복되는 스타일은 컴포넌트로 추출 -->
<!-- src/components/common/Button.astro -->
---
interface Props {
  variant?: 'primary' | 'secondary';
}

const { variant = 'primary' } = Astro.props;

const styles = {
  primary: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
  secondary: 'px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300',
};
---

<button class={styles[variant]}>
  <slot />
</button>
```

`@apply` 허용 예외:
- 서드파티 라이브러리의 스타일을 오버라이드해야 하는 경우
- 마크다운/MDX 렌더링된 HTML에 스타일을 적용해야 하는 경우 (클래스를 직접 부여할 수 없으므로)

**참고:** [Tailwind CSS - Reusing Styles](https://tailwindcss.com/docs/reusing-styles)

## Tailwind CSS v4 설정

Tailwind v4는 `tailwind.config.js` 대신 CSS 기반 설정(`@theme`)을 사용한다.

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* 프로젝트 커스텀 색상 */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #64748b;
  --color-accent: #8b5cf6;

  /* 폰트 */
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* 브레이크포인트 (필요 시 확장) */
  --breakpoint-3xl: 1920px;
}
```

> **Why:** v4의 CSS 기반 설정은 별도 JS 설정 파일 없이 CSS 안에서 디자인 토큰을 정의할 수 있어, 에디터 자동완성과 타입 안전성이 향상된다.

## 반응형 전략

### 모바일 퍼스트

Tailwind의 기본 브레이크포인트 시스템을 따르며, 모바일 퍼스트로 작성한다.

```html
<!-- BAD: 데스크톱부터 작성하고 모바일에서 오버라이드 -->
<div class="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">

<!-- GOOD: 모바일부터 작성하고 확장 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 브레이크포인트 기준

| 접두사 | 최소 너비 | 대상 |
|--------|----------|------|
| (없음) | 0px | 모바일 |
| `sm:` | 640px | 작은 태블릿 |
| `md:` | 768px | 태블릿 |
| `lg:` | 1024px | 데스크톱 |
| `xl:` | 1280px | 넓은 데스크톱 |
| `2xl:` | 1536px | 초대형 화면 |

> **Why:** 모바일 사용자 비중이 높아지는 추세에서, 모바일 퍼스트는 핵심 콘텐츠를 먼저 설계하고 여유 공간에 맞춰 확장하는 접근이다. Tailwind도 이 방식을 기본으로 설계되었다.

## 다크모드

추후 도입 여부를 결정한다. 도입 시 Tailwind의 `dark:` variant를 사용하되, 시스템 설정 기반(`prefers-color-scheme`)과 수동 토글 병행을 검토한다.

## Svelte 컴포넌트 내 스타일

Svelte 컴포넌트에서도 Tailwind 유틸리티를 우선 사용한다. Svelte의 `<style>` 블록은 컴포넌트 스코프 CSS가 꼭 필요한 경우에만 사용한다.

```svelte
<!-- BAD: Svelte <style>로 기본 스타일링 -->
<div class="wrapper">
  <button class="btn">{label}</button>
</div>

<style>
  .wrapper { display: flex; gap: 1rem; }
  .btn { padding: 0.5rem 1rem; background: blue; color: white; }
</style>

<!-- GOOD: Tailwind 유틸리티 사용 -->
<div class="flex gap-4">
  <button class="px-4 py-2 bg-blue-600 text-white rounded">{label}</button>
</div>
```

Svelte `<style>` 허용 예외:
- Tailwind로 표현하기 어려운 복잡한 애니메이션
- 서드파티 컴포넌트 스타일 오버라이드

## 참고 자료

- [Tailwind CSS - Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)
- [Tailwind CSS - Reusing Styles](https://tailwindcss.com/docs/reusing-styles)
- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Tailwind CSS v4 - @theme](https://tailwindcss.com/docs/theme)
