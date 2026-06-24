---
id: "/blog/release/v24.18.0?1782256361150"
tool: "nodejs"
title: "Node.js 24.18.0 (LTS)"
link: "https://nodejs.org/en/blog/release/v24.18.0"
pubDate: 2026-06-23T23:12:41.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v24.18.0"
contentType: "commentary"
summary: "Node.js 24.18.0 'Krypton' LTS lands with a larger default Buffer pool, new Web Cryptography algorithms, HTTP 1xx support, and a substantial batch of crypto hardening work."
---

The Node.js Blog has published the 24.18.0 release under the 'Krypton' LTS line. It's a chunky minor release with several semver-minor features and a notably crypto-heavy commit list driven largely by Filip Skokan's ongoing Web Cryptography work.

## What's actually new

The headline feature for performance-sensitive workloads is `Buffer.poolSize` defaulting to 64 KiB (up from the previous default). Matteo Collina also contributed a change to avoid attaching stream listeners on idle HTTP agent sockets, which targets connection reuse overhead.

On the crypto side, this release adds TurboSHAKE and KangarooTwelve as Web Cryptography algorithms, wires up ML-DSA, ML-KEM, ChaCha20-Poly1305, and AES-KW for BoringSSL environments, and hardens CryptoKey/KeyObject internal slots against prototype pollution. JWK support for ML-KEM and SLH-DSA key types is also included. Root certificates are updated to NSS 3.123.1.

For HTTP, there's a new `writeInformation` method that lets you send arbitrary 1xx status codes — useful if you've been working around the lack of interim response support. The inspector module now exposes precise coverage start to the JS runtime. Dependency bumps include npm 11.16.0 and SQLite 3.53.1.

A revert is worth noting: `stream: noop pause/resume on destroyed streams` was rolled back, so if you were relying on that behavior (or working around it), check your stream handling code.

## What it means for your config

The `Buffer.poolSize` increase is the most config-adjacent change here. If you've been explicitly setting `Buffer.poolSize` in your application startup to tune memory allocation, the new default may make that unnecessary — or you may want to keep your explicit value if you're targeting constrained environments. Review any startup scripts or Node.js flags files where you've tuned this.

The `--permission` flag documentation now drops the `--experimental` prefix, suggesting the permission model is considered stable. If you've been gating permission-model configs behind experimental feature checks, that gate can likely be removed.

The new `--enable-all-experimentals` build flag appeared in the commits — relevant if you maintain custom Node.js builds and want a single toggle for experimental features rather than enumerating them individually.

For the crypto changes: if your project uses Web Crypto and you target BoringSSL (common in Electron or Cloudflare Workers-adjacent toolchains), the expanded algorithm support may let you drop polyfills or third-party crypto libraries from your dependency config. The announcement doesn't detail specific configuration surface for the new algorithms beyond the API — check the linked PRs for usage details.

No breaking changes are called out explicitly, but the stream revert and the `Buffer.poolSize` default change are worth validating in your test suite before rolling to production.

## Recommended next step

If you're on the Node.js 24.x LTS track, update and run your test suite — the `Buffer.poolSize` default change and the stream revert are the two most likely to surface behavioral differences. For projects setting up a fresh Node.js environment, our generator can scaffold an initial config with the current LTS target: [Generate a Node.js config](/en/generator/nodejs).

---

**Read the full announcement on Node.js Blog** → [Node.js 24.18.0 (LTS)](https://nodejs.org/en/blog/release/v24.18.0)