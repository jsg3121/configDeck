---
id: "https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel"
tool: "huggingface"
title: "Fine-tune video and image models at scale with NVIDIA NeMo Automodel and 🤗 Diffusers"
link: "https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel"
pubDate: 2026-07-17T15:57:54.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel"
contentType: "commentary"
summary: "NVIDIA and Hugging Face announce a NeMo Automodel integration that lets you fine-tune Diffusers-format diffusion models — including FLUX, Wan 2.1/2.2, HunyuanVideo, and Qwen-Image — at scale without checkpoint conversion or model rewrites. Training parallelism is driven by YAML config, not code changes."
---

NVIDIA and Hugging Face jointly announced that NeMo Automodel, NVIDIA's open-source PyTorch DTensor-native training library, now integrates directly with Diffusers-format models on the Hugging Face Hub. The collaboration targets the pain point of scaling diffusion model fine-tuning beyond single-GPU setups without having to rewrite training code or convert checkpoints.

## What's actually new

The core selling point is zero checkpoint conversion: you point `pretrained_model_name_or_path` at a Hub model ID, train, and the resulting checkpoint loads back into a standard `DiffusionPipeline` for inference or re-upload. NeMo Automodel ships ready-made fine-tuning recipes for seven model configurations spanning text-to-image and text-to-video — Wan 2.1 (1.3B and 14B), Wan 2.2 (A14B MoE), FLUX.1-dev, FLUX.2-dev, HunyuanVideo 1.5, and Qwen-Image. Both full fine-tuning and LoRA are supported across most of these. The library currently targets flow-matching models only, using latent-space training with pre-encoded VAE outputs and multiresolution bucketed dataloading. Adding support for a new Diffusers model requires only a data preprocessing handler and a model adapter rather than a complete custom training script.

## What it means for your config

This is where NeMo Automodel's design is worth paying attention to from a config perspective. Parallelism strategy — FSDP2, tensor parallel, context parallel, pipeline parallel, expert parallel — is declared in YAML configuration files rather than baked into training scripts. The blog walks through a concrete example using the checked-in `flux_t2i_flow.yaml` with run-specific values passed as CLI overrides (cache directory, resolution, learning rate schedule, checkpoint intervals). That means switching from single-node LoRA to multi-node full fine-tuning is a config change, not a code change.

If you're already running Diffusers training scripts (the `train_dreambooth_lora.py`-style examples), this is a different orchestration layer. NeMo Automodel doesn't replace those scripts for simple single-GPU jobs — it's aimed at the point where you need FSDP sharding, multi-node SLURM jobs, or models that don't fit on one device. The YAML configs live in `examples/diffusion/finetune/` in the Automodel repo, and the post notes Kubernetes orchestration support is coming but isn't available yet.

One practical detail: installation via the NeMo Automodel Docker container (`nvcr.io/nvidia/nemo-automodel:26.06`) is the recommended path since it bundles PyTorch, TransformerEngine, and CUDA dependencies. A pip install option exists but expect the usual CUDA build headaches for TransformerEngine if you go that route.

## Recommended next step

If you're fine-tuning diffusion models larger than what fits comfortably on a single GPU, clone the Automodel repo and look at the YAML recipes in `examples/diffusion/finetune/` for your target model. The pre-encoding step for latent caching is mandatory and model-specific, so start there before attempting a training run. If you're happy with single-GPU LoRA via the existing Diffusers training scripts, there's no urgent reason to migrate — but bookmark this for when you scale up. The post also mentions upcoming "Pythonic recipe APIs," which may change the config surface; worth watching.

---

**Read the full announcement on Hugging Face Blog** → [Fine-tune video and image models at scale with NVIDIA NeMo Automodel and 🤗 Diffusers](https://huggingface.co/blog/nvidia/scale-diffusers-finetuning-nemo-automodel)