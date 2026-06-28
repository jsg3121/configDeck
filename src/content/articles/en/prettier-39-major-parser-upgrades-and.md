---
id: "https://prettier.io/blog/2026/06/27/3.9.0"
tool: "prettier"
title: "Prettier 3.9: Major parser upgrades and Formatting improvements"
link: "https://prettier.io/blog/2026/06/27/3.9.0"
pubDate: 2026-06-27T00:00:00.000Z
sourceName: "Prettier Blog"
sourceUrl: "https://prettier.io/blog/2026/06/27/3.9.0"
contentType: "commentary"
summary: "Prettier 3.9 ships upgraded parsers for Markdown (micromark v4), YAML (yaml v2), GraphQL (v17 support), and Flow (new Rust-based parser), plus a batch of JavaScript/TypeScript formatting fixes especially around --no-semi mode and comment handling."
---

The Prettier team has released version 3.9, announced on the Prettier Blog. The headline is a wave of parser replacements across five languages, paired with a solid list of JS/TS formatting corrections that fix long-standing idempotency and comment-placement bugs.

## What's actually new

The biggest change is the Markdown parser moving from the outdated remark-parse v8 to micromark v4, which should resolve a long tail of CommonMark and GFM compliance issues that have generated bug reports for years. MDX is not yet migrated — the team is explicitly asking for community help there. YAML gets a similar treatment, jumping to yaml v2. GraphQL support now covers GraphQL.js v17 syntax, including fragment arguments and directives on directive definitions, both of which previously threw syntax errors. Flow users get a new Rust-based ("oxidized") parser; the announcement includes local benchmark numbers showing roughly 37–43% faster parse times on representative fixtures.

On the JS/TS formatting side, the most notable fix is that `break`/`continue` with trailing comments in `--no-semi` mode now format idempotently — previously a second format pass could produce different output. Several other fixes address double-parenthesization in negated logical expressions, misplaced IIFE JSDoc comments, spurious spaces in CSS template literal selectors, and inconsistent alignment in embedded template interpolations.

## What it means for your config

No new configuration options ship in this release, and no existing options are deprecated. However, a few things deserve attention:

- **Pin the exact version.** The Prettier team repeats their standing advice: use `"prettier": "3.9.0"` in `package.json`, not a caret range. Parser upgrades like micromark and yaml v2 can subtly change formatted output, so you want deterministic behavior across your team.
- **Plugin upgrades required.** If you use `@prettier/plugin-oxc` or `@prettier/plugin-hermes`, you need to upgrade those alongside Prettier itself for the new formatting rules to take effect. The announcement doesn't specify minimum plugin versions — check the respective plugin changelogs.
- **Expect diff noise on Markdown and YAML files.** Swapping an entire parser backend means some files may reformat differently even without content changes. Run `prettier --write` across your repo and commit the formatting changes in an isolated PR so they don't pollute feature work.
- **`--no-semi` users:** The `break`/`continue` comment fix changes output in a way that adds semicolons in specific cases. If you have snapshot tests or golden-file comparisons, expect updates there.
- **MDX caveat:** The MDX parser has *not* been upgraded yet. If your project relies heavily on MDX formatting, this release won't change your experience — and shouldn't break it either, but keep an eye on the tracking issue.

## Recommended next step

Update Prettier to the pinned version, upgrade any first-party Prettier plugins you use, then run a full format pass and review the diff before merging. If you're setting up a new project or revisiting your formatter config, you can [generate a Prettier config](/en/generator/prettier-config) to get a clean starting point. For existing setups, the main action item is absorbing the reformatted output from the new parsers in one clean commit.

---

**Read the full announcement on Prettier Blog** → [Prettier 3.9: Major parser upgrades and Formatting improvements](https://prettier.io/blog/2026/06/27/3.9.0)