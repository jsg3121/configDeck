---
id: "/blog/release/v26.5.0?1783512035116"
tool: "nodejs"
title: "Node.js 26.5.0 릴리스: 텍스트 임포트 플래그, 이벤트 루프 지연 샘플링 등 추가"
link: "https://nodejs.org/en/blog/release/v26.5.0"
pubDate: 2026-07-08T12:00:35.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.5.0"
contentType: "commentary"
summary: "Node.js 26.5.0(Current)이 릴리스되었다. ESM에 --experimental-import-text 플래그가 추가되고, perf_hooks에 이벤트 루프 반복당 지연 샘플링 기능이 들어왔으며, 애드온 임포트 지원이 기본 활성화되었다."
---

Node.js Blog에서 Node.js 26.5.0(Current) 릴리스를 발표했다. SEMVER-MINOR 변경 다섯 건과 다수의 의존성 업데이트, 버그 수정이 포함된 릴리스다.

## 무엇이 새로운가

이번 릴리스의 주요 SEMVER-MINOR 변경은 다음과 같다. ESM 모듈 시스템에 `--experimental-import-text` 플래그가 추가되어 텍스트 파일 임포트를 실험적으로 지원한다. `perf_hooks`에서 이벤트 루프 반복(iteration)마다 지연을 샘플링하는 기능이 들어왔고, `buffer`에는 `blob.textStream()` 메서드가 구현되었다. `stream` 모듈에서 `ReadableStreamTee`가 외부에 노출되었으며, `tls`에서 협상된 TLS 그룹을 리포트하는 기능이 추가되었다.

그 외 눈에 띄는 변경으로, 애드온의 import 지원이 기본 활성화(`module: enable import support for addons by default`)되었고, undici가 8.7.0으로, sqlite가 3.53.3으로 업데이트되었다. 보안 관련으로는 EdDSA 검증 시 small-order 포인트를 거부하는 수정과 대용량 DH 제너레이터 검증 수정이 포함되었다. 새로운 릴리서 Stewart X Addison의 GPG 키도 추가되어 향후 릴리스 서명에 사용될 수 있다.

## 설정 파일에 어떤 의미인가

`--experimental-import-text` 플래그는 CLI 인자 또는 `NODE_OPTIONS` 환경변수를 통해 전달해야 하므로, CI 파이프라인이나 Docker 엔트리포인트에서 Node.js 실행 옵션을 관리하는 설정에 항목이 하나 늘어날 수 있다. 다만 아직 실험 단계(experimental)이므로 프로덕션 설정에 바로 넣기보다는 개발 환경에서 먼저 테스트하는 편이 안전하다.

애드온 import 지원이 기본 활성화된 부분은, 이전에 별도 플래그로 활성화했던 프로젝트라면 해당 플래그를 제거해도 된다는 의미다. 다만 원문에서 구체적인 기존 플래그명이나 마이그레이션 절차는 다루지 않았으므로, 정확한 설정 변경은 공식 문서를 확인하길 권한다.

이번 릴리스에 breaking change는 명시되어 있지 않다. SEMVER-MINOR 범위이므로 기존 설정이 깨질 가능성은 낮지만, `permission` 모델 관련 애드온 권한 수정(`fix addon permission drop`)이 있으니 퍼미션 모델을 사용하는 환경에서는 동작을 재확인할 필요가 있다.

## 다음 단계 제안

26.5.0을 적용하기 전에 현재 프로젝트의 Node.js 런타임 옵션 설정을 점검해 보자. 특히 `NODE_OPTIONS`로 전달하는 플래그 목록, 애드온 관련 플래그, 퍼미션 모델 설정이 있다면 이번 릴리스 노트의 커밋 목록과 대조하는 것이 좋다. 새 프로젝트의 Node.js 환경 설정을 처음부터 잡아야 한다면 [Node.js 설정 생성](/ko/generator/nodejs)을 활용해 볼 수 있다.

---

**원문 전체 보기**: [Node.js 26.5.0 (Current)](https://nodejs.org/en/blog/release/v26.5.0) ([Node.js Blog](https://nodejs.org/en/blog/release/v26.5.0))