---
id: "https://smashingmagazine.com/2026/06/benefits-cognitive-inclusion-ux-research/"
tool: "smashingmagazine"
title: "UX 리서치에서 인지적 포용이 가져오는 이점"
link: "https://smashingmagazine.com/2026/06/benefits-cognitive-inclusion-ux-research/"
pubDate: 2026-06-10T10:00:00.000Z
sourceName: "Smashing Magazine"
sourceUrl: "https://smashingmagazine.com/2026/06/benefits-cognitive-inclusion-ux-research/"
contentType: "commentary"
summary: "인지 장애를 가진 참가자가 일반 참가자 대비 1.8배 더 많은 유저빌리티 이슈와 개선 제안을 도출했다는 Fable 연구 결과를 Smashing Magazine이 소개했다."
---

Smashing Magazine에 Fable VP of Innovation이 UC Irvine과 공동 진행한 탐색적 사용자 연구 결과가 게재되었다. 인지 장애(기억력, 집중력, 학습 관련 어려움)를 가진 참가자를 UX 리서치에 포함시킬 때 얻는 실질적 이점을 데이터로 보여주는 글이다.

## 무엇이 새로운가

연구팀은 AI 프로토타이핑 도구로 생성한 세 개의 웹사이트(레시피 사이트, 서점 사이트, 헤어살롱 사이트)에 대해 각 사이트당 인지 장애 참가자 5명, 일반(gen pop) 참가자 5명씩 총 30회의 사용자 인터뷰를 진행했다. 결과적으로 인지 장애 참가자는 197개 이슈를 발견하고 93개 개선 제안을 했으며, 일반 참가자는 113개 이슈와 54개 제안에 그쳤다. 즉, 인지 장애 참가자가 이슈와 제안 모두에서 1.8배 더 많은 인사이트를 제공했다. 특히 콘텐츠, 버튼, 아이콘, 시각 요소, 미디어 관련 이슈에서 차이가 두드러졌다. 각 사이트별로 Accessible Usability Scale(AUS) 점수도 인지 장애 참가자 쪽이 일관되게 낮았으며, 가장 복잡한 서점 사이트에서는 평균 AUS 점수 차이가 17.2점에 달했다.

## 설정 파일에 어떤 의미인가

이 글은 UX 리서치 방법론에 관한 것이라 특정 도구의 설정 파일이나 config 변경과 직접적인 연관은 없다. 다만 개발자 도구를 만드는 입장에서 주목할 점이 있다. CLI 도구나 대시보드 UI를 설계할 때 접근성 린트 규칙(예: eslint-plugin-jsx-a11y)이나 자동화된 접근성 검사 도구만으로는 인지 접근성 문제를 잡아내기 어렵다. 원문의 연구가 보여주듯 자동화 도구가 커버하지 못하는 영역 — 정보 구조의 복잡도, 피드백 부재, 시각적 요소의 과도한 스크롤 유발 등 — 은 실제 인지 장애 사용자의 테스트를 통해서만 드러난다. 설정 파일 차원에서 바뀌는 것은 없지만, 도구 제작자라면 접근성 테스트 파이프라인에 인지 장애 참가자를 포함하는 프로세스를 검토할 가치가 있다.

## 다음 단계 제안

원문에는 인지 장애 참가자를 모집하기 위한 스크리너 설계, 인터뷰 진행 가이드, AUS 설문 활용법까지 상세히 문서화되어 있다. 자체 제품의 유저빌리티 테스트를 계획 중이라면 원문의 모집·스크리닝 방법과 파일럿 스터디 구조를 참고해 기존 리서치 프로세스에 인지 접근성 참가자 그룹을 추가하는 것을 고려해 볼 만하다. 특히 미국 기준 인지 장애 인구 비율이 CDC 자료 기준 13.9%라는 점을 감안하면, 이 그룹을 배제한 리서치는 상당한 사용성 이슈를 놓칠 수 있다.

---

**원문 전체 보기**: [The Benefits Of Cognitive Inclusion In UX Research](https://smashingmagazine.com/2026/06/benefits-cognitive-inclusion-ux-research/) ([Smashing Magazine](https://smashingmagazine.com/2026/06/benefits-cognitive-inclusion-ux-research/))