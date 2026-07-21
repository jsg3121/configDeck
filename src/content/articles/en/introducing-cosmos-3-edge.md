---
id: "https://huggingface.co/blog/nvidia/cosmos3edge"
tool: "huggingface"
title: "Introducing Cosmos 3 Edge"
link: "https://huggingface.co/blog/nvidia/cosmos3edge"
pubDate: 2026-07-20T15:58:51.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/cosmos3edge"
contentType: "commentary"
summary: "NVIDIA released Cosmos 3 Edge, a 4B-parameter open world model for robotics and vision AI on edge devices, now available on Hugging Face. The model combines autoregressive and diffusion transformer towers with a shared representation to handle scene understanding, prediction, and action generation in one package."
---

NVIDIA announced the release of Cosmos 3 Edge on the Hugging Face Blog, making the model available through Hugging Face's Cosmos 3 repository. It's a 4-billion-parameter open model designed to run on edge hardware for robotics and vision AI use cases.

## What's actually new

Cosmos 3 Edge uses a dual-tower architecture — an autoregressive tower for vision/text understanding and a diffusion tower for prediction, generation, and action output. The two towers share multimodal attention layers but keep separate normalization and MLP layers, which lets the model reason about a scene before generating actions or video predictions. The model maps different physical embodiments (robot arms, vehicles, cameras) into a common action representation using geometric vectors for translation, rotation, and manipulation state. NVIDIA claims it ranks #1 among similar-sized models on VANTAGE-Bench for vision analytics and achieves state-of-the-art results for robot policy learning. They're also releasing a policy checkpoint post-trained on the DROID dataset for pick-and-place tasks, along with post-training scripts. Separately, a Cosmos 3 Super 4-Step distillation checkpoint is included that reduces diffusion steps from 35–50 down to 4, citing up to 25× faster inference.

## What it means for your config

This isn't a typical library update that touches your project config files. Cosmos 3 Edge is a model weight release with accompanying training scripts — it's closer to a deployment artifact than a build dependency. The practical config surface here is around inference infrastructure: which NVIDIA hardware you're targeting (Jetson, RTX PRO, DGX), how you set up the model for fine-tuning on H100 or DGX Station clusters, and how you integrate the post-training scripts into your workflow. The announcement references "open Cosmos Frameworks" for customization but doesn't detail specific configuration schemas, environment variables, or file formats. If you're building robotics pipelines that consume HF-hosted models, the main thing to watch is whether your existing model-loading configs (transformers library settings, device maps, quantization flags) need adjustment for the dual-tower architecture. The source doesn't spell this out — check the model card on the HF repo for concrete integration details.

## Recommended next step

If you're working on edge robotics or vision AI and already pulling models from Hugging Face, grab the model card at the linked repository and check hardware compatibility against your target deployment platform. The DROID policy checkpoint and the 4-step distillation checkpoint are worth evaluating separately — one is for robot manipulation, the other for faster image/video generation. Start with the post-training scripts NVIDIA included to understand the fine-tuning workflow before committing to integration.

---

**Read the full announcement on Hugging Face Blog** → [Introducing Cosmos 3 Edge](https://huggingface.co/blog/nvidia/cosmos3edge)