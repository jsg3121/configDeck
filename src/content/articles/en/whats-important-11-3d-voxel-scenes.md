---
id: "https://css-tricks.com/?p=394879"
tool: "csstricks"
title: "What's !important #11: 3D Voxel Scenes, Flying Focus, CSS Syntaxes, and More"
link: "https://css-tricks.com/whats-important-11/"
pubDate: 2026-05-15T13:16:34.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/whats-important-11/"
contentType: "commentary"
summary: "CSS-Tricks' latest roundup covers Heerich.js for 3D voxel scenes, the of <selector> syntax reaching Baseline, range syntax nuances for container queries, scroll-driven animations, and platform updates from Chrome 148 and Safari 26.5."
---

CSS-Tricks published the eleventh issue of their *What's !important* newsletter, rounding up a dense set of CSS and web platform developments. The highlights span new libraries, selector syntaxes that quietly reached broad support, and fresh browser releases.

## What's actually new

**Heerich.js** is a small engine by David Aerne for building 3D voxel scenes rendered as SVG. Because SVG accepts CSS variables, the scenes are styleable with plain CSS — a nice intersection of tooling concerns. **Polypane** launched a snippet store with a "1-Click De-crapulator" that copies a component's basic HTML without the surrounding noise.

On the CSS language side, two syntax topics stand out. The `of <selector>` syntax for `:nth-child()` — e.g., `div:nth-child(2 of .intro)` — is now Baseline-supported, and it composes with CSS nesting. The **range syntax** for media and container queries (using `>`, `<`, `>=`, `<=`) is shipping, but support is fragmented: container *style* queries are landing in Firefox 151, while the range syntax for those queries ships separately behind a flag. That's the kind of mismatch that bites you in production if your tooling doesn't catch it.

Chrome 148 brings name-only container queries (now Baseline), the `revert-rule` keyword, an `at-rule()` function for feature queries, and a `loading` attribute for `<video>`/`<audio>`. Safari 26.5 adds the `:open` pseudo-class (now Baseline) and an updated `random()` function. Cross-browser gaps remain on several of these; the original has the specifics.

Chris Coyier's exploration of animating focus via view transitions is also worth a read, especially the CSS-only "flying focus" technique shared by Polypane founder Kilian Valkhof in the comments.

## What it means for your config

The `of <selector>` syntax reaching Baseline status is the most config-relevant item here. If you maintain a Browserslist or PostCSS setup that transpiles modern selectors, your target matrix may already cover this — but it's worth verifying. PostCSS plugins that polyfill `:nth-child()` variants may now be unnecessary weight in your build pipeline if your supported browsers align with Baseline.

The range syntax gap for container style queries is a real footgun for anyone using tools like Stylelint or custom linting rules to enforce modern syntax. Your linter might not flag that you're writing range-syntax container style queries that only work behind a flag in some browsers. There's no automated solution mentioned in the source — just awareness and manual checking for now.

Nothing here introduces breaking changes to existing configurations, but if you use Polypane in your dev workflow, the new snippet store is a workflow addition, not a config change.

## Recommended next step

Audit your CSS build tooling against the Baseline status of `of <selector>` and name-only container queries. If you're still running PostCSS transforms or polyfills for these, you may be adding build time for no benefit. For the range syntax, be cautious in container query contexts — test specifically in Firefox and Safari, and don't assume that supporting the query type means supporting its range variant. The original article links out to detailed explanations by Ahmad Shadeed (range syntax) and Josh Comeau (scroll-driven animations) that are worth bookmarking before scroll-triggered animations land.

---

**Read the full announcement on CSS-Tricks** → [What's !important #11: 3D Voxel Scenes, Flying Focus, CSS Syntaxes, and More](https://css-tricks.com/whats-important-11/)