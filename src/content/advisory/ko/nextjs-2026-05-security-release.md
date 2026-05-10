---
ghsaId: 'next-2026-05-release'
title: 'Next.js 2026-05 통합 보안 릴리즈 (13건)'
severity: 'high'
cvssScore: 7.5
ecosystem: 'npm'
package: 'next'
affected:
  - range: '>=16.0.0 <16.2.5'
  - range: '>=15.0.0 <15.5.16'
patched:
  - '15.5.16'
  - '16.2.5'
publishedAt: 2026-05-06
updatedAt: 2026-05-09
status: 'active'
references:
  - label: 'Vercel — Next.js May 2026 security release'
    url: 'https://vercel.com/changelog/next-js-may-2026-security-release'
  - label: 'Netlify — May 2026 React/Next.js 보안 분석'
    url: 'https://www.netlify.com/changelog/2026-05-08-react-nextjs-security-vulnerabilities/'
  - label: 'Cloudflare — WAF/어댑터 완화'
    url: 'https://developers.cloudflare.com/changelog/post/2026-05-06-react-nextjs-vulnerabilities/'
  - label: 'GitHub Advisory Database'
    url: 'https://github.com/advisories'
summary: '2026년 5월 6일 Next.js와 React Server Components 의 13개 보안 권고가 함께 공개됐습니다. 미들웨어/프록시 우회, SSRF, 캐시 포이즈닝, XSS, DoS 카테고리에 걸친 다중 권고이며, Next.js 15.5.16 / 16.2.5 한 번의 업그레이드로 모두 해소됩니다.'
---

## 이 페이지의 위치

이 advisory 는 2026년 5월 6일 Next.js 팀이 한 번에 공개한 **13건의 통합 보안 릴리즈**를 한 페이지에서 한눈에 보기 위한 허브입니다. 13건 모두 Next.js `15.5.16` / `16.2.5` 한 번의 업그레이드로 해소됩니다. 진단기 영역에 사용 중인 Next.js 버전을 입력하면 영향 여부를 즉시 확인할 수 있습니다.

각 권고 중 ConfigDeck 가 별도 페이지를 운영하는 항목은 표 우측 링크로 연결됩니다. 그 외 항목은 Vercel/GitHub Advisory 의 원본을 직접 참조하시면 됩니다.

## 카테고리별 13건 요약

### 미들웨어 / 프록시 우회 (5건)

| GHSA | 제목 | 심각도 |
|---|---|---|
| [GHSA-267c-6grr-h53f](https://github.com/advisories/GHSA-267c-6grr-h53f) | App Router segment-prefetch URL 인증 우회 | High — [상세](./nextjs-cve-2026-44575) |
| [GHSA-26hh-7cqf-hhc6](https://github.com/advisories/GHSA-26hh-7cqf-hhc6) | App Router segment-prefetch 우회 (불완전 패치 후속) | High |
| [GHSA-36qx-fr4f-26g5](https://github.com/advisories/GHSA-36qx-fr4f-26g5) | Pages Router 기본 로케일 경로의 프록시 인증 우회 | High |
| [GHSA-492v-c6pp-mqqv](https://github.com/advisories/GHSA-492v-c6pp-mqqv) | 동적 라우트 파라미터 주입을 통한 우회 | High |
| [GHSA-3g8h-86w9-wvmq](https://github.com/advisories/GHSA-3g8h-86w9-wvmq) | 미들웨어 리다이렉트의 캐시 포이즈닝 가능성 | Low |

### 서비스 거부(DoS) (3건)

| GHSA | 제목 | 심각도 |
|---|---|---|
| [GHSA-rv78-f8rc-xrxh](https://github.com/advisories/GHSA-rv78-f8rc-xrxh) | React Server Components 의 DoS (CVE-2026-23870) | High — [상세](./react-cve-2026-23870) |
| [GHSA-mg66-mrh9-m8jx](https://github.com/advisories/GHSA-mg66-mrh9-m8jx) | Cache Components 의 커넥션 고갈 DoS | High |
| [GHSA-h64f-5h5j-jqjh](https://github.com/advisories/GHSA-h64f-5h5j-jqjh) | Image Optimization API 의 DoS | Moderate |

### 서버 사이드 요청 위조(SSRF) (1건)

| GHSA | 제목 | 심각도 |
|---|---|---|
| [GHSA-c4j6-fc7j-m34r](https://github.com/advisories/GHSA-c4j6-fc7j-m34r) | WebSocket 업그레이드 환경의 SSRF | High |

### 캐시 포이즈닝 (2건)

| GHSA | 제목 | 심각도 |
|---|---|---|
| [GHSA-wfc6-r584-vfw7](https://github.com/advisories/GHSA-wfc6-r584-vfw7) | RSC 응답의 캐시 포이즈닝 | Moderate |
| [GHSA-vfv6-92ff-j949](https://github.com/advisories/GHSA-vfv6-92ff-j949) | RSC cache-busting 충돌을 통한 캐시 포이즈닝 | Low |

### 크로스 사이트 스크립팅(XSS) (2건)

| GHSA | 제목 | 심각도 |
|---|---|---|
| [GHSA-ffhc-5mcf-pf4q](https://github.com/advisories/GHSA-ffhc-5mcf-pf4q) | CSP nonce 사용 App Router 환경의 XSS | Moderate |
| [GHSA-gx5p-jg67-6x7h](https://github.com/advisories/GHSA-gx5p-jg67-6x7h) | beforeInteractive 스크립트와 untrusted input 의 XSS | Moderate |

## 공통 영향 범위 / 패치

이 통합 릴리즈에서 영향받는 Next.js 버전 범위는 권고마다 다소 다르지만, 다음 두 라인의 최신 패치 버전으로 업그레이드하면 13건이 모두 해소됩니다.

```bash
# 15.x 라인
npm install next@15.5.16

# 16.x 라인
npm install next@16.2.5

# 또는 최신 안정 버전
npm install next@latest
```

> Next.js 13.x / 14.x 라인은 일부 권고에서만 영향을 받습니다. 사용 중인 메이저가 13.x / 14.x 라면 GitHub Advisory Database 의 각 GHSA 페이지에서 본인 메이저가 영향 범위에 포함되는지 직접 확인하세요. 단, 두 라인 모두 메인스트림 지원이 끝나가는 시점이므로 가능하면 15.5.16 / 16.2.5 로 마이그레이션을 권장합니다.

## 우선순위 가이드

5월 통합 릴리즈의 13건을 모두 동등하게 다룰 필요는 없습니다. 다음 우선순위로 검토하시면 효율적입니다.

1. **즉시 패치 적용**: 미들웨어/프록시 우회 5건 + DoS 3건 (인증 우회와 가용성 직격은 사고 영향이 가장 큼)
2. **App Router + 외부 노출이 있다면**: SSRF 1건 + 캐시 포이즈닝 2건 (캐시 계층이 있는 경우 특히 주의)
3. **CSP / 외부 입력 처리에 의존한다면**: XSS 2건

세 단계 모두 동일한 패치(`15.5.16` / `16.2.5`)로 해결되므로, 실제 작업은 단일 업그레이드 + 회귀 테스트 1회로 끝납니다.

## 정리

이 통합 advisory 는 5월 6일 한 번에 공개된 권고들을 카테고리별로 정리해 한눈에 파악할 수 있도록 한 가이드입니다. 진단기에서 사용 중인 Next.js 버전이 영향 범위에 포함되는지 즉시 확인하고, 패치 버전으로 업그레이드한 뒤 회귀 테스트를 수행하시면 13건 전체가 한 번에 해소됩니다.
