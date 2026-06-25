---
id: "/blog/release/v26.4.0?1782344347849"
tool: "nodejs"
title: "Node.js 26.4.0 (Current)"
link: "https://nodejs.org/en/blog/release/v26.4.0"
pubDate: 2026-06-24T23:39:07.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/release/v26.4.0"
contentType: "commentary"
summary: "Node.js 26.4.0 ships package maps, a new virtual filesystem subsystem, caller-supplied readFile buffers, TLS certificate compression, and expanded TCP keepalive options — all as semver-minor additions."
---

Node.js 26.4.0 landed on June 24, 2026, as the latest Current release. The Node.js Blog changelog lists eight semver-minor features alongside a dense batch of dependency updates, crypto improvements, and FFI work.

## What's actually new

The headline addition is **package maps** (`loader: implement package maps`), contributed by Maël Nison. This is a new loader-level feature; the commit references PR #62239, but the release notes don't elaborate on configuration surface or interaction with existing `imports`/`exports` fields in `package.json` — you'll want to read the PR for specifics.

A brand-new **`node:vfs` subsystem** also appears, with two commits from Matteo Collina: a minimal `node:vfs` module and dispatch of `node:fs/promises` to mounted VFS instances. This is worth watching if you build tooling that intercepts or virtualizes filesystem access (test runners, bundlers, embedded runtimes).

On the I/O side, `fs.readFile()` now accepts **caller-supplied buffers**, which should reduce allocation pressure in hot read paths. The `net` module gains support for `TCP_KEEPINTVL` and `TCP_KEEPCNT` in `setKeepAlive`, giving finer-grained control over TCP keepalive behavior. TLS picks up a `certificateCompression` option. And `http` now closes pre-request sockets when `closeIdleConnections` is called, tightening idle-connection hygiene.

Other notable bits: `net.BlockList` is promoted to release-candidate stability, the FFI subsystem adds fast-call support for more platforms, npm is bumped to 11.17.0, and OpenSSL's build config is updated to support compression.

## What it means for your config

**Package maps** is the one to watch from a config perspective. The feature lives in the loader layer, which means it could affect how module resolution is configured — potentially overlapping with `package.json` `imports`, TypeScript `paths`, or bundler aliases. The release notes don't specify the configuration format or whether it requires a CLI flag, so we can't give concrete guidance yet. We'll revisit once the documentation settles.

The new `node:vfs` module doesn't appear to require any configuration changes for existing projects — it's an opt-in API. Similarly, the `certificateCompression` TLS option and the extended `setKeepAlive` parameters are additive; they won't affect existing TLS or net configs unless you explicitly adopt them.

No breaking changes are listed in this release. The semver-minor designation across all notable changes means your existing `engines` field and CI matrix shouldn't need adjustment beyond what you'd normally do for a minor bump.

## Recommended next step

If you're on the Current release line, upgrade and scan the changelog for features relevant to your stack — package maps and VFS in particular are early-stage additions worth evaluating before they stabilize. If you're managing Node.js version constraints or engine fields across projects, make sure your config reflects 26.4.0 compatibility. You can use our [Node.js config generator](/en/generator/nodejs) to scaffold or update project-level settings.

---

**Read the full announcement on Node.js Blog** → [Node.js 26.4.0 (Current)](https://nodejs.org/en/blog/release/v26.4.0)