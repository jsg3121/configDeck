---
id: SPEC-0003
title: Shareable URL — 옵션 상태 URL 직렬화 및 공유 기능
status: 완료
owner: jsg3121
created: 2026-04-26
updated: 2026-04-26
related_adrs:
  - ADR-0005  # 공유 링크 기능 — URL 기반 옵션 인코딩
  - ADR-0014  # 성장 전략 로드맵 (Shareable URL P0 격상)
related_specs:
  - SPEC-0001  # 파일 옵션 생성기 기능 보강 (§2.2에서 본 SPEC으로 분리)
---

# SPEC-0003: Shareable URL — 옵션 상태 URL 직렬화 및 공유 기능

> **본 SPEC은 회고형(retrospective) 문서이다.**
> 1.2.0 사이클에서 ADR-0014의 P0 격상 결정에 따라 구현이 선행되었고, 본 문서는 구현 범위를 사후 정리해 향후 확장과 검증의 기준으로 삼는다.

## 1. 배경 (Background)

### 1.1 현재 상태

- ADR-0005에서 URL 쿼리스트링 기반 공유 링크를 결정했으나, 1.2.0 직전까지 미구현 상태였다
- 사용자가 옵션을 선택해 파일을 생성한 후, 동일한 설정 상태를 다시 보여줄 방법이 없었다
- 기획서와 ADR-0014에서 공유 링크는 "재방문 메커니즘의 핵심"으로 평가되었으나 P1로 분류되어 후순위였다

### 1.2 문제점

1. **재방문 동기 부재**: 한 번 다운로드하면 다시 방문할 이유가 없다. SEO 유입의 복리 효과가 발휘되지 않는다.
2. **모바일 활용성 단절**: ADR-0005의 "모바일에서 옵션 선택 → PC에서 다운로드" 시나리오가 동작하지 않는다.
3. **레퍼럴/바이럴 채널 부재**: 블로그·Stack Overflow·팀 위키에서 "이 설정 그대로 받아가세요" 형태의 공유가 불가능하다.
4. **디버깅·문서화 어려움**: 사용자가 만든 설정 그대로를 재현하기 어려워, 이슈 보고나 가이드 작성에 사용되지 못한다.

### 1.3 사용자 요구

- ADR-0005에서 도출된 모바일 ↔ PC 디바이스 간 옵션 상태 전달 시나리오
- ADR-0014에서 격상 근거로 제시된 "전환 비용 0인 서비스의 재방문 락인" 요구
- 1.2.0 직전 sprint 리뷰에서 "옵션 조합을 동료에게 그대로 보내주고 싶다"는 사용성 피드백

## 2. 목표 (Goals)

### 2.1 달성하려는 것 (In Scope)

- 파일별 생성기·스택 생성기 양쪽에서 현재 옵션 상태를 URL로 직렬화한다
- URL 진입 시 옵션 상태를 자동 복원한다 (preset, 개별 옵션, 비활성 파일)
- 모바일에서는 Web Share API로 네이티브 공유 시트를 호출하고, 미지원 환경 또는 거부 시 클립보드 복사로 폴백한다
- 데스크톱에서는 클립보드 복사를 기본 동작으로 한다
- URL 길이가 일정 임계치(2,000자)를 초과하면 사용자에게 경고를 노출한다
- 기본값과 동일한 옵션은 URL에서 제외하여 길이를 최소화한다

### 2.2 다루지 않는 것 (Out of Scope)

- **서버 측 단축 URL 생성** — ADR-0005에서 정적 사이트 아키텍처와 부합하지 않아 명시적으로 제외
- **공유 링크 통계/분석(클릭 추적 등)** — 별도 KPI 도구 도입 후 검토. 본 SPEC 범위 외
- **QR 코드 생성** — 추가 라이브러리 의존이 필요. 사용자 요구가 명시적으로 발생하면 별도 SPEC으로 검토
- **만료 링크/소유권 모델** — 정적 인코딩 방식과 본질적으로 어긋남. 도입 시 ADR 재작성 필요

> **Why Out of Scope 명시:** 공유 링크는 추가 기능 후보가 무궁무진하다. 본 SPEC은 ADR-0005의 결정을 충실히 구현하는 범위에 한정하고, 위 항목은 트래픽·요구가 검증된 후 별도로 다룬다.

## 3. 제안 (Proposal)

### 3.1 개요

옵션 상태를 base64url로 인코딩한 단일 쿼리 파라미터(`o`)와, 프리셋 식별자(`preset`)로 구성된 URL을 생성한다. 인코딩 전에 기본값과 동일한 옵션을 제거해 길이를 최소화한다. 공유 시에는 Web Share API → Clipboard API 순으로 폴백한다.

### 3.2 상세 설계

#### 3.2.1 URL 스키마

**파일별 생성기**

```
https://config-deck.dev/{locale}/generator/{file-slug}
  ?preset={preset-id}                    # 프리셋이 명시적으로 선택된 경우만
  &o={base64url(JSON.stringify(diff))}   # 기본값과 다른 옵션이 있을 때만
```

**스택 생성기**

