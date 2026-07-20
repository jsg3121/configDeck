---
id: "https://www.searchenginejournal.com/are-you-a-bot-screens-can-get-your-pages-dropped-by-google/582801/"
tool: "searchenginejournal"
title: "봇 확인 화면이 Google 색인에서 페이지를 탈락시킬 수 있다"
link: "https://www.searchenginejournal.com/are-you-a-bot-screens-can-get-your-pages-dropped-by-google/582801/"
pubDate: 2026-07-19T05:00:38.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/are-you-a-bot-screens-can-get-your-pages-dropped-by-google/582801/"
contentType: "commentary"
summary: "CDN이나 봇 방어 레이어가 Googlebot에게 'are you a bot' 인터스티셜을 반환하면, Google이 해당 페이지를 다른 사이트의 중복으로 처리해 색인에서 제외할 수 있다."
---

Search Engine Journal이 Google의 John Mueller가 Search Off the Record 팟캐스트에서 설명한 "are you a bot" 화면의 색인 문제를 정리했다. 핵심은 봇 차단 인터스티셜이 Googlebot에게 정상 콘텐츠 대신 반환되면서 색인 탈락이나 canonical 오판을 유발한다는 것이다.

## 무엇이 새로운가

사이트 보안 레이어가 Googlebot을 의심스러운 방문자로 분류하면 실제 콘텐츠 대신 봇 확인 페이지를 200 응답으로 내보낸다. 이 동일한 인터스티셜이 여러 사이트에서 나타나기 때문에 Google은 이를 중복 콘텐츠로 인식하고, 다른 사이트의 페이지를 canonical로 선택할 수 있다. 사이트 운영자가 브라우저로 직접 확인해도 정상 로딩되므로 문제를 눈치채기 어렵다. Mueller는 Search Console의 페이지 색인 보고서와 URL Inspection 도구에서 canonical이 자기 사이트가 아닌 외부 주소로 잡혀 있는지 확인하라고 안내했다. 이 문제는 CDN, 호스팅, 또는 별도 봇 방어 서비스 단에서 발생하므로 페이지 자체 코드만 봐서는 원인을 찾을 수 없다.

## 설정 파일에 어떤 의미인가

이 이슈는 소스 코드나 빌드 설정 차원이 아니라 인프라 레이어의 문제다. Cloudflare Bot Management, AWS WAF, Akamai Bot Manager 같은 CDN·WAF 설정에서 Googlebot UA나 IP 대역을 허용 목록에 추가해야 하는지 점검해야 한다. 프레임워크 설정(Next.js `next.config.js`, Nginx conf 등)에서 직접 봇 차단 로직을 넣은 경우에도 동일한 문제가 발생할 수 있다. 다만 원문은 특정 CDN 설정 방법이나 구체적 옵션까지는 다루지 않았으므로, 각 서비스의 공식 문서에서 Googlebot 허용 설정을 확인하는 것이 정확하다. CI/CD 파이프라인에서 배포 후 Lighthouse나 별도 크롤러로 페이지를 검증하더라도, Googlebot이 실제로 받는 응답과 다를 수 있다는 점을 인지해야 한다.

## 다음 단계 제안

Search Console에 접속해 페이지 색인 보고서에서 "중복" 또는 "canonical이 다른 곳으로 지정됨" 상태의 페이지가 있는지 먼저 확인하자. URL Inspection에서 canonical URL이 자기 도메인이 아닌 외부 사이트로 잡혀 있다면, CDN이나 호스팅 보안 설정 담당자에게 Googlebot 트래픽 처리 방식을 문의해야 한다. 수정 후에는 Search Console의 Validate Fix 기능으로 재크롤링을 요청할 수 있다.

---

**원문 전체 보기**: ["Are You A Bot" Screens Can Get Your Pages Dropped By Google](https://www.searchenginejournal.com/are-you-a-bot-screens-can-get-your-pages-dropped-by-google/582801/) ([Search Engine Journal](https://www.searchenginejournal.com/are-you-a-bot-screens-can-get-your-pages-dropped-by-google/582801/))