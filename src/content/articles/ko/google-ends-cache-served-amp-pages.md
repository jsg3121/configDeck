---
id: "https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/"
tool: "searchenginejournal"
title: "Google, 검색에서 캐시 기반 AMP 페이지 제공 종료"
link: "https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/"
pubDate: 2026-07-02T20:06:10.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/"
contentType: "commentary"
summary: "Google이 7월 1일부터 AMP 뷰어, AMP Cache, Signed Exchanges를 통한 AMP 제공을 중단하고, 검색 결과 클릭 시 도메인의 AMP 호스트 페이지로 직접 연결한다. AMP 콘텐츠의 랭킹 방식에는 변화가 없다."
---

Search Engine Journal 보도에 따르면, Google 검색이 AMP 페이지를 처리하는 방식을 변경했다. 7월 1일부터 AMP 검색 결과를 클릭하면 Google의 AMP Cache가 아닌 해당 도메인의 AMP 호스트 페이지로 직접 이동한다.

## 무엇이 새로운가

기존에는 AMP 결과를 클릭하면 Google이 자체 AMP Cache에서 페이지를 제공했고, AMP 뷰어 안에서 google.com URL로 표시됐다. Signed Exchanges를 설정하면 원래 도메인 URL을 보여줄 수 있었지만, 이제 그 경로 자체가 사라졌다. Google은 AMP 문서에서 AMP 뷰어, AMP Cache, Signed Exchanges 관련 언급을 모두 제거했다. 이 변경은 콘텐츠 전달 방식에만 영향을 미치며, AMP 콘텐츠는 "다른 일반 웹페이지와 동일하게" 랭킹된다고 Google이 명시했다. 2021년 Top Stories 캐러셀에서 AMP 필수 요건을 해제하고 번개 아이콘을 제거한 이후 이어져 온 AMP 탈중앙화 흐름의 마지막 단계로 볼 수 있다.

## 설정 파일에 어떤 의미인가

Signed Exchanges를 위해 웹 서버나 CDN에 별도 설정을 유지하고 있었다면, 그 설정은 이제 Google 검색 맥락에서 불필요해졌다. AMP Cache 프리페칭을 전제로 성능 최적화를 구성했던 경우, 이제 트래픽이 자체 서버로 직접 유입되므로 캐싱 전략과 서버 부하를 재점검할 필요가 있다. Next.js의 AMP 지원(`amp` 옵션)이나 AMP 플러그인을 사용 중인 프로젝트라면, AMP 페이지 자체는 여전히 유효하므로 빌드 설정을 급히 변경할 이유는 없다. 다만 `amphtml` 링크 태그와 관련된 Signed Exchanges 설정, CDN 레벨의 AMP Cache 관련 헤더 설정 등은 정리 대상이 된다. 원문에서는 기존 AMP 설정의 구체적인 마이그레이션 경로까지는 다루지 않았으므로, Google의 업데이트된 AMP 공식 문서를 직접 확인하는 것이 정확하다.

## 다음 단계 제안

우선 자사 사이트에 Signed Exchanges나 AMP Cache 관련 설정이 남아 있는지 점검하고, 불필요한 설정을 제거해 유지보수 부담을 줄이자. AMP 페이지를 계속 운영할지 여부는 이제 순수하게 기술적 판단의 영역이다 — Google 측의 특별 대우가 사라진 만큼, AMP가 자사 성능 목표에 실질적으로 기여하는지를 기준으로 결정하면 된다. Google의 업데이트된 AMP 문서를 확인해 변경된 사항의 전체 범위를 파악해 두는 것을 권한다.

---

**원문 전체 보기**: [Google Ends Cache-Served AMP Pages In Search](https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/) ([Search Engine Journal](https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/))