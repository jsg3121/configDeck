---
id: "https://css-tricks.com/?p=393441"
tool: "csstricks"
title: "Cross-Document View Transitions: Scaling Across Hundreds of Elements"
link: "https://css-tricks.com/cross-document-view-transitions-part-2/"
pubDate: 2026-05-25T13:46:54.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/cross-document-view-transitions-part-2/"
contentType: "commentary"
summary: "Part 2 of CSS-Tricks' series on cross-document view transitions tackles the real scaling problem: going from one named element to hundreds without your CSS collapsing into an unmaintainable wall of selectors. The key is view-transition-class, which decouples animation styling from per-element identity."
---

CSS-Tricks published the second part of their cross-document view transitions series, moving past the single-element demos into the mess you actually hit in production: grids with dozens or hundreds of items that each need unique transition names. The article walks through both the current solution and a future CSS proposal that would eliminate the problem entirely.

## What's actually new

The core takeaway is the distinction between `view-transition-name` (unique identity, one per element per page) and `view-transition-class` (shared styling hook, works like a regular CSS class). The article demonstrates that by assigning unique names per element but a shared `view-transition-class`, you can target all transitions with a single wildcard selector like `::view-transition-group(*.card)` — meaning your animation CSS stays constant regardless of item count.

The article also spotlights two proposed CSS functions: `sibling-index()`, which already shipped in Chrome 138, and `ident()`, which has a Chrome Intent to Prototype from May 2025 but no browser implementation yet. Together they'd allow auto-generating unique `view-transition-name` values in pure CSS, eliminating the need for server-side or JS-based name generation. That future is worth tracking but isn't usable today.

Browser support for `view-transition-class` itself: Chrome 125+, Edge, and Safari 18.2+. Firefox doesn't support it yet.

## What it means for your config

This is primarily a CSS architecture concern, not a build-tool config change — but it has implications if you're generating styles at build time. If your project currently uses a CSS preprocessor or JavaScript loop to emit per-item `::view-transition-group(card-N)` selectors, `view-transition-class` eliminates that entire build step. You can replace generated selector lists with a handful of static rules using the wildcard syntax.

For server-rendered apps (any templating language), the pattern shifts name generation into inline styles on HTML elements — `style="view-transition-name: product-42; view-transition-class: card"` — which means your stylesheet no longer needs to know about individual items at all. If you're using a CSS linting tool that flags inline styles, you may need to whitelist these two properties.

No breaking changes to existing view transition setups. `view-transition-class` is additive — if you don't use it, nothing changes. But if you're on Firefox or need to support older Chromium versions, you'll want to treat the transitions as a progressive enhancement since the property will simply be ignored.

## Recommended next step

If you're already using cross-document view transitions for more than a hero image, audit your CSS for per-name selector lists and replace them with `view-transition-class` plus the wildcard pseudo-element syntax. For new implementations, set unique names server-side or via templating and keep all animation behavior in shared `*.classname` rules. Bookmark `ident()` progress — once it lands, you'll be able to drop the server-side name generation entirely and do everything in CSS. The original article has inline demos and the full code patterns worth working through.

---

**Read the full announcement on CSS-Tricks** → [Cross-Document View Transitions: Scaling Across Hundreds of Elements](https://css-tricks.com/cross-document-view-transitions-part-2/)