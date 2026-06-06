---
id: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim"
tool: "huggingface"
title: "Thousand Token Wood: shipping a multi-agent economy on a 3B model"
link: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim"
pubDate: 2026-06-05T22:18:46.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim"
contentType: "commentary"
summary: "A Build Small Hackathon project runs five autonomous trading agents on Qwen2.5-3B via vLLM, demonstrating that a small model can reliably produce structured output for a multi-agent simulation while requiring heavy prompt engineering to compensate for weak reasoning."
---

A Hugging Face Blog post details "Thousand Token Wood," a Build Small Hackathon entry that runs a five-agent economy entirely on Qwen2.5-3B, served with vLLM on Modal and fronted by Gradio. The write-up is an honest field report on what worked, what didn't, and how the author patched each failure — making it more useful than most demo announcements.

## What's actually new

The core finding is a clean split: the 3B model hit 100% valid JSON across 75 calls in a representative run, but its economic *reasoning* was poor — agents would try to buy the goods they already produced in surplus. The fix wasn't scaling up; it was tighter prompting that told each agent what it made, what it needed, and included a worked example. A tolerant JSON parse-and-repair layer degrades bad responses to no-ops rather than crashing the loop.

The simulation design itself is the other interesting piece. An initial version with abundant resources produced a dead market. The author engineered scarcity through diet variety constraints, spoilage mechanics, and a rising firewood demand that only one agent could supply. On top of that, historical market episodes (tulip mania, bank runs) are injected as in-simulation shocks. The agents react without scripting — one bank-run event caused an agent to liquidate honey, crashing its price from 10 to 3. All agent prompts, responses, and parsed actions are published as an open traces dataset.

## What it means for your config

This project doesn't ship a library or change any config surface — it's a self-contained demo. There's nothing here that alters how you'd configure vLLM, Gradio, or Modal in your own projects. The engineering lessons (structured output prompting, JSON repair layers, scarcity-driven simulation design) are patterns you'd adopt in application code, not in config files.

If you're running your own vLLM or Modal deployments, the post doesn't detail specific serving configs or Modal stub definitions. The open traces dataset on Hugging Face could be useful if you're benchmarking structured output reliability on small models, but there are no new config knobs to worry about.

## Recommended next step

If you build multi-agent systems on small models, read the full post for the specific prompt engineering patterns — especially the technique of computing an agent's shortage list server-side and injecting it into the prompt rather than asking the model to reason about its own inventory. Then check the open traces dataset linked from the post to see raw prompt/response pairs. That's the real artifact here: evidence of where a 3B model's formatting reliability ends and its reasoning gaps begin, which is directly useful for deciding how much logic to push into prompts versus application code in your own pipelines.

---

**Read the full announcement on Hugging Face Blog** → [Thousand Token Wood: shipping a multi-agent economy on a 3B model](https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim)