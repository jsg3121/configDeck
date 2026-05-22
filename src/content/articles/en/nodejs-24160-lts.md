---
id: "/blog/release/v24.16.0?1779369943186"
tool: "nodejs"
title: "Node.js 24.16.0 (LTS)"
link: "https://nodejs.org/en/blog/release/v24.16.0"
pubDate: 2026-05-21T13:25:43.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v24.16.0"
contentType: "commentary"
summary: "The first LTS point release for Node.js 24 'Krypton' lands with UUIDv7 generation, abortable fs.stat(), test order randomization, and a hardened HTTP client request options merge."
---

Node.js 24.16.0, codenamed 'Krypton', shipped on May 21, 2026 as a semver-minor LTS update. The release was announced on the Node.js Blog and includes a dense set of additions across crypto, fs, http, the built-in test runner, and the debugger.

## What's actually new

The headline addition is `crypto.randomUUIDv7()`, giving you a native, sortable UUID without reaching for a userland package. The `fs` module picks up an `AbortSignal`-compatible `signal` option on `fs.stat()` and now exposes the `frsize` field from `statfs`. On the HTTP side, `IncomingMessage` gains a `req.signal` property, and `ClientRequest` options merging has been hardened — Matteo Collina's name on that commit suggests it's security-adjacent, so read the linked PR if you proxy or modify request options programmatically.

The built-in test runner continues to mature: you can now randomize test execution order, `mock.timers` supports `AbortSignal.timeout`, and the mock timeout API has been aligned. The debugger gets "edit-free runtime expression probes" in `node inspect`, which lets you attach log-like probes to running code without modifying source files.

Under the hood, dependency bumps are substantial: OpenSSL 3.5.6, SQLite 3.53.0, npm 11.13.0, undici 7.25.0, ICU 78.3, and libuv 1.52.1. There's also a new `util` feature that lets you colorize text output with hex colors via `util.styleText`.

## What it means for your config

None of the semver-minor features introduce new config file formats or require changes to existing `package.json` / `tsconfig.json` / `.npmrc` setups. However, a few things are worth noting:

- **Test runner randomization**: If you're using the built-in test runner and your tests have hidden order dependencies, enabling randomization will surface them. The announcement doesn't specify the exact CLI flag or config option — check the linked PR (#61747) before adopting.
- **`req.signal` on `IncomingMessage`**: If you have middleware or framework config that manually wires up abort controllers for incoming requests, this native signal may simplify or conflict with that wiring. Worth auditing.
- **Hardened `ClientRequest` options merge**: If you're doing anything creative with HTTP agent options — custom proxy configs, patched `http.request` calls — verify that the stricter merge behavior doesn't reject options you were passing before.
- **OpenSSL 3.5.6**: If your deployment pins OpenSSL versions or uses custom TLS config (e.g., `--openssl-config`), confirm compatibility.

The announcement doesn't detail breaking interactions with bundler or linter configs. If you're managing Node.js version constraints in your project, updating the `engines` field in `package.json` to include `>=24.16.0` is the standard move once you've validated.

## Recommended next step

Pin or test against 24.16.0 in CI before rolling it to production. If you're still on Node.js 22 LTS, this release doesn't change your upgrade timeline — but the native UUIDv7 and `req.signal` additions are the kind of small wins that accumulate into a compelling reason to move. If you need to scaffold or update your Node.js project configuration, try our [Node.js config generator](/en/generator/nodejs).

---

**Read the full announcement on Node.js Blog** → [Node.js 24.16.0 (LTS)](https://nodejs.org/en/blog/release/v24.16.0)