---
id: "https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/"
tool: "searchenginejournal"
title: "AI 옵트아웃 선택이 Google 인기 기사 노출을 잃게 할 수 있다"
link: "https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/"
pubDate: 2026-07-28T21:20:40.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/"
contentType: "commentary"
summary: "Google이 Top Stories 캐러셀을 AI Overviews 내부에 배치하기 시작하면서, AI 기능 옵트아웃을 선택한 퍼블리셔가 해당 뉴스 노출까지 함께 잃을 가능성이 제기되고 있다."
---

NewzDash의 추적 데이터를 기반으로, Google이 Top Stories 캐러셀을 AI Overviews 안에 통합 배치하는 사례가 늘고 있다는 분석이 Search Engine Journal을 통해 보도되었다. 이에 따라 Google Search Console의 AI 옵트아웃 설정이 뉴스 퍼블리셔의 Top Stories 노출에도 영향을 미칠 수 있다는 우려가 나온다.

## 무엇이 새로운가

NewzDash 데이터에 따르면, Top Stories가 표시된 뉴스 검색 중 미국 15.5%, 영국 17.46%에서 캐러셀이 AI Overview 내부에 위치했다. 엔터테인먼트 분야가 양국 모두에서 가장 높은 비율을 보였다. 중요한 점은 AI Overview 내부 캐러셀과 별도 모듈이 동시에 나타나는 경우는 없었다는 것이다. 즉 하나의 배치만 존재한다.

Google은 Search Console의 AI 옵트아웃 설정을 6월 17일부터 반영하기 시작했다고 밝혔으며, 현재 영국 일부 사이트 소유자를 대상으로 테스트 중이다. NewzDash 창립자 John Shehata는 옵트아웃 시 AI Overview 내부의 Top Stories 캐러셀에서도 빠질 가능성이 높다고 보지만, 아직 검증된 결과는 아니라고 명시했다. Google 역시 캐러셀에 대해 별도 언급을 하지 않았다.

한 가지 더 짚을 부분은 Google-Extended와의 혼동이다. Google-Extended는 Gemini 모델 학습용 크롤링을 제어하는 것이지, Google Search 노출 자체와는 무관하다. 이를 차단해도 AI Overviews나 Top Stories 배치에는 영향이 없다.

## 설정 파일에 어떤 의미인가

이 소식은 개발 도구 설정보다는 웹사이트 SEO 및 검색 노출 전략에 해당하는 영역이다. 직접적으로 코드베이스의 설정 파일(예: `robots.txt`, 메타 태그 등)을 변경해야 하는지는 원문에서 구체적으로 다루지 않는다. 다만 `robots.txt`의 `Google-Extended` 디렉티브와 Search Console의 AI 옵트아웃 설정이 서로 다른 기능을 제어한다는 점은 기술 담당자가 명확히 구분해 둘 필요가 있다. Google이 향후 옵트아웃 대상 기능을 확대할 예정이라고 밝힌 만큼, 현재 설정이 미래에 어떤 범위까지 적용될지는 불확실하다. 공식 문서에서 캐러셀 관련 동작이 명시되면 다시 정리하겠다.

## 다음 단계 제안

뉴스 사이트나 콘텐츠 퍼블리싱을 운영하는 팀이라면, 먼저 자사 Search Console에 AI 옵트아웃 설정이 활성화되어 있는지 확인하고, `robots.txt`의 `Google-Extended` 설정과 혼동하고 있지 않은지 점검할 것을 권한다. 옵트아웃 결정을 내리기 전에 원문에서 제시된 트레이드오프—AI 요약 거부 대 뉴스 노출 감소 가능성—를 팀 내에서 논의하는 것이 현실적이다. Google이 아직 캐러셀 동작에 대해 공식 입장을 내놓지 않았으므로, 성급한 설정 변경보다는 추적과 관찰이 우선이다.

---

**원문 전체 보기**: [AI Opt-Out May Cost Sites A Google Top Stories Spot](https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/) ([Search Engine Journal](https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/))