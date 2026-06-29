---
id: "https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/"
tool: "searchenginejournal"
title: "검색과 에이전트는 하나의 제품이다 — 플레이북도 하나면 된다"
link: "https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/"
pubDate: 2026-06-28T12:00:52.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/"
contentType: "commentary"
summary: "Google CEO Sundar Pichai와 SVP Nick Fox의 발언을 근거로, 기존 SEO와 AI 에이전트 최적화가 별개 전략이 아닌 동일한 플레이북임을 주장하는 Search Engine Journal 기고문이다."
---

Search Engine Journal에 게재된 이 글은 2026년 봄 Sundar Pichai의 인터뷰 두 건과 Google Marketing Live 2026에서 Nick Fox의 발언을 엮어, Google Search가 에이전트 매니저로 수렴하고 있으며 최적화 방법론도 하나로 통합된다는 논지를 펼친다. 별도의 "AEO 전략"이나 "GEO 전략"을 팔던 시대가 끝나고 있다는 주장이다.

## 무엇이 새로운가

Pichai는 Cheeky Pint 팟캐스트에서 "정보 탐색 쿼리의 상당수가 Search 안에서 에이전틱해질 것"이라 말했고, AI Mode에서 이미 실현 중이라고 밝혔다. Decoder 인터뷰에서는 AI Overview 결과를 보고 "해당 쿼리에 비해 너무 의견이 강하다"고 인정하며 제품이 아직 완성형이 아님을 시사했다. Nick Fox는 "AI 검색 최적화 방법은 검색 최적화 방법과 같다. 좋은 콘텐츠를 만들라"고 직접 발언했고, AI가 이미 처리하는 표면적 수준을 넘어서는 깊이가 필요하다고 덧붙였다. 기고자 자체 조사에 따르면, 핀테크 기업 274곳 중 36%가 JavaScript 의존 때문에 AI 크롤러에 부분적으로 보이지 않았고, 17%는 JS 실행 없이 콘텐츠가 전혀 노출되지 않았다.

## 설정 파일에 어떤 의미인가

이 글은 SEO·콘텐츠 전략 관점의 논의이며, 특정 개발 도구의 설정 파일이나 빌드 구성 변경을 다루지는 않는다. 다만 개발 팀 설정에 한 가지 실질적 시사점이 있다: **서버 사이드 렌더링(SSR) 기본 출력**이다. 원문은 "raw HTML first, not JS-rendered-eventually"를 강조하며, AI 크롤러와 에이전트가 접근하는 것은 결국 JavaScript 실행 전의 HTML이라고 지적한다. Next.js, Nuxt, Astro 등 프레임워크를 사용하는 프로젝트라면 SSR/SSG 설정이 제대로 켜져 있는지, 핵심 콘텐츠가 클라이언트 전용 렌더링에 갇혀 있지 않은지 점검할 가치가 있다. 구체적인 프레임워크별 설정 가이드는 원문 범위 밖이므로, 각 프레임워크 공식 문서를 참고하는 편이 정확하다.

시맨틱 마크업, 구조화 데이터(structured data), 내부 링크 구조 등은 기존 SEO 체크리스트와 동일하다. 원문은 Google이 4월에 공개한 에이전트 친화적 체크리스트와도 같은 항목이라고 명시한다.

## 다음 단계 제안

자사 사이트에 JavaScript 비활성화 상태로 접속해 핵심 콘텐츠가 보이는지부터 확인해 보라. curl이나 브라우저 DevTools에서 JS를 끈 채로 페이지를 로드하면 AI 크롤러 시점을 빠르게 시뮬레이션할 수 있다. SSR 설정이 미비하다면 프레임워크의 렌더링 모드 옵션을 재검토하고, 구조화 데이터가 빠져 있다면 Schema.org 마크업 추가를 우선순위에 올리는 것이 실질적인 첫 단계다. 전체 맥락과 Pichai·Fox 발언 원문은 아래 링크에서 확인할 수 있다.

---

**원문 전체 보기**: [Search And Agents Are One Product. You Only Need One Playbook](https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/) ([Search Engine Journal](https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/))