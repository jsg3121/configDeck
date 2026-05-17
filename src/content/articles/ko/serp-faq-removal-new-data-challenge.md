---
id: "https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/"
tool: "searchenginejournal"
title: "FAQ 리치 결과 제거와 새 데이터가 스키마 마크업의 AI 검색 가치에 던지는 의문"
link: "https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/"
pubDate: 2026-05-16T12:00:54.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/"
contentType: "commentary"
summary: "Google이 FAQ 리치 결과를 종료하고, Ahrefs 연구에서 JSON-LD 추가가 AI 검색 인용 증가에 유의미한 효과를 보이지 않았다는 분석이 나왔다. 스키마 마크업을 AI 인용 부스터로 권장하던 GEO 전략의 근거가 약해지고 있다."
---

Search Engine Journal이 Google의 FAQ 리치 결과 종료와 Ahrefs의 JSON-LD 효과 연구를 종합 분석한 기사를 게재했다. 스키마 마크업이 AI 검색 인용을 높인다는 그간의 주장에 대해 데이터 기반의 반론이 제기된 셈이다.

## 무엇이 새로운가

Google은 FAQ 리치 결과를 공식 종료했으며, 그 4일 후 Ahrefs가 1,885개 웹페이지를 대상으로 JSON-LD 스키마 추가 전후의 AI 인용 변화를 측정한 보고서를 발표했다. 결과는 Google AI Mode +2.4%, ChatGPT +2.2%, Google AI Overviews -4.6%로, 앞의 두 수치는 통계적으로 의미 없는 수준이었고 AI Overviews의 감소는 유의미했으나 Ahrefs 스스로도 스키마 때문이라 단정하지 않았다. 테스트 대상 페이지 모두 스키마 추가 전에 이미 100건 이상의 AI Overview 인용을 보유하고 있었다는 점이 중요하다. 즉, 이미 충분히 노출된 페이지에 스키마를 얹었을 때의 효과만 측정된 것이다. Yoast 창립자 Joost de Valk는 "GEO 업계가 초기 SEO의 사이클을 더 빠르게 반복하고 있다"고 지적했고, Lily Ray는 FAQ 스키마가 스팸화되어 보상이 철회되는 익숙한 패턴이라고 평가했다.

## 설정 파일에 어떤 의미인가

ConfigDeck 관점에서 보면, 이번 소식은 CMS·사이트 빌더의 구조화 데이터 설정을 재검토할 시점이라는 신호다. 많은 프로젝트가 Yoast, RankMath, 혹은 커스텀 JSON-LD 생성 로직을 통해 FAQ 스키마를 자동 삽입하고 있는데, 리치 결과가 더 이상 렌더링되지 않으므로 해당 설정의 유지 비용 대비 효과를 따져봐야 한다. 다만 Google은 FAQ 구조화 데이터를 페이지 이해 목적으로 계속 사용한다고 명시했으므로, 즉시 제거가 정답은 아니다. Product, Review, Event, Video 등 여전히 활성 리치 결과를 지원하는 타입은 별개로 봐야 하며, Ahrefs 연구가 모든 스키마 타입을 하나로 묶어 측정했다는 한계도 원문에서 명확히 언급되어 있다. JavaScript로 주입되는 스키마와 HTML 내 스키마의 크롤링 차이, 30일이라는 짧은 측정 기간, Bing·Perplexity 등 다른 AI 시스템에서의 효과 등은 아직 데이터가 없다.

## 다음 단계 제안

지금 당장 모든 스키마를 걷어내기보다는, 프로젝트에서 FAQ 스키마를 자동 생성하고 있는 설정(플러그인 옵션, 커스텀 템플릿 등)을 감사(audit)하고 리치 결과가 여전히 활성인 타입과 그렇지 않은 타입을 구분해 우선순위를 재조정하는 것이 실용적이다. "스키마를 넣으면 AI 인용이 오른다"는 전제로 세워진 GEO 전략이 있다면, Ahrefs 원문의 방법론과 한계를 직접 읽고 자사 상황에 맞는지 판단하는 것을 권한다.

---

**원문 전체 보기**: [SERP FAQ Removal & New Data Challenge Schema's AI Search Value](https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/) ([Search Engine Journal](https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/))