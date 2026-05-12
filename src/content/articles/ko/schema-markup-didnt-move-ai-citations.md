---
id: "https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/"
tool: "searchenginejournal"
title: "Ahrefs 테스트 결과, 스키마 마크업이 AI 인용에 영향을 주지 않았다"
link: "https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/"
pubDate: 2026-05-11T21:06:10.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/"
contentType: "commentary"
summary: "Ahrefs가 1,885개 페이지를 대상으로 JSON-LD 스키마 추가 전후의 AI 인용 변화를 통제 실험한 결과, Google AI Overviews·AI Mode·ChatGPT 어느 플랫폼에서도 유의미한 인용 증가가 나타나지 않았다."
---

Search Engine Journal이 Ahrefs의 새 보고서를 소개했다. JSON-LD 스키마 마크업을 추가해도 AI 플랫폼의 인용 횟수가 늘지 않았다는 내용이다.

## 무엇이 새로운가

Ahrefs는 600만 URL을 분석해 AI에 인용되는 페이지가 JSON-LD를 포함할 확률이 약 3배 높다는 상관관계를 확인했다. 그러나 이것이 인과관계인지 검증하기 위해 1,885개 페이지에 스키마를 추가한 뒤, 스키마가 없는 유사 인용 수준의 통제 페이지와 30일간 비교했다. 결과는 Google AI Overviews에서 −4.6%, AI Mode에서 +2.4%, ChatGPT에서 +2.2%로, 모두 유의미한 양의 효과가 아니었다. Ahrefs는 스키마가 있는 페이지의 높은 인용률을 스키마 자체의 효과가 아니라 사이트 전반의 품질 수준을 반영하는 상관 지표로 해석했다. 다만 보고서 대상 페이지 전부가 이미 AI Overview 인용 100건 이상인 상태였기 때문에, AI에 아직 노출되지 않은 페이지에 스키마가 도움이 되는지는 별도 연구가 필요하다고 밝혔다.

## 설정 파일에 어떤 의미인가

이 보고서는 SEO·구조화 데이터 영역의 실험이므로, 개발 도구의 빌드 설정이나 컴파일러 옵션에 직접적인 변경을 요구하지 않는다. 다만 사이트에 JSON-LD를 자동 삽입하는 설정(예: Next.js의 `metadata` API, Nuxt SEO 모듈, Jekyll·Hugo의 SEO 플러그인 등)을 운영 중이라면, 스키마 추가 자체가 AI 검색 노출의 은탄환이 아니라는 점을 인지할 필요가 있다. 스키마 설정을 제거하라는 뜻은 아니다 — 리치 결과나 지식 그래프 같은 기존 이점은 여전히 유효하다. 다만 "AI 인용 최적화"를 목적으로 스키마 구성에 공수를 투입하고 있었다면 우선순위를 재검토할 근거가 된다. 원문에서 설정 변경이나 마이그레이션 경로를 별도로 제시하지는 않았다.

## 다음 단계 제안

이미 JSON-LD를 삽입하고 있다면 굳이 제거할 이유는 없다. 대신 AI 인용 개선을 위해 스키마에만 의존하기보다, 콘텐츠 품질·링크 프로필·크롤 접근성 같은 복합 신호에 시간을 분배하는 편이 합리적이다. 아직 AI 검색에 노출되지 않는 페이지를 운영 중이라면, 이번 보고서가 다루지 못한 영역이므로 후속 연구를 주시하자. 원문의 실험 설계와 한계 설명이 상세하니 직접 읽어볼 것을 권한다.

---

**원문 전체 보기**: [Schema Markup Didn't Move AI Citations In Ahrefs Test](https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/) ([Search Engine Journal](https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/))