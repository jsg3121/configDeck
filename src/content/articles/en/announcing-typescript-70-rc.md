---
id: "https://devblogs.microsoft.com/typescript/?p=5203"
tool: "typescript"
title: "Announcing TypeScript 7.0 RC"
link: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/"
pubDate: 2026-06-18T14:31:17.000Z
sourceName: "Microsoft TypeScript Blog"
sourceUrl: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/"
contentType: "commentary"
summary: "TypeScript 7.0 RC ships a compiler fully rewritten in Go, reporting roughly 10x speed over TypeScript 6.0. New CLI flags for parallel type-checking and project building give teams direct control over concurrency trade-offs."
---

Microsoft's TypeScript team has released the Release Candidate of TypeScript 7.0, the first version built entirely on a new Go-based compiler. The announcement comes from the Microsoft TypeScript Blog and marks the culmination of over a year of porting work.

## What's actually new

The compiler has been ported from the original bootstrapped TypeScript/JavaScript codebase to Go, delivering what the team reports as roughly 10x faster performance compared to TypeScript 6.0. This was a methodical port — not a rewrite — meaning the type-checking logic is structurally identical to 6.0. The editor experience now uses LSP via a dedicated VS Code extension called "TypeScript Native Preview." Two new CLI flags arrive: `--checkers` controls the number of parallel type-checking workers (defaulting to 4), and `--builders` controls parallel project reference builds for monorepo scenarios. These flags have a multiplicative relationship — `--checkers 4 --builders 4` means up to 16 concurrent type-checkers — so tuning matters. Notably, there is no stable programmatic API yet; that's expected no earlier than TypeScript 7.1.

## What it means for your config

Your `tsconfig.json` itself doesn't need changes — the compiler enforces the same semantics. But there are real workflow considerations.

**Side-by-side installs:** Because TypeScript 7.0 ships its own native `tsc` binary, running it alongside 6.0 requires the new `@typescript/typescript6` compatibility package. The blog details an npm alias approach (`"typescript": "npm:@typescript/typescript6@^6.0.0"`) specifically because tools like `typescript-eslint` resolve `typescript` via peer dependencies. If your toolchain depends on the TypeScript API (custom transformers, lint rules, anything importing from `typescript`), you'll likely need this alias until those tools add 7.0 support.

**New flags to consider:** `--checkers` and `--builders` are worth tuning per environment. The team notes that CI runners with fewer cores and less memory may benefit from lowering `--checkers` below the default of 4. The announcement also warns that varying `--checkers` counts can, in rare cases, surface order-dependent differences in results — something to be aware of if you enforce deterministic builds.

**No API yet:** If you maintain tools that consume TypeScript's programmatic API, 7.0 RC is not your migration target. Stick with 6.0 via the compatibility package and wait for 7.1.

## Recommended next step

Install the RC in a non-critical project or branch (`npm install -D typescript@rc`) and run `npx tsc` to compare output and speed against your current setup. If you use VS Code, try the TypeScript Native Preview extension for the editor side. For CI, experiment with `--checkers` values and monitor memory. If you're setting up a fresh TypeScript project and want a clean starting config, you can [generate a TypeScript config](/en/generator/tsconfig) — though the config shape itself hasn't changed in 7.0.

---

**Read the full announcement on Microsoft TypeScript Blog** → [Announcing TypeScript 7.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/)