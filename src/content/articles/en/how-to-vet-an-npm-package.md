---
id: "https://javascriptweekly.com/issues/788"
tool: "javascriptweekly"
title: "How to vet an npm package in 2026"
link: "https://javascriptweekly.com/issues/788"
pubDate: 2026-06-02T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/788"
contentType: "commentary"
summary: "JavaScript Weekly #788 spotlights a practical npm vetting checklist alongside npm 11.16.0's new opt-in install-script policy, plus major releases from Ember, Node.js, and Astro."
---

JavaScript Weekly issue #788 leads with Gabor Koos's guide to evaluating npm packages in 2026, emphasizing provenance attestation, install script auditing, CI quality, and maintainer responsiveness — moving well past the "check the star count" era. The issue also packs a dense set of ecosystem releases and a timely supply-chain security story.

## What's actually new

The npm vetting article provides a checklist that treats provenance attestation as a first-class signal — a direct consequence of npm's ongoing push toward verifiable publishing. Separately, npm 11.16.0 shipped with initial support for an opt-in install-script policy via `allowScripts`, currently in advisory-warning-only mode. These two items reinforce each other: one helps you audit before you install, the other gives you a policy lever at install time.

On the supply-chain threat side, dozens of Red Hat npm packages were backdoored, which makes the vetting checklist feel less academic and more urgent. In releases, Ember 7.0 drops deprecated features accumulated since 6.0, Node.js 26.3.0 upgrades to npm 11.16.0 and demotes macOS x64 to tier 2, and Astro 6.4 adds a pluggable Markdown pipeline with a Rust-based processor. The date-fns library is also heading toward a Temporal-first future, with v4.4 shipping leaner and v5.0 entering alpha.

## What it means for your config

The `allowScripts` feature in npm 11.16.0 is the most config-relevant item here. It introduces an opt-in policy that controls which packages are permitted to run install scripts. Right now it only emits warnings, but once it moves past advisory mode, teams will need to decide whether to enable it in `.npmrc` or CI configuration and maintain an allowlist. If you're on Node.js 26.3.0, you already have this npm version bundled.

For Ember projects, the 7.0 release removes deprecated APIs — so if your build or lint configs reference deprecated Ember features, expect breakage. The Ember blog post (linked in the original) catalogs what changed since 6.0; reviewing it before upgrading is essential.

Astro 6.4's pluggable Markdown pipeline could affect `astro.config.*` if you're using custom Markdown plugins or remark/rehype chains, but the source doesn't detail the exact config surface. Check Astro's docs for specifics before migrating.

The date-fns Temporal shift doesn't require config changes today, but if you're importing date-fns in a project that also polyfills `Temporal`, keep an eye on v5.0 alpha for potential overlap or conflicts.

## Recommended next step

If you maintain any internal or production Node.js project, this is a good week to do two things: first, read the npm vetting checklist from Gabor Koos and compare it against your current dependency review process — provenance attestation in particular is easy to check and still widely ignored. Second, try enabling `allowScripts` in a non-critical project to see what warnings surface; it's a low-risk way to get ahead of what will likely become a default-on policy in a future npm release. Both actions take under an hour and directly reduce supply-chain exposure.

---

**Read the full announcement on JavaScript Weekly** → [How to vet an npm package in 2026](https://javascriptweekly.com/issues/788)