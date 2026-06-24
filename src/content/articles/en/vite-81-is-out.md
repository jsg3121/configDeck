---
id: "https://vite.dev/blog/announcing-vite8-1"
tool: "vite"
title: "Vite 8.1 is out!"
link: "https://vite.dev/blog/announcing-vite8-1"
pubDate: 2026-06-23T00:00:00.000Z
sourceName: "Vite Blog"
sourceUrl: "https://vite.dev/blog/announcing-vite8-1"
contentType: "commentary"
summary: "Vite 8.1 ships experimental bundled dev mode for large apps, an experimental chunk import map for better cache efficiency, Wasm ESM integration support, and several config-level additions including custom HTML asset discovery and case-insensitive glob matching."
---

The Vite Blog announced Vite 8.1, building on the Rolldown-powered unified bundler introduced in Vite 8.0 back in March. The headline feature is an experimental bundled dev mode, but there are several other additions worth looking at if you maintain Vite configs at any scale.

## What's actually new

**Bundled dev mode** is the biggest item. Vite's identity has been its unbundled dev server, but large projects pay a real cost in request overhead. The new experimental mode bundles during dev as well, and the team reports roughly 15x faster startup and 10x faster full page reloads in a synthetic 10,000-component React app, with HMR staying instant. Real-world numbers from the Linear team showed cold starts up to 3x faster and 10x fewer network requests. Third-party plugin support is still limited — the team is explicit about that.

**Chunk import maps** address hash cascading in production builds: when one chunk's content changes, every chunk that imports it transitively gets re-hashed, busting caches unnecessarily. This experimental feature uses browser import maps to decouple chunk hashes, improving cache hit rates on deploys.

**Wasm ESM integration** lets you import `.wasm` files directly and call their exports — no plugin required anymore. **Lightning CSS** gets closer to becoming the default CSS processor, with two upstream features now landed. And there are two smaller but useful config additions: case-insensitive `import.meta.glob` matching and custom HTML element/attribute asset discovery.

## What it means for your config

Several of these features touch `vite.config.js` directly. Bundled dev mode is enabled via `experimental.bundledDev: true` (or the `--experimental-bundle` CLI flag). If you want to try Lightning CSS now, set `css.transformer: 'lightningcss'`. The new `html.additionalAssetSources` option lets you declare custom elements and attributes for asset pipeline discovery — handy if your project uses web components or custom image loading attributes with data attributes.

One thing to watch: the chunk import map feature is noted as incompatible with `experimental.renderBuiltUrl`. If your config relies on that option for custom asset URL rewriting, you can't combine them yet.

For plugin authors, the bundled dev mode may require changes. The team says documentation on plugin-side adjustments is still in progress, so if you maintain a Vite plugin, hold off on guaranteeing compatibility until that lands.

No breaking changes are called out for the 8.1 upgrade itself — the announcement frames it as additive and experimental. Migration from 8.0 should be straightforward.

## Recommended next step

If you work on a large app where dev server startup or full-reload times are a pain point, `experimental.bundledDev: true` is the obvious thing to try first — but keep expectations calibrated given the "experimental" label and limited third-party plugin support. For everyone else, the chunk import map and Lightning CSS options are lower-risk experiments worth enabling in a branch to see how they affect your build output and cache behavior. Read the linked design documents and discussion threads in the original post before committing to any of these in CI.

---

**Read the full announcement on Vite Blog** → [Vite 8.1 is out!](https://vite.dev/blog/announcing-vite8-1)