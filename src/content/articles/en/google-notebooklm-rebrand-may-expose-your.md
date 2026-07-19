---
id: "https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/"
tool: "searchenginejournal"
title: "Google NotebookLM Rebrand May Expose Your Site To More AI Scraping"
link: "https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/"
pubDate: 2026-07-18T10:09:29.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/"
contentType: "commentary"
summary: "Google rebranded NotebookLM to Gemini Notebook and changed its user agent string from Google-NotebookLM to Google-GeminiNotebook, with the old string sunsetting in August 2026. Site owners blocking the old agent need to update firewall or .htaccess rules before then, since robots.txt doesn't apply to these user-triggered fetchers."
---

Search Engine Journal reports that Google's rebrand of NotebookLM to Gemini Notebook comes with a user agent swap that has real operational consequences for anyone actively blocking this fetcher. The old `Google-NotebookLM` user agent string will stop working in August 2026, giving site owners a narrow window to update their blocking rules.

## What's actually new

The user agent identifier changed from `Google-NotebookLM` to `Google-GeminiNotebook`, with full mobile and desktop agent strings now documented by Google. The old identifier remains functional until August 2026 as a grace period. Functionally, Gemini Notebook behaves identically to NotebookLM — it's a name change, not a product change. Notably, Project Mariner has been fully retired and removed from Google's user-triggered fetcher documentation as well.

The critical detail here: Gemini Notebook's fetcher is classified as a **user-triggered fetcher**, meaning it does not respect `robots.txt`. If you've been relying on `robots.txt` to block it, you were never blocking it in the first place. The only effective methods are firewall rules or `.htaccess` rewrites targeting the user agent string.

## What it means for your config

This is a straightforward string replacement in your server config. If you have `.htaccess` rewrite rules or WAF/firewall rules matching `Google-NotebookLM`, you need to update them to match `Google-GeminiNotebook` before August 2026. The source provides a working `.htaccess` example using `RewriteCond` against `%{HTTP_USER_AGENT}` — check the original article for the exact snippet.

A few things worth thinking about on the config side:

- **Nginx users**: The article only shows an Apache `.htaccess` example. You'll need to translate this to an `if ($http_user_agent ...)` block or handle it at the firewall level. The matching string is the same: `Google-GeminiNotebook`.
- **Firewall-level blocking**: If you're using Cloudflare, AWS WAF, or similar, update any user agent rules referencing the old string. Consider matching both old and new strings during the transition period so you're covered regardless of when Google flips the switch.
- **robots.txt won't help**: This is worth repeating because it's unintuitive. Google explicitly categorizes this as a user-triggered fetcher, so `Disallow` directives for this agent are simply ignored. Don't waste config lines on it there.
- **No interaction with other crawlers**: This change is scoped to Gemini Notebook only. It doesn't affect Googlebot, Google-Extended, or the `Google-Agent` fetcher (which is still documented separately for agent-based browsing).

## Recommended next step

Grep your server configs, `.htaccess` files, and firewall rules for `Google-NotebookLM` right now. If you find matches, add rules for `Google-GeminiNotebook` alongside the existing ones — keep both active until the old agent is fully retired in August 2026, then clean up. If you haven't been blocking this fetcher and you care about your content being scraped for AI-generated summaries, audio, and video without attribution or referral traffic, this is a good time to decide whether you want to start.

---

**Read the full announcement on Search Engine Journal** → [Google NotebookLM Rebrand May Expose Your Site To More AI Scraping](https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/)