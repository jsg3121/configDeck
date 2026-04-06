# ADR-0004: 배포 환경 선택 — Cloudflare Pages

- 상태: 승인됨
- 날짜: 2026-04-06
- 의사결정자: jsg3121

## 맥락 (Context)

ConfigDeck은 Astro 기반 정적 사이트(ADR-0002)로, 서버 사이드 기능 없이 SSG 출력만 호스팅하면 된다. 배포 플랫폼으로 Vercel, Netlify, Cloudflare Pages를 비교 검토했다.

추가 요구사항:
- `.dev` TLD 도메인 사용 희망 (AWS Route 53은 .dev 미지원)
- 의사결정자가 기존에 AWS(S3 + CloudFront) 기반으로 운영해왔으나, .dev 도메인 지원 문제로 대안 필요

## 결정 (Decision)

**Cloudflare Pages**를 배포 플랫폼으로 채택한다.

- 호스팅: Cloudflare Pages (정적 사이트, 어댑터 불필요)
- 도메인: Cloudflare Registrar에서 .dev 도메인 등록/관리
- CDN/SSL: Cloudflare 기본 제공 (330+ 엣지 로케이션, Universal SSL 자동 발급)

## 근거 (Rationale)

### .dev 도메인 통합 관리

Cloudflare Registrar에서 .dev 도메인 등록, DNS 설정, Pages 연결까지 한 곳에서 해결된다. 도매가(연 ~$11-13) 그대로 부과되며 마크업이 없다. .dev TLD는 HSTS preload 목록에 등재되어 HTTPS가 강제되는데, Cloudflare가 SSL 인증서 발급/갱신을 완전 자동으로 처리한다.

### 구축 간소화

AWS S3 + CloudFront 구성(버킷 → 정적 호스팅 → CloudFront → OAI → ACM → Route53)에 비해, Cloudflare Pages는 GitHub 연결 → 빌드 커맨드 입력만으로 배포가 완료된다. CI/CD도 Git push 시 자동 빌드/배포된다.

### 무료 티어 이점

| 항목 | Cloudflare Pages | AWS CloudFront |
|------|-----------------|----------------|
| 대역폭 | **무제한** | 1TB/월 후 GB당 과금 |
| 요청 수 | **무제한** | 1,000만 건/월 후 과금 |
| SSL | 자동 (무료) | ACM 무료, 설정은 수동 |
| DDoS 방어 | 기본 포함 | Shield Standard (기본) |

### 캐싱 정책

프로젝트 루트의 `_headers` 파일로 경로별 Cache-Control 설정이 가능하다. Astro가 `_astro/` 경로에 해시 파일명으로 에셋을 생성하므로, immutable 캐싱과 HTML must-revalidate 조합으로 효율적인 캐싱 전략을 구성할 수 있다. 커스텀 도메인 사용 시 대시보드의 Cache Rules로 추가 세밀 설정도 가능하다.

### 프리뷰 배포

PR 생성 시 `<hash>.<프로젝트명>.pages.dev` 형태의 프리뷰 URL이 자동 생성된다. `X-Robots-Tag: noindex`가 자동 포함되어 검색엔진 크롤링이 방지된다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| AWS S3 + CloudFront | .dev 도메인 미지원(Route 53), 설정 복잡, 대역폭 과금 |
| Vercel | 무료 대역폭 100GB/월 제한, .dev 도메인은 외부 DNS 필요 |
| Netlify | 무료 빌드 300분/월로 제한적, .dev 도메인은 외부 DNS 필요 |

## 결과 (Consequences)

- Astro SSG 빌드 출력(`dist/`)을 Cloudflare Pages에 직접 배포한다 (어댑터 불필요)
- `_headers` 파일로 캐싱 정책을 관리한다
- .dev 도메인은 Cloudflare Registrar에서 등록/관리한다
- DNS + CDN + 호스팅이 Cloudflare에 묶이는 벤더 종속을 감수한다
- Pages → Workers 통합 추세를 모니터링하되, 정적 사이트이므로 당장 영향은 없다

## 참고 자료 (References)

- [Deploy an Astro site | Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) — Astro 정적 사이트 배포 공식 가이드
- [Astro - Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) — Astro 공식 Cloudflare 배포 문서
- [Cloudflare Pages Limits](https://developers.cloudflare.com/pages/platform/limits/) — 무료 티어 제한사항
- [Cloudflare Pages Serving & Caching](https://developers.cloudflare.com/pages/configuration/serving-pages/) — 캐싱 및 헤더 설정
- [Buy .dev domains | Cloudflare Registrar](https://www.cloudflare.com/application-services/products/registrar/buy-dev-domains/) — .dev 도메인 등록
- [Preview Deployments | Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/) — PR별 프리뷰 배포
- [HSTS Settings | Cloudflare](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/) — HSTS/SSL 설정
