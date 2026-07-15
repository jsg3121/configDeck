---
id: "https://javascriptweekly.com/issues/794"
tool: "javascriptweekly"
title: "npm 12, TypeScript 7, and Bun in Rust"
link: "https://javascriptweekly.com/issues/794"
pubDate: 2026-07-14T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/794"
contentType: "commentary"
summary: "This JavaScript Weekly roundup covers TypeScript 7.0's final release, Bun's rewrite from Zig to Rust, and a dense set of ecosystem updates spanning Node.js 26.5, ESLint 10.7, and a supply chain attack on the jscrambler package."
---

JavaScript Weekly issue 794 packs several major ecosystem shifts into one newsletter. The headliners are TypeScript 7.0 going final, Bun's language-level rewrite from Zig to Rust, and a cluster of notable releases and security events.

## What's actually new

**TypeScript 7.0** is now the final release of the Go-powered compiler rewrite that the TypeScript team has been calling "10x faster." However, the issue flags a significant caveat: a temporary lack of a full API means many users are recommended to stay on TypeScript 6.0 for now. That's an unusual "ship it but don't adopt it yet" situation worth watching.

**Bun's Rust rewrite** gets a deep dive from creator Jarred Sumner. The port from Zig to Rust was assisted by multiple Claude Code instances, racking up roughly $165k in API usage. The Rust version underpins Bun 1.4, which is described as expected "any day now."

**Node.js 26.5.0** adds support for importing text files in ES modules via import attributes, plus `blob.textStream()`. **ESLint 10.7**, **Storybook 10.5**, and **Vite DevTools 0.4** also shipped. On the security side, the `jscrambler` npm package suffered a supply chain attack that Socket detected within six minutes. And Vercel acquired the team behind Better Auth.

A smaller but interesting item: **Ant**, a JavaScript runtime written in C that ships as a 9MB binary without V8, JSC, or SpiderMonkey, and claims very short cold start times.

## What it means for your config

The TypeScript 7.0 release is the one most likely to touch your project configs, but the recommendation to stay on 6.0 due to the incomplete API means tooling that depends on the TypeScript compiler API — think ESLint's typescript-eslint, custom transformers, or build plugins — may not work correctly yet. If your `tsconfig.json` or CI pipelines pin a TypeScript version, don't bump to 7.0 without checking whether your downstream tools have confirmed compatibility.

For Bun users, the Zig-to-Rust rewrite shouldn't change your `bunfig.toml` or runtime config in any documented way so far — Bun 1.4 isn't out yet, and the source doesn't detail config-level breaking changes. Worth monitoring once the release actually drops.

Node.js 26.5's import attributes for text files could affect how you structure module imports if you've been using workarounds (like `fs.readFileSync`) to load `.txt` or similar assets. The source doesn't specify which `type` attribute values are supported beyond text, so check the Node.js changelog before refactoring.

The `jscrambler` supply chain attack is a reminder to audit your `package-lock.json` and consider tools like Socket or `npm audit` signatures in CI. No config change per se, but if `jscrambler` is in your dependency tree, verify you're on a clean version.

## Recommended next step

If you're on TypeScript 5.x or 6.x, read the TypeScript 7.0 announcement carefully before upgrading — the performance gains are real but the API gap means your editor plugins, linters, and build tools may lag behind. For everyone else, the most actionable item this week is checking whether `jscrambler` appears anywhere in your lockfiles, and reviewing the full JavaScript Weekly issue for the items relevant to your stack.

---

**Read the full announcement on JavaScript Weekly** → [npm 12, TypeScript 7, and Bun in Rust](https://javascriptweekly.com/issues/794)