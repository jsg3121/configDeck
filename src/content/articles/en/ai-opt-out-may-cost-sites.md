---
id: "https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/"
tool: "searchenginejournal"
title: "AI Opt-Out May Cost Sites A Google Top Stories Spot"
link: "https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/"
pubDate: 2026-07-28T21:20:40.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/"
contentType: "commentary"
summary: "Google is placing Top Stories carousels inside AI Overviews for a notable share of news queries. This means publishers who opt out of AI features via Search Console may lose that carousel placement too — but Google hasn't confirmed it."
---

Search Engine Journal reports on NewzDash tracking data showing Google has started embedding the Top Stories carousel inside AI Overviews rather than displaying it as a separate module on the page. The concern: publishers who use Google's new Search Console opt-out for AI features may inadvertently lose their Top Stories visibility in the process.

## What's actually new

NewzDash found that among news searches where Top Stories appeared, 15.5% in the U.S. and 17.46% in the U.K. had the carousel nested inside the AI Overview. The two placements — standalone carousel and in-AI-Overview carousel — never appeared together in the same results. NewzDash CEO John Shehata characterizes this as a better spot on the page, though no click-through comparison data exists yet. The report notably doesn't disclose sample size, query volume, or the date range of the data.

Separately, Google's Search Console opt-out control for AI features began taking effect on June 17, initially rolling out to a subset of UK site owners and now expanding. Shehata's read — which he labels high-confidence but unproven — is that opting out would remove a publisher from any Top Stories carousel that lives *inside* an AI Overview, since the opt-out covers the entire feature. Google hasn't confirmed or denied this interpretation.

One important clarification from the article: `Google-Extended` in `robots.txt` is not the same thing as the Search Console AI opt-out. `Google-Extended` controls whether crawled content trains Gemini models and grounds answers in Gemini Apps. It does not affect whether a site appears in Google Search, AI Overviews, or Top Stories.

## What it means for your config

This is a `robots.txt` and Search Console settings concern, not a build-tooling config change. But for anyone managing site-level crawler directives, the distinction between `Google-Extended` and the Search Console AI opt-out is the thing to get right. Blocking `Google-Extended` in your `robots.txt` does not opt you out of AI Overviews or AI Mode — it only controls Gemini training and grounding. The AI feature opt-out is a separate Search Console toggle, currently available only to a subset of site owners.

Google has said the list of features covered by the opt-out will grow over time. There's no documented way to opt out of AI Overviews while retaining carousel placement inside them — the setting is all-or-nothing at the feature level. If you're a publisher weighing this, the honest answer is that the cost of opting out is still ambiguous. Google hasn't specified carousel behavior, and NewzDash hasn't tested it yet.

## Recommended next step

If you manage crawler config for a news site, audit whether you're conflating `Google-Extended` with the Search Console AI opt-out — they control different things. Before toggling the Search Console setting, read the original article for Shehata's full reasoning on the Top Stories implications, and watch for NewzDash's planned follow-up test. Until Google documents carousel behavior explicitly, any opt-out decision is being made with incomplete information.

---

**Read the full announcement on Search Engine Journal** → [AI Opt-Out May Cost Sites A Google Top Stories Spot](https://www.searchenginejournal.com/ai-opt-out-may-cost-publishers-a-top-stories-spot/584016/)