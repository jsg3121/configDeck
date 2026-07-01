---
id: "https://css-tricks.com/?p=395894"
tool: "csstricks"
title: "What's !important #14: Gap Decorations, random(), <select> field sizing, and More"
link: "https://css-tricks.com/whats-important-14/"
pubDate: 2026-06-30T13:54:14.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-14/"
contentType: "commentary"
summary: "CSS-Tricks rounds up recent CSS developments including gap decorations, the random() function, field-sizing for selects reaching Baseline, and modern theming patterns using @property and contrast-color()."
---

CSS-Tricks published the 14th edition of their "What's !important" roundup, covering a dense couple of weeks in the CSS ecosystem. Despite a quiet period for stable browser releases — Firefox 152 being the notable exception — the community output has been substantial.

## What's actually new

The headline items span several areas. Temani Afif demonstrated CSS gap decorations, which let you style the spaces between items in flexbox, grid, and multi-column layouts — a feature the community has wanted for a long time. Polypane published a collection of `random()` experiments (bokeh effects, falling petals, animated auroras), though the function still lacks browser support outside Safari. Manuel Matuzović covered `field-sizing: content` for `<select>` elements, which sizes the select to match the currently selected option; this property hit Baseline status with Firefox 152. Una Kravets wrote about CSS theming using `@property`, `light-dark()`, `contrast-color()`, and `@container style()`, all of which are now Baseline. On the non-CSS side, Heydon Pickering's Hyperblam uses Web Components to drive the Web Audio API entirely from HTML markup, and Layoutit shipped a CSS-powered port of Quake using PolyCSS.

## What it means for your config

Most of what's covered here lives at the browser-feature level rather than the build-config level, but a few items have practical implications. If your project uses PostCSS or Lightning CSS with feature flags, `field-sizing` reaching Baseline means you can stop polyfilling or prefixing it — check whether your CSS toolchain's target browser list reflects Firefox 152+. The `random()` function is a different story: with only Safari support, you'd still need fallbacks or feature queries in production, so don't remove any existing workarounds yet. For theming, if you're already using CSS custom properties through design-token tooling (Style Dictionary, for example), the combination of `@property` with typed syntax and `light-dark()` could simplify your token output — but the announcement doesn't go deep enough into tooling integration to prescribe a specific migration. We'll revisit once more concrete guidance surfaces from the tooling authors.

## Recommended next step

If you're maintaining a CSS config that targets specific browser versions — whether via Browserslist, PostCSS Preset Env, or equivalent — now is a good time to audit your target list. `field-sizing` going Baseline is the kind of quiet change that leaves dead polyfill code in your pipeline if you're not paying attention. For `random()` and gap decorations, treat the linked demos as a preview of what's coming rather than something to ship today. The original roundup links out to each author's deep dive, so follow those if any of these features touch your current work.

---

**Read the full announcement on CSS-Tricks** → [What's !important #14: Gap Decorations, random(), <select> field sizing, and More](https://css-tricks.com/whats-important-14/)