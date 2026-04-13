# ADR-0011: 아티클 AI 요약 자동화 전략

- 상태: 승인됨
- 날짜: 2026-04-13
- 의사결정자: jsg3121

## 맥락 (Context)

ADR-0010에서 아티클 페이지의 콘텐츠 표시 방식을 "제목 + 편집자 요약 + 원문 링크(Snippet 방식)"로 결정했다. 이 방식은 저작권 위험을 피하고 애드센스 "부가가치" 요건을 충족하기 위해 편집자가 직접 요약을 작성하는 것을 전제로 했다.

그러나 매일 7개 도구(ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js)의 업데이트를 수동으로 요약하는 것은 운영 부담이 크다. AI를 활용한 요약 자동화가 가능하다면 완전 자동화 파이프라인을 구성할 수 있다.

추가 고려사항:
- 2026년 기준 Google AdSense는 AI 생성 콘텐츠 자체를 금지하지 않음. 단, "사용자에게 실질적 가치를 제공"해야 함
- 한국어/영어 다국어 서비스이므로 요약 품질이 중요
- 무료 또는 저비용 운영이 목표

## 결정 (Decision)

### 결정 1: AI 요약 서비스 — Google Gemini API (Flash 모델) 채택

Google Gemini API의 Flash 모델을 사용하여 RSS 피드 원문을 기반으로 한국어/영어 요약을 자동 생성한다.

**선택 모델:** Gemini 2.5 Flash (또는 최신 Flash 모델)

**예상 사용량:**
- 7개 도구 × 주 2개 업데이트 = ~60개 아티클/월
- 아티클당: ~500 토큰 입력, ~300 토큰 출력
- 월간 총: ~30,000 입력 토큰, ~18,000 출력 토큰

**비용:** 무료 티어 내 충분히 커버 (1,000 요청/일, 250K 토큰/분)

### 결정 2: 요약 생성 파이프라인

```
GitHub Actions (매일 09:00 UTC)
  │
  ├─ 1. RSS 피드 7개 fetch
  │
  ├─ 2. 기존 아티클과 diff → 신규 항목 추출
  │
  ├─ 3. Gemini API 호출
  │     └─ 원문 링크 fetch → 본문 추출 → 요약 생성 (한국어/영어)
  │
  ├─ 4. Markdown 파일 생성 (src/content/articles/)
  │
  └─ 5. Cloudflare Pages 빌드 훅 호출
```

### 결정 3: 요약 프롬프트 전략

AI 요약은 단순 번역/축약이 아닌 "개발자 관점의 해설"로 작성하여 부가가치를 제공한다.

**프롬프트 구조:**
```
다음 개발 도구 업데이트 공지를 읽고, 개발자에게 중요한 점을 2-3문장으로 요약해주세요.
- 주요 변경사항이 무엇인지
- 기존 사용자에게 어떤 영향이 있는지
- 마이그레이션이 필요한지

원문: {content}
```

### 결정 4: Fallback 전략

Gemini API 장애 또는 Rate Limit 도달 시:
1. 재시도 (3회, exponential backoff)
2. 실패 시 해당 아티클은 "요약 준비 중" 상태로 저장
3. 다음 빌드 사이클에서 재시도

Cloudflare Workers AI를 2차 fallback으로 고려했으나, 한국어 품질 차이로 인해 우선 Gemini 단일 소스로 운영한다. 추후 필요 시 fallback 추가.

## 근거 (Rationale)

### Gemini API 선택 이유

| 기준 | Gemini API | Cloudflare Workers AI |
|------|-----------|----------------------|
| **한국어 품질** | ✅ 우수 | ⚠️ 모델별 편차 큼 |
| **무료 티어** | ✅ 1,000 요청/일 | ✅ 10,000 Neurons/일 |
| **기본료** | ✅ 없음 (종량제) | ❌ $5/월 (Workers Paid) |
| **통합 난이도** | ⚠️ 외부 API 호출 | ✅ Cloudflare 인프라 통합 |
| **유료 전환 시 비용** | Flash-Lite $0.10/M | Llama 3.2 1B $0.027/M |

