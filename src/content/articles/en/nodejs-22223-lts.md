---
id: "/blog/release/v22.22.3?1778697903090"
tool: "nodejs"
title: "Node.js 22.22.3 (LTS)"
link: "https://nodejs.org/en/blog/release/v22.22.3"
pubDate: 2026-05-13T18:45:03.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v22.22.3"
contentType: "commentary"
summary: "Node.js 22.22.3 'Jod' is a maintenance LTS release with OpenSSL 3.5.6, updated root certificates, a batch of V8 backports, and several fixes for use-after-free and null-pointer bugs across crypto, zlib, and http2."
---

Node.js Blog published the 22.22.3 LTS release ("Jod"), stewarded by Marco Ippolito. It's a chunky maintenance drop — no new features, but a long list of dependency bumps and targeted bug fixes that production teams should pay attention to.

## What's actually new

The headline dependency updates are OpenSSL upgraded to 3.5.6, root certificates updated to NSS 3.121, npm bumped to 10.9.8, and SQLite moved to 3.52.0. There's also a significant batch of V8 cherry-picks and backports (over a dozen commits under a single PR), which suggests upstream stability fixes being pulled in bulk.

On the bug-fix side, a few entries stand out for anyone running Node in production: a use-after-free in zlib when `reset()` is called during a write, an HTTP/2 `FileHandle` leak in `respondWithFile`, a keep-alive socket reuse race condition in HTTP, and a process crash caused by a malformed UNC hostname in `pathToFileURL()`. The crypto module gets a null-pointer dereference fix when `BIO_meth_new()` fails. The ESM loader also received several corrections — notably around `require(esm)` caching, sync resolve hooks with `node:` prefixes, and CTS import handling.

The timezone database is updated to 2026a and simdjson moves to 4.5.0, both of which are routine but worth noting if you pin dependency versions in CI.

## What it means for your config

This is a patch release with no breaking changes, so your existing Node.js configuration files, `package.json` engine fields, and CI matrices shouldn't need adjustment — assuming you're already targeting the `22.x` LTS line.

The OpenSSL bump to 3.5.6 is worth flagging if you maintain custom TLS configurations or pin certificate stores. The updated root certificates (NSS 3.121) could affect applications that rely on system trust stores versus bundled ones; if you explicitly set `NODE_OPTIONS` with `--use-openssl-ca` or `--use-bundled-ca`, verify your expected behavior still holds after upgrading.

The ESM loader fixes around `require(esm)` and sync resolve hooks are relevant if you use custom loader hooks or mix CJS and ESM imports. If you've been working around odd double-invocation of resolve hooks or caching quirks, this release may let you simplify those workarounds. The announcement doesn't detail whether any hook API contracts changed, so check the linked PRs if your project relies on custom loaders.

The npm 10.9.8 bump is bundled — if you lock your npm version separately via `corepack` or `engines.npm`, update accordingly.

## Recommended next step

If you're on the 22.x LTS track, upgrade promptly — the zlib use-after-free and the `pathToFileURL()` crash fix alone justify it for any internet-facing service. Run your test suite, pay extra attention to any TLS or ESM loader integration tests, and move on. If you're setting up a new Node.js project on this LTS line, you can scaffold your configuration with our [Node.js config generator](/en/generator/nodejs).

---

**Read the full announcement on Node.js Blog** → [Node.js 22.22.3 (LTS)](https://nodejs.org/en/blog/release/v22.22.3)