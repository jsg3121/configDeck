---
id: "https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/"
tool: "googledeepmind"
title: "Gemini 3.5 Flash에 컴퓨터 사용 기능 내장 — 에이전트가 브라우저·데스크톱·모바일을 직접 조작"
link: "https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/"
pubDate: 2026-06-24T16:30:01.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/"
contentType: "commentary"
summary: "Google DeepMind가 Gemini 3.5 Flash에 computer use를 빌트인 도구로 통합했다. 이전에는 별도 모델로만 제공되던 기능이 메인 Flash 모델에 네이티브로 포함되어 브라우저·모바일·데스크톱 환경을 직접 조작하는 에이전트를 구축할 수 있다."
---

Google DeepMind Blog가 Gemini 3.5 Flash에 "computer use"를 빌트인 도구로 통합했다고 발표했다. 기존에 독립 모델(Gemini 2.5 computer use model)로만 제공되던 기능이 이제 메인 Flash 모델 안에 네이티브로 들어간 것이다.

## 무엇이 새로운가

핵심 변경은 computer use가 별도 모델이 아닌 Gemini 3.5 Flash의 빌트인 도구가 됐다는 점이다. 기존에 Flash가 지원하던 function calling, Search·Maps grounding과 같은 레벨에서 computer use를 호출할 수 있다. 대상 환경은 브라우저, 모바일, 데스크톱 세 가지이며, 연속적인 소프트웨어 테스트나 엔터프라이즈 지식 작업 같은 장기 시계열(long-horizon) 자동화가 주요 타깃이다.

보안 측면에서는 프롬프트 인젝션 대응을 위해 adversarial training을 적용했고, 선택적 엔터프라이즈 세이프가드 두 가지를 함께 공개했다. 하나는 민감·비가역적 액션에 대한 사용자 확인 요구, 다른 하나는 간접 프롬프트 인젝션 탐지 시 자동 중단이다. 접근 경로는 Gemini API와 Gemini Enterprise Agent Platform 두 곳이고, Browserbase가 호스팅하는 데모 환경에서 바로 테스트해 볼 수 있다.

## 설정 파일에 어떤 의미인가

솔직히 말하면, 이번 발표는 모델 기능 통합에 대한 내용이지 개발자 설정 파일 구조가 변경되는 종류의 업데이트는 아니다. 원문에서 API 호출 방식이나 설정 스키마의 구체적인 변경점은 다루지 않았다. 기존에 Gemini 2.5 computer use 모델을 별도로 호출하던 코드를 3.5 Flash 단일 모델 호출로 전환할 수 있을 것으로 보이지만, 마이그레이션 경로나 breaking change 여부는 공식 API 문서와 레퍼런스 구현체를 직접 확인해야 한다.

에이전트 빌더 입장에서 실질적으로 신경 쓸 부분은 두 가지 엔터프라이즈 세이프가드 옵션의 활성화 방식이다. 이를 어떻게 설정하느냐에 따라 에이전트의 런타임 동작이 크게 달라질 수 있는데, 세부 설정 항목은 원문이 "best practices documentation"으로 안내하고 있으므로 해당 문서를 참조하는 것이 정확하다.

## 다음 단계 제안

원문이 안내하는 Browserbase 데모 환경에서 먼저 computer use가 실제 화면 조작을 어떤 수준으로 수행하는지 체감해 보는 것이 가장 빠르다. 이후 Gemini API 레퍼런스 구현체를 클론해서 기존 에이전트 파이프라인에 computer use 도구를 추가하는 최소 프로토타입을 만들어 보고, 특히 프롬프트 인젝션 세이프가드 두 옵션을 켰을 때와 껐을 때의 동작 차이를 비교하는 것을 권한다. 프로덕션 적용 전에 샌드박스 환경과 human-in-the-loop 검증은 필수다 — Google도 같은 권고를 하고 있다.

---

**원문 전체 보기**: [Introducing computer use in Gemini 3.5 Flash](https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/) ([Google DeepMind Blog](https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/))