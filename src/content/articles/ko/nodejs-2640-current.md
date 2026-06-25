---
id: "/blog/release/v26.4.0?1782344347849"
tool: "nodejs"
title: "Node.js 26.4.0 릴리스 — VFS 서브시스템, 패키지 맵, TLS 인증서 압축 등 주요 기능 추가"
link: "https://nodejs.org/en/blog/release/v26.4.0"
pubDate: 2026-06-24T23:39:07.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.4.0"
contentType: "commentary"
summary: "Node.js 26.4.0(Current)이 다수의 SEMVER-MINOR 변경과 함께 릴리스되었다. VFS 서브시스템 신설, 패키지 맵 구현, TLS 인증서 압축 옵션 등 설정과 런타임 양쪽에 영향을 줄 수 있는 기능이 포함되어 있다."
---

Node.js Blog에서 2026년 6월 24일자로 Node.js 26.4.0(Current) 릴리스를 공지했다. 이번 버전에는 SEMVER-MINOR로 분류된 기능 추가가 다수 포함되어 있으며, 새로운 서브시스템 도입도 눈에 띈다.

## 무엇이 새로운가

가장 주목할 부분은 `node:vfs` 서브시스템의 신설이다. Matteo Collina가 기여한 두 커밋으로 최소한의(minimal) VFS 서브시스템이 추가되었고, `node:fs/promises` 호출을 마운트된 VFS 인스턴스로 디스패치하는 기능이 함께 들어갔다. 로더 쪽에서는 Maël Nison이 구현한 **패키지 맵(package maps)** 기능이 추가되었다. TLS에는 `certificateCompression` 옵션이 새로 생겼고, `net` 모듈에서는 `setKeepAlive`에 `TCP_KEEPINTVL`과 `TCP_KEEPCNT` 지원이 들어왔다. `fs.readFile()`에 호출자가 직접 버퍼를 제공할 수 있는 옵션도 추가되었다. `net.BlockList`의 안정성 상태가 release candidate로 격상되었다. 이 밖에 FFI fast call 확장, npm 11.17.0 업데이트, SQLite 3.53.2 업데이트 등 의존성 변경도 다수 포함되어 있다.

## 설정 파일에 어떤 의미인가

**패키지 맵** 기능이 로더에 구현된 점이 설정 관점에서 가장 직접적인 영향을 줄 수 있다. 패키지 맵은 모듈 해석 방식에 관여하므로, 기존 `package.json`의 `imports`/`exports` 필드나 커스텀 로더 설정과 어떻게 상호작용하는지가 중요하다. 다만 원문 릴리스 노트에는 구체적인 설정 포맷이나 사용법이 기술되어 있지 않아, 정확한 설정 방법은 해당 PR(#62239)이나 공식 문서 업데이트를 확인해야 한다.

`node:vfs` 서브시스템 역시 파일시스템 접근을 추상화하므로 빌드 도구나 번들러 설정에 장기적으로 영향을 줄 수 있지만, 현재는 minimal 상태로 도입된 만큼 당장의 설정 변경이 필요하지는 않다. TLS의 `certificateCompression` 옵션은 서버/클라이언트 TLS 설정에 새 필드를 추가할 수 있는 부분이나, 역시 구체적인 설정값은 원문 커밋이나 문서에서 확인이 필요하다. 이번 릴리스에 breaking change는 명시되어 있지 않다.

## 다음 단계 제안

Current 트랙을 따르고 있다면 `nvm install 26.4.0`으로 업데이트 후, 특히 패키지 맵과 VFS 관련 PR 문서를 먼저 읽어보길 권한다. 프로젝트의 Node.js 엔진 버전 제약을 관리하고 있다면 [Node.js 설정 생성](/ko/generator/nodejs)에서 `engines` 필드 등을 함께 점검해 볼 수 있다. npm도 11.17.0으로 올라갔으므로 lockfile 재생성 여부도 확인하자.

---

**원문 전체 보기**: [Node.js 26.4.0 (Current)](https://nodejs.org/en/blog/release/v26.4.0) ([Node.js Blog](https://nodejs.org/en/blog/release/v26.4.0))