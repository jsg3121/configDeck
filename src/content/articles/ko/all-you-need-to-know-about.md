---
id: "https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/"
tool: "searchenginejournal"
title: "Cloudflare의 에이전트 준비 점수(Agent Readiness Score)에 대해 알아야 할 것들"
link: "https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/"
pubDate: 2026-05-24T12:00:59.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/"
contentType: "commentary"
summary: "Cloudflare가 isitagentready.com을 통해 웹사이트의 AI 에이전트 대응 수준을 100점 만점으로 측정하는 스캐너를 공개했다. Search Engine Journal 원문은 16개 체크 항목의 실제 내용과, 합산 점수만으로 판단할 때 발생하는 구조적 오해를 상세히 분석한다."
---

Search Engine Journal이 Cloudflare의 Agent Readiness Score 스캐너를 심층 분석한 글을 게재했다. isitagentready.com에 URL을 입력하면 5개 카테고리, 16개 항목에 걸쳐 해당 사이트가 AI 에이전트에 얼마나 준비되어 있는지 100점 만점으로 점수를 매긴다.

## 무엇이 새로운가

스캐너는 Discoverability(robots.txt, sitemap, Link 헤더), Content(Markdown 콘텐츠 협상), Bot Access Control(AI 봇 규칙, Content Signals, Web Bot Auth), API/Auth/MCP & Skill Discovery(API Catalog, OAuth/OIDC, MCP Server Card 등 6개), Commerce(x402, UCP, ACP) 총 5개 카테고리를 검사한다. Cloudflare Radar 통합, URL Scanner API, 그리고 MCP 서버 엔드포인트(`.well-known/mcp.json`)로도 동일한 검사를 실행할 수 있다. 특히 MCP 엔드포인트는 에이전트가 직접 스캐너를 호출해 대상 사이트를 감사할 수 있다는 점에서 주목할 만하다. 원문 필자는 자신의 콘텐츠 블로그에서 33/100을 받았는데, API·MCP·Commerce처럼 블로그에 해당하지 않는 카테고리가 점수를 끌어내렸다고 지적하며 합산 점수의 구조적 한계를 경고한다.

## 설정 파일에 어떤 의미인가

이 스캐너가 점검하는 항목 대부분은 웹 서버 및 CDN 단의 설정과 직결된다. `robots.txt`에 AI 전용 User-agent 디렉티브와 Content Signals를 추가하는 것, `.well-known/` 경로에 `api-catalog`, `mcp/server-card.json`, `http-message-signatures-directory` 같은 디스커버리 파일을 배치하는 것, Accept 헤더에 따라 Markdown을 반환하는 콘텐츠 협상 로직을 구성하는 것 — 모두 Nginx, Caddy, Cloudflare Workers 같은 레이어에서 라우팅·응답 설정을 건드려야 한다. 다만 이 체크 항목 중 상당수(Web Bot Auth, Content Signals, WebMCP, Agent Skills 등)는 아직 초안 단계 스펙이거나 Cloudflare 자체 제안이어서, 지금 당장 프로덕션 설정을 전면 개편할 필요는 없다. 원문도 이 점을 명확히 짚고 있다. 기존 `robots.txt`나 sitemap 설정이 정상인지, `.well-known/` 경로가 올바르게 서빙되는지 확인하는 정도가 현실적인 첫 단계다.

## 다음 단계 제안

우선 isitagentready.com에 자신의 사이트를 넣어보고 카테고리별 결과를 확인하자. 합산 점수보다 어떤 카테고리에서 실패했는지가 중요하다 — 원문이 강조하듯 사이트 유형에 따라 해당되지 않는 항목이 점수를 왜곡할 수 있다. `robots.txt`와 sitemap 같은 기본 항목부터 정리하고, MCP나 Agent Skills 같은 신규 스펙은 표준화 진행 상황을 지켜보며 도입 시점을 판단하면 된다. 16개 항목 각각의 의미와 실제 테스트 결과에 대한 상세한 분석은 원문에서 확인할 수 있다.

---

**원문 전체 보기**: [All You Need To Know About Cloudflare's Agent Readiness Score](https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/) ([Search Engine Journal](https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/))