---
id: "https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/"
tool: "searchenginejournal"
title: "Google Analytics에 Google Business Profile 데이터가 추가된다"
link: "https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/"
pubDate: 2026-06-05T14:57:11.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/"
contentType: "commentary"
summary: "Google이 Google Business Profile과 Google Analytics 간 네이티브 연동을 문서화했다. 전화, 길찾기, 예약 등 로컬 지표가 GA 리포트 안에 나타나지만, 다중 위치 분리 필터링은 아직 불가능하다."
---

Google이 Google Business Profile(GBP)과 Google Analytics 사이의 네이티브 연동 방법을 공식 문서로 공개했다. Search Engine Journal이 해당 내용을 정리해 보도했으며, 아직 모든 Analytics 계정에서 해당 기능이 노출되지는 않는 상태라고 한다.

## 무엇이 새로운가

연동이 완료되면 GA 리포트 내에 Google Business Profile 섹션이 생기며, 상호작용(interactions), 웹사이트 클릭, 전화, 길찾기, 메시지, 예약, 메뉴 등 7가지 지표가 표시된다. 연결은 Analytics Admin 패널의 Product links에서 설정한다. 기존에는 GBP 트래픽을 보려면 프로필 링크에 UTM 태그를 붙여야 했고, 그마저도 웹사이트 클릭 위주로만 잡혔다. 이번 네이티브 연동으로 전화·길찾기·예약처럼 프로필 자체에서 발생하는 액션도 웹 데이터와 나란히 확인할 수 있게 된다.

다만 제약이 꽤 있다. 여러 GBP를 연결하면 지표가 합산되어 개별 위치별 세분화가 불가능하다. 탐색(explorations), 비교, 필터에서도 해당 지표를 사용할 수 없고, 하위 속성(subproperties)에서는 통합 자체가 작동하지 않는다. 데이터 보존 기간도 6개월로 제한된다.

## 설정 파일에 어떤 의미인가

이번 변경은 GA 내부 Admin 패널에서의 UI 기반 연동이며, 외부 설정 파일이나 코드 수준의 구성 변경과는 직접적인 관련이 없다. 기존에 UTM 기반으로 GBP 트래픽을 추적하던 팀이라면, 네이티브 연동 활성화 후 UTM 데이터와 새 GBP 지표 사이의 중복·차이를 검토할 필요가 있을 수 있다. 하지만 원문에서도 기존 UTM 설정과의 상호작용이나 마이그레이션 경로에 대해서는 구체적으로 다루지 않았다 — Google 공식 도움말 문서가 더 업데이트되면 다시 정리하겠다.

멀티 로케이션 브랜드나 에이전시가 위치별 상세 데이터를 원한다면 여전히 Business Profile 대시보드, 데이터 내보내기, Performance API가 더 적합하다는 점도 원문이 명시하고 있다.

## 다음 단계 제안

우선 본인의 Analytics Admin → Product links에서 Google Business Profile 연동 옵션이 나타나는지 확인해 보자. 단일 매장을 운영하는 경우라면 연동만으로 로컬 액션 데이터를 GA에서 바로 볼 수 있어 실익이 크다. 다중 위치라면 합산 지표의 한계를 감안해, 기존 Performance API 파이프라인을 유지하면서 보조 지표로 활용하는 편이 현실적이다. 6개월 보존 제한이 있으므로, 장기 트렌드 분석이 필요하다면 별도 데이터 적재 방안도 함께 고려해야 한다.

---

**원문 전체 보기**: [Google Analytics Is Adding Google Business Profile Data](https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/) ([Search Engine Journal](https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/))