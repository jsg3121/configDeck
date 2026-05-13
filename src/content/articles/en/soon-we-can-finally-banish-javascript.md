---
id: "https://css-tricks.com/?p=393604"
tool: "csstricks"
title: "Soon We Can Finally Banish JavaScript to the ShadowRealm"
link: "https://css-tricks.com/soon-we-can-finally-banish-javascript-to-the-shadowrealm/"
pubDate: 2026-05-12T13:59:35.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/soon-we-can-finally-banish-javascript-to-the-shadowrealm/"
contentType: "commentary"
summary: "CSS-Tricks breaks down the TC39 ShadowRealm proposal, which introduces a new kind of JavaScript realm designed for code isolation without spawning a separate thread. The article explains what realms are, how they differ from Web Workers, and why a same-thread sandbox is useful."
---

CSS-Tricks published a deep-dive on the TC39 ShadowRealm proposal, explaining what it is and why it matters for JavaScript developers dealing with global scope pollution. The article walks through the concept of JavaScript realms from first principles before arriving at what ShadowRealms actually add.

## What's actually new

The ShadowRealm API is a TC39 proposal (the article doesn't specify the current stage) that introduces a new type of realm with its own global object and built-in intrinsics — but critically, *no separate thread*. Code offloaded to a ShadowRealm still executes on the main thread of the realm that created it. This is the key distinction from Web Workers or cross-origin iframes, which each get their own execution thread but come with the communication overhead that implies. The use cases the article highlights are concrete: running test suites in a clean-room environment where test execution can't interfere with test results, and sandboxing third-party libraries so they can't pollute or collide with your application's global scope. Think of it as getting isolation guarantees without the serialization tax of `postMessage`.

The article does a nice job clarifying a common misconception along the way: JavaScript the *language* is single-threaded, but JavaScript *applications* already span multiple threads via Workers and iframes. ShadowRealms don't change the threading model — they add isolation *within* a single thread, which is a meaningfully different primitive.

## What it means for your config

Since ShadowRealm is a language-level proposal and not a tooling or framework feature, there's no immediate config surface to worry about. That said, a few areas to watch as this matures:

- **Bundlers and transpilers**: Once ShadowRealm lands in engines, tools like Babel or TypeScript will need to understand it for type-checking and potential downleveling. Expect new `lib` entries or plugin requirements — but nothing is documented yet.
- **Linting**: ESLint rules around global scope usage (`no-global-assign`, `no-implicit-globals`) may eventually grow ShadowRealm-aware variants, but that's speculative at this point.
- **Testing frameworks**: The clean-room use case the article describes could eventually influence how test runners like Vitest or Jest configure isolation. Today they use separate processes or VMs; ShadowRealms could offer a lighter-weight option.

The announcement doesn't detail browser implementation status or polyfill availability, so there's nothing actionable for your build configs right now.

## Recommended next step

Read the full CSS-Tricks article — it's one of the better plain-language explanations of JavaScript's realm model and threading semantics, even setting ShadowRealms aside. If you maintain libraries that defensively clone built-ins (looking at you, `Array.isArray` checks against cross-realm values), or if you've hacked around global pollution with iframes, this proposal is worth tracking. Bookmark the TC39 proposal repo and check back when implementation flags start appearing in V8 or SpiderMonkey.

---

**Read the full announcement on CSS-Tricks** → [Soon We Can Finally Banish JavaScript to the ShadowRealm](https://css-tricks.com/soon-we-can-finally-banish-javascript-to-the-shadowrealm/)