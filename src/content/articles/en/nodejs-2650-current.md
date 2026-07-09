---
id: "/blog/release/v26.5.0?1783512035116"
tool: "nodejs"
title: "Node.js 26.5.0 (Current)"
link: "https://nodejs.org/en/blog/release/v26.5.0"
pubDate: 2026-07-08T12:00:35.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.5.0"
contentType: "commentary"
summary: "Node.js 26.5.0 ships five SEMVER-MINOR additions including blob.textStream(), an --experimental-import-text flag, event loop delay sampling in perf_hooks, exposed ReadableStreamTee, and TLS group negotiation reporting. Addon import support is now enabled by default."
---

Node.js 26.5.0 (Current) landed on July 8, 2026, with a handful of semver-minor features and a long tail of dependency updates, security hardening, and doc fixes. The release was announced on the Node.js Blog by Richard Lau.

## What's actually new

Five features carry the SEMVER-MINOR label. `blob.textStream()` lands in the buffer module, giving you a streaming text interface on Blob objects. The ESM loader gains `--experimental-import-text`, a new flag for importing text content — details on exact usage are in the linked PR. `perf_hooks` now samples delay per event loop iteration, which should give more granular diagnostics than the existing event loop utilization API. The streams module exposes `ReadableStreamTee`, and the TLS module can now report negotiated TLS groups.

Beyond the flagged features, a notable default-on change: import support for native addons is now enabled by default (previously behind a flag). The release also bumps undici to 8.7.0, SQLite to 3.53.3, and nghttp3 to 1.17.0. On the security side, there are fixes for large DH generator validation, rejection of small-order EdDSA points during verify, and a fix for permission model propagation via `NODE_OPTIONS` in child_process. The inspector also gets a crash fix for writes to closed sockets.

One meta note: Stewart X Addison has been added as a releaser, so future releases may carry a new GPG signing key. If you verify release signatures in CI, you'll want to add that key.

## What it means for your config

The `--experimental-import-text` flag is the most config-relevant addition. If you use Node.js CLI flags in your `package.json` (via `--node-options`), `.env` files, or CI scripts, this is a new opt-in you may want to track. Since it's experimental, it's unlikely to affect existing setups unless you explicitly adopt it.

The default-on addon import support could matter if you have projects that previously needed the `--experimental-addon-imports` flag (or equivalent). If you were passing that flag, you can likely remove it now — but verify against the PR notes before cleaning up CI configs.

For TLS configuration, the new negotiated group reporting doesn't change how you configure TLS options, but it gives you better observability into what your connections actually negotiated. Useful for auditing, not something that requires config changes.

The announcement doesn't detail any breaking changes to existing config files or module resolution behavior. If you're on the 26.x Current line, this should be a straightforward update. If you're managing Node.js version configs across projects, this is a good time to pin or test against 26.5.0 — [Generate a Node.js config](/en/generator/nodejs) can help scaffold a starting point.

## Recommended next step

If you're tracking Node.js Current releases, update a non-production environment to 26.5.0 and verify your test suite passes, paying particular attention to any native addon imports and TLS-dependent tests. Check whether you're passing any flags that are now default-on and clean up accordingly. For the new `--experimental-import-text` flag, wait for the feature to stabilize before baking it into shared configs — but it's worth experimenting with locally if text-based imports fit your workflow.

---

**Read the full announcement on Node.js Blog** → [Node.js 26.5.0 (Current)](https://nodejs.org/en/blog/release/v26.5.0)