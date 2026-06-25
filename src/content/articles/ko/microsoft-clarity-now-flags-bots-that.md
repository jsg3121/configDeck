---
id: "https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/"
tool: "searchenginejournal"
title: "Microsoft Clarity, robots.txt 무시하는 봇을 자동 감지·표시하는 기능 추가"
link: "https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/"
pubDate: 2026-06-24T20:13:45.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/"
contentType: "commentary"
summary: "Microsoft Clarity의 Bot Analytics 대시보드가 robots.txt에서 disallow한 경로로 들어오는 봇 요청을 자동 감지해 비율로 표시하는 기능을 추가했다. 무료 도구로 AI 크롤러 준수 여부를 모니터링할 수 있게 된 셈이다."
---

Microsoft Clarity가 Bot Analytics 대시보드에 robots.txt 위반 봇 요청 감지 기능을 추가했다고 Search Engine Journal이 보도했다. 사이트의 robots.txt에서 disallow 처리한 경로에 봇이 요청을 보내면, 해당 요청을 전체 봇 활동 대비 비율로 계산해 표시한다.

## 무엇이 새로운가

Clarity는 봇 요청이 들어올 때마다 해당 URL을 사이트의 robots.txt 디렉티브와 대조해 disallow 여부를 판정한다. 봇 오퍼레이터, 봇 이름, 요청 유형, 요청 경로 등으로 필터링할 수 있고, 규칙을 준수하는 크롤러와 위반하는 크롤러를 나란히 비교하는 뷰도 제공한다. 이 기능은 프로젝트 관리자가 AI Visibility 설정에서 직접 활성화해야 하며, 지원 CDN(Fastly, Amazon CloudFront, Cloudflare, Azure Front Door, Akamai) 또는 최신 Clarity WordPress 플러그인을 사용하는 사이트에서만 동작한다. 기존에 5월부터 제공하던 AI 인용 그라운딩 쿼리 표시 기능에 이어 확장된 형태다. 다만 Clarity가 보여주는 것은 "요청이 발생했다"는 사실이지, 해당 요청이 실제로 차단되었는지 여부가 아니다 — robots.txt 자체가 권고 사항이지 강제 차단 수단이 아니기 때문이다.

## 설정 파일에 어떤 의미인가

이 기능은 robots.txt 자체를 변경하라는 것이 아니라, 기존에 작성해 둔 robots.txt 규칙이 실제로 얼마나 존중되는지를 측정해 주는 도구다. 따라서 robots.txt 설정 자체에 대한 마이그레이션이나 문법 변경은 없다. 다만 개발자 입장에서 주목할 점은 두 가지다. 첫째, 이 기능이 CDN 레이어에서 요청 로그를 수집하므로, 지원 CDN을 사용하지 않는 환경에서는 데이터가 수집되지 않는다. 둘째, robots.txt에 disallow 규칙이 제대로 작성되어 있어야 위반 감지가 의미를 갖는다 — 규칙이 빠져 있거나 와일드카드가 느슨하면 위반으로 잡히지 않는다. 서버 로그를 직접 파싱해 봇 행동을 분석하던 기존 방식 대비, 자동화된 대시보드를 무료로 쓸 수 있다는 것이 실질적 이점이다.

## 다음 단계 제안

지금 할 일은 간단하다. 사이트의 robots.txt를 한 번 점검해서, 실제로 차단하고 싶은 경로가 빠짐없이 disallow 되어 있는지 확인하자. 그런 다음 Clarity 프로젝트 설정의 AI Visibility 섹션에서 해당 기능을 활성화하면 된다. 특히 AI 크롤러의 과도한 요청이 서버 리소스에 영향을 준다고 의심되는 사이트라면, 서버 로그 분석 없이도 어떤 봇이 규칙을 무시하는지 파악하는 출발점으로 쓸 수 있다. 원문에서 필터 옵션과 비교 뷰에 대한 상세 설명을 확인할 수 있다.

---

**원문 전체 보기**: [Microsoft Clarity Now Flags Bots That Ignore Robots.txt](https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/) ([Search Engine Journal](https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/))