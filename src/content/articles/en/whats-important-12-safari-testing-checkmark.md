---
id: "https://css-tricks.com/?p=395357"
tool: "csstricks"
title: "What's !important #12: Safari Testing, ::checkmark, HTML Anchor Positioning, and More"
link: "https://css-tricks.com/whats-important-12/"
pubDate: 2026-05-29T13:25:38.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-12/"
contentType: "commentary"
summary: "CSS-Tricks' latest roundup covers cross-platform Safari testing, the new ::checkmark pseudo-element, anchor positioning workarounds using data attributes and advanced attr(), and notes Firefox 151 bringing container style queries to Baseline status."
---

CSS-Tricks published the twelfth edition of their *What's !important* roundup, curating several notable CSS developments. The highlights span testing strategies, new pseudo-elements, creative shape techniques, and fresh browser platform features.

## What's actually new

The roundup covers a handful of distinct topics worth tracking. First, Declan Chidlow's piece on testing in Safari without Apple hardware — still a real pain point for anyone shipping cross-browser CSS. Second, Sunkanmi Fafowora introduces `::checkmark`, a pseudo-element that targets the checked state indicator not just on checkboxes but also on radios and selects. That scope is wider than the name suggests, so it's worth reading carefully.

On the layout side, CSS-Tricks' own Daniel Schwarz demonstrates a workaround for anchor positioning using data attributes and advanced `attr()`, motivated by the `anchor` HTML attribute being dropped from the spec. The article shows three different HTML syntax approaches for managing anchor associations without the native attribute. Meanwhile, Temani Afif highlights combining `border-shape` with the `shape()` function as an alternative to `clip-path` for creating varied shape styles. Durgesh Pawar covers `sibling-index()` and `sibling-count()`, described as almost-Baseline CSS functions.

On the browser front, Firefox 151 is noted as shipping container style queries, which are now Baseline, plus the Document Picture-in-Picture API for desktop (no Safari support). The State of CSS 2026 survey is also open, and the organizers explicitly reduced the number of features covered this year to combat survey fatigue.

## What it means for your config

None of these features directly change build tool configurations, but a few have downstream implications. If you're using PostCSS or Lightning CSS with feature targeting, `::checkmark` and `sibling-index()`/`sibling-count()` are new pseudo-elements and functions your tooling may not yet recognize — check whether your CSS linter or minifier chokes on them before shipping. Container style queries reaching Baseline means you can start removing related polyfills or feature flags from your build pipeline if you were gating on browser support.

The anchor positioning workaround using advanced `attr()` is particularly relevant for anyone maintaining utility-class configs or design system tokens. It relies on data attributes and CSS-side `attr()` parsing, so your HTML templating and any attribute-stripping sanitizers need to preserve those `data-boat` / `data-anchor` attributes. If you have CSP or sanitization rules that strip unknown data attributes, this pattern will silently break.

The announcement doesn't detail specific tooling versions required for support — we'll revisit once broader docs and caniuse data stabilize for these features.

## Recommended next step

If you maintain a cross-browser testing matrix, revisit your Safari coverage strategy using the options Chidlow outlines — especially if your CI pipeline currently skips Safari altogether. For the newer CSS features like `::checkmark` and the anchor positioning workaround, the smartest move right now is to read the individual linked articles, try them in a scratch project, and check whether your existing linting and build tooling handles the new syntax without errors. Don't rush to adopt in production until your PostCSS/stylelint configs can parse them cleanly.

---

**Read the full announcement on CSS-Tricks** → [What's !important #12: Safari Testing, ::checkmark, HTML Anchor Positioning, and More](https://css-tricks.com/whats-important-12/)