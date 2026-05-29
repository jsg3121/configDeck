---
id: "https://astro.build/blog/astro-640/"
tool: "astro"
title: "Astro 6.4"
link: "https://astro.build/blog/astro-640/"
pubDate: 2026-05-28T00:00:00.000Z
sourceName: "Astro Blog"
sourceUrl: "https://astro.build/blog/astro-640/"
contentType: "commentary"
summary: "Astro 6.4 makes the Markdown pipeline pluggable, ships a Rust-based Markdown processor called Sätteri, and adds Cloudflare helpers for advanced routing."
---

The Astro team announced Astro 6.4 on the Astro Blog. The headline features are a new `markdown.processor` API that lets you swap out the entire Markdown pipeline, a Rust-based alternative processor called Sätteri, and Cloudflare-specific helpers for the experimental advanced routing introduced in 6.3.

## What's actually new

The `markdown.processor` config option decouples Astro from its long-standing unified/remark/rehype pipeline. The default is still `unified()`, so nothing breaks, but you can now drop in a completely different processor. Alongside this, the new `@astrojs/markdown-satteri` package offers a Rust-powered Markdown and MDX pipeline — the team reports that switching the Astro and Cloudflare docs sites to Sätteri shaved over a minute off each build. The catch: Sätteri does not run remark or rehype plugins, so if your build depends on those, you stay on `unified()` or port your plugins. For Cloudflare users, `@astrojs/cloudflare` now exports a `cf()` helper usable with both a custom fetch handler and Hono middleware, handling KV session binding, static assets, `locals.cfContext`, client address, `waitUntil`, and prerendered error pages.

## What it means for your config

This release directly changes how `astro.config.*` is written. The top-level `markdown.remarkPlugins`, `markdown.rehypePlugins`, `markdown.remarkRehype`, `markdown.gfm`, and `markdown.smartypants` options are now **deprecated**. They still work today, but will be removed in Astro 8.0. The migration path is explicit: move those options into a `unified({...})` call passed to the new `markdown.processor` field. If you're switching to Sätteri, the config shape is different — you configure features like `directive` directly on `satteri({...})` rather than through remark plugins.

For Cloudflare deployments using advanced routing, the `cf()` helper replaces what was previously manual wiring of bindings and context. If you had custom fetch handler boilerplate for session KV, static assets, or `cfContext`, this consolidates it into a single function call.

No other breaking changes are called out in the announcement, but the deprecation of five top-level markdown options means you should plan a config update before 8.0 lands. If you maintain shared Astro configs or monorepo presets, now is a reasonable time to start moving plugin declarations under `markdown.processor`.

## Recommended next step

If you're on Astro 6.x, run `npx @astrojs/upgrade` and migrate your markdown plugin config to the new `processor` API while the old options still work — it's easier to do incrementally than in a rush before 8.0. If your project is Markdown-heavy and you don't rely on remark/rehype plugins, try Sätteri and compare build times. For a clean starting point, you can [generate an Astro config](/en/generator/astro) and adapt from there.

---

**Read the full announcement on Astro Blog** → [Astro 6.4](https://astro.build/blog/astro-640/)