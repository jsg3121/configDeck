---
id: "https://hugging face.co/blog/JetBrains/mellum2-launch"
tool: "huggingface"
title: "JetBrains가 만든 12B MoE 모델 Mellum2 공개"
link: "https://huggingface.co/blog/JetBrains/mellum2-launch"
pubDate: 2026-06-01T15:45:17.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/JetBrains/mellum2-launch"
contentType: "commentary"
summary: "JetBrains가 텍스트·코드 겸용 12B Mixture-of-Experts 모델 Mellum2를 Apache 2.0 라이선스로 공개했다. 토큰당 활성 파라미터가 2.5B로 제한되어 저지연·고처리량 추론에 초점을 맞춘 모델이다."
---

JetBrains가 Hugging Face Blog를 통해 Mellum2를 공개했다. 총 파라미터 12B의 Mixture-of-Experts(MoE) 아키텍처이며, 토큰당 실제 활성되는 파라미터는 2.5B에 불과해 추론 효율에 무게를 둔 모델이다.

## 무엇이 새로운가

원래 Mellum은 코드 완성 전용 모델이었는데, Mellum2에서는 자연어와 소프트웨어 엔지니어링 태스크 전반으로 범위를 확장했다. 멀티모달은 의도적으로 배제하고 텍스트·코드에 집중해 모델 크기를 작게 유지했다. 원문에 따르면 비슷한 규모의 오픈 모델 대비 2배 이상 빠른 추론 속도를 보인다고 한다. 구체적인 벤치마크 수치와 평가 방법론은 함께 공개된 arXiv 기술 보고서에 상세히 기술되어 있으므로, 정확한 숫자가 궁금하면 원문 링크를 따라가길 권한다. 라이선스는 Apache 2.0이다.

JetBrains가 강조하는 포지셔닝이 흥미롭다. 이들은 Mellum2를 "focal model"이라고 부르는데, 대형 모델을 대체하는 것이 아니라 멀티-모델 시스템 안에서 라우팅, RAG 파이프라인 후처리, 에이전트 서브태스크 같은 고빈도·저지연 작업을 담당하는 역할로 설계했다는 의미다. 프론티어 모델 하나로 모든 호출을 처리하는 대신 비용·지연을 줄이자는 아키텍처 관점이 명확하다.

## 설정 파일에 어떤 의미인가

Mellum2는 Hugging Face Hub에 모델 가중치로 올라와 있어, 기존 Hugging Face `transformers` 또는 호환 추론 프레임워크를 통해 로드할 수 있을 것으로 보인다. 다만 원문에는 구체적인 설정 파일 형식, 추론 서버 설정 옵션, 혹은 기존 파이프라인과의 호환성에 대한 상세 내용이 포함되어 있지 않다. MoE 모델 특성상 서빙 시 전문가 라우팅 관련 설정이 일반 dense 모델과 다를 수 있는데, 이 부분 역시 기술 보고서나 모델 카드에서 확인해야 한다. 현재 원문만으로는 기존 설정과의 상호작용이나 마이그레이션 경로를 정리하기 어렵다 — 모델 카드와 기술 보고서가 나와 있으므로 그쪽을 먼저 확인하는 것이 정확하다.

## 다음 단계 제안

에이전트 시스템이나 RAG 파이프라인에서 모든 호출을 대형 모델로 처리하는 비용이 부담되었다면, Mellum2를 라우팅·요약·중간 검증 단계에 시험적으로 배치해 볼 만하다. Hugging Face 컬렉션 페이지에서 모델을 내려받고, arXiv 기술 보고서에서 벤치마크와 아키텍처 세부사항을 확인한 뒤, 자체 워크로드에서 지연·품질 트레이드오프를 측정해 보는 것이 가장 현실적인 첫 단계다.

---

**원문 전체 보기**: [Introducing Mellum2: A 12B Mixture-of-Experts Model by JetBrains](https://huggingface.co/blog/JetBrains/mellum2-launch) ([Hugging Face Blog](https://huggingface.co/blog/JetBrains/mellum2-launch))