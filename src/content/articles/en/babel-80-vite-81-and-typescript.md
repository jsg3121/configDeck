---
id: "https://javascriptweekly.com/issues/791"
tool: "javascriptweekly"
title: "Babel 8.0, Vite 8.1, and TypeScript 7.0 RC"
link: "https://javascriptweekly.com/issues/791"
pubDate: 2026-06-23T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/791"
contentType: "commentary"
summary: "JavaScript Weekly #791 bundles major releases across the JS toolchain: Babel 8.0 goes ESM-only targeting ES2023+, Vite 8.1 adds experimental bundled dev mode, TypeScript 7.0 RC lands the Go-powered compiler, and Astro 7.0 moves to a Rust pipeline."
---

JavaScript Weekly issue #791 is one of those stacked editions where half the ecosystem ships at once. Babel 8.0, TypeScript 7.0 RC, Vite 8.1, Astro 7.0, and Deno 2.9's new desktop app capabilities all landed in the same digest.

## What's actually new

**Babel 8.0** is the first major in eight years. The headline config changes: it's now ESM-only and defaults to targeting ~ES2023 instead of ES5. Despite competition from SWC and Oxc, the Babel team notes that weekly downloads of @babel packages have grown 380x since 7.0.

**TypeScript 7.0 RC** brings the Go-powered compiler closer to stable, promising roughly 10x faster build performance. **Vite 8.1** introduces experimental "bundled dev mode," which aims to dramatically speed up dev server startup and full reloads on large projects, plus WASM/ESM integration support. **Astro 7.0** routes .astro compilation and Markdown/MDX processing through a Rust-powered pipeline for faster builds, and ships an Advanced Routing API for full request pipeline control.

On the runtime side, **Deno 2.9** adds `deno desktop` for building self-contained desktop apps using either OS-native WebView or bundled Chromium — with cross-compilation and framework support for Next.js and SvelteKit baked in. The newsletter editor notes a `--compress` flag that shrank a basic app from 65MB to 19MB.

Also worth flagging: **pnpm 11.7/11.8** adds `--dry-run` for installs and `--frozen-store` for read-only package stores, and multiple Node.js releases landed (v26.3.1 Current, v24.17.0 LTS, v22.23.0 LTS).

## What it means for your config

Babel 8.0 going ESM-only is the biggest config-breaking change in this batch. If your `babel.config.js` uses CommonJS (`module.exports`), you'll need to either rename it to `.mjs` or convert to ESM syntax. The new ES2023 default target also means your `targets` or `browserslist` config matters more than ever — if you still need to support older browsers, you'll have to be explicit about it rather than relying on Babel's old ES5 default.

For Vite 8.1, the bundled dev mode is experimental, so it likely requires an opt-in flag in `vite.config.ts`. The source doesn't detail the exact configuration surface yet; check Vite's docs before enabling it on production projects.

TypeScript 7.0's Go-powered compiler should be a drop-in for most `tsconfig.json` setups — the focus is on speed, not config schema changes — but RC status means edge cases may still exist. Astro 7.0's Rust pipeline and new routing API will almost certainly require config and middleware updates for existing Astro projects; refer to Astro's migration guide for specifics.

If you use pnpm, the new `--frozen-store` flag is relevant for CI configurations where you want to guarantee no writes to the package store during builds.

## Recommended next step

Prioritize the Babel 8.0 migration if you're still on v7 — the ESM-only shift will eventually ripple through the plugin ecosystem, and it's better to hit those issues now while workarounds are fresh in community discussions. For TypeScript 7.0, try the RC against your actual codebase to validate the speed claims and catch any compilation differences before the stable release. For everything else, read the individual release notes linked from the newsletter — this issue is unusually dense with actionable upgrades.

---

**Read the full announcement on JavaScript Weekly** → [Babel 8.0, Vite 8.1, and TypeScript 7.0 RC](https://javascriptweekly.com/issues/791)