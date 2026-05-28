---
id: "https://css-tricks.com/?p=393536"
tool: "csstricks"
title: "Revealing Text With CSS letter-spacing"
link: "https://css-tricks.com/revealing-text-with-css-letter-spacing/"
pubDate: 2026-05-27T12:37:33.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/revealing-text-with-css-letter-spacing/"
contentType: "commentary"
summary: "CSS-Tricks demonstrates several text-reveal techniques using negative letter-spacing, transparent color, and transitions — no JavaScript required. The patterns combine existing CSS features like ::first-letter and the ch unit to simulate per-character targeting without a ::nth-letter selector."
---

CSS-Tricks published a tutorial exploring how to build text-reveal animations using `letter-spacing` with negative values, `color: transparent`, and CSS transitions. The techniques chain together a few well-supported CSS features to create effects that would otherwise require JavaScript or a per-character pseudo-element selector that doesn't exist yet.

## What's actually new

This isn't a new browser feature — it's a creative application of existing ones. The core trick: set `letter-spacing: -1ch` (or `-2ch`) to collapse all characters on top of each other, then hide them with `color: transparent`. On a state change (`:checked`, `:hover`), transition `letter-spacing` back to `0ch` and flip `color` to `black`. The article walks through three variations: a simple checkbox-triggered reveal with different `text-align` positions controlling the reveal direction; a toggle that swaps between two `<span>` texts inside a label using staggered transitions and `overflow: clip`; and an acronym pattern where `::first-letter` stays visible (via `color: black`) while the rest of each word remains collapsed and transparent until hover. The cubic-bezier timing function `(.8, -.5, .2, 1.4)` gives the spacing animation an overshoot/"bouncy" feel. The article also notes the long-requested `::nth-letter()` pseudo-element would make individual character targeting far easier, but that doesn't exist in any spec today.

## What it means for your config

There's nothing here that touches build tooling, PostCSS plugins, or CSS config files. The properties used — `letter-spacing`, `color`, `transition`, `overflow: clip`, `::first-letter` — are standard CSS with broad browser support and don't require vendor prefixes or feature flags in modern targets. If you're running Autoprefixer or a Browserslist config, none of these properties should trigger prefix insertion for current baselines. One thing worth noting for linting setups: if you use Stylelint with strict rules around `cubic-bezier` values or negative length values, the patterns here (negative `letter-spacing`, negative values inside cubic-bezier) are perfectly valid CSS but might trip overly aggressive custom rules. No migration or config change is needed.

## Recommended next step

If you're building interactive UI touches — onboarding flows, toggle states, hover reveals — these patterns are worth bookmarking as a no-JS option. The checkbox-plus-label approach is the most practical for production since it doesn't rely on hover (important for touch devices). Before shipping, test with screen readers: collapsing characters visually doesn't affect the DOM text, but `color: transparent` combined with `overflow: clip` may need `aria-live` or visually-hidden fallback text to communicate state changes. Read the full tutorial for the complete code and embedded demos.

---

**Read the full announcement on CSS-Tricks** → [Revealing Text With CSS letter-spacing](https://css-tricks.com/revealing-text-with-css-letter-spacing/)