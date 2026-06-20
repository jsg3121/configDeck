---
id: "https://css-tricks.com/?p=394364"
tool: "csstricks"
title: "A First Look at Scroll-Triggered Animations"
link: "https://css-tricks.com/css-scroll-triggered-animations-first-look/"
pubDate: 2026-06-19T13:03:17.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/css-scroll-triggered-animations-first-look/"
contentType: "commentary"
summary: "CSS-Tricks walks through Chrome 146's new scroll-triggered animations — a CSS-native alternative to Intersection Observer that plays animations for a fixed duration once scroll thresholds are crossed, distinct from the existing scroll-driven animations spec."
---

CSS-Tricks published a detailed walkthrough of scroll-triggered animations, now shipping in Chrome 146 as the first browser implementation. The article distinguishes them from scroll-driven animations and covers the new `timeline-trigger` and `animation-trigger` properties with working demos.

## What's actually new

Scroll-triggered animations introduce two new CSS properties: `timeline-trigger` and `animation-trigger`. Where scroll-driven animations (`animation-timeline: scroll()` or `animation-timeline: view()`) tie animation progress directly to scroll position — meaning there's no fixed duration — scroll-triggered animations fire a standard timed CSS animation once a visibility threshold is met. The article frames it as the CSS equivalent of JavaScript's Intersection Observer API. The `timeline-trigger` property accepts a named identifier (a dashed ident), a `view()` function, and a timeline range like `entry 100% exit 0%` to define when the animation activates and deactivates. The `animation-trigger` property then references that identifier and applies an `<animation-action>` keyword — options include `play-forwards`, `play-backwards`, `play-once`, `play`, `pause`, `reset`, `replay`, and `none` — giving fine-grained control over playback behavior across scroll states.

## What it means for your config

This is a pure CSS feature — no build tool plugins, PostCSS transforms, or bundler config changes are required to use it. However, since it's Chrome 146-only right now, teams with browserslist or similar target configs should be aware that these properties will be unsupported elsewhere and won't even be recognized by most CSS linting or formatting tools yet. If you're using stylelint, expect unknown-property warnings for `timeline-trigger` and `animation-trigger` until rule definitions catch up; you may need to add them to your `ignoreProperties` list in the interim. There's no migration path from scroll-driven animations because these are complementary specs, not replacements — you'd choose one or the other based on whether you want duration-based playback or scroll-synchronized progress. The article doesn't mention any interaction with CSS preprocessors or framework-level abstractions.

## Recommended next step

If you're currently using Intersection Observer purely to trigger CSS class toggles for entrance animations, this is worth prototyping against. Read through the full CSS-Tricks article for the interactive demos — they do a better job of illustrating the difference between `play-forwards`, `play-once`, and `play-forwards play-backwards` than any static description can. For production use, you'll want a fallback strategy since this is single-browser for now; a simple `@supports` check on `timeline-trigger` would let you progressively enhance while keeping your IO-based approach as the baseline.

---

**Read the full announcement on CSS-Tricks** → [A First Look at Scroll-Triggered Animations](https://css-tricks.com/css-scroll-triggered-animations-first-look/)