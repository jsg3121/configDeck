---
id: "https://astro.build/blog/astro-7/"
tool: "astro"
title: "Astro 7.0"
link: "https://astro.build/blog/astro-7/"
pubDate: 2026-06-22T00:00:00.000Z
sourceName: "Astro Blog"
sourceUrl: "https://astro.build/blog/astro-7/"
contentType: "commentary"
summary: "Astro 7 ships a Rust-rewritten compiler, a new Rust-based Markdown/MDX processor as the default, Vite 8 with Rolldown, and 15–61% faster builds in benchmarks. It also introduces Advanced Routing, stabilized route caching, and developer experience improvements for AI coding agents."
---

The Astro team has announced Astro 7.0 on the Astro Blog, headlining a major performance push built around rewriting core infrastructure in Rust and upgrading to Vite 8. The release also ships new routing capabilities and quality-of-life features for AI-assisted development workflows.

## What's actually new

The `.astro` compiler has been fully rewritten from Go to Rust, built on top of Oxc and Lightning CSS. Markdown and MDX processing now defaults to Sätteri, a Rust-powered processor that replaces the unified/remark/rehype pipeline and bundles features like GFM, smart punctuation, heading IDs, container directives, and math support without requiring separate plugins. Vite 8 brings Rolldown as a unified Rust-based bundler replacing both esbuild and Rollup. The Astro team reports 15–61% faster builds across six real-world sites in their benchmarks, with the astro.build site itself going from ~63s to ~24s. Beyond performance, Astro 7 introduces Advanced Routing via a `src/fetch.ts` entrypoint, stabilizes route caching, adds experimental CDN cache providers for Netlify/Vercel/Cloudflare, and supports background dev server mode with structured JSON logging for coding agents.

## What it means for your config

The Sätteri default is the change most likely to touch your `astro.config.*`. If you were using remark-gfm, remark-smartypants, remark-math, or similar plugins for features that Sätteri now handles natively, you can remove those dependencies and enable features through a `features` object on the `satteri()` processor instead. If you depend on custom remark or rehype plugins, the unified pipeline is still available via `@astrojs/markdown-remark` — you'll need to explicitly set it as your Markdown processor.

The new Rust compiler introduces three breaking changes worth auditing: it no longer auto-corrects invalid HTML (no more silent element reordering or auto-closing), it enforces JSX-style strictness on unclosed tags and unterminated attributes, and whitespace between elements now follows JSX collapsing rules. That last one can visually break inline layouts — the fix is inserting `{' '}` expressions where you need explicit spaces.

On the Vite 8 side, a compatibility layer auto-converts existing `esbuild` and `rollupOptions` config to Rolldown equivalents, so most projects shouldn't need manual changes. Custom Vite plugins should keep working since Rolldown supports the Rollup plugin API, but edge cases are possible — test before deploying.

The `@astrojs/upgrade` CLI is the recommended migration path: `npx @astrojs/upgrade`. The team also links to a detailed upgrade guide for manual steps.

## Recommended next step

Run `npx @astrojs/upgrade` on a branch and check your build output. The compiler strictness changes and JSX whitespace behavior are the most likely sources of subtle regressions, especially in sites with loose HTML authored before linting was common. If you maintain a content-heavy site with dozens of remark/rehype plugins, test the Sätteri default carefully and fall back to `@astrojs/markdown-remark` where needed. If you're starting a new Astro project, you can scaffold one with the updated defaults right away. → [Generate an Astro config](/en/generator/astro)

---

**Read the full announcement on Astro Blog** → [Astro 7.0](https://astro.build/blog/astro-7/)