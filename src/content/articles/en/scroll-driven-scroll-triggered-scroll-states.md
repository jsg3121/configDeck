---
id: "https://css-tricks.com/?p=393503"
tool: "csstricks"
title: "Scroll-Driven, Scroll-Triggered, Scroll States, and View Transitions"
link: "https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/"
pubDate: 2026-06-08T13:00:34.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/"
contentType: "commentary"
summary: "CSS-Tricks published a concise taxonomy distinguishing four commonly conflated CSS concepts: scroll-driven animations, scroll-triggered animations, container query scroll states, and view transitions."
---

CSS-Tricks posted a reference-style article that draws clear lines between four CSS features whose names blur together in practice: scroll-driven animations, scroll-triggered animations, container query scroll states, and view transitions. It's framed as a personal cheat sheet, but it's genuinely useful for anyone who has said one term and meant another.

## What's actually new

This isn't a feature launch — it's a disambiguation piece, and a well-timed one given that these specs are at different maturity levels. The key distinctions laid out: **scroll-driven animations** have a 1:1 relationship between scroll progress and animation progress (stop scrolling, animation stops). **Scroll-triggered animations** fire when an element crosses a threshold ("trigger activation range") and then run to completion regardless of further scroll input. **Container query scroll states**, part of the CSS Conditional Rules Module Level 5 working draft, let you restyle elements based on scroll-related container conditions — the article shows a `@container scroll-state(stuck: top)` example for a sticky nav. Finally, **view transitions** are called out as having nothing to do with scroll at all; they're a separate API covering same-document state transitions and cross-document page-to-page animations. The article includes a summary table at the end that's worth bookmarking on its own.

## What it means for your config

Directly, not much — these are CSS platform features, not tooling config changes. But there are a few tangential things worth thinking about. If your project uses PostCSS or a CSS linting setup, the `@container scroll-state()` syntax from the Level 5 spec draft may trip up parsers that haven't been updated to handle it. Check whether your `stylelint` config or PostCSS plugins flag it as invalid; you may need to update plugin versions or add ignore rules. For view transitions specifically, cross-document transitions require the `@view-transition` at-rule in CSS, which is another syntax newer tooling versions need to understand. The article doesn't detail browser support or required build tool versions, so verify against your project's browserslist before shipping any of these to production. Beyond that, none of these features introduce new config files or build steps — they're pure CSS (with optional JS for view transitions).

## Recommended next step

Bookmark the summary table in the original article and share it with your team. The real value here is vocabulary alignment — when someone on your team says "scroll animation," you want shared understanding of whether they mean progress-linked or fire-and-forget. If you're exploring `scroll-state()` container queries specifically, note that it's still a working draft, so treat any usage as experimental and gate it behind feature detection or progressive enhancement.

---

**Read the full announcement on CSS-Tricks** → [Scroll-Driven, Scroll-Triggered, Scroll States, and View Transitions](https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/)