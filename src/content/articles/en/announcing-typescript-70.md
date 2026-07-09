---
id: "https://devblogs.microsoft.com/typescript/?p=5246"
tool: "typescript"
title: "Announcing TypeScript 7.0"
link: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/"
pubDate: 2026-07-08T15:58:29.000Z
sourceName: "Microsoft TypeScript Blog"
sourceUrl: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/"
contentType: "commentary"
summary: "TypeScript 7.0 ships as a native Go port delivering 8x–12x build speedups, LSP-based editor support, and a side-by-side compatibility path with TypeScript 6.0 via the @typescript/typescript6 package."
---

Microsoft's TypeScript team has released TypeScript 7.0, the long-anticipated native port of the compiler rewritten in Go. The announcement on the Microsoft TypeScript Blog includes real-world benchmarks, production adoption stories, and details on the transition from TypeScript 6.

## What's actually new

TypeScript 7.0 is a faithful port of the original codebase to Go, gaining native code speed and shared memory multithreading. The team reports build speedups between 8x and 12x on full builds across major open-source codebases — for example, the VS Code project dropping from 125.7s to 10.6s (11.9x). Memory usage also decreases, ranging from 6% to 26% lower depending on the project. Editor experience sees similar gains: time-to-first-error in the VS Code codebase went from ~17.5 seconds to under 1.3 seconds. TypeScript 7 now uses the language server protocol (LSP) instead of the previous custom protocol, meaning any LSP-compatible editor should work. Stability data from the team shows the new language server reduced failing commands by over 80% and server crashes by over 60% compared to TypeScript 6.0.

## What it means for your config

Installation is unchanged — `npm install -D typescript` pulls TypeScript 7 and gives you the `tsc` binary. Your existing `tsconfig.json` is not called out as needing changes; the port was designed to maintain structure and logic compatibility with the original compiler.

The big config-adjacent detail: **TypeScript 7.0 does not ship with a public API.** If your toolchain relies on programmatic access to the compiler — `typescript-eslint` is the obvious example — you'll need to run TypeScript 6 side-by-side. Microsoft has published `@typescript/typescript6` as a compatibility package that provides a `tsc6` binary and re-exports the 6.0 API. TypeScript 7.1 is expected to introduce a new (and different) API, so tools depending on the current API will need to update eventually. If you maintain custom transforms, lint rules, or code generators that import from `typescript`, don't drop 6.x from your dependencies yet.

For editor setup, VS Code has a dedicated extension for TypeScript 7; Visual Studio enables it automatically based on your workspace. Other editors should pick it up via LSP. Check your editor's docs for specifics.

The announcement doesn't detail any changes to compiler options, `tsconfig.json` schema, or breaking behavioral differences in type-checking. We'll revisit once the full migration guide and 7.0 release notes with option-level detail are available.

## Recommended next step

Install TypeScript 7 in a non-critical project and run `tsc` to compare build times against your current setup. If you use `typescript-eslint` or other API-dependent tools, install `@typescript/typescript6` alongside it and verify your lint and build pipelines still pass. For anyone setting up a fresh TypeScript project, you can [generate a TypeScript config](/en/generator/tsconfig) as a starting point — your existing options should carry over, but it's a good moment to audit what you actually need.

---

**Read the full announcement on Microsoft TypeScript Blog** → [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)