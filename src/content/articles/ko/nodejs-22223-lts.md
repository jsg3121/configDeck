---
id: "/blog/release/v22.22.3?1778697903090"
tool: "nodejs"
title: "Node.js 22.22.3 (LTS) 릴리스 — 보안 패치와 대규모 의존성 업데이트"
link: "https://nodejs.org/en/blog/release/v22.22.3"
pubDate: 2026-05-13T18:45:03.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v22.22.3"
contentType: "commentary"
summary: "Node.js 22.22.3 LTS('Jod')가 릴리스되었다. OpenSSL 3.5.6, npm 10.9.8, SQLite 3.52.0 등 핵심 의존성 업데이트와 함께 crypto, zlib, http, url 모듈의 버그·보안 수정이 다수 포함되어 있다."
---

Node.js Blog에서 22.22.3 LTS('Jod') 릴리스를 발표했다. 신규 기능보다는 의존성 갱신과 버그·보안 수정에 집중한 유지보수 릴리스다.

## 무엇이 새로운가

의존성 쪽 변경이 눈에 띈다. OpenSSL이 3.5.6으로, npm이 10.9.8로, SQLite가 3.52.0으로, simdjson이 4.5.0으로 올라갔고, 루트 인증서가 NSS 3.121 기준으로 갱신되었다. V8 백포트·체리픽도 십여 건 이상 포함되어 있다. 보안 관점에서 주목할 커밋으로는 crypto 모듈의 null pointer dereference 수정, `pathToFileURL()`의 잘못된 UNC 호스트네임으로 인한 프로세스 크래시 수정, zlib `reset()` 호출 시 use-after-free 수정이 있다. 모듈 시스템에서도 `require(esm)` 캐시 분리, CTS 임포트 시 동기 CJS 사용, resolve 훅 이중 호출 방지 등 ESM/CJS 상호운용 관련 수정이 여러 건 들어갔다. HTTP 쪽에서는 keep-alive 소켓 재사용 레이스 컨디션과 http2의 FileHandle 누수가 수정되었다.

## 설정 파일에 어떤 의미인가

이번 릴리스에 breaking change는 명시되어 있지 않으므로, 기존 `package.json`이나 `.nvmrc`, `tsconfig.json` 등의 설정을 변경할 필요는 없다. 다만 ESM/CJS 모듈 로딩 동작이 미묘하게 달라진 부분이 있어서, 커스텀 로더 훅(`--loader` 혹은 `module.register`)을 사용하는 프로젝트라면 resolve 훅이 이중 호출되지 않는 새 동작을 확인해 볼 만하다. TypeScript 설정에서 `.cts` 파일을 직접 임포트하는 경우 동기 CJS로 처리되는 변경도 적용되었으니, amaro(타입 스트립) 의존 프로젝트라면 동작을 한 번 점검하는 게 좋다. OpenSSL과 루트 인증서 업데이트는 TLS 관련 커스텀 설정(`NODE_EXTRA_CA_CERTS` 등)을 쓰는 환경에서 인증서 체인 검증 결과에 영향을 줄 수 있다.

## 다음 단계 제안

LTS를 운영 환경에서 사용 중이라면 OpenSSL·zlib·url 관련 보안 수정만으로도 업데이트할 이유가 충분하다. `nvm install 22.22.3` 또는 컨테이너 이미지 태그를 갱신한 뒤, 기존 테스트 스위트를 돌려 모듈 로딩 동작 변경에 대한 영향을 확인하자. 프로젝트의 Node.js 버전 설정을 정리하고 싶다면 [Node.js 설정 생성](/ko/generator/nodejs)을 활용해 볼 수 있다.

---

**원문 전체 보기**: [Node.js 22.22.3 (LTS)](https://nodejs.org/en/blog/release/v22.22.3) ([Node.js Blog](https://nodejs.org/en/blog/release/v22.22.3))