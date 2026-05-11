---
id: "https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/"
tool: "searchenginejournal"
title: "Google, 검색 결과에서 FAQ 리치 결과 완전 제거"
link: "https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/"
pubDate: 2026-05-10T08:54:15.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/"
contentType: "commentary"
summary: "Google이 FAQ 리치 결과를 검색에서 완전히 제거했다. 2023년부터 단계적으로 축소해 온 과정의 마무리이며, Search Console 보고서와 API 지원도 순차적으로 종료된다."
---

Search Engine Journal 보도에 따르면, Google이 FAQ 리치 결과 기능을 공식 폐기(deprecate)했다. 5월 7일부터 검색 결과에 FAQ 리치 결과가 더 이상 표시되지 않으며, 2023년 정부·의료 사이트에만 남겨뒀던 마지막 예외까지 모두 종료된 것이다.

## 무엇이 새로운가

폐기 일정은 세 단계로 나뉜다. 첫째, 5월 7일 기준으로 검색 결과 노출이 중단됐다. 둘째, 2026년 6월에 Search Console의 FAQ 검색 노출 필터, 리치 결과 보고서, Rich Results Test 지원이 제거된다. 셋째, Search Console API에서의 FAQ 리치 결과 지원은 2026년 8월에 종료되므로, API를 호출하는 팀은 그 전까지 코드를 조정해야 한다.

Google 문서에는 FAQPage 구조화 데이터를 페이지에 남겨둬도 문제가 되지 않는다고 명시돼 있다. 다만 해당 마크업이 가시적인 검색 결과를 만들어내지는 않는다. Google은 폐기 이유에 대해 별도의 블로그 포스트나 설명을 제공하지 않았다.

## 설정 파일에 어떤 의미인가

이번 변경은 개발자 도구 설정 파일에 직접적인 breaking change를 일으키지는 않는다. FAQPage 스키마는 여전히 유효한 Schema.org 타입이고, 마크업 자체가 크롤링이나 인덱싱에 악영향을 주지 않는다고 Google이 밝힌 바 있다.

다만 실질적으로 영향받는 지점이 있다. Search Console API를 통해 FAQ 리치 결과 데이터를 수집하는 자동화 파이프라인이나 모니터링 스크립트가 있다면, 8월 API 종료 전에 해당 호출을 제거하거나 수정해야 한다. CI/CD에 리치 결과 검증 단계를 넣어둔 경우에도 6월 이후 Rich Results Test 지원이 사라지므로 해당 단계가 실패할 수 있다.

FAQ 스키마가 AI 검색 시스템의 콘텐츠 파싱에 도움이 된다는 조언이 일부 있었다는 점도 원문이 언급하고 있으나, Google은 이 폐기와 AI 검색 트렌드 사이의 연관성을 확인하지 않았다. 이 부분은 추측을 삼가는 게 맞다.

## 다음 단계 제안

우선 Search Console API를 호출하는 코드베이스를 검색해서 FAQ 관련 호출이 있는지 확인하자. 있다면 8월 전까지 제거 일정을 잡으면 된다. FAQ 구조화 데이터 자체는 급히 지울 필요 없지만, 더 이상 검색 노출 효과가 없으므로 유지보수 비용 대비 이점을 재평가해볼 시점이다. 리치 결과 모니터링 대시보드가 있다면 FAQ 항목을 정리해 불필요한 알림을 방지하는 것도 권장한다.

---

**원문 전체 보기**: [Google Drops FAQ Rich Results From Search](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/) ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/))