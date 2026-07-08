---
id: "https://javascriptweekly.com/issues/793"
tool: "javascriptweekly"
title: "ECMAScript 2026의 새 기능 — 이미 대부분 사용 가능"
link: "https://javascriptweekly.com/issues/793"
pubDate: 2026-07-07T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/793"
contentType: "commentary"
summary: "876페이지 분량의 ECMAScript 2026 스펙이 지난주 승인되었으며, 주요 신규 기능 대부분이 이미 브라우저와 런타임에서 사용 가능하다. JavaScript Weekly 793호에서는 이 외에도 vinext 1.0 베타, webpack-dev-server 6.0, Safari MCP 서버, shadcn/ui의 Base UI 전환 등 주목할 만한 소식을 다룬다."
---

JavaScript Weekly 793호의 헤드라인은 ECMAScript 2026 스펙 승인 소식이다. 876페이지 분량의 스펙이 지난주 공식 승인되었고, Pawel Grzybek의 정리 글이 주요 기능을 예제와 함께 소개한다.

## 무엇이 새로운가

ECMAScript 2026에는 `Array.fromAsync`, 네이티브 `Uint8Array` Base64/Hex 변환, `Math.sumPrecise` 등의 기능이 포함되었다. 원문에 따르면 `Math.sumPrecise`의 Node 지원을 제외하면 모든 기능이 이미 브라우저와 런타임에 구현되어 있어 바로 사용할 수 있다. 이번 호에는 이 밖에도 눈여겨볼 릴리스가 여럿 있다. Cloudflare의 Vite 플러그인 vinext가 1.0 베타에 도달했고, webpack-dev-server 6.0은 Express 5와 네이티브 ESM으로 업그레이드되었다. 생태계 쪽에서는 Safari가 최신 프리뷰에 MCP 서버를 도입해 에이전트가 Safari 창에 연결해 디버깅할 수 있게 했고, shadcn/ui가 기본 컴포넌트 라이브러리를 Radix에서 Base UI로 전환했다.

## 설정 파일에 어떤 의미인가

**webpack-dev-server 6.0**이 Express 5와 네이티브 ESM으로 올라갔으므로, webpack 기반 프로젝트의 `devServer` 설정에서 Express 4 전용 미들웨어나 CommonJS 전용 플러그인을 사용 중이라면 호환성을 확인해야 한다. 다만 구체적인 breaking change 목록은 원문에서 별도로 다루지 않으므로 릴리스 노트를 직접 확인하는 것이 안전하다.

**shadcn/ui → Base UI 전환**은 새 프로젝트에 권장되는 변경이며, 기존 Radix 기반 프로젝트가 즉시 깨지는 것은 아니라고 원문은 밝히고 있다. 하지만 컴포넌트 초기화 설정(`components.json` 등)이나 의존성 트리가 달라질 수 있으므로, 신규 프로젝트를 시작할 때 어떤 기반을 선택할지 확인해 두면 좋다.

ECMAScript 2026 기능 자체는 언어 레벨 추가이므로 별도 설정 변경 없이 사용 가능하다. 다만 `tsconfig.json`의 `target`이나 `lib` 값이 지나치게 낮게 설정되어 있으면 타입 정의가 누락될 수 있으니, TypeScript 사용자라면 `lib` 배열에 최신 ES 라이브러리가 포함되어 있는지 점검할 만하다.

## 다음 단계 제안

ECMAScript 2026 기능을 직접 써보고 싶다면, 원문의 Pawel Grzybek 글에서 각 기능별 예제를 먼저 훑어보는 것이 가장 빠르다. webpack-dev-server를 6.0으로 올릴 계획이라면 Express 5 마이그레이션 가이드를 함께 읽어두길 권한다. shadcn/ui를 쓰는 팀이라면, 새 프로젝트 시작 시 Base UI 기반 설정을 시도해 보고 기존 Radix 프로젝트와의 차이를 파악해 두는 것이 실용적이다.

---

**원문 전체 보기**: [What's new in ECMAScript 2026 (and usable today)](https://javascriptweekly.com/issues/793) ([JavaScript Weekly](https://javascriptweekly.com/issues/793))