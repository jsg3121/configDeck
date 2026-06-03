---
id: "https://www.searchenginejournal.com/microsoft-web-iq-gives-ai-agents-bing-grounding-apis/577736/"
tool: "searchenginejournal"
title: "Microsoft Web IQ — AI 에이전트에 Bing 그라운딩 API 제공"
link: "https://www.searchenginejournal.com/microsoft-web-iq-gives-ai-agents-bing-grounding-apis/577736/"
pubDate: 2026-06-02T19:10:58.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/microsoft-web-iq-gives-ai-agents-bing-grounding-apis/577736/"
contentType: "commentary"
summary: "Microsoft가 AI 에이전트용 그라운딩 API인 Web IQ를 발표했다. Bing 인덱스 기반으로 전체 웹페이지 대신 패시지와 구조화된 증거 객체를 반환해 토큰 비용과 지연을 줄이는 데 초점을 맞췄다."
---

Microsoft가 Web IQ라는 새로운 그라운딩 API 세트를 발표했다고 Search Engine Journal이 보도했다. Bing 검색 인덱스를 기반으로 AI 에이전트가 추론 과정에서 필요한 정보를 직접 조회할 수 있게 해주는 서비스다.

## 무엇이 새로운가

Web IQ의 핵심 차별점은 전체 웹페이지가 아닌 패시지(passage)와 '구조화된 증거 객체(structured evidence objects)'를 반환한다는 점이다. AI 모델이 처리하는 토큰 수를 줄여 비용과 지연을 동시에 낮추겠다는 설계 의도이며, Microsoft는 이를 "fewer tokens in, better answers out, lower cost per call"로 요약한다. 성능 측면에서는 P95 기준 165ms 이하 응답 시간을 보고하고 있고, 3,000개 샘플 쿼리 기반 자체 벤치마크에서 경쟁사 대비 높은 GDSAT(grounding satisfaction) 점수를 주장한다. 내부적으로는 DiskANN 기술을 확장해 대규모 인덱스를 메모리에 전부 올리지 않고도 빠른 검색이 가능하도록 했다. 퍼블리셔 측면에서는 기존 Bing이 준수하는 robots exclusion 규칙을 그대로 따르며, IETF 등과 AI 시스템의 웹 콘텐츠 접근 표준을 논의 중이라고 한다.

## 설정 파일에 어떤 의미인가

Web IQ는 아직 일반 공개(GA)도, 가격 정책도 발표되지 않은 상태다. 기존 Copilot이나 Bing Chat 그라운딩이 Web IQ를 사용하는지조차 확인되지 않았다. 따라서 현 시점에서 개발자 도구 설정이나 파이프라인에 직접 영향을 주는 부분은 없다.

다만, AI 에이전트를 직접 구축하거나 LLM 기반 도구에 외부 검색 그라운딩을 통합하는 팀이라면 주목할 포인트가 있다. 현재 Bing Search API나 다른 검색 기반 RAG(Retrieval-Augmented Generation) 파이프라인을 설정해 쓰고 있다면, Web IQ가 GA될 때 엔드포인트·인증·응답 스키마가 기존 Bing API와 다를 가능성이 높다. 원문에서도 "재설계된 리트리벌 스택"이라고 명시하고 있어, 단순 드롭인 교체가 아닐 수 있다. 공식 API 스펙과 마이그레이션 가이드가 나오기 전까지는 기존 설정을 유지하는 편이 안전하다.

## 다음 단계 제안

지금 당장 설정을 바꿀 것은 없다. 대신 Microsoft가 관심 표명(expressions of interest)을 받고 있으므로, AI 에이전트 그라운딩에 Bing 인덱스를 활용할 계획이 있다면 대기자 등록을 해두는 것이 실질적인 첫 단계다. 아울러 올해 Bing Webmaster Tools에 추가된 AI 인용 데이터와 Citation Share 기능도 함께 살펴보면, 퍼블리셔 입장에서 자신의 콘텐츠가 AI 시스템에 어떻게 소비되는지 전체 그림을 잡는 데 도움이 된다.

---

**원문 전체 보기**: [Microsoft Web IQ Gives AI Agents Bing Grounding APIs](https://www.searchenginejournal.com/microsoft-web-iq-gives-ai-agents-bing-grounding-apis/577736/) ([Search Engine Journal](https://www.searchenginejournal.com/microsoft-web-iq-gives-ai-agents-bing-grounding-apis/577736/))