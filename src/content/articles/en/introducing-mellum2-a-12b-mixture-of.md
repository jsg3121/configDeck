---
id: "https://huggingface.co/blog/JetBrains/mellum2-launch"
tool: "huggingface"
title: "Introducing Mellum2: A 12B Mixture-of-Experts Model by JetBrains"
link: "https://huggingface.co/blog/JetBrains/mellum2-launch"
pubDate: 2026-06-01T15:45:17.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/JetBrains/mellum2-launch"
contentType: "commentary"
summary: "JetBrains released Mellum2, a 12B-parameter MoE model that activates 2.5B parameters per token, aimed at latency-sensitive code and text tasks. It's Apache 2.0 licensed and available on Hugging Face."
---

JetBrains announced Mellum2, a Mixture-of-Experts model with 12B total parameters designed for fast inference on text and code workloads. The release was published on the Hugging Face Blog with the model weights available under the Apache 2.0 license.

## What's actually new

Mellum2 is a from-scratch MoE architecture — not a fine-tune of an existing base. It activates only 2.5B of its 12B parameters per token, which is where the inference speed claim comes from: JetBrains reports more than 2x faster inference compared to similarly sized open models. The model is deliberately scoped to text and code, skipping multimodal capabilities entirely. JetBrains positions it not as a standalone general-purpose model but as a "focal" component — something you'd slot into a larger system for routing, RAG post-processing, sub-agent tasks, or context compression. The original Mellum was a code completion model; Mellum2 broadens that to natural language while keeping the same efficiency-first design philosophy. A full technical report with architecture details, training setup, and benchmark methodology is linked from the announcement on arXiv.

## What it means for your config

Mellum2 is a model release, not a library or framework update, so there's no direct config migration path to worry about. That said, if you're running inference pipelines that reference Hugging Face model IDs — in `transformers` configs, vLLM serving configs, or orchestration YAML — you'll want to note the new collection path (`JetBrains/mellum-2`) for when you swap it in. MoE models can behave differently from dense models in serving setups: tensor parallelism strategies, memory allocation, and expert routing overhead may require adjustments to your inference server configuration. The announcement doesn't detail specific serving recommendations (quantization support, recommended frameworks, or minimum hardware), so check the model card and technical report before committing to a deployment config. If you're using model routing logic that dispatches to different models based on task type — the kind of setup Mellum2 is explicitly designed for — this is a new candidate to add to your routing table alongside larger reasoning models.

## Recommended next step

Pull up the [model collection on Hugging Face](https://huggingface.co/collections/JetBrains/mellum-2) and the linked arXiv technical report. Before integrating, verify the benchmark results are relevant to your specific workload — "competitive with similarly sized models" covers a wide range of tasks, and performance on code generation versus general reasoning can vary significantly. If you're running multi-model agent systems where intermediate calls (routing, summarization, validation) are bottlenecked on latency or cost, Mellum2's 2.5B active parameter footprint makes it worth benchmarking against whatever you're currently using for those steps.

---

**Read the full announcement on Hugging Face Blog** → [Introducing Mellum2: A 12B Mixture-of-Experts Model by JetBrains](https://huggingface.co/blog/JetBrains/mellum2-launch)