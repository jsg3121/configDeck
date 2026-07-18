---
id: "https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel"
tool: "huggingface"
title: "NVIDIA NeMo Automodel과 Diffusers로 영상·이미지 모델 대규모 파인튜닝하기"
link: "https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel"
pubDate: 2026-07-17T15:57:54.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel"
contentType: "commentary"
summary: "NVIDIA NeMo Automodel이 Hugging Face Diffusers 포맷을 네이티브로 지원해, 체크포인트 변환 없이 Hub 모델을 바로 분산 파인튜닝할 수 있게 됐다. YAML 설정 하나로 병렬화 전략을 전환하는 구조가 핵심이다."
---

NVIDIA와 Hugging Face가 공동으로, NeMo Automodel 라이브러리를 통해 Diffusers 포맷 모델의 프로덕션급 분산 학습을 지원하는 통합 작업을 발표했다. Hugging Face Blog에 게시된 이 글은 Apache 2.0 라이선스로 공개된 해당 통합의 구조와 워크플로를 설명한다.

## 무엇이 새로운가

가장 눈에 띄는 점은 체크포인트 변환이 사라졌다는 것이다. Hub의 `pretrained_model_name_or_path`를 그대로 가리키면 학습이 시작되고, 파인튜닝 결과물도 `DiffusionPipeline`에 바로 로드된다. 현재 지원 모델 목록에는 Wan 2.1(1.3B/14B), Wan 2.2 A14B(MoE 27B), FLUX.1-dev(12B), FLUX.2-dev(32B), HunyuanVideo 1.5(13B), Qwen-Image(20B)이 포함되어 있다. 풀 파인튜닝과 LoRA 양쪽 모두 지원하며, 새 Diffusers 모델이 추가될 때 데이터 전처리 핸들러와 모델 어댑터만 작성하면 나머지 레시피 스택이 그대로 재활용된다. 현재는 flow-matching 모델만 대상이라는 제약이 있다.

## 설정 파일에 어떤 의미인가

이 통합에서 설정의 중심은 YAML 레시피 파일이다. 원문 예시에서는 `flux_t2i_flow.yaml` 하나로 모델 선택, FSDP2 8-way 샤딩, 배치 크기 등을 선언하고, 데이터셋 경로·학습률 스케줄·스텝 수 같은 런별 값은 커맨드라인 오버라이드로 주입한다. 병렬화 전략(FSDP2, tensor parallel, context parallel, pipeline parallel 등)도 설정 선언으로 전환할 수 있어, 코드를 고치지 않고 YAML 값만 바꾸면 된다. 기존 Diffusers 추론 파이프라인이나 LoRA 어댑터, 커스텀 샘플러 등 다운스트림 설정과의 호환성은 유지된다고 명시돼 있다. 다만 NeMo Automodel 자체의 YAML 스키마에 대한 상세 레퍼런스나 버전별 변경 이력은 원문에서 깊이 다루지 않았으므로, 공식 GitHub 저장소의 문서를 직접 확인하는 편이 안전하다.

## 다음 단계 제안

대규모 디퓨전 모델 파인튜닝을 고려하고 있다면, 원문에 나온 Rider–Waite 타로 데이터셋 예제를 그대로 따라가 보는 것이 가장 빠른 검증 방법이다. Docker 컨테이너(`nvcr.io/nvidia/nemo-automodel:26.06`)가 의존성을 미리 빌드해 두므로 환경 세팅 비용이 낮다. YAML 레시피를 한 번 실행한 뒤, 병렬화 옵션이나 LoRA 전환이 실제로 설정 변경만으로 작동하는지 확인해 보면 자기 워크플로에 맞는지 빠르게 판단할 수 있다.

---

**원문 전체 보기**: [Fine-tune video and image models at scale with NVIDIA NeMo Automodel and 🤗 Diffusers](https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel) ([Hugging Face Blog](https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel))