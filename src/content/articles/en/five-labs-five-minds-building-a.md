---
id: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2"
tool: "huggingface"
title: "Five labs, five minds: building a multi-model finance drama on small models"
link: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2"
pubDate: 2026-06-06T19:02:33.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2"
contentType: "commentary"
summary: "A Hugging Face hackathon project runs four different labs' small models as separate agents in an emergent economy simulation, surfacing practical lessons about serving heterogeneous models, information isolation, and bounded memory in multi-agent setups."
---

A Hugging Face Blog post details "Thousand Token Wood v2," a hackathon project that runs four small models from different labs — OpenAI's gpt-oss-20b, OpenBMB's MiniCPM3-4B, NVIDIA's Nemotron-Mini-4B, and a fine-tuned Qwen 0.5B — as distinct agents in a finance-flavored simulation. The write-up is an engineering field report, not a product launch, and it's one of the more honest accounts of what multi-model serving actually costs in config headaches.

## What's actually new

The interesting claim here isn't the game itself — it's that heterogeneous model serving is "almost entirely a serving-layer problem, not a modeling problem." The author reports that vLLM 0.22.1 JIT-compiles kernels at load and requires `nvcc` present, which broke all four models identically until the base Docker image was swapped to a CUDA devel image. Beyond that, per-model quirks were small: MiniCPM3 needed `trust_remote_code`, Nemotron loaded clean, and gpt-oss-20b required output parsing to strip an analysis preamble from its channel format. All four fit under a 24GB L4 GPU budget. The author's core architectural bet is a tolerant JSON parse-and-repair layer that normalizes every model's output; once that exists, adding a new model is a config entry rather than a code change. The post also describes a tested information firewall — hidden flags are kept entirely off-prompt and a test scans every agent prompt every turn for banned tokens — and a bounded-summary approach to persistent memory that avoids prompt inflation.

## What it means for your config

This isn't a library release or API change, so there's no migration path to worry about. But if you're configuring vLLM-based serving for multiple models, the `nvcc` dependency in vLLM 0.22.1 is a concrete gotcha worth noting — your base image choice matters, and a minimal runtime image will fail silently. The per-model flags (`trust_remote_code`, quantization format, output channel parsing) are exactly the kind of one-liner config differences that bite you in CI when you add a second or third model to a pipeline. The post doesn't provide a reusable config template or schema, but the pattern it describes — a single serving layer with per-model config entries feeding into a shared output normalization layer — is a reasonable architecture reference for anyone building multi-model agent systems on Hugging Face models. The announcement doesn't detail specific config file formats or tooling integrations beyond what's summarized here.

## Recommended next step

If you're running or planning multi-model agent setups, the most transferable takeaway is to audit your serving layer's system dependencies (especially CUDA toolkit presence for vLLM) before you debug model-level issues. The author's parse-and-repair pattern for normalizing heterogeneous model outputs is worth studying in the open-source traces linked from the original post. Read the full write-up for the specific test methodology around information leakage — the "scan every prompt for banned tokens" approach is a simple, steal-worthy idea for any agent system handling asymmetric information.

---

**Read the full announcement on Hugging Face Blog** → [Five labs, five minds: building a multi-model finance drama on small models](https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2)