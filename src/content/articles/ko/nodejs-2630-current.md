---
id: "/blog/release/v26.3.0?1780319508265"
tool: "nodejs"
title: "Node.js 26.3.0 릴리스 — Buffer 기본 풀 크기 증가, 권한 드롭 API, HTTP 헤더 검증 옵션 추가"
link: "https://nodejs.org/en/blog/release/v26.3.0"
pubDate: 2026-06-01T13:11:48.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.3.0"
contentType: "commentary"
summary: "Node.js 26.3.0이 Buffer.poolSize 기본값 64KiB 상향, permission.drop API, HTTP 헤더 검증 옵션 등 여러 SEMVER-MINOR 변경을 포함해 릴리스되었다. macOS 유니버설 바이너리의 장기 지원 불확실성도 공식 언급되었다."
---

Node.js Blog에서 2026년 6월 1일자로 Node.js 26.3.0 (Current) 릴리스를 공개했다. 이번 버전은 네 건의 SEMVER-MINOR 변경과 루트 인증서 업데이트, 그리고 QUIC 관련 대규모 개선 커밋을 포함한다.

## 무엇이 새로운가

가장 눈에 띄는 변경은 `Buffer.poolSize` 기본값이 64 KiB로 증가한 것이다(Matteo Collina 기여). HTTP 모듈에는 헤더 값 검증 방식을 제어하는 `httpValidation` 옵션이 추가되었고, `permission.drop` API가 새로 도입되어 런타임에서 부여된 권한을 명시적으로 해제할 수 있게 되었다. Inspector 모듈에서는 정밀 커버리지(precise coverage) 시작 시점을 JS 런타임에 노출하는 기능이 들어왔다. 별도로, Apple이 Intel 아키텍처 지원을 축소함에 따라 Node.js 26 수명 주기 동안 macOS 유니버설 바이너리 배포가 중단될 수 있다는 리스크가 공식적으로 언급되었다. 루트 인증서는 NSS 3.123.1로, npm은 11.16.0으로 업데이트되었다. Windows 빌드 쪽에서는 LTCG 대신 Thin LTO를 사용하도록 전환되었고, Rust 툴체인 자동 설정도 Windows에 추가되었다.

## 설정 파일에 어떤 의미인가

`Buffer.poolSize` 기본값 변경은 별도 설정 없이 자동 적용되므로, 기존에 이 값을 명시적으로 지정하지 않았던 프로젝트는 메모리 할당 패턴이 달라질 수 있다. 메모리 사용량에 민감한 환경이라면 기존 값을 직접 설정해두는 것이 안전하다. `permission.drop` API는 `--permission` 플래그 기반 권한 모델과 함께 동작하며, 원문 문서에 따르면 `--permission` 플래그에서 `--experimental` 접두사가 제거되었다. 권한 모델을 활용하는 프로젝트라면 프로세스 초기화 스크립트에서 불필요한 권한을 드롭하는 패턴을 검토해볼 만하다. `httpValidation` 옵션은 HTTP 서버 설정에 새로운 튜닝 포인트를 제공하지만, 구체적인 값과 동작 방식은 원문 PR을 확인하는 것이 정확하다. macOS Intel 환경에서 CI/CD를 운영 중이라면 유니버설 바이너리 지원 중단 가능성을 미리 인지하고, ARM64 전용 바이너리 전환 계획을 세워두는 편이 좋다.

## 다음 단계 제안

Node.js 26.x를 이미 사용 중이라면 26.3.0으로 업데이트 후 `Buffer.poolSize` 관련 메모리 프로파일링을 한 번 돌려보길 권한다. 권한 모델을 도입하려는 프로젝트는 `--permission` 플래그와 `permission.drop` API 조합을 테스트해볼 시점이다. 새 프로젝트의 Node.js 환경 설정이 필요하다면 [Node.js 설정 생성](/ko/generator/nodejs)을 활용해 기본 구성을 빠르게 잡을 수 있다.

---

**원문 전체 보기**: [Node.js 26.3.0 (Current)](https://nodejs.org/en/blog/release/v26.3.0) ([Node.js Blog](https://nodejs.org/en/blog/release/v26.3.0))