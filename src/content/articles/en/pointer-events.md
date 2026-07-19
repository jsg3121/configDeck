---
id: "http://css-tricks.com/?page_id=18170"
tool: "csstricks"
title: "pointer-events"
link: "https://css-tricks.com/almanac/properties/p/pointer-events/"
pubDate: 2026-07-15T19:57:51.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/properties/p/pointer-events/"
contentType: "commentary"
summary: "CSS-Tricks published an updated almanac reference for the pointer-events CSS property, covering its full value set including SVG-specific keywords, inheritance behavior, and common gotchas around disabled states and text selection."
---

CSS-Tricks has put out a thorough almanac entry on the `pointer-events` CSS property. It covers the full syntax — eleven keyword values in total — along with interactive demos showing how each one affects hit-testing in both HTML and SVG contexts.

## What's actually new

This isn't an announcement of a new feature; it's a reference article. But there's useful depth here that goes beyond the typical "`pointer-events: none` makes things unclickable" summary. The article frames the property around the browser's hit-testing model: `pointer-events` doesn't disable events, it changes *which element* the browser selects as the event target. That distinction matters because event propagation still works — a parent with `pointer-events: none` will still fire listeners if a child (with `pointer-events: auto`) inside it is clicked. The piece also explicitly calls out that `pointer-events: none` does not prevent keyboard focus or text selection, pointing developers toward `inert` and `user-select` respectively when those behaviors are actually what's needed. The nine SVG-only values (`visiblePainted`, `visibleFill`, `bounding-box`, etc.) get individual explanations, which is hard to find documented this clearly elsewhere.

## What it means for your config

There's no config-file impact here — `pointer-events` is a standard CSS property, not a tooling option. That said, if you're using linting tools like Stylelint, it's worth knowing that `pointer-events` accepts SVG-only values that are perfectly valid CSS but may trigger warnings in configurations that lint for HTML-only usage patterns. If your project involves inline SVG and your Stylelint config restricts property values, you may need to allowlist values like `visiblePainted` or `bounding-box`. Beyond that, no migrations, no breaking changes, and no interaction with build tooling to worry about.

## Recommended next step

If you've been using `pointer-events: none` as a quick way to "disable" UI elements, read the full article — particularly the sections on keyboard focus and event propagation. The practical takeaway is that `pointer-events` is a hit-testing tool, not a disability mechanism. For actual disabling, reach for the `disabled` attribute on form controls or the `inert` attribute for broader sections. The interactive demos in the original are especially useful for understanding the SVG values, which are hard to reason about from text alone.

---

**Read the full announcement on CSS-Tricks** → [pointer-events](https://css-tricks.com/almanac/properties/p/pointer-events/)