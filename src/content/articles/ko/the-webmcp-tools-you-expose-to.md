---
id: "https://www.searchenginejournal.com/the-webmcp-tools-you-expose-to-agents-can-be-used-to-hijack-them/579204/"
tool: "searchenginejournal"
title: "WebMCP로 노출한 도구가 AI 에이전트를 탈취하는 데 악용될 수 있다"
link: "https://www.searchenginejournal.com/the-webmcp-tools-you-expose-to-agents-can-be-used-to-hijack-them/579204/"
pubDate: 2026-07-12T12:00:52.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/the-webmcp-tools-you-expose-to-agents-can-be-used-to-hijack-them/579204/"
contentType: "commentary"
summary: "Chrome의 WebMCP 보안 가이드가 공개됐다. 웹사이트가 에이전트에게 노출하는 도구 자체가 프롬프트 인젝션의 구조화된 전달 경로가 될 수 있으며, 방어 책임은 에이전트가 아니라 도구를 등록하는 웹사이트 측에 있다는 내용이다."
---

Search Engine Journal이 Chrome 개발자 사이트에 게시된 WebMCP 보안 가이드를 분석한 글을 냈다. 웹사이트가 AI 에이전트에게 명시적으로 제공하는 도구(tool)가 곧 공격 표면이 되며, 그 방어는 도구를 등록한 쪽의 몫이라는 점이 핵심이다.

## 무엇이 새로운가

Chrome은 두 가지 공격 벡터를 명시했다. 첫째는 **악성 매니페스트** — 도구 이름·파라미터·설명에 에이전트를 탈취하려는 숨겨진 지시를 삽입하는 것이다. 둘째는 **오염된 출력(contaminated output)** — 악의 없는 사이트라도 사용자 리뷰·댓글·포럼 글 등 UGC를 반환하는 도구가 프롬프트 인젝션 페이로드를 에이전트에 전달할 수 있다. Chrome은 "LLM이 모든 텍스트를 단일 토큰 시퀀스로 처리하기 때문에 모델 내부에서 안전을 보장하는 것은 불가능하다"고 명시했다. 방어 수단으로는 `untrustedContentHint`, `readOnlyHint`, `exposedTo` 같은 어노테이션과 도구 설명 500자·출력 약 1,500자 제한, `requestUserInteraction()` 확인 경로 등이 제시됐다. WebMCP는 현재 Chrome 오리진 트라이얼 단계이며 스펙은 계속 변경 중이다.

## 설정 파일에 어떤 의미인가

WebMCP 도구 등록은 JavaScript API(`document.modelContext.registerTool`)를 통해 이루어지므로, 전통적인 빌드 도구 설정 파일(webpack, Vite, ESLint 등)과 직접적으로 교차하는 지점은 원문에서 다루지 않았다. 다만 개발자 도구 설정 관점에서 주목할 부분이 있다. `exposedTo`로 허용 오리진 목록을 관리하는 패턴은 CSP(Content-Security-Policy) 설정과 구조가 유사하다. 사이트에 WebMCP를 도입한다면 기존 CSP 정책·CORS 허용 목록과 `exposedTo` 오리진 목록 간의 일관성을 점검해야 할 가능성이 높다. 스펙이 확정되고 프레임워크 수준 통합(예: Next.js 미들웨어, Nuxt 플러그인)이 나오면 설정 파일 차원의 영향을 다시 정리하겠다.

## 다음 단계 제안

지금 당장 WebMCP 도구를 프로덕션에 등록할 계획이 없더라도, 원문이 권고하는 위협 모델링 습관은 유용하다. 등록하려는 도구마다 "이 도구가 반환할 수 있는 비신뢰 콘텐츠는 무엇인가?"를 먼저 답하고, 답할 수 없으면 도구를 내보내지 않는 것이 원칙이다. UGC를 반환하는 기존 API 엔드포인트가 있다면, 그것이 WebMCP 도구로 래핑될 때 프롬프트 인젝션 경로가 되는지 사전에 점검해 두는 것이 현실적인 첫 단계다. Chrome 보안 가이드 원문을 함께 읽어볼 것을 권한다.

---

**원문 전체 보기**: [The WebMCP Tools You Expose To Agents Can Be Used To Hijack Them](https://www.searchenginejournal.com/the-webmcp-tools-you-expose-to-agents-can-be-used-to-hijack-them/579204/) ([Search Engine Journal](https://www.searchenginejournal.com/the-webmcp-tools-you-expose-to-agents-can-be-used-to-hijack-them/579204/))