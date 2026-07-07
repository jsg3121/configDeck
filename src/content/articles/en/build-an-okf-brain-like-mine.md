---
id: "https://www.searchenginejournal.com/build-an-okf-brain-like-mine/580661/"
tool: "searchenginejournal"
title: "Build An OKF Brain Like Mine!"
link: "https://www.searchenginejournal.com/build-an-okf-brain-like-mine/580661/"
pubDate: 2026-07-06T13:00:47.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/build-an-okf-brain-like-mine/580661/"
contentType: "commentary"
summary: "Marie Haynes walks through how she built a personal knowledge base using Google's Open Knowledge Format (OKF) — a standardized markdown-plus-YAML structure designed to be readable by AI agents. The piece covers folder structure, YAML frontmatter types, index files, knowledge graphs, and automated playbooks."
---

Marie Haynes published a detailed walkthrough on Search Engine Journal showing how she built a personal "OKF brain" — a structured knowledge base using Google's Open Knowledge Format that AI agents can navigate without custom tooling. The article includes her folder layout, frontmatter conventions, and practical examples of automating SEO workflows with it.

## What's actually new

OKF itself isn't new — Google Cloud announced it earlier — but Haynes's piece is one of the first public, detailed accounts of someone building a non-trivial personal system on top of it. Her structure uses YAML frontmatter with typed categories: concepts, entities, playbooks, references, and systems. Each OKF bundle starts with an `index.md` that acts as a table of contents so an agent can scope its retrieval rather than running RAG across the entire knowledge base. She credits Andrej Karpathy's "LLM Wiki" idea for the concept-extraction and linking approach that produces a visualizable knowledge graph. On the automation side, she describes a system that monitors Google's documentation daily and updates reference files when changes are detected. The playbook layer is where this gets operationally interesting: she reports that a Google update impact analysis that previously took two days now takes hours when her agent follows a documented procedural playbook.

## What it means for your config

This is less about traditional project config and more about a new category of structured files that live alongside — or entirely outside — your codebase. If you're managing knowledge bases, documentation pipelines, or agent-facing content, the key structural decisions are in your YAML frontmatter schema and your index file design. OKF follows a spec hosted on GitHub under `GoogleCloudPlatform/knowledge-catalog`, so if you're considering adoption, that spec is the authoritative source for field names and file conventions. Haynes's article doesn't detail version pinning, schema validation tooling, or how OKF bundles interact with existing documentation systems like Docusaurus or MkDocs. There's no migration path discussed because OKF is additive — it's a new set of markdown files, not a replacement for anything you already have. If your team already maintains structured markdown with frontmatter (common in static site generators or internal wikis), the effort is mostly about conforming your `type` fields and building the index file to OKF's conventions. No breaking changes to worry about since there's nothing to break yet — this is greenfield.

## Recommended next step

If this interests you, start with the OKF spec on GitHub (`GoogleCloudPlatform/knowledge-catalog`) rather than jumping straight into prompt-driven generation. Understanding the spec's actual field requirements will save you from building a structure that looks like OKF but doesn't conform. Haynes provides a starter prompt and a list of reference links in her article that you can hand to an AI coding agent to scaffold an initial bundle. The more useful exercise, though, is deciding what your frontmatter types should be and how granular your index needs to get — that's the architectural decision that determines whether an agent can efficiently navigate your knowledge or ends up scanning everything anyway. Start small: pick one domain you document heavily, structure it as an OKF bundle, and test whether an agent can answer questions from the index alone.

---

**Read the full announcement on Search Engine Journal** → [Build An OKF Brain Like Mine!](https://www.searchenginejournal.com/build-an-okf-brain-like-mine/580661/)