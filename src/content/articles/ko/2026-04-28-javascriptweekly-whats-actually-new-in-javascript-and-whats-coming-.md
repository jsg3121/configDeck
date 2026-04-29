---
id: "https://javascriptweekly.com/issues/783"
tool: "javascriptweekly"
title: "JavaScript의 새로운 기능들과 다음에 올 것들"
link: "https://javascriptweekly.com/issues/783"
pubDate: 2026-04-28T00:00:00.000Z
summary: "pnpm 11.0과 TypeScript 7.0 베타가 출시되어 각각 성능과 컴파일 속도가 크게 향상되었습니다. ES2025와 ES2026의 새로운 JavaScript 기능들과 함께 다양한 개발 도구들의 주요 업데이트를 소개합니다. 실무에서 바로 활용할 수 있는 최신 기술 동향을 한눈에 확인할 수 있습니다."
---

## 주요 패키지 매니저 및 컴파일러 업데이트

**pnpm 11.0**이 출시되어 패키지 관리 성능이 한층 향상되었습니다. 이번 버전에서는 `minimumReleaseAge`가 기본적으로 1일로 설정되어 더욱 안정적인 패키지 설치가 가능해졌습니다. 특히 주목할 만한 개선사항은 **SQLite 기반 스토어 인덱스**로, 설치 속도가 대폭 빨라졌습니다.

pnpm 11.0의 새로운 기능들:
- 네이티브 패키지 퍼블리싱 지원
- `pack-app` 기능 추가
- v10 사용자를 위한 마이그레이션 가이드 제공
- **Rust 기반 Pacquet** 개발 재개

한편 **TypeScript 7.0 베타**가 출시되어 컴파일 성능이 기존 대비 **10배 빨라졌다**고 발표했습니다. Go 언어로 포팅된 새로운 컴파일러가 핵심 개선사항입니다. 다만 안정적인 프로그래매틱 API는 v7.1에서 제공될 예정입니다.

업그레이드 시 주의사항:
- TypeScript 6.0의 deprecation 확인 필요
- 설정 변경사항 검토
- 코드 작성 방식 변경사항 적용

## ES2025와 ES2026의 새로운 JavaScript 기능

JavaScript 언어 자체에도 흥미로운 새 기능들이 추가되고 있습니다. **ES2025**와 **ES2026**에서 도입되는 주요 기능들을 살펴보겠습니다.

**Iterator 헬퍼**는 배열과 유사한 메서드들을 모든 이터레이터에서 사용할 수 있게 해줍니다:

```javascript
// Iterator helpers 예시
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.values()
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2);
```

**Promise.try()**는 동기/비동기 함수를 일관되게 처리할 수 있는 새로운 유틸리티입니다:

```javascript
// Promise.try 사용 예시
Promise.try(() => {
  // 동기 또는 비동기 함수 모두 처리 가능
  return maybeAsyncFunction();
}).then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});
```

**Map.getOrInsert()**는 Map 객체에서 값이 없을 때 기본값을 설정하고 반환하는 편리한 메서드입니다. **using 키워드**는 리소스 관리를 자동화하며, **Temporal API**는 기존 Date 객체의 문제점들을 해결한 새로운 날짜/시간 API입니다.

## 런타임 및 프레임워크 동향

**Node.js v26.0**이 곧 출시될 예정이며, V8 14.6 업그레이드로 **Temporal API 지원**이 기본적으로 활성화됩니다. 이는 JavaScript 개발자들이 오랫동안 기다려온 개선사항입니다.

**Fresh 2.3**은 Deno의 풀스택 웹 프레임워크로 다음과 같은 특징을 갖습니다:
- 기본적으로 **제로 JavaScript** 출력
- 필요하지 않은 페이지에는 JavaScript를 전혀 포함하지 않음
- **View Transitions API** 간편 지원
- **WebSocket** 일급 지원

개발 도구 측면에서는 **Rspack 2.0**이 출시되어 v1.7 대비 10% 더 빨라졌으며, 더 나은 정적 분석과 실험적 **RSC(React Server Components)** 지원을 제공합니다.

## 혁신적인 개발 도구와 라이브러리

새로운 개발 도구들이 JavaScript 생태계를 더욱 풍성하게 만들고 있습니다. **TSRX**는 Svelte 메인테이너와 전 React 핵심 엔지니어가 개발한 JSX 개선 시도입니다. 제어 흐름, 스코프 스타일, 로컬 변수를 포함하며 React, Preact, Solid로 컴파일됩니다.

**Nano Stores 1.3**은 단 **286바이트** 크기의 초경량 상태 관리 라이브러리입니다:

```javascript
import { atom } from 'nanostores'

// 원자적 스토어 생성
const count = atom(0)

// 값 변경
count.set(count.get() + 1)

// 구독
count.subscribe(value => {
  console.log('Count:', value)
})
```

**TradingView의 Lightweight Charts 5.2**는 금융 데이터 시각화에 특화된 캔버스 기반 차트 라이브러리입니다. 둥근 캔들 플롯, 박스 위스커 플롯, 듀얼 레인지 히스토그램 등 금융 전용 기능들을 제공합니다.

## 실무 활용 팁과 마이그레이션 가이드

**pnpm 11.0으로 업그레이드**하려면 다음 명령어를 사용합니다:

```bash
# pnpm 업그레이드
npm install -g pnpm@latest

# 기존 프로젝트에서 lockfile 업데이트
pnpm install --frozen-lockfile=false
```

**TypeScript 7.0 베타 테스트**를 위해서는:

```bash
# TypeScript 7.0 베타 설치
npm install -D typescript@beta

# 기존 설정 호환성 확인
tsc --showConfig
```

성능 최적화를 위해 **Aube** 패키지 매니저도 고려해볼 만합니다. Mise 창시자가 개발한 이 새로운 도구는 성능에 중점을 두고 있습니다.

**WebAssembly 디버깅**이 필요한 경우 Chrome DevTools의 강력한 WASM 디버거 기능을 활용할 수 있으며, **.NET Native AOT**로 Node.js 애드온을 작성하는 것도 가능해졌습니다.

이러한 변화들은 JavaScript 생태계가 지속적으로 성숙해지고 있음을 보여줍니다. 특히 성능 개선과 개발자 경험 향상에 중점을 둔 업데이트들이 눈에 띕니다.