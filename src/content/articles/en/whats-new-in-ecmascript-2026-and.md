---
id: "https://javascriptweekly.com/issues/793"
tool: "javascriptweekly"
title: "What's new in ECMAScript 2026 (and usable today)"
link: "https://javascriptweekly.com/issues/793"
pubDate: 2026-07-07T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/793"
contentType: "commentary"
summary: "ECMAScript 2026's 876-page spec was approved, with features like Array.fromAsync and native Uint8Array Base64/Hex conversion already shipping in browsers and runtimes. JavaScript Weekly's latest issue rounds up the highlights alongside notable releases including webpack-dev-server 6.0 and shadcn/ui's switch to Base UI."
---

JavaScript Weekly issue 793 covers the approval of the ECMAScript 2026 spec and highlights several features that are already usable today. The issue also packs in a dense set of ecosystem updates worth a ConfigDeck-lens look.

## What's actually new

The ECMAScript 2026 spec — 876 pages — was approved last week. Pawel Grzybek's linked roundup covers the main additions, including `Array.fromAsync` and native `Uint8Array` Base64/Hex conversion. Nearly everything is already shipping in browsers and runtimes, with `Math.sumPrecise` in Node being the noted exception. Beyond the spec itself, this issue surfaces several releases with config implications: webpack-dev-server 6.0 upgrades to Express 5 and native ESM, Cloudflare's `vinext` 1.0 Beta reimplements Next.js's API surface as a Vite plugin, and shadcn/ui has switched its default component library from Radix to Base UI (Radix remains supported but Base UI is now recommended for new projects). There's also a TC39 proposal to standardize a `code` property on `Error`, formalizing what's long been a de-facto Node convention.

## What it means for your config

The webpack-dev-server 6.0 upgrade to Express 5 and native ESM is the item most likely to touch your config files directly. If you're running a `devServer` block in your webpack config with Express 4 middleware or CommonJS-only plugins, expect breakage — though the source doesn't detail specific migration steps, so check the release notes before upgrading.

The `vinext` beta is interesting for teams currently juggling `next.config.js` alongside Cloudflare Workers config. It reimplements Next.js's API surface on Vite, which means your build config story could simplify if you're deploying to Cloudflare — but it's a beta, so treat it accordingly.

For shadcn/ui users: switching from Radix to Base UI as the default doesn't force an immediate migration — Radix is still supported. But new projects scaffolded with shadcn/ui will pull in Base UI, so your component-level dependencies and any related config (bundler aliases, tree-shaking settings) may shift over time.

The ECMAScript 2026 features themselves don't require config changes. They're spec-level additions already in engines, so your `tsconfig.json` target or ESLint ecmaVersion settings shouldn't need adjustment to use them — though if you're still targeting older environments via Babel, you may want to verify plugin coverage for `Array.fromAsync` and the Uint8Array methods.

## Recommended next step

If you're on webpack-dev-server 5.x, read the 6.0 changelog before bumping — the Express 5 and ESM shift is the kind of thing that breaks silently in CI. For the ECMAScript 2026 features, Grzybek's original roundup includes examples for each addition; skim it to see which ones you can drop polyfills for today. And if you're starting a new shadcn/ui project, go with Base UI as the default unless you have specific Radix dependencies — fighting upstream defaults is never worth the maintenance cost.

---

**Read the full announcement on JavaScript Weekly** → [What's new in ECMAScript 2026 (and usable today)](https://javascriptweekly.com/issues/793)