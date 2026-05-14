---
id: "https://www.searchenginejournal.com/liquid-web-wordpress-plugin-rebrand-triggers-backlash/574828/"
tool: "searchenginejournal"
title: "Liquid Web 워드프레스 플러그인 리브랜딩, 사용자 반발 촉발"
link: "https://www.searchenginejournal.com/liquid-web-wordpress-plugin-rebrand-triggers-backlash/574828/"
pubDate: 2026-05-13T23:28:37.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/liquid-web-wordpress-plugin-rebrand-triggers-backlash/574828/"
contentType: "commentary"
summary: "Liquid Web가 StellarWP 산하 워드프레스 플러그인들을 Kadence, LearnDash, The Events Calendar, Give 네 개 핵심 제품으로 통합하면서 브랜드 혼선과 라이선스 접근 문제로 사용자 반발이 일어났다. 기존 고객은 현 플랜과 라이선스를 유지할 수 있다고 공식 확인됐다."
---

Search Engine Journal이 Liquid Web의 워드프레스 플러그인 포트폴리오 재편과 그에 따른 사용자 반발을 보도했다. StellarWP 브랜드가 사실상 사라지면서 Kadence, SolidWP, Iconic, Restrict Content Pro 등 개별 플러그인 브랜드에 의존하던 사용자들 사이에 혼란이 확산됐다.

## 무엇이 새로운가

Liquid Web는 기존 StellarWP 산하의 다양한 플러그인을 Kadence, LearnDash, The Events Calendar, Give 네 가지 핵심 제품으로 재편했다. SolidWP, Iconic, Restrict Content Pro, MemberDash는 더 이상 독립 제품으로 판매되지 않으며, 해당 기능은 Kadence 또는 LearnDash에 통합된다. Kadence 가격 체계는 Essentials $99, Pro $219, Elite $399 세 단계로 변경됐고, 기존 Lifetime Bundle은 폐지됐다. 동시에 Nexcess가 2026년 4월 "Specialty Cloud" 브랜드로 재출범하면서, 동일 제품이 Nexcess와 "Liquid Web by Nexcess" 양쪽에서 소개되는 이중 브랜딩이 혼란을 가중시켰다. Nexcess 측 전략 제품 리더 Jack Kitterhing은 기존 고객 전원이 그랜드파더링되며, Lifetime 고객도 기존 보유 기능을 그대로 유지한다고 확인했다.

## 설정 파일에 어떤 의미인가

이번 변경은 워드프레스 사이트에서 Kadence, SolidWP, Iconic 등 StellarWP 계열 플러그인을 사용 중인 개발자에게 직접적인 영향을 줄 수 있다. 플러그인 슬러그나 업데이트 엔드포인트, 라이선스 키 인증 서버가 변경될 가능성이 있기 때문이다. CI/CD 파이프라인에서 `wp plugin update`를 자동화하거나, `composer.json`으로 유료 플러그인 저장소를 관리하는 경우, 저장소 URL이나 인증 토큰이 깨질 수 있다. 원문에서도 로그인 장애, 인보이스 누락, 제품 페이지 리다이렉트 오류가 보고되었으므로, 자동 배포 환경에서는 라이선스 검증 실패로 빌드가 깨지지 않는지 점검이 필요하다. 다만 구체적인 플러그인 슬러그 변경이나 API 엔드포인트 마이그레이션 경로는 원문에서 다루지 않았다 — Liquid Web 또는 Nexcess 공식 문서가 업데이트되면 다시 정리하겠다.

## 다음 단계 제안

StellarWP 계열 플러그인을 운영 중이라면, 지금 당장 라이선스 키가 정상 인증되는지, 플러그인 업데이트 채널이 살아 있는지 수동으로 확인해 보는 것이 좋다. 특히 Lifetime 라이선스 보유자라면 Liquid Web 계정에 로그인해 기존 구매 내역과 다운로드 접근 권한이 유지되는지 점검하라. 자동화된 워드프레스 배포 환경에서는 플러그인 업데이트 실패를 감지하는 모니터링을 일시적으로 강화해 두는 편이 안전하다. 상세한 마이그레이션 정보는 원문과 Liquid Web 공식 채널을 참고하자.

---

**원문 전체 보기**: [Liquid Web WordPress Plugin Rebrand Triggers Backlash](https://www.searchenginejournal.com/liquid-web-wordpress-plugin-rebrand-triggers-backlash/574828/) ([Search Engine Journal](https://www.searchenginejournal.com/liquid-web-wordpress-plugin-rebrand-triggers-backlash/574828/))