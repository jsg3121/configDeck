---
id: "/blog/release/v26.3.1?1781757519606"
tool: "nodejs"
title: "Node.js 26.3.1 보안 릴리스 — CVE 11건 패치"
link: "https://nodejs.org/en/blog/release/v26.3.1"
pubDate: 2026-06-18T04:38:39.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.3.1"
contentType: "commentary"
summary: "Node.js 26.3.1은 순수 보안 릴리스로, TLS·crypto·HTTP/2·Permission Model 등에 걸쳐 High 2건을 포함한 총 11건의 CVE를 수정한다."
---

Node.js Blog에서 2026년 6월 18일 Node.js 26.3.1(Current) 보안 릴리스를 발표했다. 새 기능 없이 CVE 11건 패치에만 집중한 릴리스다.

## 무엇이 새로운가

High 등급 두 건이 눈에 띈다. CVE-2026-48618은 TLS에서 서버 신원 검증 시 호스트명을 정규화하지 않던 문제이고, CVE-2026-48933은 WebCrypto 암호화 출력 길이에 대한 가드가 누락된 문제다. Medium 등급으로는 프록시 자격 증명이 터널 에러 메시지에 그대로 노출되는 문제(CVE-2026-48615), HTTP/2 originSet이 무한히 커질 수 있는 메모리 이슈(CVE-2026-48619), SNI 컨텍스트 매칭이 대소문자를 구분하던 버그(CVE-2026-48928), 호스트명에 NUL 바이트가 포함되는 것을 허용하던 문제(CVE-2026-48930), TLS 세션 재사용 시 인증된 호스트에 바인딩하지 않던 문제(CVE-2026-48934) 등이 포함된다. Low 등급 4건은 모두 Permission Model과 http.Agent 관련이다. 의존성 측면에서는 OpenSSL 3.5.7, llhttp 9.4.2, undici 8.5.0으로 업데이트됐다.

## 설정 파일에 어떤 의미인가

이번 릴리스는 기능 변경이 없으므로 `tsconfig.json`, `.node-version`, `package.json` 등 프로젝트 설정 파일을 수정할 필요는 없다. 다만 Node.js Permission Model(`--experimental-permission`)을 사용하는 환경이라면 주의가 필요하다. `process.chdir`과 `FileHandle.utimes`, 파이프 open/chmod 등에서 권한 검사가 강화됐기 때문에, 기존에 허용되던 동작이 이제 차단될 수 있다. Permission Model 플래그를 CI 스크립트나 Docker 엔트리포인트에 넣어 두었다면 배포 전 테스트를 돌려 보는 것이 좋다. TLS SNI 매칭이 대소문자를 무시하도록 수정된 점도 리버스 프록시 설정에서 인증서 컨텍스트를 대문자 호스트명으로 등록해 뒀던 드문 케이스에 영향을 줄 수 있다. Breaking change로 공식 분류된 항목은 없다.

## 다음 단계 제안

보안 릴리스이므로 프로덕션 환경은 빠르게 26.3.1로 올리는 것을 권장한다. `.node-version` 또는 `.nvmrc` 파일의 버전을 갱신하고, CI 매트릭스에도 반영하자. 새 Node.js 프로젝트 설정이 필요하다면 [Node.js 설정 생성](/ko/generator/nodejs)을 활용할 수 있다. 원문의 CVE별 커밋 링크에서 각 패치의 구체적인 변경 범위를 확인할 수 있으니, 영향 평가가 필요하면 직접 살펴보길 바란다.

---

**원문 전체 보기**: [Node.js 26.3.1 (Current)](https://nodejs.org/en/blog/release/v26.3.1) ([Node.js Blog](https://nodejs.org/en/blog/release/v26.3.1))