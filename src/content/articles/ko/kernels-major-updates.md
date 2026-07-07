---
id: "https://huggingface.co/blog/revamped-kernels"
tool: "huggingface"
title: "🤗 Kernels 프로젝트 대규모 업데이트 정리"
link: "https://huggingface.co/blog/revamped-kernels"
pubDate: 2026-07-06T00:00:00.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/revamped-kernels"
contentType: "commentary"
summary: "Hugging Face가 커스텀 GPU 커널의 패키징·배포·보안 체계를 전면 재설계했다. 새 리포지토리 타입, 신뢰된 퍼블리셔 제도, 코드 서명, Torch Stable ABI 및 TVM FFI 지원이 핵심이다."
---

Hugging Face Blog에서 🤗 Kernels 프로젝트의 대규모 업데이트를 발표했다. 초기 "From Zero to GPU" 발표 이후 프로젝트를 거의 전면 재설계했으며, 보안·CLI·프레임워크 지원·에이전트 기반 커널 개발 기반까지 여러 축에서 변화가 있다.

## 무엇이 새로운가

Hub에 "kernel"이라는 새 리포지토리 타입이 추가되어, 지원 가속기·OS·백엔드 버전 정보를 커널 페이지에서 바로 확인할 수 있게 됐다. 보안 측면에서는 "trusted publisher" 개념을 도입해 기본적으로 신뢰된 퍼블리셔의 커널만 로드하며, 그 외 커널은 `trust_remote_code` 인자를 명시해야 한다. 코드 서명에는 Sigstore의 cosign을 활용해 임시 서명 키를 사용하고, 신뢰된 GitHub 워크플로우에서 서명됐는지까지 검증한다. 프레임워크 지원에서는 Torch Stable ABI가 추가되어 특정 Torch 버전 이후 약 2년간 호환을 보장하고, Apache TVM FFI를 통해 PyTorch·JAX·CuPy 등 교차 프레임워크 커널 작성이 가능해졌다. CLI도 `kernels`(로딩·준비용)와 `kernel-builder`(빌드용)로 역할을 명확히 분리했다.

## 설정 파일에 어떤 의미인가

커널 로딩 코드에서 가장 직접적인 변경은 `trust_remote_code` 인자다. 기존에 신뢰되지 않은 퍼블리셔의 커널을 사용 중이었다면 `get_kernel()` 호출 시 이 옵션을 명시적으로 추가해야 한다. 빌드 파이프라인 쪽에서는 `kernels` CLI와 `kernel-builder` CLI가 분리되었으므로, 기존 스크립트나 CI 설정에서 두 도구의 명령을 혼용하고 있었다면 각각의 문서를 확인해 업데이트할 필요가 있다. 코드 서명은 아직 로딩 시 자동 검증 단계에는 포함되지 않았고, 수동 검증 명령(`kernels verify-signature`)만 제공된다. 서명 설정에 대한 구체적인 가이드는 kernels v0.16.0 릴리스 노트에 있다. Torch Stable ABI 타겟팅이나 TVM FFI 사용에 따른 빌드 설정 변경은 원문에서 세부 사항을 다루지 않으므로, 공식 CLI 문서를 직접 참조하는 것이 정확하다.

## 다음 단계 제안

현재 커스텀 커널을 배포하거나 소비하고 있다면, 우선 Hub의 새 kernel 리포지토리 타입으로 전환 가능 여부를 확인하고, `kernels`와 `kernel-builder` CLI 문서를 각각 살펴보길 권한다. 에이전트 기반 커널 개발에 관심이 있다면, kernel-builder의 비대화형 CLI 설계와 백엔드별 스킬 구조가 어떤 워크플로우에 조합 가능한지 원문의 해당 섹션을 읽어볼 만하다. 코드 서명은 아직 초기 단계이므로 바로 프로덕션에 적용하기보다는 v0.16.0 릴리스 노트를 따라 테스트 환경에서 먼저 시도해 보는 것이 현실적이다.

---

**원문 전체 보기**: [🤗 Kernels: Major Updates](https://huggingface.co/blog/revamped-kernels) ([Hugging Face Blog](https://huggingface.co/blog/revamped-kernels))