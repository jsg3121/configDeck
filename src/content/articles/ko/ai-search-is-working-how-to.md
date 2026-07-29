---
id: "https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/"
tool: "searchenginejournal"
title: "AI 검색이 실제로 작동하고 있다 — 실험으로 증명하는 방법"
link: "https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/"
pubDate: 2026-07-23T19:38:11.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/"
contentType: "commentary"
summary: "seoClarity 팀이 AI 검색 인용(citation)에 대한 분할 테스트 방법론과 세 가지 실제 클라이언트 테스트 결과를 공유한 Search Engine Journal 웨비나 요약이다. FAQ 추가·제거 실험으로 상관관계가 아닌 인과관계를 입증한 사례가 핵심이다."
---

Search Engine Journal이 seoClarity의 Mark Traphagen, Mihir Naik, Suraj Lalchandani와 함께 진행한 웨비나 요약을 공개했다. 주제는 AI 검색(ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews 등)에서의 노출을 단순 가시성 점수가 아닌 분할 테스트로 인과적으로 검증하는 방법론이다.

## 무엇이 새로운가

가장 눈에 띄는 부분은 FAQ 섹션 실험이다. 약 1,000개 프롬프트를 측정 대상으로 두고 테스트 페이지에 FAQ를 추가하자 AI 인용이 대조군 대비 상승했고, FAQ를 제거하자 인용이 다시 하락했다. seoClarity 측은 이 "되돌림(reversion)"이 상관관계와 인과관계를 구분하는 핵심이라고 강조했다. 반면 메타 디스크립션 변경과 리스티클 포맷 변경 테스트는 예상과 다른 결과를 냈는데, 구체적인 내용은 웨비나 녹화본에서 확인할 수 있다.

또 하나 주목할 점은 Google이 6월 3일 Search Console에 AI Overviews·AI Mode 전용 리포트를 추가한 것이다. URL 단위로 Google AI 검색 피처 내 노출 빈도를 퍼스트파티 데이터로 확인할 수 있게 됐다. 다만 seoClarity 팀은 이 리포트가 ChatGPT, Claude, Perplexity 등 비Google AI 엔진은 커버하지 못하므로 서드파티 트래킹이 여전히 필요하다고 짚었다.

LLM 환경에서는 트래픽을 50:50으로 분할할 수 없기 때문에, 상관 페이지(correlated pages)로 대조군을 구성하고, 변경 전 베이스라인 기간과 변경 후 최소 테스트 기간을 엄격히 설정하는 방식을 사용한다. 테스트 윈도우를 너무 짧게 잡으면 "노이즈를 읽게 된다"는 경고도 덧붙였다.

## 설정 파일에 어떤 의미인가

이 웨비나는 SEO·AEO(Answer Engine Optimization) 전략 레벨의 이야기이며, 특정 빌드 도구나 개발 설정 파일의 변경을 요구하는 내용이 아니다. 다만 개발 팀 관점에서 접점이 하나 있다. FAQ 섹션의 접기(collapsible toggle) 구현 방식에 따라 AI 봇이 콘텐츠를 읽을 수도, 못 읽을 수도 있다는 점이다. Lalchandani는 특정 구현은 Google과 AI 엔진 모두에 콘텐츠가 노출되고, 다른 구현은 양쪽 모두에 보이지 않는다고 언급했다. 구체적인 구현 패턴 비교는 녹화본에서 다루므로, 프론트엔드에서 아코디언 컴포넌트를 쓰고 있다면 확인해 볼 가치가 있다. 스키마나 마크다운 테스트 블루프린트도 세션에서 다뤘다고 하지만, 원문에 기술적 상세는 포함되어 있지 않아 여기서 추측하지 않겠다.

## 다음 단계 제안

우선 Google Search Console에 AI Overviews / AI Mode 리포트가 활성화되어 있는지 확인하라. 자사 사이트가 대상 서브셋에 포함된다면, 퍼스트파티 데이터 기반으로 현재 AI 검색 노출 상태를 파악하는 것이 첫 단계다. 그다음, 사이트에서 접기 방식으로 구현된 FAQ가 있다면 실제 AI 크롤러가 해당 콘텐츠를 읽을 수 있는지 렌더링 테스트를 돌려보라. seoClarity의 분할 테스트 방법론 전체와 세 가지 테스트의 상세 결과는 웨비나 녹화본에서 확인할 수 있다.

---

**원문 전체 보기**: [AI Search is Working. How to Prove It With Real Tests.](https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/) ([Search Engine Journal](https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/))