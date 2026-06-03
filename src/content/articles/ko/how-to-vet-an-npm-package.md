---
id: "https://javascriptweekly.com/issues/788"
tool: "javascriptweekly"
title: "2026년 npm 패키지 검증법, 그리고 이번 주 JS 생태계 주요 소식"
link: "https://javascriptweekly.com/issues/788"
pubDate: 2026-06-02T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/788"
contentType: "commentary"
summary: "JavaScript Weekly 788호는 npm 패키지 평가 체크리스트를 헤드라인으로 다루며, npm 11.16.0의 install-script 정책, Ember 7.0, Node.js 26.3.0, Astro 6.4 등 다수의 릴리스 소식을 전한다."
---

JavaScript Weekly 788호가 발행됐다. 헤드라인은 Gabor Koos의 "npm 패키지 평가: 2026 에디션"이며, 별 수(star count) 너머를 보는 실용적 검증 체크리스트를 제시한다.

## 무엇이 새로운가

npm 패키지 평가 가이드는 provenance attestation, install script, CI 품질, 메인테이너 응답성 등을 점검 항목으로 제안한다. 이와 맞물려 npm 11.16.0이 `allowScripts`를 통한 opt-in install-script 정책을 경고(advisory warning) 수준으로 지원하기 시작했다. Red Hat npm 패키지 다수가 백도어 공격을 받은 사건도 함께 보도됐는데, install script 정책의 필요성을 직접적으로 보여주는 사례다. 릴리스 쪽에서는 Ember 7.0이 deprecated 기능을 정리하는 메이저 릴리스로 나왔고, Node.js 26.3.0은 npm 11.16.0 탑재·macOS x64의 tier 2 강등·QUIC 개선을 포함한다. Astro 6.4는 플러거블 Markdown 파이프라인과 Rust 기반 Markdown 프로세서, Cloudflare 고급 라우팅 헬퍼를 추가했다. date-fns는 Temporal 우선 라이브러리로의 전환을 준비 중이며, 경량화된 v4.4와 v5.0 알파가 나왔다.

## 설정 파일에 어떤 의미인가

가장 직접적인 설정 변경 포인트는 npm의 `allowScripts` 정책이다. 현재는 경고만 출력하는 단계지만, 프로젝트의 `.npmrc`나 CI 파이프라인에서 install-script 실행을 제어하는 설정이 곧 표준 관행이 될 가능성이 높다. Ember 7.0으로 올리는 팀은 deprecated API 제거에 따른 설정·코드 정리가 필요하고, Node.js 26.3.0에서 macOS x64가 tier 2로 내려간 점은 CI 매트릭스 설정을 다시 확인할 이유가 된다. Astro 6.4의 Rust 기반 Markdown 프로세서 도입은 `astro.config.*`에서 Markdown 파이프라인 설정을 커스터마이징하는 방식이 달라질 수 있음을 시사하지만, 구체적인 설정 스키마 변경은 원문에서 상세히 다루지 않으므로 Astro 공식 문서를 직접 확인하는 편이 정확하다. pnpm 11.5, ESLint 10.4.1, Angular 22 RC3도 릴리스됐으니 lockfile이나 린트 설정의 호환성 점검이 필요할 수 있다.

## 다음 단계 제안

이번 호에서 즉시 행동으로 옮길 만한 것은 두 가지다. 첫째, npm 11.16.0으로 업데이트 후 `allowScripts` 옵션을 테스트 환경에서 먼저 켜보고 어떤 패키지가 install script를 실행하는지 파악하라. 둘째, Gabor Koos의 패키지 평가 체크리스트를 팀 내부 의존성 리뷰 프로세스에 반영할 수 있는지 검토하라. 백도어 사건이 보여주듯 공급망 보안은 설정 한 줄의 문제이기도 하다.

---

**원문 전체 보기**: [How to vet an npm package in 2026](https://javascriptweekly.com/issues/788) ([JavaScript Weekly](https://javascriptweekly.com/issues/788))