**핵심 선택 기준:** 한국어 요약 품질

ConfigDeck은 한국어 사용자가 주 타겟이므로 한국어 요약 품질이 핵심이다. Gemini는 Google의 다국어 학습 데이터로 인해 한국어 품질이 Cloudflare Workers AI의 오픈소스 모델(Llama, Mistral)보다 우수하다.

### AI 요약과 애드센스 정책

2026년 기준 Google AdSense 정책:
- AI 생성 콘텐츠 자체는 **금지 대상이 아님**
- 금지 대상: "사용자에게 가치 없는 얇은 콘텐츠", "검색 순위 조작 목적 스팸"
- 승인 조건: **실질적 가치 제공**

AI 요약이 단순 번역/축약이 아닌 "개발자 관점 해설"을 제공하면 부가가치 요건을 충족한다.

### 무료 티어 충분성

월간 예상 사용량 ~60개 아티클은 Gemini 무료 티어(1,000 요청/일)의 0.2%에 불과하다. 서비스 확장으로 10배 증가해도 무료 티어 내에서 운영 가능하다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| Cloudflare Workers AI | 한국어 요약 품질이 Gemini보다 낮음. 인프라 통합 장점은 있으나 품질이 우선 |
| Claude API | 무료 티어 없음. 품질은 우수하나 비용 발생 |
| Groq (Llama 3) | 무료이나 한국어 품질 중간. Rate limit이 불안정 |
| OpenAI GPT-4o-mini | 무료 티어 제한적. Gemini Flash와 품질 유사하나 비용 구조 불리 |
| 하이브리드 (Gemini + Workers AI fallback) | 초기 복잡도 증가. 단일 소스로 시작 후 필요 시 추가 |
| 수동 요약 유지 | 운영 부담 과대. 매일 갱신 목표와 충돌 |

## 결과 (Consequences)

### 긍정적

- 완전 자동화 파이프라인 구현 가능 (RSS 감지 → AI 요약 → 빌드 → 배포)
- 무료 티어로 운영 비용 $0 유지
- 한국어/영어 요약 동시 생성으로 다국어 지원 간소화
- 편집자 개입 없이 24시간 내 최신 아티클 반영

### 부정적

- Gemini API 의존성 발생 (장애 시 요약 생성 불가)
- 무료 티어 데이터가 Google 제품 개선에 활용될 수 있음
- AI 요약 품질이 일정하지 않을 수 있음 (프롬프트 튜닝 필요)
- 2026년 4월 이후 Gemini 정책 변경으로 무료 티어 축소 가능성

### 후속 조치

- [ ] Gemini API 키 발급 및 환경 변수 설정
- [ ] 요약 프롬프트 테스트 및 튜닝
- [ ] GitHub Actions 워크플로우에 Gemini API 호출 로직 추가
- [ ] 요약 품질 모니터링 및 피드백 루프 구성
- [ ] ADR-0010 상태를 `제안됨` → `승인됨`으로 변경

## 참고 자료 (References)

- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) — Gemini API 가격 및 무료 티어 정책
- [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits) — Gemini API 요청 제한
- [Cloudflare Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) — Workers AI 가격 및 Neurons 체계
- [Google AdSense AI Content Policy 2026](https://thehumanizeai.pro/articles/google-adsense-ai-content-policy-2026) — 2026년 애드센스 AI 콘텐츠 정책 분석
- [AdSense Program Policies](https://support.google.com/adsense/answer/48182) — 애드센스 프로그램 정책 (부가가치 요건)
- [ADR-0010: 아티클 콘텐츠 수집 및 갱신 전략](ADR-0010-article-content-strategy.md) — 본 ADR의 선행 결정
