---
id: "https://huggingface.co/blog/nvidia/cosmos-h-dreams"
tool: "huggingface"
title: "NVIDIA Cosmos-H-Dreams: 수술 로봇을 위한 실시간 생성형 시뮬레이션"
link: "https://huggingface.co/blog/nvidia/cosmos-h-dreams"
pubDate: 2026-07-27T09:32:20.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/cosmos-h-dreams"
contentType: "commentary"
summary: "NVIDIA가 수술 로봇 시뮬레이션 모델 Cosmos-H-Surgical-Simulator를 실시간 추론이 가능하도록 증류한 Cosmos-H-Dreams를 공개했다. FlashDreams 추론 엔진과 결합해 단일 GPU에서 약 160fps로 인터랙티브 시뮬레이션을 구동한다."
---

Hugging Face Blog에 NVIDIA가 Cosmos-H-Dreams를 소개하는 글이 게시됐다. 기존 Cosmos-H-Surgical-Simulator의 수술 영상 생성 능력을 실시간 인터랙티브 시뮬레이터로 전환한 프로젝트다.

## 무엇이 새로운가

핵심은 교사-학생 증류 파이프라인이다. 양방향(bidirectional) 교사 모델의 디노이징 궤적을 캐싱한 뒤, 인과적(causal) 학생 모델이 이를 모방하도록 학습하고, 이어서 self-forcing distillation으로 자기 생성 컨텍스트에서도 안정적으로 롤아웃하게 만든다. 학생 모델은 라텐트 프레임당 최소 2단계 디노이징만으로 동작한다. 추론 쪽에서는 FlashDreams라는 스트리밍 추론 라이브러리가 KV 캐시 스트리밍, CUDA Graph 캡처, 모델 컴파일 등을 결합해 단일 NVIDIA RTX PRO 6000에서 약 160fps를 달성한다고 밝혔다. 브라우저 WebRTC 클라이언트와 Meta Quest WebXR 클라이언트를 통한 상호작용 인터페이스도 제공되며, CMR Surgical·Cambridge Consultants와 협업해 Versius 수술 컨트롤러 연동도 시연했다.

## 설정 파일에 어떤 의미인가

Cosmos-H-Dreams는 Hugging Face에 체크포인트가 공개되어 있고, 교사 파인튜닝부터 self-forcing distillation까지의 레시피를 단계별 가이드로 제공한다고 명시돼 있다. 다만 원문에서 구체적인 설정 파일 포맷, YAML/TOML 구조, 하이퍼파라미터 키 이름 같은 세부 사항은 다루지 않는다. 모델 아키텍처가 Cosmos-Predict2.5-2B 기반이고 44차원 통합 액션 표현을 사용한다는 점, dVRK의 이중 팔 액션(상대 엔드이펙터 이동·회전·그리퍼 상태)을 이 표현으로 매핑한다는 점 정도가 설정 관점에서 확인 가능한 정보다. 자체 데이터에 맞춰 학생 모델을 훈련하려면 별도 가이드 문서를 참조해야 하므로, 구체적 설정 옵션은 해당 가이드가 공개된 뒤 다시 정리하겠다.

## 다음 단계 제안

수술 로봇 시뮬레이션에 관심이 있다면, 먼저 원문 하단의 단계별 가이드 링크를 확인해 교사 파인튜닝과 증류 파이프라인의 전체 흐름을 파악하는 것이 좋다. dVRK 외 자체 로봇 플랫폼을 사용하는 경우 44차원 액션 표현으로의 매핑 방식을 먼저 이해해야 한다. FlashDreams의 GPU 요구사항(원문에서는 RTX PRO 6000 단일 카드 기준)도 인프라 계획 시 확인해 둘 필요가 있다.

---

**원문 전체 보기**: [NVIDIA Cosmos-H-Dreams: Bringing Real-Time Generative Simulation to Surgical Robotics](https://huggingface.co/blog/nvidia/cosmos-h-dreams) ([Hugging Face Blog](https://huggingface.co/blog/nvidia/cosmos-h-dreams))