---
id: "https://huggingface.co/blog/nunchaku-diffusers"
tool: "huggingface"
title: "Bringing Nunchaku 4-bit Diffusion Inference to Diffusers"
link: "https://huggingface.co/blog/nunchaku-diffusers"
pubDate: 2026-07-23T00:00:00.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nunchaku-diffusers"
contentType: "commentary"
summary: "Hugging Face integrates Nunchaku Lite into Diffusers, enabling native loading of SVDQuant W4A4 checkpoints via from_pretrained() with no local CUDA compilation. This cuts diffusion model VRAM usage roughly in half while also delivering inference speedups."
---

Hugging Face announced native integration of Nunchaku Lite into the Diffusers library, letting developers load SVDQuant 4-bit diffusion checkpoints with a standard `from_pretrained()` call. The integration ships through the `kernels` package on the Hub, eliminating the need for local CUDA compilation or a separate inference engine.

## What's actually new

Most quantization backends already in Diffusers (bitsandbytes, GGUF, torchao, Quanto) are weight-only: they shrink memory but don't speed up inference. Nunchaku Lite brings W4A4 (4-bit weights *and* activations) quantization via SVDQuant, which handles outliers by absorbing activation outliers into the weights and splitting each weight matrix into a small 16-bit low-rank branch plus a 4-bit residual. The practical result on a cited benchmark is a 1024×1024 image generated in about 1.7 seconds on an RTX 5090 at roughly 12 GB peak VRAM, versus about 24 GB for the BF16 pipeline. The blog notes an approximate 30% speedup from Nunchaku Lite alone, rising to about 1.8× when combined with `torch.compile`. Two kernel families are used: `svdq_w4a4` for attention and MLP projections, and `awq_w4a16` for normalization/modulation layers. NVFP4 precision requires Blackwell GPUs (RTX 50 series, B200); INT4 variants cover Turing, Ampere, and Ada. Volta and Hopper are currently unsupported.

## What it means for your config

The key config surface is a `quantization_config` block inside the transformer's `config.json`. It declares `quant_method: "nunchaku_lite"`, the compute dtype, and per-scheme sections (`svdq_w4a4`, `awq_w4a16`) listing target modules, precision, group size, and rank. This follows the same pattern Diffusers already uses for bitsandbytes and torchao quantization configs, so if you've written those before, the shape will be familiar.

Because the quantized model preserves the original module structure, downstream tooling — schedulers, LoRA loading, offloading, `torch.compile` — sees a normal Diffusers model. That's the important bit: you shouldn't need to rework pipeline orchestration configs or custom hooks. The blog explicitly states LoRA loading hooks and offloading work transparently.

One thing to watch: the hardware gate is enforced at load time via CUDA capability checks, not silently. If you're deploying across mixed GPU fleets, your deployment configs will need to route NVFP4 checkpoints to Blackwell nodes and INT4 checkpoints to older generations. The blog doesn't detail how to handle this automatically, so you'll want to build that routing yourself.

The companion `diffuse-compressor` toolkit lets you quantize new architectures and publish them as standard Diffusers repos. The blog doesn't go deep on the compressor's config surface, so check the linked documentation if you plan to quantize your own models.

## Recommended next step

If you're running diffusion inference on consumer GPUs and VRAM is your bottleneck, this is worth testing immediately — the install is just a pip line and loading uses standard Diffusers APIs. Start with one of the ready-to-use checkpoints linked in the original post, verify output quality against your BF16 baseline, and check whether the VRAM savings let you move to a smaller (cheaper) instance. Pay attention to which GPU generation you're targeting and pick the right precision variant accordingly.

---

**Read the full announcement on Hugging Face Blog** → [Bringing Nunchaku 4-bit Diffusion Inference to Diffusers](https://huggingface.co/blog/nunchaku-diffusers)