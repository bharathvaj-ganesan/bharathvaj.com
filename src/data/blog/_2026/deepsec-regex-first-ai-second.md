---
title: "Scan codebase with deepsec"
pubDatetime: 2026-11-23T00:00:00Z
type: til
tags:
  - security
  - ai
  - tooling
description: I learned what deepsec is, how its pipeline works, and how it keeps AI scanning costs down.
---

Today I came to know about [deepsec](https://vercel.com/oss/deepsec) from [AIEngineerGuide.com](https://aiengineerguide.com/til/vercel-deepsec/). It is an open-source vulnerability scanner that Vercel Labs released. It uses AI agents to review code, runs in your own infrastructure, and is built for large, existing codebases, where it hunts for bugs that have been hiding for a long time.
<blockquote class="twitter-tweet" data-dnt="true"><p>Vercel Developers' post introducing deepsec</p>&mdash; <a href="https://x.com/vercel_dev/status/2051381241283539255">View on X</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## What it is

deepsec is an AI-powered vulnerability scanner for existing codebases. You run it on demand against all the code in a repo, and it looks for the hard-to-find security issues that have been sitting in an app for years.

It runs in your own infrastructure. An AI agent reads your code through your own OpenAI or Anthropic key, or through Vercel AI Gateway. The only thing it adds to your repo is a `.deepsec/` folder, where it keeps its state and findings.

Because an AI agent reads every file it reviews, each scan costs real money. So the core idea is to spend that money only where it matters.

## How it works

![deepsec pipeline: scan is free, process and revalidate use AI, enrich and export are cheap](@/assets/images/deepsec-pipeline.svg)

Three stages matter most:

- **scan** finds candidate spots with regex matchers. It is free and fast.
- **process** sends each candidate to an AI agent with the repo context and gets findings back.
- **revalidate** checks each finding against the code and git history. The verdict is `true-positive`, `false-positive`, `fixed`, or `uncertain`.

Each file keeps one record, and nothing is overwritten. If a run stops partway, the same command picks up where it left off.

## What it looks for

![deepsec coverage: injection, auth and access, server-side requests, secrets and config, infrastructure and CI, and AI-specific issues](@/assets/images/deepsec-categories.svg)

Matchers are tuned per framework, so coverage varies. The AI reviewer can also flag issues no matcher covers. It reads source only and never runs the code, so treat each finding as a lead to triage.

## How it keeps the cost down

AI is the expensive part. deepsec limits how much code reaches it.

![Funnel: every file is scanned for free, then only files with regex hits reach AI, then findings are triaged, then only HIGH+ findings are revalidated](@/assets/images/deepsec-cost-funnel.svg)

- **Regex gate.** Only files with a scanner hit go to the AI. Clean files cost nothing.
- **No repeat work.** Analyzed files are recorded, so re-runs skip them.
- **PR mode.** `process --diff origin/main` reviews only the files a pull request changes. CI cost follows the diff, not the whole repo.
- **Triage and revalidate.** Triage sorts findings with a cheaper model, at about 1¢ each. Revalidate only HIGH+ findings, which is the paid check.
- **Cheaper settings.** Sonnet costs about a third of Opus, with a 10–20% higher false-positive rate. `--thinking-level` lowers reasoning effort for quick runs.
- **Hard caps.** `--max-cost-usd` stops at a resumable boundary. Run with `--limit 50` first to calibrate.

For rough numbers, the docs estimate $130–300 for 500 files with Opus at default settings. Costs can swing 2–3× with file complexity.

## Try it

```bash
npx deepsec init
```

Run it from the root of the repo you want to scan. The docs are at [deepsec.sh](https://deepsec.sh).
