---
id: "https://css-tricks.com/?p=393498"
tool: "csstricks"
title: "Computing and Displaying Discounted Prices in CSS"
link: "https://css-tricks.com/computing-and-displaying-discounted-prices-in-css/"
pubDate: 2026-05-14T14:05:01.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/computing-and-displaying-discounted-prices-in-css/"
contentType: "commentary"
summary: "CSS-Tricks walks through calculating and displaying discounted prices entirely in CSS using the upgraded attr() function, CSS math functions like mod() and round(), and custom counters — no JavaScript required."
---

CSS-Tricks published a tutorial demonstrating how to compute and render discounted prices purely in CSS, eliminating the need for JavaScript on e-commerce-style pricing UIs. The technique leans on several newer CSS capabilities, some of which are not yet Baseline.

## What's actually new

The core trick hinges on the upgraded `attr()` function, which now accepts a type argument (e.g., `attr(data-price number)`) so that HTML `data-*` attribute values can be parsed as numbers rather than strings. This lets you feed them directly into `calc()` for arithmetic — in this case, `Original Price * (1 - Discount)`. The article notes that this expanded `attr()` syntax is *not* yet Baseline, so production use today is premature.

To display the result, the demo uses CSS counters, which only handle integers. The workaround splits the computed price into dollars and cents using `round(down, ...)` and `mod(..., 1) * 100`, then stitches them back together inside `content`. The `mod()` function itself is noted as newly Baseline, while `calc()` and `round()` already have broad support. The `:has()` pseudo-class drives the toggling logic — when a "student discount" checkbox is checked, the original price gets a strikethrough and the computed sale price appears via `::after`.

## What it means for your config

This is a CSS authoring pattern, not a tooling or build-config change. That said, there are a few things worth flagging for your setup:

- **PostCSS / Lightning CSS users:** If your build pipeline processes or downgrades modern CSS, check whether your tooling handles the typed `attr()` syntax. Most processors today likely pass it through untouched or may choke on it. Until browser support catches up, you probably want this behind a feature flag or progressive enhancement guard anyway.
- **Stylelint configs:** Rules that lint `attr()` usage or counter properties may need updates once teams start adopting this pattern. No immediate action needed, but worth a mental bookmark.
- **No build-tool migration required.** This is purely a CSS-level technique; it doesn't affect bundler configs, framework settings, or deployment pipelines.

The announcement doesn't detail interaction with CSS preprocessors like Sass — the typed `attr()` call is native CSS, so it would need to live in plain `.css` files or be passed through verbatim by your preprocessor.

## Recommended next step

Treat this as a "watch and experiment" item. The upgraded `attr()` is the linchpin, and until it lands in all major browsers, shipping this in production pricing UIs would be risky. But the underlying ideas — using CSS math to reduce JS surface area for presentational calculations — are worth internalizing now. Read the full tutorial to see the working demo and the exact counter-splitting technique; it's a clean illustration of where CSS is headed for lightweight computed displays.

---

**Read the full announcement on CSS-Tricks** → [Computing and Displaying Discounted Prices in CSS](https://css-tricks.com/computing-and-displaying-discounted-prices-in-css/)