---
id: "https://huggingface.co/blog/nunchaku-diffusers"
tool: "huggingface"
title: "Nunchaku 4비트 디퓨전 추론을 Diffusers에 통합하다"
link: "https://huggingface.co/blog/nunchaku-diffusers"
pubDate: 2026-07-23T00:00:00.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nunchaku-diffusers"
contentType: "commentary"
summary: "Nunchaku의 SVDQuant 4비트 양자화 체크포인트를 Diffusers에서 from_pretrained()만으로 로드할 수 있는 'Nunchaku Lite' 통합이 발표되었다. 별도 추론 엔진 없이 VRAM을 절반 수준으로 줄이면서 약 30% 속도 향상을 제공한다."
---

Hugging Face Blog에서 Nunchaku Lite라는 새로운 Diffusers 통합 경로를 발표했다. SVDQuant 방식으로 4비트 양자화된 디퓨전 트랜스포머 체크포인트를 별도 추론 엔진이나 로컬 CUDA 컴파일 없이 표준 Diffusers API로 로드할 수 있게 된다.

## 무엇이 새로운가

기존 Diffusers의 양자화 백엔드(bitsandbytes, GGUF, torchao, Quanto)는 대부분 weight-only 방식이라 메모리만 줄이고 추론 속도에는 이점이 없거나 오히려 지연이 생겼다. Nunchaku Lite는 SVDQuant의 W4A4(4비트 가중치+활성화) 접근을 채택해 메모리 절감과 속도 향상을 동시에 노린다. 원문에 따르면 RTX 5090 기준 ERNIE-Image-Turbo 모델로 1024×1024 이미지를 약 1.7초에 생성하며, 피크 VRAM이 BF16 대비 약 24GB에서 약 12GB로 줄었다. 다만 아키텍처별 퓨즈드 커널이 없는 Lite 버전 특성상 원본 Nunchaku 엔진의 최대 속도에는 미치지 못하고, 약 30% 속도 향상 수준이라고 명시되어 있다. `torch.compile`을 결합하면 end-to-end 속도 향상이 1.35배에서 1.8배로 올라간다고 한다.

## 설정 파일에 어떤 의미인가

설정 관점에서 가장 눈여겨볼 부분은 트랜스포머의 `config.json` 안에 `quantization_config` 블록이 추가된다는 점이다. `quant_method: "nunchaku_lite"`를 선언하고, `svdq_w4a4`와 `awq_w4a16` 섹션에서 대상 모듈, precision(`nvfp4` 또는 `int4`), group_size, rank 등을 지정한다. 양자화된 모델이 원본과 동일한 모듈 구조를 유지하기 때문에 스케줄러, LoRA 로딩, 오프로딩, `torch.compile` 등 기존 Diffusers 하위 설정들과 그대로 호환된다고 원문은 설명한다.

하드웨어 제약도 설정 시 중요하다. NVFP4 precision은 Blackwell GPU(RTX 50 시리즈, RTX PRO 6000, B200)에서만 동작하고, INT4는 Turing/Ampere/Ada(RTX 30·40 시리즈, A100, L40S)를 지원한다. Volta와 Hopper는 현재 미지원이며, 로드 시 CUDA capability를 검증해 명확한 에러를 반환한다. 기존 BF16 파이프라인 설정을 쓰고 있었다면 별도 마이그레이션 없이 체크포인트 경로만 양자화 버전으로 교체하면 된다.

## 다음 단계 제안

소비자 GPU에서 디퓨전 모델을 돌리는 환경이라면, 먼저 본인의 GPU 세대가 지원 목록에 있는지 확인하고 원문의 ready-to-use 체크포인트 목록에서 사용 중인 모델의 양자화 버전이 있는지 살펴보는 것이 가장 빠른 시작점이다. 새로운 아키텍처를 직접 양자화하려면 원문에서 소개하는 `diffuse-compressor` 툴킷을 확인하자. 벤치마크 수치와 세부 설정 옵션은 원문에 더 상세하게 정리되어 있다.

---

**원문 전체 보기**: [Bringing Nunchaku 4-bit Diffusion Inference to Diffusers](https://huggingface.co/blog/nunchaku-diffusers) ([Hugging Face Blog](https://huggingface.co/blog/nunchaku-diffusers))