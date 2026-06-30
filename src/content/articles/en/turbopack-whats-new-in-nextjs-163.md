---
id: "/blog/next-16-3-turbopack"
tool: "nextjs"
title: "Turbopack: What's New in Next.js 16.3"
link: "https://nextjs.org/blog/next-16-3-turbopack"
pubDate: 2026-06-29T20:00:00.000Z
sourceName: "Next.js Blog"
sourceUrl: "https://nextjs.org/blog/next-16-3-turbopack"
contentType: "commentary"
summary: "Next.js 16.3 brings major Turbopack improvements focused on memory reduction in dev mode, persistent file system cache for builds, an experimental Rust-based React Compiler, and Vite-compatible import.meta.glob support."
---

The Next.js Blog published the third in a series of posts covering the upcoming Next.js 16.3 stable release, this time focused entirely on Turbopack bundler improvements. The theme is compiler performance — less memory, faster builds, and a smaller runtime footprint.

## What's actually new

The headline feature is dramatically reduced dev server memory usage. Turbopack can now evict cached results from memory to disk, leveraging the file system cache introduced in 16.1. Both memory eviction and the dev filesystem cache are on by default in 16.3. The team notes that the exact reduction varies per app — size of the route graph, how much was visited, and session length all factor in — but the post mentions reductions of up to 90% in the title.

The persistent file system cache, previously dev-only, now extends to `next build`. CI pipelines can preserve the `.next` directory between runs to speed up subsequent builds. Separately, the React Compiler — stable since Next.js 16.0 as a Babel transform — now has an experimental native Rust port integrated into Turbopack. Early tests against large apps like v0 showed 20–50% compilation speed improvements. Turbopack also picks up Vite-compatible `import.meta.glob`, which is watcher-aware in dev mode but only available when building with Turbopack (not the `--webpack` fallback). HMR got faster too: consolidating chunk-tracking subscriptions cut dev server cold start by over 15% on complex apps. Finally, Turbopack now tree-shakes its own runtime code, skipping WebAssembly and worker support unless your app actually uses them.

## What it means for your config

Several new config flags land with this release. `turbopackFileSystemCacheForBuild` enables the persistent build cache. `turbopackRustReactCompiler` opts into the native Rust React Compiler (you still need the React Compiler itself enabled). `turbopackMemoryEviction` exists as an escape hatch to disable the new memory eviction behavior if you're debugging cache issues — but it's on by default, so most teams won't touch it. There's also `turbopackLocalPostcssConfig` for monorepos that need per-package PostCSS resolution instead of a single root config.

The important interaction to watch: `import.meta.glob` is Turbopack-only. If your project still uses `--webpack` for builds, this API won't work, and any code relying on it will break under that flag. If you're straddling both bundlers during migration, keep that boundary clear.

The announcement doesn't specify the exact shape of these config values beyond their names — check the Next.js docs for the full schema before adding them to your `next.config` file.

## Recommended next step

If you're running long dev sessions on a large Next.js app, upgrading to 16.3 should provide immediate relief on memory pressure with zero config changes, since the key features default to on. For CI pipelines, the build cache is worth enabling early — persist your `.next` directory between runs and measure the delta. If you're already using the React Compiler via Babel, the Rust port is worth benchmarking on a branch, but treat it as experimental. For anyone setting up a fresh Next.js project, you can [generate a Next.js config](/en/generator/nextjs) that accounts for these new options.

---

**Read the full announcement on Next.js Blog** → [Turbopack: What's New in Next.js 16.3](https://nextjs.org/blog/next-16-3-turbopack)