```
https://config-deck.dev/{locale}/generator/{stack-slug}
  ?o={base64url(JSON.stringify({
    disabled: ['file-slug', ...],          // 비활성화된 파일 목록
    files: { 'file-slug': { ...diff } }    // 파일별 옵션 차분
  }))}
```

#### 3.2.2 인코딩 알고리즘

[src/lib/utils/shareUrl.ts](../../../../src/lib/utils/shareUrl.ts)에 구현된 흐름:

1. **diff 계산**: `filterNonDefaultOptions(options, defaults)`로 기본값과 다른 키만 추출 (`isEqual` 깊은 비교)
2. **JSON 직렬화**: `JSON.stringify(diff)`
3. **UTF-8 → 바이트 → base64**: `TextEncoder` → `btoa`
4. **URL-safe 변환**: `+ → -`, `/ → _`, 끝 패딩 `=` 제거
5. **임계치 검사**: 최종 URL이 2,000자 초과 시 `warning` 반환

> **Why TextEncoder:** deprecated된 `unescape`/`escape`을 피하고 MDN의 "Base64 — The 'Unicode Problem'" 권장 패턴을 따른다.

#### 3.2.3 디코딩 알고리즘

`URLSearchParams`로 `preset`/`o`를 추출 후 역순 디코딩한다. 디코딩 실패 시 빈 객체로 폴백하고 `console.warn`으로 알린다 (사용자 흐름 차단 금지).

#### 3.2.4 공유 동작

```
[복사 버튼 클릭]
   │
   ├─ Web Share API 가능? (navigator.share && navigator.canShare)
   │     ├─ Yes → navigator.share({ url, title })
   │     │       사용자가 거부(AbortError) → 클립보드 복사 폴백
   │     └─ No  → 클립보드 복사
   │
   └─ 결과 토스트 노출 ("복사됨!", 2초 후 사라짐)
```

> **Why API 지원 여부와 무관하게 클립보드 복사 보장:** 1.2.0 작업 중 일부 모바일 브라우저(특히 in-app browser)에서 Web Share가 부분 지원되어 사용자가 공유 시트를 닫으면 아무 일도 일어나지 않는 문제가 있었다. 폴백을 항상 보장한다.

### 3.3 사용자 플로우

1. 사용자가 옵션을 선택하고 "공유" 버튼을 클릭한다
2. 모바일: 네이티브 공유 시트가 뜨거나 클립보드 복사 토스트가 표시된다
3. 데스크톱: 클립보드 복사 토스트가 표시된다
4. 받은 사람이 URL을 클릭하면 동일한 옵션 상태로 페이지가 열린다
5. 받은 사람은 즉시 미리보기·다운로드·재공유를 할 수 있다

## 4. 근거 (Rationale)

