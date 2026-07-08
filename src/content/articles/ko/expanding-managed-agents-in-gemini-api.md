---
id: "https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/"
tool: "googleaiblog"
title: "Gemini API 관리형 에이전트 확장: 백그라운드 실행, 원격 MCP 연동 등"
link: "https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/"
pubDate: 2026-07-07T08:54:00.000Z
sourceName: "Google AI Blog"
sourceUrl: "https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/"
contentType: "commentary"
summary: "Google이 Gemini Interactions API의 관리형 에이전트에 백그라운드 비동기 실행, 원격 MCP 서버 연동, 커스텀 함수 호출, 자격 증명 갱신 기능을 추가했다."
---

Google AI Blog에서 Gemini Interactions API의 관리형 에이전트(Managed Agents)에 네 가지 주요 기능을 추가했다고 발표했다. 격리된 클라우드 샌드박스 안에서 추론, 코드 실행, 패키지 설치, 파일 관리까지 단일 엔드포인트로 처리하는 기존 구조 위에 얹히는 업데이트다.

## 무엇이 새로운가

첫째, `background: true` 옵션으로 장시간 작업을 비동기 실행할 수 있다. HTTP 연결을 유지할 필요 없이 ID를 받아 폴링하거나 스트리밍으로 진행 상황을 확인하고, 나중에 재접속해도 된다. 둘째, 원격 MCP(Model Context Protocol) 서버와 직접 연동이 가능해졌다. 별도 프록시 미들웨어 없이 `mcp_server` 도구를 Google Search나 코드 실행 같은 내장 도구와 함께 전달하면 된다. 셋째, 커스텀 함수 호출이 샌드박스 내장 도구와 나란히 동작한다. 내장 도구는 서버에서 자동 실행되고, 커스텀 함수는 `requires_action` 상태로 전환되어 클라이언트 측 로컬 비즈니스 로직을 실행한다. 넷째, 만료된 액세스 토큰이나 API 키를 `environment_id`를 유지한 채 새 네트워크 설정으로 갱신할 수 있으며, 파일시스템 상태·설치된 패키지·클론된 저장소는 그대로 보존된다.

## 설정 파일에 어떤 의미인가

이번 업데이트는 API 호출 시 파라미터 수준의 변경(`background`, `mcp_server` 도구 정의, 네트워크 자격 증명 객체 등)이 핵심이다. 기존 프로젝트 빌드 설정이나 린터·번들러 구성에 직접 영향을 주는 종류의 변경은 아니다. 다만 에이전트 환경 설정(environment configuration)과 네트워크 규칙(network rules) 정의 방식이 구체적으로 어떤 스키마를 따르는지는 원문에서도 상세히 다루지 않고 공식 문서로 안내하고 있다. 커스텀 에이전트 정의 파일이나 MCP 서버 연결 설정의 구체적 포맷이 궁금하다면 Gemini Interactions API 개요 문서와 관리형 에이전트 퀵스타트를 직접 확인하는 편이 정확하다.

## 다음 단계 제안

이미 Gemini API로 에이전트를 운영 중이라면 백그라운드 실행 모드부터 테스트해 보는 것이 실질적이다. 긴 작업에서 HTTP 타임아웃으로 고생한 경험이 있다면 즉시 효과를 체감할 수 있다. 원격 MCP 연동은 사내 API나 프라이빗 데이터베이스를 에이전트에 노출해야 하는 시나리오에서 프록시 레이어를 줄여 줄 수 있으므로, 해당 요구사항이 있다면 공식 문서의 보안 모범 사례와 함께 검토하길 권한다.

---

**원문 전체 보기**: [Expanding Managed Agents in Gemini API:  background tasks, remote MCP and more](https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/) ([Google AI Blog](https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/))