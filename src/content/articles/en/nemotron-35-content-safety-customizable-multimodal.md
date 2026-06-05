---
id: "https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety"
tool: "huggingface"
title: "Nemotron 3.5 Content Safety: Customizable Multimodal Safety for Global Enterprise AI"
link: "https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety"
pubDate: 2026-06-04T18:57:45.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety"
contentType: "commentary"
summary: "NVIDIA releases Nemotron 3.5 Content Safety, a 4B-parameter model built on Gemma 3 that adds custom policy enforcement, auditable reasoning traces, and a public safety dataset to its existing multimodal and multilingual classification capabilities."
---

NVIDIA announced Nemotron 3.5 Content Safety on the Hugging Face Blog, upgrading its safety classifier line with custom policy support, a THINK reasoning mode, and an open training/evaluation dataset. The model is a LoRA-adapted Gemma 3 4B IT that targets real-time inference on 8GB+ VRAM GPUs.

## What's actually new

The headline feature over its predecessor (Nemotron 3) is **custom policy enforcement at inference time**: you pass a natural-language policy specification alongside the input, and the model reasons against that policy rather than only its built-in Aegis 2.0 taxonomy. This enables category suppression (e.g., ignoring "violence" flags when a DevOps tool says "terminate a process") and injection of organization-specific risk categories. The model also gains a THINK mode that emits step-by-step reasoning traces before delivering its safe/unsafe verdict — useful for compliance logging and human review, though it adds latency. When latency matters, you can disable THINK and get a low-latency binary verdict. NVIDIA is also releasing the multimodal, multilingual safety dataset used for training, including the condensed reasoning traces — a notable move since most open-source safety models don't ship their data. Language coverage stays at 12 explicitly trained languages, with zero-shot generalization across roughly 140 languages inherited from the Gemma 3 base.

## What it means for your config

This model lives in the inference/guardrail layer rather than in build-time config, so there's no direct impact on typical CI or linting configurations. That said, if you're integrating content safety into a deployment pipeline — say, as a guardrail sidecar or a pre/post-processing step in an LLM serving stack — the three output modes (binary, binary+categories, THINK) are selected at inference time, which means your orchestration config (whether that's a NeMo Guardrails YAML, a custom FastAPI wrapper, or something else) will need to specify the desired mode. The custom policy input is also a runtime concern: you'll likely template it per-deployment context.

The article doesn't detail specific config file formats, environment variables, or integration hooks beyond the output mode descriptions. If you're running this behind NVIDIA's NIM or a vLLM-style serving layer, watch for updated deployment docs that clarify how the LoRA adapter loading and policy injection are parameterized. We'll revisit once those specifics land.

## Recommended next step

If you're evaluating open-weight safety classifiers for a production guardrail pipeline, the released dataset is arguably more valuable than the model itself — it gives you a way to benchmark your existing classifier against NVIDIA's training distribution and spot coverage gaps in your own taxonomy. Start by reviewing the dataset and the Aegis 2.0 category alignment on the Hugging Face model page, then test the THINK mode output against a handful of your known edge cases to see whether the reasoning traces actually help your review workflow or just add token cost.

---

**Read the full announcement on Hugging Face Blog** → [Nemotron 3.5 Content Safety: Customizable Multimodal Safety for Global Enterprise AI](https://huggingface.co/blog/nvidia/nemotron-3-5-content-safety)