---
id: "https://css-tricks.com/?page_id=394786"
tool: "csstricks"
title: "translateZ()"
link: "https://css-tricks.com/almanac/functions/t/translatez/"
pubDate: 2026-06-25T13:18:56.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/almanac/functions/t/translatez/"
contentType: "commentary"
summary: "CSS-Tricks published an almanac entry on the translateZ() CSS function, covering syntax, the requirement for perspective, and the old GPU-compositing trick."
---

CSS-Tricks has added an almanac reference page for the `translateZ()` CSS function, covering how it shifts elements along the Z-axis in 3D space. The entry walks through syntax, the mandatory relationship with `perspective`, and a performance note about GPU compositing.

## What's actually new

This is a reference/documentation page rather than a feature announcement — `translateZ()` has been part of the CSS Transform Module Level 2 spec for a while, and it works in all modern browsers. The article's main contribution is clearly explaining that `translateZ()` does nothing visible without either the `perspective` property on a parent or the `perspective()` function inline before the translate. It also distinguishes `translateZ()` from `scale()`: moving an element closer along the Z-axis makes it *appear* larger due to perspective projection, but the element's actual dimensions haven't changed. The entry includes interactive demos that rotate a parent container to prove the point visually.

The article also mentions the `translateZ(0)` trick — applying a zero-distance Z translation to force the browser to promote an element to its own compositing layer, shifting rendering to the GPU. This is a well-known (and somewhat dated) performance hack. Modern browsers generally handle layer promotion more intelligently now, and the `will-change` property is the more intentional way to signal compositing hints. If you're still sprinkling `translateZ(0)` around to fix animation jank, it's worth checking whether `will-change: transform` is a cleaner fit for your situation.

## What it means for your config

There's no config surface here in the traditional sense — `translateZ()` is plain CSS, not a build tool or framework option. That said, if you use CSS linting tools like Stylelint, be aware that some rule sets flag `translateZ(0)` as a "no-op" transform or discourage it in favor of `will-change`. If your team enforces strict Stylelint configs, you may need to allow-list `translateZ(0)` or explicitly switch to `will-change: transform` to keep your pipeline clean. The article doesn't address tooling or preprocessor considerations, so there's nothing else to flag on the config side.

One tangential note: if you're using CSS-in-JS libraries or utility frameworks like Tailwind, the syntax for applying `translateZ()` varies. Tailwind, for example, doesn't ship a `translate-z` utility by default — you'd need to use arbitrary values or extend your config. The CSS-Tricks article doesn't cover framework integration, so consult your framework's docs for the exact approach.

## Recommended next step

If you write 3D transforms and have ever been confused about why `translateZ()` appeared to do nothing, read through the interactive demos in the original article — they make the perspective dependency immediately obvious. For anyone still using `translateZ(0)` purely as a compositing hack, audit those instances and consider whether `will-change: transform` is a better signal for modern browsers. Neither approach is free; both create new compositing layers that consume memory, so apply them deliberately rather than globally.

---

**Read the full announcement on CSS-Tricks** → [translateZ()](https://css-tricks.com/almanac/functions/t/translatez/)