---
id: "https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/"
tool: "searchenginejournal"
title: "구글, 하이픈 포함 도메인 이름은 SEO에 문제없다고 확인"
link: "https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/"
pubDate: 2026-06-08T23:43:54.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/"
contentType: "commentary"
summary: "구글의 John Mueller가 하이픈이 포함된 도메인 이름이 SEO에 불이익을 주지 않는다고 Bluesky에서 확인했다. 도메인에 하이픈 최대 61개까지 기술적으로 가능하다는 점도 덧붙였다."
---

Search Engine Journal이 구글 John Mueller의 Bluesky 발언을 보도했다. 하이픈이 포함된 도메인 이름은 SEO 관점에서 문제가 없으며, 기술적으로 도메인 하나에 하이픈을 최대 61개까지 사용할 수 있다는 내용이다.

## 무엇이 새로운가

SEO 커뮤니티에서 하이픈 도메인은 오랫동안 스팸성 신호로 여겨져 왔다. 초기 검색엔진이 키워드 기반 알고리즘을 사용하던 시절, 하이픈으로 키워드를 나열한 도메인이 남용되었기 때문이다. Mueller는 하이픈 도메인 자체에 부정적 신호가 부여되지 않는다고 명시했다. 원문은 Mercedes-benz.com, Coca-cola.com, T-mobile.com 같은 대형 브랜드와 미국 정부의 e-verify.gov, W3C 관련 Web-Platform-Tests.org 등을 근거로 하이픈 도메인이 실제로 잘 작동하는 사례를 열거하고 있다. 다만 모바일 입력 불편, 신뢰도 인식 저하 같은 UX 측면의 단점은 여전히 존재한다고 원문도 인정한다.

## 설정 파일에 어떤 의미인가

이 주제는 웹 서버나 DNS 설정, 혹은 정적 사이트 생성기(SSG)에서 도메인을 지정하는 설정 파일과 간접적으로 관련된다. 하이픈 도메인이 SEO 페널티를 받지 않는다는 점이 확인되었으므로, 예를 들어 Next.js의 `next.config.js`에서 `assetPrefix`나 리다이렉트 설정 시, 또는 Nginx·Caddy 등 리버스 프록시의 `server_name` 설정 시 하이픈 도메인을 SEO 우려만으로 피할 이유는 없다. 그러나 이번 발언은 구글 검색의 크롤링·인덱싱 정책에 대한 것이지, 특정 설정 도구의 동작 변경이 아니다. 기존 설정 파일을 마이그레이션하거나 변경할 필요는 전혀 없다.

## 다음 단계 제안

새 프로젝트나 마이크로사이트 도메인을 고를 때 하이픈 도메인을 SEO 이유만으로 배제하지 않아도 된다. 다만 UX 관점 — 모바일 키보드에서의 입력 편의성, 구두로 전달할 때의 명확성 — 은 별개 기준이므로 여전히 고려해야 한다. 원문에서 DMOZ 시절 데이터와 대형 브랜드 사례까지 상세히 다루고 있으니, 의사결정 배경을 더 파악하려면 아래 원문을 참고하길 권한다.

---

**원문 전체 보기**: [Google Says Hyphenated Domain Names Are Okay For SEO](https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/) ([Search Engine Journal](https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/))