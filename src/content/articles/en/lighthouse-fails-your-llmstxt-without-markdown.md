---
id: "https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/"
tool: "searchenginejournal"
title: "Lighthouse Fails Your Llms.txt Without Markdown Links"
link: "https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/"
pubDate: 2026-07-03T14:00:03.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/"
contentType: "commentary"
summary: "Lighthouse 13.3.0's new Agentic Browsing category includes an llms.txt audit that parses the file as markdown — failing any site whose llms.txt uses plain-text link formats instead of markdown bracket-paren syntax, even when the links are valid and the file is served as text/plain."
---

Search Engine Journal documents a concrete gotcha in Lighthouse's new Agentic Browsing audit category: your `llms.txt` file will fail the `llms-txt` check if it doesn't use markdown `[text](url)` link syntax, regardless of whether the links themselves are correct and functional. The article walks through the author's experience on their own site, where the fix was literally five characters per link.

## What's actually new

Lighthouse 13.3.0 shipped an "Agentic Browsing" category alongside the familiar Performance, Accessibility, SEO, and Best Practices panels. It includes six audits: accessibility tree well-formedness, cumulative layout shift, llms.txt discoverability, and three WebMCP checks. The category uses a fractional pass ratio rather than a 0–100 score.

The interesting tension here is the `.txt` extension and `text/plain` MIME type versus the `llmstxt.org` spec, which explicitly defines the format as markdown. Lighthouse enforces the spec strictly — if your links aren't in `[label](url)` format, the parser registers zero links and fails you. The article points out that auto-generated files from plugins like AIOSEO emit markdown syntax by default and likely pass, while hand-written files that use natural plain-text formatting probably don't. Format compliance and content quality are two completely different axes, and this audit only measures the first.

## What it means for your config

This isn't about build tool config in the traditional sense, but it's very much a "file format as contract" problem that developers maintaining `llms.txt` files need to know about. If you've been treating `llms.txt` as a freeform plain-text file — a reasonable assumption given the extension and MIME type — you'll need to convert your link lines to markdown syntax to pass the audit.

The conversion is mechanical: change `- Label: /path - Description` to `- [Label](/path): Description`. No structural rethinking required, just syntax. The file can stay `text/plain` on the wire; only the content format matters to the parser.

If you're generating `llms.txt` through a build step or CMS plugin, check whether it already emits markdown links. If it does, you're probably fine. If you're maintaining it by hand, budget a few minutes for the conversion.

Worth noting: the article also flags that three WebMCP audits returned "not applicable" without explanation, even on a site that does expose WebMCP via the imperative API. The audit tooling around agentic browsing is clearly still rough. Don't treat a passing score as a complete picture of agent-readiness.

## Recommended next step

Run the audit yourself: `npx lighthouse@latest https://yoursite.com --only-categories=agentic-browsing`. If your `llms.txt` fails with "File does not appear to contain any links," convert your link lines to markdown bracket-paren syntax and re-run. The more interesting exercise, as the article argues, is checking whether the file's *content* actually describes your site accurately — something no automated audit can tell you.

---

**Read the full announcement on Search Engine Journal** → [Lighthouse Fails Your Llms.txt Without Markdown Links](https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/)