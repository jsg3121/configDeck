---
id: "/blog/release/v26.3.1?1781757519606"
tool: "nodejs"
title: "Node.js 26.3.1 (Current)"
link: "https://nodejs.org/en/blog/release/v26.3.1"
pubDate: 2026-06-18T04:38:39.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.3.1"
contentType: "commentary"
summary: "Node.js 26.3.1 is a security release addressing 11 CVEs across TLS, HTTP/2, crypto, DNS, and the permission model. Two are rated High severity, targeting hostname verification and WebCrypto cipher output."
---

Node.js 26.3.1 landed on June 18, 2026 as a security-only patch to the Current release line. The Node.js Blog lists 11 CVEs fixed, with severity ratings from Low to High, plus dependency bumps for OpenSSL, undici, and llhttp.

## What's actually new

The two High-severity fixes both deal with output integrity: CVE-2026-48618 normalizes hostnames during TLS server identity checks, and CVE-2026-48933 guards WebCrypto cipher output length. The Medium-severity batch is where the breadth is — it covers case-sensitive SNI context matching, unbounded `originSet` growth in HTTP/2, NUL-byte injection via DNS/net hostnames, proxy credential leakage in tunnel errors, and TLS session reuse being bound to the authenticated host. On the Low end, several fixes tighten the Node.js permission model: `process.chdir` handling for `writereport`, `FileHandle.utimes` disabling, and pipe open/chmod being gated behind net scope. Dependency updates include OpenSSL 3.5.7, undici 8.5.0, and llhttp 9.4.2.

Matteo Collina authored the majority of these patches — seven of the eleven CVE fixes — which tracks with his ongoing work on HTTP and TLS hardening in core.

## What it means for your config

None of these fixes introduce new configuration surface or change existing options. However, a few behavioral changes are worth noting for teams that rely on specific TLS behaviors:

- **SNI matching is now case-insensitive.** If you're supplying `SNICallback` or setting up multiple TLS contexts keyed by hostname, this fix corrects what was previously broken behavior. If your code happened to depend on the case-sensitive matching (unlikely, but possible), test after upgrading.
- **TLS session reuse is now scoped to the authenticated host.** If you're reusing TLS sessions across different hostnames through an `http.Agent` or custom pooling logic, verify that connections still behave as expected.
- **Permission model users** should note the three Low-severity fixes tightening `process.chdir`, `FileHandle.utimes`, and pipe operations. If you're running Node.js with `--experimental-permission`, these close gaps that could have allowed bypasses.

There are no new flags or config file changes required. This is a drop-in upgrade for 26.x users.

## Recommended next step

Update to 26.3.1 now — security patches with two High-severity TLS/crypto fixes shouldn't sit in a backlog. If you're on an LTS line (24.x or 22.x), check the Node.js security page for corresponding backport releases. For teams setting up new Node.js projects with proper engine constraints and configuration baselines, our generator can help: [Generate a Node.js config](/en/generator/nodejs).

---

**Read the full announcement on Node.js Blog** → [Node.js 26.3.1 (Current)](https://nodejs.org/en/blog/release/v26.3.1)