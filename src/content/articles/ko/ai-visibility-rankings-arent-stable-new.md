---
id: "https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/"
tool: "searchenginejournal"
title: "AI 가시성 순위는 안정적이지 않다 — 새 연구에 따르면 대부분 통계적 노이즈"
link: "https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/"
pubDate: 2026-07-11T12:30:19.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/"
contentType: "commentary"
summary: "AI 가시성 트래킹 대시보드에 표시되는 인용 점유율과 순위는 단일 스냅샷에 불과하며, 동일 질문을 반복해도 결과가 달라진다는 IQRush 프리프린트 논문과 별도 연구를 Search Engine Journal이 분석했다."
---

Search Engine Journal이 IQRush의 프리프린트 논문(사전 공개 접근)을 바탕으로, AI 가시성 추적 데이터가 본질적으로 불안정하다는 분석 기사를 게재했다. 같은 질문을 SearchGPT, Gemini, Perplexity에 반복 입력하면 매번 다른 출처가 인용되며, 대시보드 수치는 고정된 사실이 아니라 변동하는 표본이라는 점을 강조한다.

## 무엇이 새로운가

논문의 핵심 주장은 두 가지 조건이 동시에 충족돼야 순위가 신뢰할 만하다는 것이다. 순위 순서가 더 이상 변하지 않아야 하고, 상위 사이트 간 차이가 오차 범위보다 커야 한다. 30개 플랫폼-주제 조합 테스트에서 두 조건 충족에 필요한 인용 포함 응답 수는 33~94개였고, SearchGPT에서는 3건이 125개 질문 이후에도 상위 사이트를 분리하지 못했다. 별도로 University of St. Gallen 연구팀도 4월에 유사한 결론 — 단일 측정은 신뢰할 수 없고 반복 샘플링이 필요하다 — 에 도달해 이 주장을 뒷받침한다. 플랫폼별로 필요한 데이터량도 다른데, Gemini는 동일 사이트에 인용을 집중시키므로 응답당 독립 정보가 적고, SearchGPT는 인용을 분산시켜 응답당 정보량이 더 많다. 상위 10위 사이트의 전형적 오차 범위가 약 5개 순위이며, 5건 중 1건은 10순위 이상 벌어진다는 점도 눈여겨볼 부분이다.

## 설정 파일에 어떤 의미인가

이 기사는 개발자 도구의 설정 파일이나 빌드 파이프라인과는 직접적 관련이 없다. 다만 AI 가시성 트래킹 도구를 CI/CD 파이프라인이나 대시보드에 통합해 SEO 지표를 자동 수집하는 팀이라면 고려할 점이 있다. 트래커가 단일 스냅샷만 반환하는지, 반복 측정 후 오차 범위를 함께 보고하는지를 확인해야 한다. 자동화 스크립트에서 단일 API 호출 결과를 확정 수치로 저장하고 있다면, 해당 데이터의 해석 방식을 재검토할 필요가 있다. 원문에서 특정 도구의 설정 옵션이나 마이그레이션 경로는 다루지 않으므로, 구체적인 설정 변경 사항은 각 트래킹 도구의 공식 문서를 참조하는 것이 맞다.

## 다음 단계 제안

현재 AI 가시성 트래킹 도구를 사용 중이라면, 해당 도구가 반복 샘플링과 오차 범위 리포팅을 지원하는지 먼저 확인하자. 콘텐츠 변경 전후 효과를 측정할 때는 단일 비교가 아닌 복수 측정을 기본으로 설계하고, "데이터 부족"이라는 결론도 유효한 결과로 받아들이는 것이 정확한 의사결정에 도움이 된다. 논문 자체가 프리프린트이고 30개 테스트 기반이므로, 자사 주제·플랫폼에 그대로 적용하기보다는 방법론의 방향성을 참고하는 수준이 적절하다.

---

**원문 전체 보기**: [AI Visibility Rankings Aren't Stable – New Research Shows It's Mostly Statistical Noise](https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/) ([Search Engine Journal](https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/))