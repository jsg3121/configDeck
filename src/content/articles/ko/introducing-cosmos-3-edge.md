---
id: "https://hugging face.co/blog/nvidia/cosmos3edge"
tool: "huggingface"
title: "NVIDIA Cosmos 3 Edge 소개 — 엣지 디바이스용 40억 파라미터 월드 모델"
link: "https://huggingface.co/blog/nvidia/cosmos3edge"
pubDate: 2026-07-20T15:58:51.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/cosmos3edge"
contentType: "commentary"
summary: "NVIDIA가 Hugging Face에 Cosmos 3 Edge를 공개했다. 로봇·비전 AI 에이전트용 40억 파라미터 오픈 월드 모델로, 엣지 디바이스에서 실시간 추론과 로봇 액션 생성을 목표로 한다."
---

NVIDIA가 Hugging Face의 Cosmos 3 리포지토리를 통해 Cosmos 3 Edge를 공개했다. 40억 파라미터 규모의 오픈 월드 모델로, 로봇과 비전 AI 에이전트가 엣지 디바이스에서 실시간으로 주변을 이해하고 행동을 생성할 수 있도록 설계됐다.

## 무엇이 새로운가

Cosmos 3 Edge는 오토리그레시브 타워(비전·텍스트 토큰 처리)와 디퓨전 타워(비전·오디오·액션 토큰 처리)라는 두 개의 트랜스포머 타워를 공유 멀티모달 어텐션 레이어로 연결한 구조다. 월드 액션 모델(WAM)로서 640×360 해상도에서 추론 1회당 32개의 액션을 생성하며, NVIDIA Jetson Thor에서 15Hz 실시간 제어를 달성한다고 밝혔다. 동일 규모(4B) 모델 중 VANTAGE-Bench 비전 분석 부문 1위, 로봇 정책 학습에서도 최고 수준이라고 원문은 언급한다. 함께 공개된 Cosmos 3 Edge Policy (DROID)는 DROID 데이터셋으로 포스트 트레이닝된 로봇 매니퓰레이션 정책이며, 포스트 트레이닝 스크립트도 제공된다. 별도로 Cosmos 3 Super 4-Step Distillation 체크포인트도 공개됐는데, 디퓨전 스텝을 35~50에서 4로 줄여 최대 25배 빠른 추론을 제공한다고 한다.

## 설정 파일에 어떤 의미인가

Cosmos 3 Edge는 Hugging Face 리포지토리에서 모델 가중치와 포스트 트레이닝 스크립트 형태로 배포된다. 기존 Hugging Face Transformers 파이프라인이나 `config.json` 기반 워크플로우에 어떻게 통합되는지는 원문에서 명확히 다루지 않는다. 두 개의 트랜스포머 타워가 공존하는 구조이므로, 모델 로딩 시 일반적인 `AutoModel` 패턴과 다를 가능성이 있다. 파인튜닝은 H100 또는 NVIDIA DGX Station 클러스터가 필요하다고 언급돼 있어, 로컬 개발 환경 설정 시 하드웨어 요구 사항을 먼저 확인해야 한다. 구체적인 설정 파일 포맷, 의존성, breaking change 등은 원문에서 상세히 다루지 않았다 — Hugging Face의 모델 카드와 Cosmos Frameworks 공식 문서가 보완되면 다시 정리하겠다.

## 다음 단계 제안

관심 있는 개발자는 먼저 [Hugging Face의 Cosmos 3 Edge 모델 카드](https://huggingface.co/nvidia/Cosmos3-Edge)에서 모델 구조와 요구 사양을 확인하는 것이 실용적이다. 로봇 정책 학습이 목적이라면 함께 공개된 DROID 포스트 트레이닝 스크립트부터 살펴보고, 이미지·비디오 생성 쪽이라면 4-Step Distillation 체크포인트의 추론 품질을 직접 비교해 보는 편이 빠르다. 엣지 배포 대상 하드웨어(Jetson, RTX PRO 등)가 확정돼 있다면 메모리 프로파일링을 먼저 돌려 보길 권한다.

---

**원문 전체 보기**: [Introducing Cosmos 3 Edge](https://huggingface.co/blog/nvidia/cosmos3edge) ([Hugging Face Blog](https://huggingface.co/blog/nvidia/cosmos3edge))