- **base64url 인코딩**: 쿼리 파라미터에 안전하면서도 JSON 페이로드를 압축 없이 그대로 보낼 수 있어 디버깅이 쉽다 ([RFC 4648 §5](https://datatracker.ietf.org/doc/html/rfc4648#section-5))
- **diff 기반 인코딩**: 기본값을 URL에 포함하지 않음으로써 단순 프리셋의 URL 길이를 수십 바이트 수준으로 유지한다. 이는 메신저·SNS의 자동 단축/잘림을 회피한다
- **2,000자 임계치**: IE/일부 모바일 브라우저의 URL 길이 제한과 메신저 미리보기 제약을 고려한 보수적 수치 ([RFC 9110 §4.1](https://datatracker.ietf.org/doc/html/rfc9110#section-4.1))
- **Web Share API + Clipboard 폴백**: ADR-0005 참고자료의 [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) 권장 패턴
- **TextEncoder 사용**: `unescape`/`escape`은 deprecated. MDN ["Base64 — The 'Unicode Problem'"](https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem) 권장 패턴

## 5. 대안 (Alternatives)

| 대안 | 설명 | 장점 | 단점 | 채택 여부 |
|------|------|------|------|-----------|
| 평문 쿼리 파라미터 (`?eslint=strict&prettier=semi:false`) | ADR-0005 본문 예시 방식 | 사람이 읽을 수 있음 | 옵션 수 증가 시 URL 길이 폭증, 특수문자 이슈 | 불채택 |
| **base64url + 단일 `o` 파라미터** | 옵션을 JSON으로 묶어 인코딩 | URL 짧음, 구조 자유, 특수문자 안전 | 사람이 직접 읽기 어려움 | **채택** |
| LZ-string 압축 + base64url | 더 강한 압축 | 매우 큰 옵션도 짧게 표현 | 라이브러리 의존, 디버깅 어려움 | 불채택 (현 시점 옵션 규모로는 과한 투자) |
| 서버측 단축 URL | 임의 ID로 매핑 | 매우 짧음, 통계 가능 | 정적 아키텍처(ADR-0002/0004) 위배 | 불채택 |
| 옵션 상태 localStorage + QR | 디바이스 간 전달용 별도 채널 | 오프라인 보존 | 디바이스 전환 번거로움, QR 라이브러리 필요 | 불채택 |

## 6. 실행 계획 (Execution Plan)

> 본 SPEC은 회고형이므로, 실행은 1.2.0에서 이미 완료되었다. 아래는 실제 실행 흐름의 사후 기록이다.

### 6.1 단계 (실행 완료)

| 단계 | 작업 | 산출물 | 상태 |
|------|------|--------|------|
| 1 | URL 인코딩/디코딩 유틸 구현 | [src/lib/utils/shareUrl.ts](../../../../src/lib/utils/shareUrl.ts) | ✅ 완료 |
| 2 | 파일별 생성기 공유 버튼 통합 | [FileGenerator.svelte](../../../../src/components/generator/FileGenerator.svelte), [CodePreview.svelte](../../../../src/components/generator/CodePreview.svelte) | ✅ 완료 |
| 3 | 스택 생성기 공유 버튼 통합 | [StackGenerator.svelte](../../../../src/components/generator/StackGenerator.svelte) | ✅ 완료 |
| 4 | URL 진입 시 옵션 복원 로직 | [modules/fileGeneratorLogic.ts](../../../../src/components/generator/modules/fileGeneratorLogic.ts), [modules/codePreviewLogic.ts](../../../../src/components/generator/modules/codePreviewLogic.ts) | ✅ 완료 |
| 5 | Web Share API + 클립보드 폴백 | CodePreview/StackGenerator 내 핸들러 | ✅ 완료 |
| 6 | deprecated `unescape`/`escape` → TextEncoder/TextDecoder 전환 | shareUrl.ts:38-65 | ✅ 완료 (QA 후속 조치) |

### 6.2 마일스톤

- **M1**: shareUrl 유틸 + 파일 생성기 공유 버튼 (df036c3)
- **M2**: 스택 생성기 공유 + Web Share API 적용 (76bb316, 71f35e1)
- **M3**: QA 후속 보정 — TextEncoder 전환 (1.2.0 QA 사이클)

### 6.3 확인 지점 (Checkpoints) — 사후 검증

- [x] M1 완료 후: 파일 생성기에서 공유 URL 생성 → 새 탭에서 옵션 복원 확인 (수동 검증 완료)
- [x] M2 완료 후: 모바일 환경에서 Web Share 시트 호출 확인
- [x] QA 후속: 정적 분석에서 deprecated API 사용 0건

## 7. 리스크 & 대응 (Risks & Mitigations)

| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| 옵션 스키마 변경 시 기존 공유 링크 호환성 깨짐 | 사용자가 받은 링크가 동작하지 않음 | 디코딩 실패 시 빈 객체 폴백 + console.warn으로 흐름 차단 방지. 향후 옵션 키 rename 시 마이그레이션 매핑 추가 |
| URL 길이 폭증 (옵션 수 증가) | 메신저·브라우저에서 잘림 | 2,000자 임계치 경고 + 향후 LZ-string 도입 옵션 검토 |
| 악의적 페이로드 주입 | XSS·예외 발생 | 디코딩 결과는 옵션 스키마 검증 후 사용. 직접 DOM에 삽입하지 않음 |
| Web Share API 브라우저별 동작 차이 | 일부 브라우저에서 침묵 실패 | 항상 클립보드 폴백을 보장 (1.2.0에서 발견된 이슈) |
| iOS Safari clipboard write 제한 | 사용자 제스처 컨텍스트 외에서 실패 | 공유 핸들러는 항상 onClick 같은 사용자 제스처 핸들러 내부에서 실행 |

## 8. 성공 지표 (Success Metrics)

> STR-0002 / ADR-0014의 KPI에 정렬한다.

| 지표 | 30일 목표 | 90일 목표 | 비고 |
|------|----------|----------|------|
| Shareable URL 생성 수 | 50/월 | 300/월 | 클립보드 복사·Web Share 호출 카운트 |
| 공유 URL 진입 트래픽 | 측정 시작 | 전체 트래픽의 5% | UTM 또는 referrer 기반 |
| 공유 URL 진입 후 다운로드 전환율 | 측정 시작 | 30% 이상 | 진입 → 다운로드 클릭률 |

## 9. 참고 자료 (References)

- [ADR-0005: 공유 링크 기능](../../../decisions/records/ADR-0005-share-link.md) — URL 기반 인코딩 결정
- [ADR-0014: 성장 전략 로드맵](../../../decisions/records/ADR-0014-growth-strategy-roadmap.md) — Shareable URL P0 격상 근거
- [SPEC-0001 §2.2](./SPEC-0001-option-generator-enhancement.md#22-다루지-않는-것-out-of-scope) — 본 SPEC으로의 분리 명시
- [MDN: Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN: Base64 — The "Unicode Problem"](https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem)
- [RFC 4648 §5: base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5)
- [RFC 9110 §4.1: URI Reference](https://datatracker.ietf.org/doc/html/rfc9110#section-4.1)

## 10. 변경 이력 (Changelog)

| 날짜 | 변경 내용 | 변경자 |
|------|----------|--------|
| 2026-04-26 | 회고형 SPEC 작성. 1.2.0 사이클의 Shareable URL 구현 사후 정리 | jsg3121 |
