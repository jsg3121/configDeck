---
id: "/blog/release/v26.3.0?1780319508265"
tool: "nodejs"
title: "Node.js 26.3.0 (Current)"
link: "https://nodejs.org/en/blog/release/v26.3.0"
pubDate: 2026-06-01T13:11:48.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.3.0"
contentType: "commentary"
summary: "Node.js 26.3.0 ships a larger default Buffer pool, a new permission.drop API, configurable HTTP header validation, updated root certificates, and a heads-up about the future of macOS universal binaries."
---

Node.js 26.3.0 landed on June 1 as the latest Current release. The Node.js Blog post covers five semver-minor additions alongside a notable advisory about macOS Intel support and a hefty batch of QUIC and crypto improvements.

## What's actually new

The default `Buffer.poolSize` jumps from its previous value to 64 KiB, contributed by Matteo Collina. This is a silent performance-relevant change — any code that relies on the old default or manually sets `Buffer.poolSize` should take note. A new `httpValidation` option lets you configure how HTTP header values are validated, giving more control over strictness. The inspector module now exposes precise coverage start to the JS runtime, useful for tooling that needs fine-grained code coverage data. On the security side, `permission.drop` is a new API that allows a running process to voluntarily relinquish permissions it was granted at startup — and the `--permission` flag has dropped its `--experimental` prefix, signaling the permission model is now considered stable. Root certificates are updated to NSS 3.123.1.

Beyond the semver-minor items, the release includes crypto hardening against prototype pollution in WebCrypto, a pile of QUIC work (rate limiting, hostname verification, stream idle timeouts, block list support, and multiple UAF fixes), and a Windows build change swapping LTCG for Thin LTO in release builds. There's also early-stage Rust toolchain configuration for Windows builds.

The macOS advisory is worth reading carefully: Apple's ecosystem is moving away from Intel, and the Node.js project warns it may not be able to ship universal (ARM + x86_64) binaries for the entire lifespan of v26. For now, universal binaries continue, but teams pinned to Intel Macs should plan accordingly.

## What it means for your config

The `Buffer.poolSize` increase to 64 KiB shouldn't require config changes unless you've explicitly tuned it or have memory-sensitive workloads where the larger pool matters. If you set `Buffer.poolSize` manually in application startup code, verify whether your value still makes sense relative to the new default.

The `--permission` flag losing its experimental prefix means you can reference it in production launch configs and CI scripts without the `--experimental` prefix. If you were using `--experimental-permission`, check whether the old flag is still accepted or if you need to update your scripts — the announcement doesn't specify deprecation of the old form, so verify against the docs.

The new `permission.drop` API is relevant if you're building least-privilege Node.js services: you can now grant broad permissions at startup and narrow them programmatically once initialization is complete. This interacts directly with how you structure your `--permission` and `--allow-*` flags.

The `httpValidation` option may matter if you proxy untrusted traffic and previously relied on Node's default strictness (or lack thereof). The announcement doesn't detail the available validation modes, so consult the HTTP docs before toggling it.

## Recommended next step

If you're on the Node.js 26.x Current track, upgrade and audit any explicit `Buffer.poolSize` settings and `--experimental-permission` flags in your launch configs. Teams using the permission model in production should explore `permission.drop` for tighter runtime sandboxing. For generating or reviewing your Node.js project configuration, try [Generate a Node.js config](/en/generator/nodejs).

---

**Read the full announcement on Node.js Blog** → [Node.js 26.3.0 (Current)](https://nodejs.org/en/blog/release/v26.3.0)