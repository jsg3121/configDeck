---
id: "https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/"
tool: "searchenginejournal"
title: "Google UCP 업데이트: AI 쇼핑에 장바구니, 카탈로그, 로열티 프로그램 지원 추가"
link: "https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/"
pubDate: 2026-05-10T12:00:07.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/"
contentType: "commentary"
summary: "Google이 Universal Commerce Protocol(UCP)에 장바구니, 실시간 카탈로그 조회, 로열티 계정 연동 기능을 추가하고, Merchant Center를 통한 간소화된 온보딩 경로를 발표했다."
---

Search Engine Journal이 Google의 UCP 3월 업데이트를 상세히 분석했다. 2026년 1월 NRF에서 Shopify와 함께 공개된 UCP가 단일 상품 결제만 지원하던 한계를 벗어나, 장바구니·카탈로그·로열티 연동이라는 실질적 기능 세 가지를 갖추게 됐다는 내용이다.

## 무엇이 새로운가

Cart 기능은 AI 에이전트가 한 리테일러의 여러 상품을 단일 작업으로 장바구니에 담을 수 있게 한다. 이전에는 상품 하나당 별도 결제 세션이 필요했다. Catalog 기능은 기존 Google Shopping 피드의 정적 스냅샷과 달리, 에이전트가 리테일러 재고에서 변형·가격·재고 수준을 실시간으로 조회할 수 있게 한다. Identity Linking은 OAuth 2.0 기반으로 쇼퍼의 리테일러 계정을 UCP 플랫폼에 연결해 멤버 가격·할인·무료 배송 같은 로열티 혜택을 AI 에이전트 거래에서도 유지시킨다. 원문에 따르면 Cart와 Catalog은 아직 드래프트 사양이고, Identity Linking만 안정 릴리스 상태다.

플랫폼 측면에서는 Commerce Inc, Salesforce, Stripe가 UCP를 구현할 예정이다. 특히 Salesforce는 이미 ACP(OpenAI+Stripe의 Agentic Commerce Protocol)도 지원하므로, Salesforce Commerce Cloud 리테일러는 단일 플랫폼에서 ChatGPT(ACP)와 Google AI Mode(UCP) 양쪽 에이전트를 모두 커버할 수 있게 된다.

## 설정 파일에 어떤 의미인가

UCP는 개발자 도구 설정 파일이 아니라 커머스 프로토콜이므로, `.eslintrc`나 `tsconfig.json` 같은 프로젝트 설정에 직접적인 영향은 없다. 다만 Google Merchant Center를 통해 상품 피드를 관리하는 리테일러라면 주목할 점이 있다. 원문에 따르면 `native_commerce` 상품 속성을 사용하는 제품은 Google AI Mode와 Gemini 앱에서 결제 버튼이 표시되며, 기존 Merchant Center 피드 관리자는 별도 통합 프로젝트 없이 설정 변경 수준으로 UCP를 활성화할 수 있다고 한다. Merchant Center 내 UCP 온보딩 구체적인 설정 경로나 스키마 변경 사항은 원문에서도 "over the coming months"로만 언급하고 있어, 실제 설정 인터페이스가 공개되면 다시 정리하겠다.

Shopify, Salesforce Commerce Cloud, Stripe 기반 리테일러는 플랫폼이 프로토콜 레이어를 추상화해주므로 직접 UCP 사양을 구현할 필요가 없다. 이 부분은 Shopify의 Agentic Storefronts가 이미 취하고 있는 접근과 동일하다.

## 다음 단계 제안

커머스 쪽 개발을 담당하고 있다면, 지금 당장 코드를 고칠 일보다는 상품 데이터 품질을 점검하는 게 실질적이다. 구조화된 마크업과 정확한 피드 데이터가 UCP·ACP 양쪽 에이전트의 기본 요구사항이다. 사용 중인 커머스 플랫폼(Shopify, Salesforce, Stripe 등)이 UCP 지원을 언제 롤아웃하는지 타임라인을 추적하고, Cart·Catalog 사양이 드래프트에서 안정으로 전환되는 시점을 지켜보는 것이 합리적이다. Identity Linking은 이미 안정 릴리스이므로, 로열티 프로그램을 운영하는 리테일러라면 OAuth 2.0 연동 준비를 먼저 검토해볼 만하다.

---

**원문 전체 보기**: [Google's UCP Update: Carts, Catalogs, And Loyalty In AI Shopping](https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/) ([Search Engine Journal](https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/))