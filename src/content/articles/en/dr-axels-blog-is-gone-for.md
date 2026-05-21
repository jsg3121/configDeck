---
id: "https://javascriptweekly.com/issues/786"
tool: "javascriptweekly"
title: "Dr. Axel's blog is gone (for now)"
link: "https://javascriptweekly.com/issues/786"
pubDate: 2026-05-19T00:00:00.000Z
sourceName: "JavaScript Weekly"
sourceUrl: "https://javascriptweekly.com/issues/786"
contentType: "commentary"
summary: "JavaScript Weekly #786 covers a dense week: an RFC to make npm install scripts opt-in, Dr. Axel Rauschmayer pulling his blog offline due to AI crawlers, Bun's Rust rewrite merge, Deno 2.8 teased, Angular 22 RC, and TanStack's post-compromise hardening efforts."
---

JavaScript Weekly #786 is a stacked issue. The headline is emotional — Dr. Axel Rauschmayer, whose books and blog posts have taught a generation of JS developers, has taken his content offline because AI crawlers overwhelmed his infrastructure — but the issue beneath it carries several stories with direct tooling and config implications worth unpacking.

## What's actually new

The biggest operational item is an RFC from Jamie Magee (GitHub/npm) proposing that npm make dependency install scripts opt-in rather than running them by default. npm is currently the only major package manager that auto-runs `postinstall` and similar lifecycle scripts, and the RFC argues this is a meaningful security surface. The newsletter also flags `npq`, a tool that audits packages — including install script presence — before installing them.

Beyond that: Bun's controversial Rust-based rewrite has been merged, with open questions about AI-ported code quality. Deno 2.8 is imminent, promising better Node.js compatibility, `import defer`, and TypeScript 6.0.3 support. Angular 22 hit Release Candidate status, with signal-based forms and `OnPush` change detection becoming the default. TanStack published details on how they're hardening their supply chain after last week's npm compromise, where an attacker pushed malicious package versions. And ESLint Config Inspector 3.0 shipped — a visual tool for navigating flat configs.

## What it means for your config

The npm install scripts RFC is the one to watch. If it lands, any project relying on `postinstall` hooks for native module compilation, code generation, or setup steps will need to explicitly opt users in. That means `.npmrc` configs, CI pipeline scripts, and monorepo tooling that depend on implicit lifecycle script execution could break. It's worth auditing which of your dependencies use install scripts now — `npq` or `npm query` can help with that — so you're not surprised later.

Angular 22's shift to `OnPush` as the default change detection strategy will affect how new projects are scaffolded and could trip up teams copying older config patterns. If you're on Angular and haven't adopted `OnPush` yet, this RC period is the time to test.

For Deno users, the 2.8 teaser mentions `import defer` support, which could change how entry point configs and module loading strategies are structured, but details are thin until the release actually drops.

The TanStack compromise is a reminder to pin dependency versions and enable lockfile validation in CI. If you haven't already, review your `package-lock.json` or equivalent for any TanStack packages and ensure you're on clean versions.

ESLint Config Inspector 3.0 doesn't change your config files, but it makes debugging flat configs significantly easier — useful if you've migrated from `.eslintrc` and are still wrestling with rule resolution order.

## Recommended next step

If you maintain packages with `postinstall` scripts or depend on ones that do, read the npm RFC discussion now and leave feedback — this will shape how npm works for everyone. For Angular teams, spin up a test project against the 22 RC to validate your component configs against the new `OnPush` default. And if you were hit by or are worried about the TanStack incident, the team's hardening post is a practical checklist worth adopting for your own packages.

---

**Read the full announcement on JavaScript Weekly** → [Dr. Axel's blog is gone (for now)](https://javascriptweekly.com/issues/786)