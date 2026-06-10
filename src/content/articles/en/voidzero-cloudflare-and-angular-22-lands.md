---
id: "https://javascriptweekly.com/issues/789"
tool: "javascriptweekly"
title: "VoidZero → Cloudflare, and Angular 22 lands"
link: "https://javascriptweekly.com/issues/789"
pubDate: 2026-06-09T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/789"
contentType: "commentary"
summary: "VoidZero, the company behind Vite, Vitest, Rolldown, and Oxc, is joining Cloudflare. This JavaScript Weekly roundup also covers Safari 27 beta, Electron 43 beta, the Rust port of React Compiler, and several notable releases."
---

This week's JavaScript Weekly leads with the biggest JS tooling acquisition story of the year: Evan You's VoidZero — the company behind Vite, Vitest, Rolldown, and Oxc — is joining Cloudflare. The issue also covers a dense set of runtime and compiler updates across the ecosystem.

## What's actually new

Evan You explains the move candidly: monetizing open-source tooling is hard. Under Cloudflare, all VoidZero projects remain MIT-licensed, and the existing team stays in charge. The Vite team separately announced that Cloudflare is establishing a $1 million fund to support Vite ecosystem maintainers and contributors — a concrete commitment that goes beyond the usual "we love open source" press release language.

Elsewhere in the roundup: Safari 27 beta ships a rewritten ESM loader that's now standards-compliant and improves top-level `await`, plus adds JSPI support in WebAssembly. Electron 43 beta reports significant performance gains via an embedded Node.js snapshot, V8 bytecode caching for bundles, and link-time optimization. Meta says the Rust port of React Compiler is ready to test and showing "great results," with a merge expected soon. On the releases front, TanStack Table v9 hits beta with headless data grid support across seven frameworks, Node-RED reaches 5.0, and Rolldown moves to 1.1.

Note: despite the title mentioning Angular 22, the source material doesn't include details on that release beyond listing Taiga UI 5.10 (an Angular component library) in the tools section.

## What it means for your config

The VoidZero → Cloudflare move doesn't change anything in your `vite.config.*`, `vitest.config.*`, or Rolldown configs today. MIT licensing is preserved, and the teams remain the same, so there's no migration to plan. The more interesting question is whether Cloudflare steers Vite's defaults toward Cloudflare-native deployment targets over time — but that's speculation, not something to act on now.

For Safari 27's ESM loader rewrite, if you've been working around top-level `await` bugs in Safari with bundler transformations or conditional code paths, keep an eye on the beta. Those workarounds may become removable once Safari 27 ships to stable.

The Rust React Compiler port, when merged, could eventually affect your Babel/SWC pipeline configs if you're using the JavaScript version of the compiler today. The source doesn't detail the migration path yet, so wait for Meta's official docs before touching your build config.

Rolldown 1.1 may carry config surface changes relevant to early adopters — check the changelog before upgrading if you've pinned Rolldown in your build pipeline.

## Recommended next step

If you maintain Vite plugins or contribute to the Vite ecosystem, the $1 million fund is worth investigating — the Vite team's post linked from the newsletter has details. For everyone else, this is a "watch, don't react" week: none of these announcements require immediate config changes, but the Safari ESM fix and React Compiler Rust port are both worth tracking for their eventual impact on your build and polyfill decisions. Read the full issue for links to all the original announcements.

---

**Read the full announcement on JavaScript Weekly** → [VoidZero → Cloudflare, and Angular 22 lands](https://javascriptweekly.com/issues/789)