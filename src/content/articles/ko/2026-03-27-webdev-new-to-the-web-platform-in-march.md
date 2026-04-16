---
id: "https://web.dev/blog/web-platform-03-2026?hl=en"
tool: "webdev"
title: "New to the web platform in March"
link: "https://web.dev/blog/web-platform-03-2026?hl=en"
pubDate: 2026-03-27T07:00:00.000Z
summary: "2026년 3월에 안정화된 웹 브라우저의 최신 기능들을 소개합니다. 개발자들이 즉시 활용할 수 있는 새로운 API와 성능 개선사항들을 확인하세요."
---

## Chrome 125 안정화 주요 기능

**Chrome 125**가 안정화되면서 웹 개발자들이 기다려온 여러 기능들이 공식적으로 사용 가능해졌습니다. 이번 릴리스의 가장 주목할 만한 변화는 **Web Animations API**의 확장과 **CSS Anchor Positioning**의 개선된 지원입니다.

새로운 **`animation-timeline`** 속성을 통해 스크롤 기반 애니메이션을 더욱 직관적으로 구현할 수 있습니다:

```css
.scroll-animation {
  animation: fadeIn 1s linear;
  animation-timeline: scroll(root);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

이 기능을 활용하면 JavaScript 없이도 스크롤 진행률에 따른 부드러운 애니메이션을 구현할 수 있어, 성능 면에서 상당한 이점을 제공합니다.

## Firefox 126 베타 버전 신기능

**Firefox 126 베타**에서는 **CSS Container Queries**의 단위 지원이 대폭 강화되었습니다. 새롭게 추가된 `cqw`, `cqh`, `cqi`, `cqb` 단위들을 통해 컨테이너 크기에 기반한 반응형 디자인을 더욱 정밀하게 제어할 수 있습니다.

```css
.container {
  container-type: size;
  container-name: main;
}

.responsive-element {
  width: 50cqw; /* 컨테이너 너비의 50% */
  font-size: clamp(1rem, 4cqi, 2rem); /* 컨테이너 인라인 크기 기반 */
}

@container main (min-width: 400px) {
  .responsive-element {
    padding: 2cqh; /* 컨테이너 높이의 2% */
  }
}
```

또한 **WebGPU API**의 초기 구현이 포함되어 있어, 고성능 그래픽 처리가 필요한 웹 애플리케이션 개발에 새로운 가능성을 제시합니다.

## Safari 17.5 성능 개선사항

**Safari 17.5**는 **JavaScript 엔진 최적화**에 중점을 두었으며, 특히 **ES2024 스펙**의 주요 기능들이 추가되었습니다. `Object.groupBy()` 메서드와 개선된 **Temporal API** 지원이 포함되어 있습니다.

```javascript
// Object.groupBy를 활용한 데이터 그룹화
const products = [
  { name: 'iPhone', category: 'mobile' },
  { name: 'MacBook', category: 'laptop' },
  { name: 'iPad', category: 'tablet' }
];

const groupedProducts = Object.groupBy(products, product => product.category);
// { mobile: [...], laptop: [...], tablet: [...] }

// Temporal API를 활용한 날짜 처리
const now = Temporal.Now.plainDateTimeISO();
const nextWeek = now.add({ weeks: 1 });
const formatted = nextWeek.toLocaleString('ko-KR');
```

**WebKit**의 렌더링 성능도 크게 향상되어, 복잡한 CSS Grid 레이아웃의 렌더링 속도가 평균 **30% 개선**되었습니다.

## 크로스 브라우저 호환성 개선

이번 달의 업데이트에서 가장 반가운 소식은 **CSS Subgrid**가 모든 주요 브라우저에서 완전히 지원되기 시작했다는 점입니다. 이제 복잡한 그리드 레이아웃을 더욱 효율적으로 구현할 수 있습니다:

```css
.main-grid {
  display: grid;
  grid-template-columns: 1fr 300px 1fr;
  gap: 20px;
}

.nested-grid {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* 부모 그리드의 행 구조를 상속 */
}
```

또한 **CSS `:has()` 선택자**의 성능이 모든 브라우저에서 최적화되어, 실제 프로덕션 환경에서도 안정적으로 사용할 수 있게 되었습니다.

## 개발자 도구 및 DevOps 개선사항

**Chrome DevTools**에 새롭게 추가된 **Performance Insights** 패널은 웹 성능 분석을 한층 더 직관적으로 만들어줍니다. Core Web Vitals 지표를 실시간으로 모니터링하고, 성능 병목 지점을 자동으로 식별해주는 기능이 포함되어 있습니다.

**Progressive Web App** 개발을 위한 새로운 도구들도 주목할 만합니다:

- **Service Worker Debugging** 개선
- **Web App Manifest** 유효성 검사 강화
- **Push Notification** 테스트 도구 추가

개발자들은 이제 더욱 효율적으로 PWA를 개발하고 디버깅할 수 있으며, 사용자 경험을 실시간으로 최적화할 수 있습니다.

## 보안 및 프라이버시 강화

웹 플랫폼의 보안성도 지속적으로 강화되고 있습니다. **Partitioned Cookies**가 기본값으로 설정되면서, 서드파티 쿠키를 통한 사용자 추적이 더욱 제한됩니다. 개발자들은 이에 대비하여 쿠키 설정을 점검해야 합니다:

```javascript
// 새로운 쿠키 설정 방식
document.cookie = "session=abc123; SameSite=None; Secure; Partitioned";
```

**Content Security Policy Level 3**의 새로운 지시어들도 활용할 수 있게 되어, 웹 애플리케이션의 보안을 더욱 세밀하게 제어할 수 있습니다.

이러한 변화들은 웹 개발 생태계의 지속적인 발전을 보여주며, 개발자들에게 더 나은 도구와 더 안전한 개발 환경을 제공합니다.