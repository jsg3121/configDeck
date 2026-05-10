---
ghsaId: 'next-2026-05-release'
title: 'Next.js May 2026 Coordinated Security Release (13 advisories)'
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
  - label: 'Netlify — May 2026 React/Next.js security analysis'
    url: 'https://www.netlify.com/changelog/2026-05-08-react-nextjs-security-vulnerabilities/'
  - label: 'Cloudflare — WAF and adapter mitigations'
    url: 'https://developers.cloudflare.com/changelog/post/2026-05-06-react-nextjs-vulnerabilities/'
  - label: 'GitHub Advisory Database'
    url: 'https://github.com/advisories'
summary: 'On May 6, 2026 the Next.js team released a coordinated set of 13 security advisories spanning middleware/proxy bypass, SSRF, cache poisoning, XSS, and DoS. A single upgrade to Next.js 15.5.16 / 16.2.5 resolves all of them.'
---

## What this page is

This advisory is a hub for the **13 coordinated advisories** the Next.js team published on May 6, 2026. All 13 are resolved by a single upgrade to Next.js `15.5.16` / `16.2.5`. Use the diagnosis above to instantly check whether your installed version falls in the affected range.

For advisories where ConfigDeck operates a dedicated page, the table includes a link to the deep-dive. For the rest, follow the GitHub Advisory link directly.

## Per-category breakdown (13 advisories)

### Middleware / proxy bypass (5)

| GHSA | Title | Severity |
|---|---|---|
| [GHSA-267c-6grr-h53f](https://github.com/advisories/GHSA-267c-6grr-h53f) | Auth bypass via App Router segment-prefetch URL | High — [details](./nextjs-cve-2026-44575) |
| [GHSA-26hh-7cqf-hhc6](https://github.com/advisories/GHSA-26hh-7cqf-hhc6) | App Router segment-prefetch bypass (incomplete-fix follow-up) | High |
| [GHSA-36qx-fr4f-26g5](https://github.com/advisories/GHSA-36qx-fr4f-26g5) | Pages Router default-locale proxy authorization bypass | High |
| [GHSA-492v-c6pp-mqqv](https://github.com/advisories/GHSA-492v-c6pp-mqqv) | Bypass via dynamic route parameter injection | High |
| [GHSA-3g8h-86w9-wvmq](https://github.com/advisories/GHSA-3g8h-86w9-wvmq) | Middleware redirects can be cache-poisoned | Low |

### Denial of service (3)

| GHSA | Title | Severity |
|---|---|---|
| [GHSA-rv78-f8rc-xrxh](https://github.com/advisories/GHSA-rv78-f8rc-xrxh) | DoS in React Server Components (CVE-2026-23870) | High — [details](./react-cve-2026-23870) |
| [GHSA-mg66-mrh9-m8jx](https://github.com/advisories/GHSA-mg66-mrh9-m8jx) | DoS via connection exhaustion in Cache Components | High |
| [GHSA-h64f-5h5j-jqjh](https://github.com/advisories/GHSA-h64f-5h5j-jqjh) | DoS via Image Optimization API | Moderate |

### Server-side request forgery (1)

| GHSA | Title | Severity |
|---|---|---|
| [GHSA-c4j6-fc7j-m34r](https://github.com/advisories/GHSA-c4j6-fc7j-m34r) | SSRF in WebSocket-upgrade applications | High |

### Cache poisoning (2)

| GHSA | Title | Severity |
|---|---|---|
| [GHSA-wfc6-r584-vfw7](https://github.com/advisories/GHSA-wfc6-r584-vfw7) | Cache poisoning in RSC responses | Moderate |
| [GHSA-vfv6-92ff-j949](https://github.com/advisories/GHSA-vfv6-92ff-j949) | Cache poisoning via RSC cache-busting collisions | Low |

### Cross-site scripting (2)

| GHSA | Title | Severity |
|---|---|---|
| [GHSA-ffhc-5mcf-pf4q](https://github.com/advisories/GHSA-ffhc-5mcf-pf4q) | XSS in App Router with CSP nonces | Moderate |
| [GHSA-gx5p-jg67-6x7h](https://github.com/advisories/GHSA-gx5p-jg67-6x7h) | XSS in beforeInteractive scripts with untrusted input | Moderate |

## Shared affected range / patch

Affected ranges differ slightly per advisory, but upgrading to the latest patch on either supported line resolves all 13.

```bash
# 15.x line
npm install next@15.5.16

# 16.x line
npm install next@16.2.5

# Or latest stable
npm install next@latest
```

> Next.js 13.x / 14.x are affected only by a subset of these advisories. If you are still on those majors, check each GHSA page in the GitHub Advisory Database to confirm whether your major is in scope. Both lines are reaching the end of mainstream support, so migrating to 15.5.16 / 16.2.5 is recommended where possible.

## Prioritization guide

You do not need to treat all 13 with the same urgency. Recommended order:

1. **Patch immediately**: The 5 middleware/proxy bypass advisories + 3 DoS advisories — auth bypass and availability impact are the highest-blast-radius incidents.
2. **If using App Router with public exposure**: The 1 SSRF advisory + 2 cache-poisoning advisories — especially relevant when a CDN/cache layer sits in front.
3. **If you rely on CSP or untrusted input handling**: The 2 XSS advisories.

All three tiers are resolved by the same patch (`15.5.16` / `16.2.5`), so the actual change is a single upgrade plus a regression pass.

## Summary

This page collects the May 6, 2026 coordinated advisories into a single, browsable view. Use the diagnosis to verify whether your installed Next.js version falls in the affected range, upgrade to the patched line, run your regression suite, and you address all 13 in one cycle.
