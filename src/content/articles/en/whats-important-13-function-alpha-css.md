---
id: "https://css-tricks.com/?p=395752"
tool: "csstricks"
title: "What's !important #13: @function, alpha(), CSS Wordle, and More"
link: "https://css-tricks.com/whats-important-13/"
pubDate: 2026-06-15T13:15:33.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-13/"
contentType: "commentary"
summary: "CSS-Tricks rounds up the latest CSS platform news including @function, the new alpha() function for color manipulation, WebKit's Grid Lanes guide, dialog element improvements, and Chrome 149's newly Baseline features like gap decorations."
---

CSS-Tricks published the thirteenth edition of their "What's !important" roundup, covering a dense week of CSS platform developments. The highlights span `@function`, a new `alpha()` color function, `<dialog>` improvements, WebKit's Grid Lanes documentation, and fresh Baseline arrivals in Chrome 149.

## What's actually new

The biggest item here is `@function`, which CSS-Tricks describes as likely the biggest CSS feature to hit Baseline this year. Jane Ori's walkthrough and Declan Chidlow's reference documentation on CSS-Tricks are both linked for developers getting up to speed.

The `alpha()` function is the most interesting detail for anyone who's built a design token system. Right now, if you store a full color value like `oklch(0.65 0.23 230)` in a custom property, adjusting its alpha channel requires the verbose `oklch(from var(--color) l c h / 0.5)` syntax — repeating the color space and all its channels. `alpha(from var(--color) / 0.5)` collapses that into something color-space-agnostic and far more readable. If you've been storing raw channel values in variables just to keep alpha flexibility, this removes that workaround entirely.

On the layout side, WebKit published a "Field Guide to Grid Lanes" — their rebranding of CSS masonry layout — with demos ranging from minimal to real-world. For `<dialog>`, Una Kravets highlighted the `closedby` attribute (not yet in Safari) and `overscroll-behavior: contain` as practical UX fixes, while Chris Coyier covered dialog animation patterns (yes, `@starting-style` is still the tricky part).

Chrome 149 brings gap decorations, `image-rendering: crisp-edges`, and `rect()`/`xywh()` for `shape-outside` to Baseline status. The `path()` and `shape()` functions for `shape-outside` still lack Safari and Firefox support.

## What it means for your config

Most of these features don't directly touch build configs or tooling settings — they're native CSS platform additions. However, there are a few things worth noting. If you use PostCSS or Lightning CSS with feature-targeting flags, the Baseline status of gap decorations and `image-rendering: crisp-edges` in Chrome 149 may affect whether your tooling still needs to polyfill or prefix those properties. Check your browserslist targets.

For `@function`, tooling support will matter as adoption grows. CSS linters, formatters, and IDE extensions will need to recognize the new syntax. If you're running Stylelint, watch for rule updates — unrecognized at-rules could trigger false positives. The `alpha()` function is early enough that it likely isn't in any tooling's radar yet.

The `closedby` attribute for `<dialog>` has no Safari support, so if your project enforces cross-browser parity through feature checks or progressive enhancement policies, factor that in before relying on it in production.

## Recommended next step

If you maintain a design system or token pipeline, the `alpha()` function is the item to bookmark — it could simplify how you structure color custom properties and eliminate the awkward pattern of storing raw channel values. For everything else, the roundup is worth a full read, especially the linked walkthroughs for `@function` and Grid Lanes, which go deeper than the summary here. CSS Day 2026 recordings should surface in late June, so keep an eye on that for the conference content.

---

**Read the full announcement on CSS-Tricks** → [What's !important #13: @function, alpha(), CSS Wordle, and More](https://css-tricks.com/whats-important-13/)