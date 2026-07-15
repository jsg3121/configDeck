---
id: "https://javascriptweekly.com/issues/794"
tool: "javascriptweekly"
title: "npm 12, TypeScript 7, 그리고 Rust로 다시 쓴 Bun"
link: "https://javascriptweekly.com/issues/794"
pubDate: 2026-07-14T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/794"
contentType: "commentary"
summary: "TypeScript 7.0 최종 릴리스, Bun의 Zig→Rust 포팅, Node.js 26.5.0 등 주요 JS 생태계 업데이트를 JavaScript Weekly 794호가 다뤘다. 설정 파일 관점에서 TypeScript 7의 API 미완성 이슈와 ESLint 10.7 업그레이드 시 주의점을 짚는다."
---

JavaScript Weekly 794호가 TypeScript 7.0 최종 릴리스, Bun의 Rust 재작성, Node.js 26.5.0, ESLint 10.7 등 굵직한 릴리스 소식을 한꺼번에 전했다. 이번 호는 런타임·컴파일러·린터가 동시에 메이저 업데이트를 낸 드문 주간이다.

## 무엇이 새로운가

**TypeScript 7.0**이 정식 출시됐다. Go로 작성된 컴파일러로, 원문에서 "10x faster"라고 표현한 속도 향상이 핵심이다. 다만 완전한 API가 아직 제공되지 않아, 많은 사용자에게는 당분간 6.0을 유지하도록 권장하고 있다. **Bun**은 Zig에서 Rust로 전면 포팅됐으며, 제작자 Jarred Sumner가 Claude Code 인스턴스를 활용해 API 가격 기준 약 $165k를 투입했다고 밝혔다. Rust 버전은 곧 나올 Bun 1.4의 기반이 된다. **Node.js 26.5.0**은 ES 모듈에서 import attributes를 통한 텍스트 파일 임포트와 `blob.textStream()`을 추가했다. **ESLint 10.7**, **Storybook 10.5**, **Vite DevTools 0.4**도 함께 릴리스됐다. 보안 쪽에서는 jscrambler npm 패키지가 공급망 공격을 받았고, Socket이 6분 만에 탐지했다는 소식도 포함됐다.

## 설정 파일에 어떤 의미인가

TypeScript 7.0이 가장 큰 설정 영향을 준다. Go 기반 컴파일러로 전환됐지만, 원문에 따르면 전체 API가 아직 갖춰지지 않아 **ts-node, ts-jest, 커스텀 트랜스포머 등 TypeScript API에 의존하는 도구 체인은 7.0에서 정상 동작하지 않을 수 있다**. `tsconfig.json` 자체의 스키마 변경에 대해서는 원문이 상세히 다루지 않으므로, 공식 TypeScript 블로그와 릴리스 노트를 직접 확인하는 것이 안전하다. ESLint 10.7 역시 마이너 릴리스지만, `eslint.config.*` 기반 flat config를 쓰고 있다면 플러그인 호환성을 점검해 볼 시점이다. Bun의 Rust 재작성은 `bunfig.toml` 설정 호환에 영향을 줄 수 있으나, 구체적인 breaking change 목록은 Bun 1.4 릴리스 노트가 나와야 확인할 수 있다. Next.js의 보안 릴리스 프로그램도 신설됐는데, `next.config.*`와 직접 관련된 설정 변경보다는 패치 주기와 보안 공지 채널이 공식화된 것이 핵심이다.

## 다음 단계 제안

TypeScript 7.0으로 바로 전환하기보다는, 현재 프로젝트의 빌드 파이프라인이 TypeScript API를 얼마나 직접 사용하는지부터 점검하는 것이 현실적이다. API 의존성이 없는 프로젝트라면 7.0을 별도 브랜치에서 테스트해 컴파일 속도 차이를 직접 확인해 보고, 의존성이 있다면 6.0을 유지하면서 API 지원 로드맵을 추적하자. npm 공급망 공격 소식은 `npm audit`을 주기적으로 돌리고, lockfile 변경을 PR 리뷰에서 꼼꼼히 확인하는 습관을 다시 점검하는 계기로 삼을 만하다.

---

**원문 전체 보기**: [npm 12, TypeScript 7, and Bun in Rust](https://javascriptweekly.com/issues/794) ([JavaScript Weekly](https://javascriptweekly.com/issues/794))