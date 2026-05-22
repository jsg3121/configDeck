---
id: "/blog/release/v24.16.0?1779369943186"
tool: "nodejs"
title: "Node.js 24.16.0 LTS 릴리스 — UUIDv7, 디버거 프로브, HTTP 시그널 등 추가"
link: "https://nodejs.org/en/blog/release/v24.16.0"
pubDate: 2026-05-21T13:25:43.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v24.16.0"
contentType: "commentary"
summary: "Node.js 24.16.0 'Krypton' LTS가 릴리스됐다. crypto.randomUUIDv7(), fs.stat()의 signal 옵션, IncomingMessage의 req.signal 등 SEMVER-MINOR 수준의 기능 다수가 포함됐다."
---

Node.js Blog에서 2026년 5월 21일 Node.js 24.16.0 'Krypton' LTS 릴리스를 발표했다. Antoine du Hamel이 릴리스를 담당했으며, 다수의 SEMVER-MINOR 변경과 의존성 업데이트가 포함된 비교적 내용이 풍부한 LTS 릴리스다.

## 무엇이 새로운가

주목할 만한 SEMVER-MINOR 변경 사항을 정리하면 다음과 같다. `crypto.randomUUIDv7()`이 구현되어 시간 순서 정렬이 가능한 UUID 생성을 네이티브로 지원한다. `fs.stat()`에 `signal` 옵션이 추가되어 AbortSignal로 stat 호출을 취소할 수 있게 됐고, `statfs`에서 `frsize` 필드가 노출된다. HTTP 쪽에서는 `ClientRequest` 옵션 병합이 강화(harden)됐고, `IncomingMessage`에 `req.signal`이 추가됐다. 디버거에는 코드 수정 없이 런타임 표현식을 주입할 수 있는 프로브 기능이 `node inspect`에 들어왔다. 테스트 러너는 테스트 순서 랜덤화 지원, mock 타임아웃 API 정렬, `AbortSignal.timeout`에 대한 mock-timers 지원이 추가됐다. 의존성 측면에서는 OpenSSL 3.5.6, SQLite 3.53.0, undici 7.25.0, npm 11.13.0, ICU 78.3 등으로 업데이트됐다.

## 설정 파일에 어떤 의미인가

이번 릴리스에서 breaking change는 없다 — 전부 SEMVER-MINOR이므로 기존 프로젝트 설정을 깨뜨릴 가능성은 낮다. 다만 몇 가지 실질적으로 설정에 영향을 줄 수 있는 부분이 있다. `http` 모듈의 `ClientRequest` 옵션 병합 강화(`harden`)는 기존에 의도치 않게 병합되던 옵션이 거부될 수 있음을 의미하므로, 커스텀 HTTP 에이전트나 프록시 설정을 사용하는 프로젝트라면 업그레이드 후 동작을 확인할 필요가 있다. 테스트 러너의 순서 랜덤화 기능은 CI 설정에서 테스트 안정성 검증에 활용할 수 있지만, 활성화 방법에 대한 구체적인 플래그는 원문 커밋 기록을 확인하는 편이 정확하다. OpenSSL 3.5.6 업데이트는 TLS 관련 설정이나 인증서 체인 검증에 민감한 환경에서 릴리스 노트를 별도로 확인하길 권한다.

## 다음 단계 제안

LTS 릴리스이므로 프로덕션 환경에서도 업그레이드를 검토할 시점이다. `nvm install 24.16.0`이나 Docker 이미지 태그를 업데이트한 뒤 기존 테스트 스위트를 돌려보는 것이 가장 빠른 검증 방법이다. 프로젝트의 Node.js 엔진 버전 설정(`package.json`의 `engines` 필드, `.nvmrc`, `.node-version` 등)을 정리해야 한다면 [Node.js 설정 생성](/ko/generator/nodejs) 도구를 활용해 보자.

---

**원문 전체 보기**: [Node.js 24.16.0 (LTS)](https://nodejs.org/en/blog/release/v24.16.0) ([Node.js Blog](https://nodejs.org/en/blog/release/v24.16.0))