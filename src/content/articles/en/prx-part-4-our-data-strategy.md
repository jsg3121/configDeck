---
id: "https://huggingface.co/blog/Photoroom/prx-part4-data"
tool: "huggingface"
title: "PRX Part 4: Our Data Strategy"
link: "https://huggingface.co/blog/Photoroom/prx-part4-data"
pubDate: 2026-07-06T15:30:55.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/Photoroom/prx-part4-data"
contentType: "commentary"
summary: "Photoroom details the data pipeline behind PRX, their 7B image generation model, covering dataset assembly, captioning strategy, storage format choices (Lance + MDS), and measured tradeoffs like JPEG vs PNG training data."
---

Photoroom published Part 4 of their PRX series on the Hugging Face Blog, focused entirely on the data pipeline that feeds their 7B-parameter image generation model. This installment covers dataset philosophy, captioning, storage formats, and some empirical validation of their encoding choices.

## What's actually new

The post lays out a concrete two-format pipeline: **Lance** for dataset curation and feature engineering (columnar, supports predicate pushdown, scalar indexes, vector search), and **MDS (Mosaic Data Shards)** for streaming during distributed training via Mosaic Composer. Lance handles the exploratory, mutable side; MDS handles the rigid, high-throughput streaming side. That's a clean separation worth noting if you work with large-scale training data.

On captioning, Photoroom switched to long, faithful VLM-generated captions for all images. Their argument is that accurate long captions turn visual "noise" (screenshots, logos, text in images) into conditioned attributes the model can learn to include or exclude, which lets them keep filtering deliberately light. They also moved from pre-computing text latents with T5Gemma to computing them on-the-fly after switching to Qwen3-VL as the text encoder. At 7B scale the throughput cost was only about 3–4%, and it eliminated the need to rewrite terabytes of stored latents when swapping encoders.

The JPEG vs. PNG analysis is the most empirically grounded section. They measured PSNR and LPIPS across repeated decode/encode cycles at JPEG quality 92, then trained two identical models — one on JPEG, one on PNG — and found no meaningful difference in output quality or detectable quantization artifacts. The post includes specific numbers in tables; see the original for details.

## What it means for your config

This post doesn't introduce new libraries, APIs, or config surfaces that would affect your project setup. It's a design rationale document. That said, if you're building ML data pipelines, the Lance-for-curation / MDS-for-streaming split is a practical architectural pattern. If you currently use MDS and find yourself constantly rewriting shards to add columns or apply filters, Lance might be worth evaluating as the upstream format. The post also implicitly validates computing text latents at training time rather than pre-baking them — relevant if your training config pre-computes encoder outputs and you're considering an encoder swap. No migration steps or breaking changes apply here; this is pipeline design guidance, not a software release.

## Recommended next step

If you're training diffusion models at scale, read the full post for the empirical tables on JPEG quality degradation and the throughput cost of on-the-fly text encoding — those are the sections with the most transferable data points. If you're already using Mosaic Streaming, consider whether adding Lance as a curation layer upstream of your MDS conversion would reduce the number of times you rewrite your shards. The earlier parts of the PRX series (architecture, training design, speedrun) provide the context for why these data decisions were made.

---

**Read the full announcement on Hugging Face Blog** → [PRX Part 4: Our Data Strategy](https://huggingface.co/blog/Photoroom/prx-part4-data)