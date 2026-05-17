---
id: "https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/"
tool: "searchenginejournal"
title: "구글의 새 AI 검색 가이드, AEO와 GEO를 '여전히 SEO'라고 규정"
link: "https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/"
pubDate: 2026-05-15T16:14:25.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/"
contentType: "commentary"
summary: "구글이 생성형 AI 검색 최적화 공식 문서를 새로 발행하며, AEO·GEO를 별도 프레임워크가 아닌 기존 SEO의 일부로 명시했다. llms.txt, 콘텐츠 청킹, 인위적 멘션 등 업계에서 권장되던 전술 다수를 불필요하다고 공식 부인한 점이 핵심이다."
---

Search Engine Journal이 구글의 새 공식 문서 "Optimizing your website for generative AI features on Google Search"를 분석했다. AI Overviews와 AI Mode를 포함한 생성형 AI 검색 기능에 대한 구글 측 최적화 권고와 불필요한 전술 목록을 정리한 내용이다.

## 무엇이 새로운가

구글은 AEO(Answer Engine Optimization)와 GEO(Generative Engine Optimization)를 별도 분야로 취급하지 않으며, "구글 검색 관점에서 생성형 AI 검색 최적화는 검색 경험 최적화이므로 여전히 SEO"라고 문서에 명시했다. 이전까지 컨퍼런스 발언 수준이던 입장이 공식 문서로 올라간 셈이다.

"미신 타파(Mythbusting)" 섹션에서는 구체적으로 llms.txt 파일 및 특수 마크업 생성, 콘텐츠 청킹, AI 시스템 맞춤 콘텐츠 재작성, 인위적 멘션 확보, 생성형 AI 전용 구조화 데이터 등을 구글 검색에서는 불필요하다고 명시했다. 한편 에이전트(agentic) 경험에 대한 초기 가이드도 포함되어, 브라우저 에이전트가 스크린샷·DOM·접근성 트리를 분석해 웹사이트에 접근할 수 있다는 점과 Universal Commerce Protocol(UCP)을 언급하고 있다.

## 설정 파일에 어떤 의미인가

이 가이드는 SEO·웹 퍼블리싱 영역의 소식이므로, 개발자 도구의 빌드 설정이나 린트 설정에 직접적인 변경을 유발하지는 않는다. 다만 사이트를 운영하는 개발자 입장에서 몇 가지 설정 관련 시사점이 있다.

- **llms.txt 생성 자동화를 빌드 파이프라인에 넣었다면**: 구글 검색 노출 목적이라면 우선순위를 재고할 수 있다. 구글은 이 파일에 특별한 가중치를 부여하지 않는다고 밝혔다. 물론 ChatGPT나 Perplexity 등 비-구글 플랫폼에서는 다를 수 있으므로 완전히 제거할지는 별도 판단이 필요하다.
- **구조화 데이터(JSON-LD 등) 설정**: 생성형 AI 전용 스키마는 없다고 명시했으나, 리치 결과를 위한 기존 구조화 데이터는 계속 유지하라고 권고한다. 기존 설정을 바꿀 이유는 없다.
- **시맨틱 HTML, JavaScript SEO 모범 사례, 크롤링 설정**: 구글이 기술적 권고로 재차 강조한 영역이다. Next.js 등 프레임워크의 SSR/SSG 설정, robots.txt, 메타 태그 설정은 기존대로 유지하면 된다.

에이전트 관련 설정(UCP 등)은 아직 초기 단계이며, 구글 스스로도 "관련성이 있고 여유가 있을 때 탐색하라"고 표현했다. 당장 설정 변경이 필요한 사안은 아니다.

## 다음 단계 제안

기존에 AEO/GEO 전용 최적화 작업을 별도로 진행하고 있었다면, 이번 구글 공식 문서를 기준으로 해당 작업의 실제 효과를 재평가하는 것이 합리적이다. 특히 llms.txt 생성이나 콘텐츠 청킹을 빌드 스크립트에 포함시켰다면, 구글 검색 대상 여부를 기준으로 유지·제거를 판단하면 된다. 에이전트 경험에 관심이 있다면 구글이 링크한 web.dev의 에이전트 친화 웹사이트 가이드를 먼저 읽어보는 것을 추천한다.

---

**원문 전체 보기**: [Google's New AI Search Guide Calls AEO And GEO 'Still SEO'](https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/) ([Search Engine Journal](https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/))