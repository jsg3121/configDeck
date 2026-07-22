---
id: "http://css-tricks.com/?page_id=244261"
tool: "csstricks"
title: "writing-mode"
link: "https://css-tricks.com/almanac/properties/w/writing-mode/"
pubDate: 2026-07-21T09:39:10.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/properties/w/writing-mode/"
contentType: "commentary"
summary: "CSS-Tricks published an updated almanac entry on the writing-mode property, covering its five values, how it redefines block and inline axes, and its downstream effects on Flexbox, Grid, and logical properties."
---

CSS-Tricks has published a thorough almanac reference for the `writing-mode` CSS property, covering syntax, values, layout implications, and an interactive demo. The entry goes well beyond a simple property definition — it doubles as a primer on how writing modes reshape the logical axis model that underpins modern CSS layout.

## What's actually new

The article documents five values: `horizontal-tb` (the default), `vertical-rl`, `vertical-lr`, `sideways-rl`, and `sideways-lr`. Each value name encodes two pieces of information — whether lines are horizontal or vertical, and the direction blocks progress. The more interesting half of the piece explains how `writing-mode` doesn't merely rotate text; it swaps the block and inline axes that Flexbox, Grid, alignment properties, and logical properties all rely on. A `flex-direction: row` container, for instance, lays items along the inline axis, which means it can run vertically under a vertical writing mode. The article also notes that `writing-mode` applies to all elements except table row/column groups, table rows, table columns, and ruby containers, and that the property is inherited but not animatable.

## What it means for your config

This is a CSS property reference, not a tooling release, so there's no migration path or breaking change to worry about. That said, if your project uses Stylelint or other CSS linting and you've configured rules that enforce physical properties (e.g., flagging `width`/`height` in favor of `inline-size`/`block-size`), understanding `writing-mode` is essential context for why those lint rules exist. Switching to logical properties only pays off when your team actually understands the axis model `writing-mode` establishes — otherwise the lint rule is just noise. If you maintain a design-system config or a shared Prettier/Stylelint preset, it's worth confirming your rules don't inadvertently block valid `writing-mode` declarations or the `sideways-*` values, which are less commonly seen and could trip naive pattern-based linting.

## Recommended next step

Read the full CSS-Tricks entry, especially the interactive demo that lets you swap languages and writing modes in real time — it makes the axis-swapping behavior click faster than any static explanation. If you maintain shared CSS tooling configs, audit your Stylelint rules to ensure they don't conflict with vertical writing modes or the logical properties that pair with them. For teams not dealing with CJK content, the article still serves as the clearest explanation available of why modern CSS thinks in "block" and "inline" rather than "top" and "left."

---

**Read the full announcement on CSS-Tricks** → [writing-mode](https://css-tricks.com/almanac/properties/w/writing-mode/)