---
id: "http://css-tricks.com/?page_id=243521"
tool: "csstricks"
title: "offset-path"
link: "https://css-tricks.com/almanac/properties/o/offset-path/"
pubDate: 2026-06-03T15:02:38.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/properties/o/offset-path/"
contentType: "commentary"
summary: "CSS-Tricks updated their Almanac entry for offset-path, the CSS property that defines a movement path for animated elements. The reference covers the rename from motion-path, current value support, rotation control, and integration with the Web Animations API."
---

CSS-Tricks has published an updated Almanac reference for the `offset-path` CSS property, which lets you define a path that an element follows during animation. The entry covers the property's evolution from its earlier `motion-path` name, its current syntax, and the broader family of `offset-*` properties.

## What's actually new

This is a reference article rather than a release announcement, but it captures important state. The property originally shipped as `motion-path` (with related `motion-*` properties) and has been renamed to `offset-path` in the spec — CSS-Tricks recommends using both syntaxes for now if you need broad compatibility. The spec says `offset-path` should accept `path()`, `shape()`, `url()`, shape functions like `circle()`, `ellipse()`, `polygon()`, and `none`, but CSS-Tricks notes that in practice only `path()` and `none` appear to work reliably. Even referencing an SVG `<path>` via `url()` within the same document doesn't seem to function. The entry also covers `offset-rotate` for controlling element orientation along the path, and notes that the Web Animations API can drive `offset-distance` from JavaScript while the path itself is defined in CSS.

## What it means for your config

If you're using any CSS linting or PostCSS setup, the dual-naming situation is worth paying attention to. Autoprefixer or PostCSS plugins that handle motion path properties should ideally emit both `motion-path` and `offset-path` declarations, plus both `motion-offset` and `offset-distance` in keyframes. Check whether your PostCSS config or stylelint rules flag one syntax as unknown — you may need to update allowed property lists. If you have a stylelint config with a `property-no-unknown` rule, the older `motion-*` properties could trigger false positives unless explicitly whitelisted.

There's no migration as such — this is a CSS spec rename, not a tooling change — but if you're generating CSS from a build pipeline, grep for `motion-path` and make sure the corresponding `offset-path` declaration exists alongside it. The source doesn't detail specific browser support thresholds, so check caniuse for current coverage before dropping the legacy names.

For teams using SVG animation libraries like GreenSock, `offset-path` is an alternative native approach that may reduce your JS dependency surface, but the limited value support (effectively just `path()`) means it's not a drop-in replacement for complex motion scenarios.

## Recommended next step

Audit your existing stylesheets and PostCSS plugin chain for any `motion-path` or `motion-offset` usage. Add the `offset-path` / `offset-distance` equivalents if they're missing. If you rely on stylelint, confirm that both the old and new property names are recognized in your config. Beyond that, the CSS-Tricks entry has inline demos and code samples that make it easy to experiment — read through the full reference to see where value support actually stands before committing to `offset-path` for production animation work.

---

**Read the full announcement on CSS-Tricks** → [offset-path](https://css-tricks.com/almanac/properties/o/offset-path/)