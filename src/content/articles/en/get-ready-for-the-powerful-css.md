---
id: "https://css-tricks.com/?p=395508"
tool: "csstricks"
title: "Get Ready For the Powerful CSS border-shape Property!"
link: "https://css-tricks.com/get-ready-for-the-powerful-css-border-shape-property/"
pubDate: 2026-07-07T15:14:00.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/get-ready-for-the-powerful-css-border-shape-property/"
contentType: "commentary"
summary: "CSS-Tricks walks through the new border-shape property, which accepts the same values as clip-path but lets borders, box-shadow, and outline follow the resulting shape instead of being clipped away. Support is currently Chrome-only."
---

CSS-Tricks has published a deep-dive on the upcoming `border-shape` CSS property, written by Temani Afif. The article situates `border-shape` alongside two other recent additions — the `shape()` function (now Baseline) and the `corner-shape` property — and demonstrates a wide range of visual techniques the new property unlocks.

## What's actually new

The core problem `border-shape` solves is one CSS developers have fought for years: `clip-path` and `mask` clip the *entire* element, decorations included, so adding a visible border to a clipped shape has always required hacks. `border-shape` accepts the same value types as `clip-path` — `shape()`, `polygon()`, and other basic shape functions — but instead of clipping, it *reshapes* the element so that `border`, `box-shadow`, and `outline` trace the new contour. The syntax swap is minimal: replace `clip-path` with `border-shape` and your decorations survive.

A particularly interesting detail is the dual-shape mode. Passing two `<basic-shape>` values gives you fill mode: the first shape defines the outer boundary, the second the inner boundary, and the border fills the area between them. The article shows how combining `inset(0)` with a second shape creates cutout effects, and how pushing the outer shape beyond the element boundary (e.g., `inset(0 -100vw)`) produces full-bleed "breakout" backgrounds using only a border. Content inside the element still flows in the original rectangle, which mirrors existing `border-radius` behavior.

Note that `border-radius` is ignored when `border-shape` is active — the element no longer has traditional corners to round. Support is Chrome-only at the time of writing.

## What it means for your config

`border-shape` is a pure CSS property, so there's no build-tool or bundler configuration involved in using it. However, if your project relies on PostCSS plugins or linting rules that whitelist known properties, you may need to update those allow-lists once you start adopting it. Stylelint users with `property-no-unknown` enabled, for example, will see warnings until the property lands in their tool's data set.

Because support is limited to Chromium, any production use needs a fallback strategy. You could feature-detect with `@supports (border-shape: inset(0))` and fall back to `clip-path` for non-supporting browsers — you lose the decorations but keep the shape. No migration from existing `clip-path` code is strictly required; the two properties solve different problems and can coexist.

The article doesn't address interactions with CSS containment, custom properties in shape values, or how `border-shape` behaves inside CSS layers. Those details will matter once the spec stabilizes and other engines ship.

## Recommended next step

If you're building a design system or component library that currently uses `clip-path` shapes, it's worth auditing which of those shapes would benefit from visible borders or shadows — those are your best candidates for eventual `border-shape` adoption. For now, experiment in Chrome, bookmark the CSS-Tricks article for its extensive demos, and keep an eye on the spec for cross-browser signals before committing to production use.

---

**Read the full announcement on CSS-Tricks** → [Get Ready For the Powerful CSS border-shape Property!](https://css-tricks.com/get-ready-for-the-powerful-css-border-shape-property/)