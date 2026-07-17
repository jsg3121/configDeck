---
id: "https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb"
tool: "huggingface"
title: "NVIDIA Nemotron 3 Embed, RTEB 리더보드 1위 — 에이전틱 검색을 위한 임베딩 모델 컬렉션 공개"
link: "https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb"
pubDate: 2026-07-16T16:01:21.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb"
contentType: "commentary"
summary: "NVIDIA가 RTEB 리더보드 1위를 차지한 8B 모델과 프로덕션용 1B 변형 두 종을 포함한 Nemotron 3 Embed 임베딩 모델 컬렉션을 오픈 웨이트로 공개했다. RAG, 에이전틱 검색, 코드 검색 등 실서비스 배포를 염두에 둔 구성이다."
---

NVIDIA가 Hugging Face Blog를 통해 Nemotron 3 Embed 임베딩 모델 컬렉션을 공개했다. 8B 플래그십 모델이 RTEB 리더보드 종합 1위를 기록했으며, 프로덕션 배포를 위한 1B BF16·1B NVFP4 변형을 함께 제공한다.

## 무엇이 새로운가

컬렉션은 세 모델로 구성된다. Nemotron-3-Embed-8B-BF16은 RTEB 78.5%, MMTEB Retrieval 75.5%를 기록한 품질 앵커이고, Nemotron-3-Embed-1B-BF16은 RTEB 72.4%로 이전 1B 모델 대비 에러율을 27% 줄인 효율형, Nemotron-3-Embed-1B-NVFP4는 Blackwell 아키텍처에서 BF16 대비 최대 2배 처리량을 내면서 검색 정확도 99% 이상을 유지하는 양자화 변형이다. 32k 컨텍스트 윈도우, 다국어·코드 검색, 오픈 웨이트·데이터셋·레시피를 함께 제공한다. 에이전틱 평가에서는 검색 정확도가 높을수록 에이전트의 반복 검색이 줄어 다운스트림 토큰 비용이 낮아지는 경향을 보여준다.

주목할 만한 기술적 디테일이 하나 있다. 8B 모델은 Ministral-3-8B-Instruct-2512 백본의 인과적(causal) 디코더를 양방향 인코더로 변환해 만들었다. 1B 모델은 3B 모델에서 NVIDIA ModelOpt의 NAS 파이프라인을 이용해 구조적 프루닝과 디스틸레이션을 두 차례 거쳐 압축한 결과다. 단순히 작은 모델을 처음부터 학습한 것이 아니라는 점이 설계 의도와 직결된다.

## 설정 파일에 어떤 의미인가

Hugging Face에서 바로 사용 가능하고, vLLM과 NVIDIA NIM 마이크로서비스 배포도 지원한다고 명시돼 있다. 기존에 Hugging Face Transformers 기반으로 임베딩 모델을 로드하는 파이프라인이 있다면 모델 이름만 교체하는 수준으로 전환할 수 있을 가능성이 높지만, 구체적인 로딩 코드나 설정 변경 사항(토크나이저 설정, 양방향 인코더 전환에 따른 추론 파라미터 등)은 원문에서 자세히 다루지 않았다. NIM 배포 시 NVFP4 변형의 Blackwell 전용 의존성이 인프라 설정에 어떤 제약을 추가하는지도 별도 문서를 확인할 필요가 있다. 공식 모델 카드와 NeMo AutoModel 레시피가 공개되면 설정 관점에서 다시 정리하겠다.

## 다음 단계 제안

RAG 파이프라인에서 임베딩 모델을 교체해 검색 품질을 비교해 볼 계획이라면, 먼저 원문의 RTEB·MMTEB·ViDoRe V3 벤치마크 수치를 자신의 도메인과 대조해 보는 것이 현실적인 출발점이다. 특히 에이전틱 워크플로를 운영 중이라면 Figure 3의 검색 정확도 대 토큰 비용 트레이드오프 그래프가 모델 선택 근거로 유용하다. Blackwell GPU를 활용 가능한 환경이라면 NVFP4 변형의 처리량 이점도 확인해 볼 만하다.

---

**원문 전체 보기**: [NVIDIA Nemotron 3 Embed Ranks #1 Overall on RTEB, Advancing Agentic Retrieval](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb) ([Hugging Face Blog](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb))