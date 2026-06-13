---
id: "https://openai.com/index/openai-to-acquire-ona"
tool: "openainews"
title: "OpenAI, Ona 인수 계획 발표"
link: "https://openai.com/index/openai-to-acquire-ona"
pubDate: 2026-06-11T00:00:00.000Z
sourceName: "OpenAI News"
sourceUrl: "https://openai.com/index/openai-to-acquire-ona"
contentType: "commentary"
summary: "OpenAI가 Ona를 인수하여 Codex에 보안이 강화된 영구 클라우드 환경을 추가하고, 엔터프라이즈 워크플로에서 장기 실행 AI 에이전트를 지원할 계획이다."
---

OpenAI News에 따르면, OpenAI가 Ona를 인수할 계획을 발표했다. 이번 인수의 목적은 Codex에 보안이 적용된 영구(persistent) 클라우드 환경을 확보하여 엔터프라이즈 워크플로 전반에서 장기 실행 AI 에이전트를 운용하는 것이다.

## 무엇이 새로운가

공개된 정보가 제한적이지만, 핵심은 두 가지다. 첫째, Codex가 일회성 코드 생성 도구를 넘어 지속적으로 동작하는 클라우드 환경을 갖추게 된다는 점이다. 둘째, "장기 실행(long-running) AI 에이전트"라는 표현에서 알 수 있듯, 단발 요청-응답 패턴이 아닌 상태를 유지하며 복수 단계를 처리하는 에이전트 아키텍처를 목표로 하고 있다. Ona가 어떤 인프라 기술을 보유하고 있는지, 인수 후 제품 통합 일정이 어떻게 되는지는 원문에서도 상세히 다루지 않았으므로 공식 후속 발표를 확인하는 것이 좋다.

## 설정 파일에 어떤 의미인가

현재 시점에서 개발자 설정 파일에 직접적인 영향을 판단하기 어렵다. Codex가 영구 클라우드 환경을 갖추게 되면, 향후 에이전트 실행 환경 설정(런타임 버전, 시크릿 관리, 네트워크 정책 등)을 선언적 파일로 정의하는 방식이 등장할 수 있지만, 이는 아직 추측 영역이다. 원문에서 기존 Codex 설정이나 API와의 호환성, 마이그레이션 경로 등은 언급되지 않았다. 구체적인 설정 변경 사항이나 breaking change 여부는 공식 문서가 나온 뒤 다시 정리하겠다.

## 다음 단계 제안

지금 당장 무언가를 변경할 필요는 없다. 다만 Codex를 엔터프라이즈 CI/CD 파이프라인이나 자동화 워크플로에 이미 활용 중이라면, 인수 완료 후 환경 설정 방식이 어떻게 바뀌는지 OpenAI 공식 블로그와 Codex 문서를 주시할 가치가 있다. 특히 장기 실행 에이전트가 도입되면 기존 단발 호출 기반 통합 방식과 인증·권한 모델이 달라질 수 있으므로, 현재 사용 중인 API 키 관리 구조와 네트워크 정책을 미리 점검해 두면 전환이 수월해질 것이다.

---

**원문 전체 보기**: [OpenAI to acquire Ona](https://openai.com/index/openai-to-acquire-ona) ([OpenAI News](https://openai.com/index/openai-to-acquire-ona))