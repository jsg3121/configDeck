---
id: "https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety"
tool: "huggingface"
title: "Nemotron 3.5 Content Safety: 엔터프라이즈 AI를 위한 커스터마이즈 가능한 멀티모달 안전 모델"
link: "https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety"
pubDate: 2026-06-04T18:57:45.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety"
contentType: "commentary"
summary: "NVIDIA가 Nemotron 3.5 Content Safety를 공개했다. 멀티모달 입력, 다국어 지원, 커스텀 정책 적용, 추론 추적을 단일 모델에 통합한 안전 분류 모델이다."
---

NVIDIA가 Hugging Face Blog를 통해 Nemotron 3.5 Content Safety를 발표했다. 이전 버전인 Nemotron 3 Content Safety(2026년 3월 공개)에서 도입된 멀티모달·다국어 기능 위에, 커스텀 정책 적용과 감사 가능한 추론 추적(THINK 모드)을 하나의 추론 호출로 통합한 4B 파라미터 모델이다.

## 무엇이 새로운가

핵심 추가 기능은 커스텀 정책 적용이다. 입력과 함께 자연어로 작성된 정책 명세를 전달하면, 내장 분류 체계에만 의존하지 않고 해당 정책에 따라 판정을 내린다. 카테고리 억제(예: DevOps 도구에서 "terminate a process"가 폭력으로 분류되지 않도록)나 조직 고유의 위험 카테고리 주입이 가능하다. THINK 모드를 켜면 단계별 추론 과정이 출력되어 컴플라이언스 로깅이나 사람에 의한 리뷰에 활용할 수 있고, 지연 시간이 중요하면 끄고 저지연 바이너리 판정만 받을 수도 있다. 아키텍처는 Google Gemma 3 4B IT 위에 LoRA 어댑터를 적용한 형태로, 128K 컨텍스트 윈도우를 지원하며 8GB 이상 VRAM GPU에서 실시간 배포가 가능하다고 밝혔다. 12개 언어에 대해 명시적 학습을 거쳤고, Gemma 3 베이스 모델 덕분에 약 140개 언어에 제로샷 일반화를 제공한다. 학습 및 평가에 사용된 안전 데이터셋도 함께 공개되었는데, 멀티모달·다국어 데이터에 추론 추적까지 포함된 점이 눈에 띈다.

## 설정 파일에 어떤 의미인가

Nemotron 3.5 Content Safety는 개발자 도구의 설정 파일을 직접 변경하는 종류의 릴리스는 아니다. 다만 LLM 기반 서비스에 안전 가드레일을 구성하는 팀이라면 주목할 부분이 있다. 기존에 텍스트와 이미지를 별도 파이프라인으로 분류하던 구성을 단일 모델 호출로 통합할 수 있고, 커스텀 정책을 추론 시점에 주입하는 구조이므로 정책 변경 시 모델 재학습이나 설정 파일 재배포 없이 프롬프트 수준에서 대응할 수 있다. 출력 모드가 세 가지(바이너리, 바이너리+카테고리, THINK)로 나뉘므로, 서빙 파이프라인에서 모드 선택을 환경 변수나 설정으로 관리하는 패턴을 고려할 만하다. 다만 원문에서는 구체적인 API 설정 예시나 기존 NeMo Guardrails와의 통합 방법은 상세히 다루지 않았다 — 공식 모델 카드나 후속 문서가 나오면 다시 정리하겠다.

## 다음 단계 제안

안전 분류 파이프라인을 운영 중이거나 도입을 검토하는 팀이라면, 우선 원문에서 세 가지 출력 모드의 예시와 Aegis 2.0 분류 체계(13개 핵심 카테고리 + 10개 세부 카테고리)를 확인하고, 현재 사용 중인 분류 정책과 얼마나 겹치는지 비교해 보는 것이 실질적인 첫 단계다. 함께 공개된 안전 데이터셋은 자체 안전 모델 평가 벤치마크로도 활용할 수 있으므로 체크해 볼 가치가 있다.

---

**원문 전체 보기**: [Nemotron 3.5 Content Safety: Customizable Multimodal Safety for Global Enterprise AI](https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety) ([Hugging Face Blog](https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety))