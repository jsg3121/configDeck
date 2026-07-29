---
id: "/blog/announcements/new-api-docs-beta?1784919600000"
tool: "nodejs"
title: "Check out the New Node.js API Documentation Preview"
link: "https://nodejs.org/en/blog/announcements/new-api-docs-beta"
pubDate: 2026-07-24T19:00:00.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/announcements/new-api-docs-beta"
contentType: "commentary"
summary: "The Node.js project has a beta preview of redesigned API docs at beta.docs.nodejs.org, built on a new standalone tool called doc-kit, and is actively requesting community feedback before making it the default."
---

The Node.js project announced a public beta of its redesigned API documentation, now live at beta.docs.nodejs.org. As detailed on the Node.js Blog, the team is looking for real-world usage and feedback before it replaces the current docs.

## What's actually new

The underlying content is unchanged — pages are still generated from the same Markdown files in the `nodejs/node` repository. What's different is the presentation layer: reworked navigation, layout, and readability, plus a unified design system shared with the main nodejs.org website. The headline addition is built-in search, which the API docs have never had before — a search box on every page with a keyboard shortcut. Other new features include a persistent sidebar listing every module, an always-visible per-page table of contents, better small-screen support, and an `llms.txt` file that gives AI tools a structured entry point to the API reference. Pages also remain usable with JavaScript disabled and offline, which is a nice touch for anyone working in constrained environments.

Under the hood, the old documentation generator has been replaced by `doc-kit`, a standalone tool developed by the Node.js project. Bug reports, feature requests, and contributions are tracked in the `nodejs/doc-kit` repository rather than the main Node.js repo. Existing features like ESM/CJS code switching, stability badges, version history, and light/dark themes have all carried over.

## What it means for your config

This is a documentation infrastructure change, not a runtime or configuration change. Nothing about how you write `package.json`, `tsconfig.json`, `.nvmrc`, or any other Node.js-adjacent config file is affected. There are no breaking changes, no new CLI flags, and no migration steps for your projects.

That said, if you maintain tooling or scripts that scrape or link to the current Node.js docs (e.g., custom linter rule descriptions pointing at `nodejs.org/api/...`), it's worth watching whether URLs change when the beta becomes the default. The announcement doesn't specify URL-level backwards compatibility, so keep an eye on the `doc-kit` repository for updates on that front.

The `llms.txt` addition is worth noting if you build internal developer tools or AI-assisted workflows that reference Node.js APIs — it provides a cleaner ingestion path than scraping HTML.

## Recommended next step

Visit [beta.docs.nodejs.org](https://beta.docs.nodejs.org) and use it for actual work for a day or two. Try the search. Try it on your phone. If something feels off — broken links, rendering issues, missing content — open an issue on the `nodejs/doc-kit` repository. The team is explicitly asking for feedback before flipping the switch, and this is the window where your input will actually shape the result.

---

**Read the full announcement on Node.js Blog** → [Check out the New Node.js API Documentation Preview](https://nodejs.org/en/blog/announcements/new-api-docs-beta)