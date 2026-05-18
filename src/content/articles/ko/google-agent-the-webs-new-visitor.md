---
id: "https://www.searchenginejournal.com/google-agent-the-webs-new-visitor-just-got-an-identity/571508/"
tool: "searchenginejournal"
title: "Google-Agent: 웹의 새로운 방문자가 공식 신원을 얻었다"
link: "https://www.searchenginejournal.com/google-agent-the-webs-new-visitor-just-got-an-identity/571508/"
pubDate: 2026-05-17T12:00:45.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-agent-the-webs-new-visitor-just-got-an-identity/571508/"
contentType: "commentary"
summary: "Google이 공식 웹 페처 목록에 Google-Agent를 추가했다. 사용자 요청으로 작동하는 AI 에이전트이며, robots.txt를 무시하고 Web Bot Auth 암호화 인증을 실험 중이다."
---

Search Engine Journal이 Google의 새 사용자 에이전트 문자열 Google-Agent의 등장과 그 의미를 분석했다. 2026년 3월 20일 Google 공식 웹 페처 목록에 추가된 이 에이전트는, 크롤러가 아닌 사용자 대리 브라우징 도구로서 기존 봇과 근본적으로 다른 접근 규칙을 따른다.

## 무엇이 새로운가

Google-Agent는 Googlebot과 달리 사람이 요청할 때만 웹사이트를 방문한다. Project Mariner가 이를 사용하는 첫 번째 제품이다. 핵심은 두 가지다. 첫째, Google은 이를 "사용자 트리거 페처"로 분류하며 robots.txt 규칙을 일반적으로 무시한다는 입장이다. OpenAI의 ChatGPT-User나 Anthropic의 Claude-User가 robots.txt를 존중하는 것과 대비된다. 둘째, Google-Agent는 IETF 드래프트 표준인 Web Bot Auth 프로토콜을 실험 중이며, `https://agent.bot.goog`이라는 암호화 신원을 사용한다. User agent 문자열은 위조 가능하지만, 공개키 기반 서명은 그렇지 않다. Akamai, Cloudflare, Amazon(AgentCore Browser)이 이미 이 프로토콜을 지원하고 있다고 원문은 전한다.

## 설정 파일에 어떤 의미인가

이 주제는 전통적인 빌드 도구나 코드 설정 파일보다 인프라·서버 설정 영역에 해당한다. 개발자 입장에서 직접적으로 영향받는 설정 지점은 다음과 같다.

- **robots.txt**: Google-Agent에 대해서는 차단 효과가 없다. 콘텐츠 접근 제어가 필요하면 서버 사이드 인증으로 전환해야 한다. 기존 robots.txt의 `Disallow` 규칙이 이 에이전트에는 적용되지 않는다는 점을 팀 내 공유할 필요가 있다.
- **CDN·WAF 규칙**: Cloudflare, Akamai 등에서 비브라우저 트래픽을 공격적으로 차단하는 룰셋을 쓰고 있다면, Google이 공개하는 IP 범위를 허용 목록에 추가해야 에이전트 트래픽이 서버에 도달한다.
- **Web Bot Auth**: 아직 IETF 드래프트 단계이고 Google도 실험 중이므로, 당장 설정에 반영할 구체적 스펙은 확정되지 않았다. 공식 스펙이 안정화되면 다시 정리하겠다.

폼이나 체크아웃 플로우를 운영하는 경우, 시맨틱 HTML과 명확한 라벨이 에이전트 호환성의 기본이라는 점도 원문이 강조한다. JavaScript 의존도가 높은 인터랙션은 에이전트가 조용히 실패할 수 있다.

## 다음 단계 제안

서버 액세스 로그에서 `Google-Agent` 문자열을 필터링해 현재 트래픽 규모와 접근 패턴을 먼저 파악하자. CDN·WAF 설정에서 Google 공개 IP 범위 허용 여부를 점검하고, robots.txt에만 의존하던 접근 제어가 있다면 인증 기반으로 전환할 계획을 세울 시점이다. Web Bot Auth 프로토콜은 드래프트 상태이므로 IETF 문서와 Google 공식 문서를 워치리스트에 추가해두는 정도면 충분하다.

---

**원문 전체 보기**: [Google-Agent: The Web's New Visitor Just Got An Identity](https://www.searchenginejournal.com/google-agent-the-webs-new-visitor-just-got-an-identity/571508/) ([Search Engine Journal](https://www.searchenginejournal.com/google-agent-the-webs-new-visitor-just-got-an-identity/571508/))