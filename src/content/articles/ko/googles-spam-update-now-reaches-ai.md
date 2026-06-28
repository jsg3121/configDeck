---
id: "https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/"
tool: "searchenginejournal"
title: "Google 스팸 업데이트, AI 답변까지 적용 범위 확대 — 단속은 여전히 난제"
link: "https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/"
pubDate: 2026-06-27T12:00:59.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/"
contentType: "commentary"
summary: "Google 6월 스팸 업데이트가 생성형 AI 답변 조작까지 단속 대상으로 포함했으나, Cornell Tech 프리프린트 연구는 사용자 생성 콘텐츠를 통한 AI 답변 오염이 탐지·방어 모두 어렵다는 점을 보여준다."
---

Google이 올해 두 번째 스팸 업데이트 롤아웃을 시작했으며, 이번에는 "생성형 AI 응답을 조작하려는 시도"도 스팸 정책 위반으로 명시 적용된다. Search Engine Journal이 Cornell Tech의 미심사 프리프린트 연구 결과와 함께 이 정책의 실효성 문제를 상세히 다뤘다.

## 무엇이 새로운가

Google 스팸 정책이 AI 답변 조작을 공식 위반 항목으로 다루게 된 것 자체는 이전에 문서화됐지만, 이번 6월 업데이트에서 실제 집행 대상에 포함된 점이 핵심이다. 한편 Cornell Tech 연구("Deep-Research Agents Can Be Poisoned via User-Generated Content")는 AI 리서치 에이전트가 하위 쿼리를 일괄 실행해 반복 등장하는 페이지를 수집하는 구조적 취약점을 파고든다. 특정 토픽 클러스터 내에서 하나의 사용자 생성 페이지가 쿼리의 최대 48%에 등장했고, 약 13단어의 삽입 텍스트만으로 세션의 38~51%에서 공격자가 원하는 엔티티가 최종 보고서에 포함됐다. 여러 페이지에 분산 삽입하면 이 수치는 42~62%까지 올라갔다. 연구팀은 사용자 생성 소스 제거, LLM 사전 필터링, 사후 검증 세 가지 방어를 시도했으나 모두 결과 품질 저하 없이 공격을 차단하지 못했다.

## 설정 파일에 어떤 의미인가

이 기사는 SEO·콘텐츠 정책 영역의 이야기이므로, 빌드 설정이나 개발 도구 구성에 직접 영향을 주는 내용은 없다. 다만 개발자 도구 관점에서 몇 가지 짚을 점이 있다.

- **AI 에이전트 기반 검색 도구를 자체 파이프라인에 통합하고 있는 팀이라면**, 연구에서 테스트된 STORM, Co-STORM, OmniThink 같은 오픈소스 에이전트의 검색 소스 구성(어떤 도메인을 허용·차단하는지)을 점검할 필요가 있다. 사용자 생성 콘텐츠 비중이 17~23%에 달한다는 수치는 소스 필터링 설정의 기본값을 재고하게 만든다.
- **크롤러·봇 관리 설정(robots.txt, 메타 태그 등)** 측면에서 새로운 변경 사항이 요구되는 것은 아니다. Google이 이 정책을 SpamBrain 시스템으로 집행할지, 별도 업데이트로 집행할지도 아직 밝히지 않았다.
- AI 답변에 자사 사이트가 인용됐는지 확인할 대시보드가 현재 존재하지 않는다는 점은 모니터링 도구 설정의 공백이다. 원문에서도 "no dashboard tells a site whether it landed in an AI answer"라고 명확히 지적한다.

원문에서 기존 웹마스터 도구 설정과의 구체적 상호작용은 다루지 않았다. Google의 집행 방식이 구체화되면 후속 정리가 필요하다.

## 다음 단계 제안

당장 할 수 있는 것은 제한적이다. AI 검색 도구의 소스로 자사 사이트가 어떻게 노출되는지 수동으로라도 확인해 보고, 사용자 생성 콘텐츠 영역(포럼, 댓글, 커뮤니티 페이지)에 의도치 않은 제3자 삽입이 없는지 점검하는 것이 현실적인 첫 단계다. 오픈소스 AI 리서치 에이전트를 운영 중이라면 검색 소스 허용 목록을 좁히는 것도 고려해 볼 만하다. 원문의 연구 결과와 Google 정책 전문을 직접 확인하길 권한다.

---

**원문 전체 보기**: [Google's Spam Update Now Reaches AI Answers. Enforcement Is Hard](https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/) ([Search Engine Journal](https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/))