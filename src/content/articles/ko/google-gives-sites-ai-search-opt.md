---
id: "https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/"
tool: "searchenginejournal"
title: "Google, AI 검색 옵트아웃은 제공하면서 판단 근거 데이터는 빠뜨리다"
link: "https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/"
pubDate: 2026-06-06T13:31:25.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/"
contentType: "commentary"
summary: "Google이 AI Overviews·AI Mode 옵트아웃 토글과 AI 성과 리포트를 Search Console에 추가했지만, 클릭·CTR 데이터가 빠져 퍼블리셔가 옵트아웃 여부를 판단하기 어렵다는 분석이다."
---

Search Engine Journal이 이번 주 동시에 발표된 세 가지 변화 — 영국 CMA의 행위 요건 부과, Google Search Console의 AI 검색 옵트아웃 토글, AI 성과 리포트 — 를 종합 분석했다. 핵심 논점은 "옵트아웃 버튼은 생겼지만, 그걸 누를지 판단할 데이터가 없다"는 것이다.

## 무엇이 새로운가

CMA의 행위 요건은 법적 의무로, Google이 퍼블리셔에게 AI 검색 기능 및 AI 모델 학습에서 콘텐츠를 제외할 수 있게 허용하고, 옵트아웃한 사이트에 불이익을 주지 못하도록 한다. Google은 같은 날 Search Console에 도메인 단위 토글을 테스트하기 시작했으며, AI Overviews·AI Mode·Discover 내 AI Overviews를 대상으로 한다. 페이지 단위 제어는 아직 없고, CMA가 2027년 3월까지 구현 기한을 부여했다. AI 성과 리포트는 노출(impressions) 데이터만 제공하며, CMA가 요구하는 클릭 수와 CTR은 포함되지 않았다. 기존 `Google-Extended` 태그는 모델 학습·그라운딩 옵트아웃용이었고 AI Overviews를 막지 못했으며, `nosnippet` 태그는 일반 스니펫과 AI 스니펫을 동시에 차단해 선택적 제어가 불가능했다.

## 설정 파일에 어떤 의미인가

이번 변화는 `robots.txt`나 메타 태그 같은 크롤러 제어 설정과 직접 맞닿아 있다. 기존에 `Google-Extended`를 `robots.txt`에 추가해 AI 학습을 차단하던 사이트도, AI Overviews 노출은 별도로 막을 수 없었다. 이제 Search Console 토글이 그 간극을 채우지만, 이것은 설정 파일이 아니라 UI 토글이다. 즉 `robots.txt`나 메타 태그 수준의 선언적 제어 수단이 아직 공개되지 않았다. 페이지 단위 제어가 향후 어떤 형태(메타 태그, HTTP 헤더, `robots.txt` 디렉티브 등)로 제공될지도 원문에서 언급하지 않는다. `Google-Extended`와 `nosnippet` 태그를 이미 설정한 사이트라면, 새 토글과의 상호작용 — 예컨대 토글 OFF인데 `Google-Extended`는 ON인 경우 어떤 쪽이 우선하는지 — 에 대한 공식 문서가 나올 때까지 기존 설정을 섣불리 변경하지 않는 편이 안전하다.

## 다음 단계 제안

영국 사이트를 운영하거나 글로벌 롤아웃에 대비하려면, 먼저 Search Console에서 AI 성과 리포트가 노출되는지 확인하고 현재 노출 수 기준선을 기록해 두는 것이 좋다. 옵트아웃 결정은 클릭 데이터가 추가된 후로 미루는 편이 합리적이다. 기존 `robots.txt`의 `Google-Extended` 설정과 메타 태그 `nosnippet` 적용 현황을 문서화해 두면, 향후 페이지 단위 제어가 나왔을 때 마이그레이션 범위를 빠르게 파악할 수 있다.

---

**원문 전체 보기**: [Google Gives Sites AI Search Opt-Out, But Not The Data To Use It](https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/) ([Search Engine Journal](https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/))