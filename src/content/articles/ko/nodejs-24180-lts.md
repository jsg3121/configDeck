---
id: "/blog/release/v24.18.0?1782256361150"
tool: "nodejs"
title: "Node.js 24.18.0 'Krypton' LTS 릴리스 — 암호화 강화와 Buffer 기본값 변경"
link: "https://nodejs.org/en/blog/release/v24.18.0"
pubDate: 2026-06-23T23:12:41.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v24.18.0"
contentType: "commentary"
summary: "Node.js 24의 첫 LTS 릴리스로, Buffer.poolSize 기본값 증가, Web Cryptography 알고리즘 추가, HTTP 1xx 응답 전송 API 등 여러 SEMVER-MINOR 변경이 포함됐다."
---

Node.js Blog에서 v24.18.0 'Krypton' LTS를 공식 발표했다. 코드네임에서 알 수 있듯 v24 라인의 장기 지원 채널 진입이며, 암호화·HTTP·Buffer 영역에 걸쳐 다수의 SEMVER-MINOR 변경을 담고 있다.

## 무엇이 새로운가

가장 눈에 띄는 변경은 `Buffer.poolSize` 기본값이 64 KiB로 늘어난 것이다(Matteo Collina, #63597). 기존 값에 의존하는 코드가 있다면 확인이 필요하다. 암호화 쪽에서는 Web Cryptography API에 TurboSHAKE·KangarooTwelve 알고리즘이 추가됐고, `crypto.diffieHellman()`이 키 데이터를 직접 받을 수 있도록 확장됐다. ML-KEM·SLH-DSA의 JWK 지원, BoringSSL 환경에서 ChaCha20-Poly1305·AES-KW·ML-DSA·ML-KEM 연결, 프로토타입 오염 방어 등 포스트-양자·보안 강화 작업이 대거 들어왔다. HTTP 모듈에는 임의의 1xx 상태 코드를 보낼 수 있는 `writeInformation` 메서드가 추가됐고, idle 에이전트 소켓에서 불필요한 스트림 리스너를 제거하는 성능 개선도 포함됐다. 루트 인증서가 NSS 3.123.1로 업데이트됐고, npm은 11.16.0, SQLite는 3.53.1로 올라갔다.

## 설정 파일에 어떤 의미인가

`Buffer.poolSize` 기본값 변경은 SEMVER-MINOR지만, 메모리 사용 패턴이 바뀔 수 있다. 컨테이너 메모리 제한을 타이트하게 잡아둔 환경이라면 모니터링 후 필요 시 명시적으로 `Buffer.poolSize`를 이전 값으로 설정하는 것이 안전하다. `--permission` 플래그에서 `--experimental` 접두사가 문서상 제거된 점도 주목할 만하다 — 퍼미션 모델을 프로덕션 설정에 반영하고 있었다면 플래그 이름을 재확인하자. 빌드 쪽에서는 `--enable-all-experimentals` 빌드 플래그가 추가됐고, Windows x64 PGO가 활성화됐다. 커스텀 빌드 스크립트를 운영하는 팀이라면 원문의 커밋 목록을 직접 확인하는 편이 좋다. `crypto.diffieHellman()` API 시그니처 변경(키 인자 이름 정렬)은 타입 체크나 래퍼를 쓰고 있는 경우 업데이트가 필요할 수 있다. 전반적으로 breaking change는 없으나, LTS 진입 시점이므로 CI에서 v24로 테스트 매트릭스를 확장할 적절한 타이밍이다.

## 다음 단계 제안

로컬 환경에서 `nvm install 24`로 전환 후 기존 테스트 스위트를 돌려보는 것이 가장 빠른 검증 방법이다. 특히 암호화 관련 코드가 있는 프로젝트라면 새 알고리즘 지원과 인자 이름 변경 여부를 체크하자. 프로젝트의 Node.js 버전·엔진 설정을 정리하려면 [Node.js 설정 생성](/ko/generator/nodejs) 도구를 활용할 수 있다.

---

**원문 전체 보기**: [Node.js 24.18.0 (LTS)](https://nodejs.org/en/blog/release/v24.18.0) ([Node.js Blog](https://nodejs.org/en/blog/release/v24.18.0))