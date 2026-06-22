---
id: "https://www.searchenginejournal.com/make-something-agents-want/576188/"
tool: "searchenginejournal"
title: "AI 에이전트가 원하는 것을 만들어라"
link: "https://www.searchenginejournal.com/make-something-agents-want/576188/"
pubDate: 2026-06-21T12:00:34.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/make-something-agents-want/576188/"
contentType: "commentary"
summary: "Cloudflare, Shopify, Stripe, Supabase, Netlify, Google 등 6개 기업이 독립적으로 AI 에이전트 대응 인프라를 구축한 현상을 분석하며, 웹사이트가 사람뿐 아니라 에이전트에게도 작동해야 하는 이유를 설명하는 글이다."
---

Search Engine Journal에 게재된 이 글은 Y Combinator의 "Make something people want"라는 모토를 AI 에이전트 시대에 맞게 재해석한다. Cloudflare, Shopify, Stripe, Supabase, Netlify, Google이 서로 조율 없이 각자 에이전트 대응 인프라를 구축한 현상을 근거로, 에이전트가 새로운 배포 채널이 되었다고 주장한다.

## 무엇이 새로운가

원문이 정리한 핵심 사례를 요약하면 이렇다. Cloudflare는 2026년 4월 런치 위크 전체를 에이전트에 할애했고, Web Bot Auth, Markdown for Agents, WebMCP in Browser Run, Agent Readiness Score 등을 발표했다. Shopify는 Agent Toolkit을 출시해 AI 에이전트가 카탈로그 탐색부터 결제까지 구조화된 API로 처리할 수 있게 했다. Google은 Universal Commerce Protocol을 I/O 2026에서 확장하고, FIDO Alliance에 Agent Payments Protocol을 60개 기관과 함께 추가했다. Stripe는 Projects를, Netlify는 netlify.ai라는 별도 에이전트 전용 진입점을 만들었다. 저자가 강조하는 공통 패턴은 세 가지다: 머신 리더블 아이덴티티, 구조화된 콘텐츠, 에이전트가 호출 가능한 액션.

## 설정 파일에 어떤 의미인가

이 글은 SEO·인프라 전략 레벨의 논의이지, 특정 설정 파일이나 빌드 도구 변경을 다루지는 않는다. 다만 개발자 도구 설정과 직접 맞닿는 부분이 몇 가지 있다. 원문은 "JavaScript 렌더링에 의존하면 대부분의 에이전트가 빈 페이지를 본다"고 명시한다. 이는 Next.js, Nuxt, SvelteKit 등 프레임워크의 렌더링 모드 설정(SSR vs CSR)이 에이전트 도달성에 직접 영향을 준다는 뜻이다. robots.txt의 AI 유저에이전트 허용 여부, sitemap 최신 상태 유지, 구조화된 데이터 마크업 같은 항목도 언급되는데, 이들은 이미 익숙한 웹 기본기이지만 에이전트를 "방문자 클래스"로 인식하고 점검해야 한다는 관점은 새롭다. 프로토콜 레이어(UCP, MCP, WebMCP)와 관련된 구체적 설정 방법이나 마이그레이션 경로는 원문에서 상세히 다루지 않으므로, 각 플랫폼의 공식 문서를 직접 확인하는 편이 낫다.

## 다음 단계 제안

당장 할 수 있는 일은 자기 사이트의 에이전트 가시성을 점검하는 것이다. 원문에서 언급된 Cloudflare의 isitagentready.com으로 현재 상태를 확인해 보고, SSR 설정이 제대로 되어 있는지, robots.txt가 주요 AI 크롤러를 차단하고 있지는 않은지 살펴보자. 프로토콜 레이어 대응은 아직 대부분의 사이트에서 시작 전이라고 원문도 인정하고 있으니, 우선은 서버 렌더링과 구조화된 데이터부터 챙기는 게 현실적이다.

---

**원문 전체 보기**: [Make Something Agents Want](https://www.searchenginejournal.com/make-something-agents-want/576188/) ([Search Engine Journal](https://www.searchenginejournal.com/make-something-agents-want/576188/))