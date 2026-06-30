---
id: "/blog/next-16-3-turbopack"
tool: "nextjs"
title: "Turbopack: Next.js 16.3에서 달라진 점"
link: "https://nextjs.org/blog/next-16-3-turbopack"
pubDate: 2026-06-29T20:00:00.000Z
sourceName: "Next.js Blog"
sourceUrl: "https://nextjs.org/blog/next-16-3-turbopack"
contentType: "commentary"
summary: "Next.js 16.3 프리뷰에서 Turbopack 번들러의 메모리 사용량 절감, 빌드용 파일시스템 캐시, 실험적 Rust React Compiler 통합 등 컴파일러 성능 중심 업데이트가 공개되었다."
---

Next.js Blog에서 16.3 프리뷰에 포함된 Turbopack 번들러 개선 사항을 공개했다. 이번 릴리스는 컴파일러 성능에 초점을 맞추며, 메모리·CPU 사용량 절감과 빌드 속도 향상을 주요 목표로 삼고 있다.

## 무엇이 새로운가

가장 눈에 띄는 변경은 개발 서버 메모리 사용량 감소다. 16.1에서 도입된 파일시스템 캐시를 활용해 인메모리 캐시를 디스크로 내보내는(eviction) 방식으로, 장시간 개발 세션에서 메모리가 무한정 증가하는 문제를 완화한다. 16.3에서는 메모리 eviction과 파일시스템 캐시가 모두 기본 활성화 상태다. 빌드(`next build`) 쪽에서도 동일한 영속 캐시를 사용할 수 있게 되었으며, CI에서 `.next` 디렉터리를 다음 실행에 복사하면 이전 컴파일 결과를 재활용할 수 있다.

React Compiler의 Rust 네이티브 포트가 실험적으로 통합되었다. 원문에 따르면 v0 같은 대형 React 앱에서 컴파일 시간이 20–50% 줄어드는 초기 테스트 결과가 나왔다. 또한 Vite 호환 `import.meta.glob` API가 추가되어 파일 패턴 기반 동적 임포트를 지원하며, HMR 구독 구조를 단순화해 복잡한 앱에서 개발 서버 콜드 스타트가 15% 이상 단축되었다고 밝혔다. 런타임 코드도 WebAssembly·Worker 등 실제 사용하는 기능만 포함하도록 트리밍된다.

## 설정 파일에 어떤 의미인가

`next.config` 관련 설정 플래그가 여러 개 등장한다. 메모리 eviction을 비활성화하려면 `turbopackMemoryEviction`, 빌드 캐시를 켜려면 `turbopackFileSystemCacheForBuild`, Rust React Compiler를 쓰려면 `turbopackRustReactCompiler`, 모노레포에서 패키지별 PostCSS 설정을 적용하려면 `turbopackLocalPostcssConfig` 플래그를 사용한다. 모두 `experimental` 수준이거나 원문에서 config 값으로 언급되었지만, 정확한 타입·위치는 원문의 코드 스니펫과 공식 문서를 직접 확인하는 편이 안전하다.

기존에 Babel 기반 React Compiler를 사용 중이었다면 Rust 버전으로 전환할 때 `turbopackRustReactCompiler` 플래그를 추가하는 것 외에 별도 마이그레이션은 원문에서 언급되지 않았다. `import.meta.glob`은 Turbopack 전용이므로 `--webpack` 옵션으로 빌드하는 프로젝트에서는 동작하지 않는다는 점이 주의 사항이다. Breaking change에 대한 명시적 언급은 없으나, 메모리 eviction과 파일시스템 캐시가 기본값으로 켜진 만큼 기존 캐시 관련 이슈가 있었던 프로젝트라면 업그레이드 후 동작을 확인할 필요가 있다.

## 다음 단계 제안

16.3 프리뷰를 설치한 뒤 장시간 개발 세션에서 메모리 프로파일을 한번 비교해 보는 것이 가장 빠른 검증 방법이다. CI 파이프라인에서 `.next` 디렉터리를 캐싱하도록 설정하면 빌드 캐시 효과를 바로 체감할 수 있다. 새 프로젝트를 시작하거나 설정을 정비하려면 [Next.js 설정 생성](/ko/generator/nextjs)을 활용해 기본 구조를 잡은 뒤, 원문에서 소개된 실험적 플래그를 하나씩 추가해 보길 권한다.

---

**원문 전체 보기**: [Turbopack: What's New in Next.js 16.3](https://nextjs.org/blog/next-16-3-turbopack) ([Next.js Blog](https://nextjs.org/blog/next-16-3-turbopack))