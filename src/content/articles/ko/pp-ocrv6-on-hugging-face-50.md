---
id: "https://huggingface.co/blog/PaddlePaddle/pp-ocrv6"
tool: "huggingface"
title: "PP-OCRv6가 Hugging Face에 공개: 1.5M~34.5M 파라미터로 50개 언어 OCR 지원"
link: "https://huggingface.co/blog/PaddlePaddle/pp-ocrv6"
pubDate: 2026-06-22T13:18:56.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/PaddlePaddle/pp-ocrv6"
contentType: "commentary"
summary: "PaddleOCR의 PP-OCRv6가 tiny·small·medium 세 가지 모델 티어로 공개되었다. 50개 언어를 단일 모델 패밀리로 지원하며, Paddle Inference·Transformers·ONNX Runtime 세 가지 백엔드를 선택할 수 있다."
---

PaddleOCR 팀이 Hugging Face Blog를 통해 PP-OCRv6 모델 패밀리를 공개했다. 문서, 스크린샷, 다국어 이미지, 산업 라벨 등 실제 환경의 텍스트 검출·인식을 목표로 한 경량 OCR 모델이다.

## 무엇이 새로운가

모델은 tiny(1.5M 파라미터), small(7.7M), medium(34.5M) 세 티어로 나뉜다. PaddleOCR 자체 벤치마크 기준으로 medium 티어는 검출 Hmean 86.2%, 인식 정확도 83.2%를 기록했으며, 이전 세대인 PP-OCRv5_server 대비 검출 +4.6pp, 인식 +5.1pp 향상됐다고 밝혔다. medium과 small 티어는 중국어 간·번체, 영어, 일본어 및 46개 라틴 문자 언어 등 총 50개 언어를 하나의 모델로 지원한다. 백본으로 PPLCNetV4를 통일하고, 검출에는 RepLKFPN, 인식에는 EncoderWithLightSVTR을 도입해 아키텍처를 정비했다. Hugging Face Hub에 safetensors, Paddle 추론 포맷, ONNX 모델이 모두 올라와 있다.

## 설정 파일에 어떤 의미인가

개발자 입장에서 주목할 부분은 PaddleOCR 3.7의 통합 추론 엔진 인터페이스다. `PaddleOCR()` 생성자에서 `engine` 파라미터 하나로 백엔드를 전환할 수 있다 — `"transformers"`, `"onnxruntime"`, 또는 기본값인 Paddle Inference. 기존에 PaddleOCR를 이미 사용 중이라면 `engine` 파라미터만 추가하면 되고, 나머지 파이프라인 코드는 동일하게 유지된다. 다만 원문에서 PP-OCRv5 기반 기존 설정으로부터의 마이그레이션 절차나 breaking change에 대해서는 구체적으로 다루지 않았다. `use_doc_orientation_classify`, `use_doc_unwarping`, `use_textline_orientation` 같은 전처리 옵션을 `False`로 끈 예시가 제공되지만, 이 옵션들의 기본값 변경 여부 등 세부 사항은 공식 PaddleOCR 문서를 직접 확인하는 편이 안전하다.

## 다음 단계 제안

원문에 링크된 온라인 데모에서 자신의 OCR 대상 이미지를 직접 넣어보는 것이 가장 빠른 평가 방법이다. 배포 환경에 맞춰 Paddle·ONNX·Transformers 중 어떤 백엔드가 적합한지 판단한 뒤, Hugging Face Hub의 PP-OCRv6 Collection에서 해당 포맷 모델을 내려받아 기존 파이프라인에 붙여 보면 된다. 다국어 OCR을 별도 모델로 관리하던 경우라면, 단일 모델 패밀리로 통합할 수 있는지 검토해 볼 만하다.

---

**원문 전체 보기**: [PP-OCRv6 on Hugging Face: 50-Language OCR from 1.5M to 34.5M Parameters](https://huggingface.co/blog/PaddlePaddle/pp-ocrv6) ([Hugging Face Blog](https://huggingface.co/blog/PaddlePaddle/pp-ocrv6))