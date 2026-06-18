---
id: "https://huggingface.co/blog/allenai/molmomotion"
tool: "huggingface"
title: "MolmoMotion: 언어 기반 3D 모션 예측 모델 공개"
link: "https://huggingface.co/blog/allenai/molmomotion"
pubDate: 2026-06-17T15:26:44.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/allenai/molmomotion"
contentType: "commentary"
summary: "Allen AI가 텍스트 지시와 3D 포인트를 입력받아 객체의 미래 3D 궤적을 예측하는 MolmoMotion 모델, 116만 영상 규모의 MolmoMotion-1M 데이터셋, 2.7K 클립의 PointMotionBench 벤치마크를 오픈 공개했다."
---

Allen AI가 Hugging Face Blog를 통해 MolmoMotion을 공개했다. RGB 이미지, 객체 위의 3D 쿼리 포인트, 그리고 자연어 행동 설명을 입력으로 받아 해당 객체가 앞으로 몇 초간 3D 공간에서 어떻게 움직일지 궤적을 예측하는 모델이다.

## 무엇이 새로운가

MolmoMotion은 Molmo 2를 백본으로 사용하며, 두 가지 변형이 있다. **MolmoMotion-AR**은 3D 좌표를 구조화된 텍스트로 표현해 자기회귀적으로 궤적을 생성하고, **MolmoMotion-FM**은 flow-matching 방식으로 노이즈를 연속 3D 좌표 공간에서 모션으로 변환한다. 모션 표현은 클래스에 구애받지 않고, 카메라 시점 변화에도 안정적이며, 로봇 정책이나 영상 생성 모델에 직접 전달할 수 있는 형태로 설계됐다. 함께 공개된 **MolmoMotion-1M** 데이터셋은 116만 개 영상에서 추출한 3D 포인트 궤적으로, 736가지 모션 유형과 5,600개 이상의 객체를 포함한다. 평가용 **PointMotionBench**는 사람이 검증한 2.7K 클립으로 구성되며 111개 객체 카테고리와 61가지 모션 유형을 다룬다. 모델 가중치, 데이터셋, 벤치마크, 코드가 모두 오픈 공개되었다.

## 설정 파일에 어떤 의미인가

MolmoMotion은 개발자 도구 설정 파일과 직접적으로 관련되는 프로젝트는 아니다. 모델 추론이나 학습을 로컬에서 재현하려면 GitHub 저장소의 코드를 클론하고, Hugging Face Hub에서 모델·데이터셋을 내려받는 과정이 필요하지만, 원문에서 구체적인 환경 설정 파일 구조나 의존성 매니저 설정에 대한 안내는 제공하지 않는다. `transformers`, `datasets` 등 Hugging Face 생태계 라이브러리와의 통합 방식이나 필요한 CUDA/PyTorch 버전 같은 상세 사항은 프로젝트 GitHub 저장소와 Hugging Face 모델 카드에서 직접 확인하는 것이 정확하다.

## 다음 단계 제안

로보틱스 플래닝이나 비디오 생성 파이프라인에 3D 모션 예측을 통합하려는 팀이라면, 먼저 PointMotionBench로 기존 접근법과 MolmoMotion의 정량 비교를 확인하고, MolmoMotion-1M 데이터셋을 자체 도메인에 맞게 파인튜닝할 수 있는지 검토해 보는 것이 실질적인 첫 단계다. AR 변형과 FM 변형의 특성이 다르므로 — 궤적이 명확한 경우 AR, 불확실성이 있는 경우 FM — 자신의 유스케이스에 맞는 변형을 선택하는 것이 중요하다. 자세한 실험 결과와 한계점은 원문과 기술 보고서에서 확인할 수 있다.

---

**원문 전체 보기**: [MolmoMotion: Language-guided 3D motion forecasting](https://huggingface.co/blog/allenai/molmomotion) ([Hugging Face Blog](https://huggingface.co/blog/allenai/molmomotion))