---
id: "https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/"
tool: "searchenginejournal"
title: "Google Analytics Is Adding Google Business Profile Data"
link: "https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/"
pubDate: 2026-06-05T14:57:11.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/"
contentType: "commentary"
summary: "Google has documented a native integration between Google Business Profile and Google Analytics, surfacing local engagement metrics like calls, directions, and bookings directly in GA reports. The integration has notable limitations around multi-location segmentation and data retention."
---

Google has published documentation for a native link between Google Business Profile (GBP) and Google Analytics, as covered by Search Engine Journal. Once connected, seven local engagement metrics — interactions, website clicks, calls, directions, messages, bookings, and menus — appear in a dedicated section within your Analytics reports.

## What's actually new

Before this integration, GA could only capture GBP traffic via UTM-tagged links on your profile, which primarily tracked website clicks. Actions like phone calls, direction requests, and bookings happened on the profile itself and stayed invisible to Analytics. The native link now pulls those into GA alongside your web data. You set it up in the Analytics Admin panel under Product links.

The constraints are worth reading carefully. If you link multiple GBP locations, Analytics aggregates the metrics — there's no way to segment or filter by individual location. The data can't be used in explorations, comparisons, or filters, and the integration doesn't work with subproperties. GA also only retains GBP data for six months, so you're looking at recent trends, not historical analysis. And notably, GA will display all seven metrics regardless of your business type, unlike the GBP dashboard which hides irrelevant ones. The link may not be available in every Analytics account yet.

## What it means for your config

This is a product-level integration configured through the GA Admin UI, not something that touches config files, build pipelines, or code deployments. There's no SDK change, no tag update, and no GTM container modification involved — it's a first-party link within Google's own ecosystem.

That said, if you're currently relying on UTM parameters on your GBP links to measure local engagement, this integration partially overlaps with that approach. It won't replace UTM tracking for website click attribution (UTMs still give you campaign-level granularity in acquisition reports), but for the other six metrics — calls, directions, messages, bookings, menus, and aggregate interactions — the native link provides data you couldn't get through UTMs at all. Teams running multi-location setups should note that the GBP Performance API and the profile dashboard still offer more granular, per-location reporting than this GA integration currently does.

## Recommended next step

If you manage a single-location business and already live in GA for reporting, check your Admin panel under Product links to see if the GBP linking option has appeared in your account. For multi-location brands or agencies, hold off on treating this as your primary local reporting channel — the lack of per-location segmentation and the six-month data ceiling make the native GBP dashboard and Performance API better fits for now. Keep an eye on whether Google adds location-level filtering in a future update; the current documentation doesn't commit to it.

---

**Read the full announcement on Search Engine Journal** → [Google Analytics Is Adding Google Business Profile Data](https://www.searchenginejournal.com/google-analytics-is-adding-google-business-profile-data/578107/)