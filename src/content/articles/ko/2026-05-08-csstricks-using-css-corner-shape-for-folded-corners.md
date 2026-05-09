---
id: "https://css-tricks.com/?p=393431"
tool: "csstricks"
title: "CSS corner-shape로 접힌 모서리 효과 만들기"
link: "https://css-tricks.com/using-css-corner-shape-for-folded-corners/"
pubDate: 2026-05-08T13:54:10.000Z
summary: "CSS의 새로운 corner-shape 속성을 사용하여 복잡한 JavaScript나 이미지 없이도 접힌 모서리 효과를 구현하는 방법을 소개합니다. 기존의 clip-path나 pseudo-element 방식보다 훨씬 간단하고 직관적인 접근법을 제시합니다."
---

## CSS corner-shape란?

**CSS corner-shape**는 CSS Working Group에서 논의 중인 새로운 속성으로, 요소의 모서리를 다양한 형태로 변형할 수 있게 해줍니다. 기존의 `border-radius`가 원형 모서리만 지원했다면, `corner-shape`는 훨씬 다양한 모서리 형태를 제공합니다.

이 속성은 아직 실험적 단계에 있지만, 접힌 종이나 카드 효과, 기하학적 디자인 등을 구현할 때 매우 유용한 도구가 될 것으로 예상됩니다. 특히 **접힌 모서리(folded corners)** 효과를 만들 때 기존 방식보다 훨씬 간단하고 직관적인 해결책을 제공합니다.

## 기존 접힌 모서리 구현 방식의 한계

전통적으로 접힌 모서리 효과를 구현하려면 여러 복잡한 방법을 사용해야 했습니다:

- **Pseudo-elements (::before, ::after)** 사용
- **clip-path** 속성으로 복잡한 경로 정의
- **SVG** 이미지 활용
- **JavaScript**와 Canvas를 이용한 동적 생성

```css
/* 기존 방식 - pseudo-element 사용 */
.folded-corner::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-bottom: 20px solid #ccc;
}
```

이러한 방식들은 코드가 복잡하고, 유지보수가 어려우며, 반응형 디자인에서 일관성을 유지하기 힘든 문제가 있었습니다.

## corner-shape를 활용한 접힌 모서리 구현

**CSS corner-shape**를 사용하면 접힌 모서리 효과를 매우 간단하게 구현할 수 있습니다:

```css
.folded-corner {
  corner-shape: fold 20px;
  background: #f0f0f0;
  padding: 20px;
  width: 300px;
  height: 200px;
}

/* 특정 모서리만 접힌 효과 적용 */
.top-right-fold {
  corner-shape: round round fold round;
  /* 순서: top-left, top-right, bottom-right, bottom-left */
}
```

### 다양한 접힌 효과 옵션

`corner-shape`는 여러 값을 지원하여 다양한 접힌 효과를 만들 수 있습니다:

- `fold 15px` - 기본 접힌 효과 (15px 크기)
- `fold 20px 10px` - 너비와 높이를 다르게 설정
- `sharp-fold 25px` - 날카로운 접힌 효과
- `round-fold 30px` - 둥근 접힌 효과

```css
.card-variations {
  /* 부드러운 접힌 효과 */
  .soft-fold {
    corner-shape: round round round-fold 20px;
  }
  
  /* 날카로운 접힌 효과 */
  .sharp-fold {
    corner-shape: round round sharp-fold 25px;
  }
  
  /* 여러 모서리에 다른 효과 */
  .multi-fold {
    corner-shape: fold 15px round fold 10px round;
  }
}
```

## 실제 활용 사례와 예제

접힌 모서리 효과는 다양한 웹 디자인 요소에서 활용할 수 있습니다:

### 카드 컴포넌트

```css
.card {
  corner-shape: round round fold 30px round;
  background: linear-gradient(135deg, #fff 0%, #f8f8f8 100%);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 24px;
  margin: 16px;
}

.card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ddd 0%, #ccc 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
```

### 스티커 노트 효과

```css
.sticky-note {
  corner-shape: round 5px round round fold 20px;
  background: #ffd700;
  width: 200px;
  height: 200px;
  transform: rotate(2deg);
  box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
  font-family: 'Handlee', cursive;
}
```

### 가격 태그 디자인

```css
.price-tag {
  corner-shape: fold 15px round round round;
  background: #e74c3c;
  color: white;
  padding: 8px 12px;
  position: relative;
  display: inline-block;
}
```

## 브라우저 지원 현황과 대안

**CSS corner-shape**는 아직 실험적 기능이므로 브라우저 지원이 제한적입니다. 현재 상황과 대안을 고려해야 합니다:

### 점진적 향상(Progressive Enhancement) 적용

```css
/* 기본 스타일 (모든 브라우저) */
.folded-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

/* corner-shape 지원 브라우저용 */
@supports (corner-shape: fold 20px) {
  .folded-card {
    border-radius: 8px 8px 8px 0;
    corner-shape: round round round fold 20px;
  }
}

/* Fallback을 위한 clip-path */
@supports not (corner-shape: fold 20px) {
  .folded-card {
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
  }
}
```

### PostCSS 플러그인 활용

corner-shape를 사용하기 위한 PostCSS 플러그인을 개발하거나 기존 플러그인을 활용할 수 있습니다:

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-corner-shape-polyfill'),
    require('autoprefixer')
  ]
}
```

### 개발 환경 설정

현재 corner-shape를 실험하려면 다음과 같은 환경 설정이 필요합니다:

- **Chrome Canary** - experimental features 플래그 활성화
- **Firefox Nightly** - CSS experimental features 활성화  
- **개발자 도구**에서 실험적 CSS 기능 활성화

이 새로운 CSS 기능은 웹 디자인의 표현력을 크게 향상시킬 것이며, 복잡한 도형이나 장식적 요소를 훨씬 간단하게 구현할 수 있게 해줄 것입니다.