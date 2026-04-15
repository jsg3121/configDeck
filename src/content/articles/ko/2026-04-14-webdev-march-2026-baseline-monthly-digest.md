---
id: "https://web.dev/blog/baseline-digest-mar-2026?hl=en"
tool: "webdev"
title: "March 2026 Baseline monthly digest"
link: "https://web.dev/blog/baseline-digest-mar-2026?hl=en"
pubDate: 2026-04-14T07:00:00.000Z
summary: "2026년 3월 Baseline의 주요 업데이트와 새로운 웹 표준 지원 현황을 정리한 월간 리포트입니다. 최신 웹 API와 CSS 기능의 브라우저 지원 상태를 확인하고 실무 적용 가이드를 제공합니다."
---

## Baseline 2026 주요 업데이트 개요

**Baseline**은 주요 브라우저에서 안정적으로 지원되는 웹 기술들을 추적하고 분류하는 이니셔티브로, 2026년 3월에는 여러 중요한 웹 표준이 새롭게 **Baseline 2026**에 포함되었습니다. 이번 업데이트는 특히 **CSS Grid Level 2**, **Web Components v2**, 그리고 **새로운 JavaScript API**들의 안정적인 지원을 확인할 수 있는 중요한 이정표가 되었습니다.

개발자들은 이제 이러한 기술들을 프로덕션 환경에서 안심하고 사용할 수 있으며, 별도의 폴리필이나 호환성 검증 없이도 현대적인 웹 애플리케이션을 구축할 수 있습니다. 특히 **Chrome 124**, **Firefox 125**, **Safari 17.4** 버전부터 모든 기능이 완전히 지원됩니다.

## CSS Grid Level 2의 Baseline 지원

**CSS Grid Level 2**가 드디어 Baseline 2026에 포함되면서, 서브그리드(`subgrid`) 기능을 모든 주요 브라우저에서 안정적으로 사용할 수 있게 되었습니다. 이는 복잡한 레이아웃 구조에서 부모 그리드의 트랙을 자식 요소가 직접 참조할 수 있는 혁신적인 기능입니다.

```css
.parent-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
}

.child-subgrid {
  grid-column: 2 / 4;
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
```

서브그리드를 활용하면 카드 레이아웃에서 각 카드의 제목과 내용 높이를 자동으로 정렬할 수 있으며, 복잡한 폼 레이아웃에서도 일관된 정렬을 쉽게 구현할 수 있습니다. 이전에는 JavaScript나 복잡한 CSS 해킹이 필요했던 작업들이 이제 순수 CSS만으로 해결 가능합니다.

## Web Components v2 표준화 완료

**Web Components v2** 사양이 모든 브라우저에서 완전히 지원되면서 Baseline 2026에 추가되었습니다. 특히 **Declarative Shadow DOM**과 **Scoped Custom Element Registry**가 핵심 개선사항입니다.

```html
<!-- Declarative Shadow DOM 예시 -->
<my-component>
  <template shadowroot="open">
    <style>
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid #ccc;
      }
    </style>
    <slot></slot>
  </template>
  <p>컴포넌트 내용</p>
</my-component>
```

```javascript
// Scoped Registry 사용
class MyApp extends HTMLElement {
  constructor() {
    super();
    this.registry = new CustomElementRegistry();
    this.registry.define('my-button', MyButton);
    this.attachShadow({ 
      mode: 'open', 
      registry: this.registry 
    });
  }
}
```

이러한 개선으로 서버사이드 렌더링에서도 Web Components를 효율적으로 사용할 수 있으며, 대규모 애플리케이션에서 컴포넌트 간 네이밍 충돌 문제를 완전히 해결할 수 있습니다.

## 새로운 JavaScript API 지원 현황

2026년 3월 Baseline 업데이트에는 몇 가지 중요한 **JavaScript API**들이 새롭게 포함되었습니다. **Temporal API**, **Import Assertions**, 그리고 **Top-level await in modules**가 대표적입니다.

**Temporal API**는 기존 `Date` 객체의 한계를 극복한 새로운 날짜/시간 처리 API입니다:

```javascript
// 기존 Date 객체의 문제점
const oldDate = new Date('2026-03-15');
console.log(oldDate.getMonth()); // 2 (0-based indexing)

// Temporal API 사용
const plainDate = Temporal.PlainDate.from('2026-03-15');
console.log(plainDate.month); // 3 (1-based indexing)

// 시간대 처리
const zonedDateTime = Temporal.ZonedDateTime.from({
  timeZone: 'Asia/Seoul',
  year: 2026,
  month: 3,
  day: 15,
  hour: 14,
  minute: 30
});
```

**Import Assertions**를 통해 JSON과 CSS 파일을 더 안전하게 임포트할 수 있습니다:

```javascript
// JSON 파일 임포트
import config from './config.json' assert { type: 'json' };

// CSS 모듈 임포트 (Constructable Stylesheets와 함께)
import styles from './component.css' assert { type: 'css' };
document.adoptedStyleSheets = [styles];
```

## 개발자를 위한 실무 적용 가이드

Baseline 2026의 새로운 기능들을 프로덕션 환경에 적용하기 위해서는 몇 가지 고려사항이 있습니다. 먼저 **브라우저 지원 범위**를 명확히 설정해야 합니다.

현재 Baseline 2026 기능들은 다음 브라우저 버전부터 지원됩니다:
- **Chrome 124+** (2024년 3월 출시)
- **Firefox 125+** (2024년 4월 출시)  
- **Safari 17.4+** (2024년 3월 출시)
- **Edge 124+** (2024년 3월 출시)

기존 프로젝트에서 마이그레이션할 때는 **점진적 개선(Progressive Enhancement)** 방식을 권장합니다:

```javascript
// Feature Detection 예시
if ('shadowRoot' in Element.prototype && 'CustomElementRegistry' in window) {
  // Web Components v2 기능 사용
  class MyComponent extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  }
} else {
  // 폴백 구현
  console.warn('Web Components not supported, using fallback');
}
```

CSS에서는 `@supports` 규칙을 활용하여 안전하게 새로운 기능을 적용할 수 있습니다:

```css
/* 기본 레이아웃 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* 서브그리드 지원 시 개선된 레이아웃 */
@supports (grid-template-columns: subgrid) {
  .nested-grid {
    grid-column: span 2;
    display: grid;
    grid-template-columns: subgrid;
  }
}
```

번들러 설정에서도 새로운 기능들을 고려해야 합니다. **Webpack 5**나 **Vite 4+**에서는 Import Assertions를 기본 지원하므로 별도 플러그인 없이 JSON과 CSS 임포트를 사용할 수 있습니다.