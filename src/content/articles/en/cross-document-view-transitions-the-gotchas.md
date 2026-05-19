---
id: "https://css-tricks.com/?p=393399"
tool: "csstricks"
title: "Cross-Document View Transitions: The Gotchas Nobody Mentions"
link: "https://css-tricks.com/cross-document-view-transitions-part-1/"
pubDate: 2026-05-18T13:47:19.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/cross-document-view-transitions-part-1/"
contentType: "commentary"
summary: "CSS-Tricks walks through the real, current way to enable cross-document view transitions on multi-page sites — replacing a deprecated meta tag with a CSS at-rule — and digs into silent failure modes like the 4-second timeout and aspect ratio warping."
---

CSS-Tricks published the first part of a two-part series on cross-document view transitions for multi-page sites. The article focuses on the pitfalls that trip up developers who follow outdated tutorials, starting with the most common one: the opt-in mechanism changed and nobody got a deprecation warning.

## What's actually new

The core news here isn't the feature itself — cross-document view transitions have been shipping in Chromium for a while — it's the documentation correction. The `<meta name="view-transition" content="same-origin">` tag that most existing tutorials recommend is deprecated and silently does nothing in current browsers. The correct opt-in is now a CSS at-rule: `@view-transition { navigation: auto; }`, which must appear in the stylesheets of *both* the source and destination pages. The article notes support in Chromium-based browsers and Safari 18.2+, with Firefox support still in progress.

The move from a meta tag to CSS isn't just syntactic churn. It means you can wrap the opt-in in `@media` queries — conditionally enabling transitions based on `prefers-reduced-motion`, viewport width, or any other media condition. The article also flags that `navigation: auto` only fires on user-initiated, same-origin navigations (link clicks, back button), not programmatic redirects, cross-origin links, or POST form submissions.

Beyond the opt-in fix, the piece covers a 4-second timeout that silently kills transitions on slow-loading pages and aspect ratio warping on image-heavy transitions. Part 2 (forthcoming) will address scaling `view-transition-name` across large numbers of elements and the distinction between `view-transition-name` and `view-transition-class`.

## What it means for your config

This is a CSS-level configuration change, but it has implications if you use any templating or build system that injects the old meta tag into your `<head>`. If you have a shared layout partial, HTML boilerplate, or a CMS template that includes `<meta name="view-transition" content="same-origin">`, remove it — it does nothing now and may mislead future maintainers into thinking transitions are enabled.

The replacement `@view-transition` at-rule goes in your CSS, which means it flows through your normal stylesheet pipeline: PostCSS, Sass, whatever you use. One thing to watch: if you use CSS minifiers or linters with strict at-rule whitelists, `@view-transition` may get flagged or stripped. Check that your toolchain recognizes it. Stylelint users in particular should verify their `at-rule-no-unknown` configuration allows it.

Since both pages must opt in independently, teams with inconsistent CSS delivery (e.g., different stylesheets per route, code-split CSS) need to make sure the at-rule lands in every page's stylesheet, not just a shared global one. The article points out you can use this deliberately — skip transitions on your 404 or auth pages by simply not including the rule.

## Recommended next step

If you've attempted cross-document view transitions before and given up, start by swapping the meta tag for the CSS at-rule and testing in a current Chromium or Safari 18.2+ browser. The article includes a minimal two-page example and a `pagereveal` event listener you can drop in to actually surface the silent `TimeoutError` that kills transitions on slow pages — that debugging snippet alone is worth the click-through. Read the full piece for the timeout and aspect-ratio fixes; Part 2 should cover the scaling patterns that matter once you move past a two-page demo.

---

**Read the full announcement on CSS-Tricks** → [Cross-Document View Transitions: The Gotchas Nobody Mentions](https://css-tricks.com/cross-document-view-transitions-part-1/)