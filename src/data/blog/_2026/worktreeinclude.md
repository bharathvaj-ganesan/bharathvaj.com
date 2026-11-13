---
title: ".worktreeinclude: Carry Local Files into Git Worktrees"
pubDatetime: 2026-11-12T00:00:00Z
type: til
tags:
  - git
  - developer-experience
  - claude-code
description: Use .worktreeinclude to copy required gitignored files into new worktrees automatically.
---

A Git worktree contains files tracked by Git. Local files such as `.env`, development certificates, and machine-specific configuration are usually ignored, so a fresh worktree may not be ready to run.

`.worktreeinclude` solves this for tools that support it. Add the file at the repository root and list the ignored files that each new worktree needs:

```text
# .worktreeinclude
.env
.env.local
config/*.local.json
certs/local/**
```

When a supported tool creates a worktree, it copies files that satisfy both conditions:

1. The path matches `.worktreeinclude`.
2. Git already ignores the file.

Tracked files are unaffected because Git checks them out normally. The `.worktreeinclude` file itself can be committed—it contains paths and patterns, not the secret values.

## Why it is useful

Worktrees are increasingly used to isolate parallel coding-agent sessions. Without this file, every worktree needs the same manual setup:

```bash
cp .env ../feature-worktree/.env
cp config/app.local.json ../feature-worktree/config/app.local.json
```

With `.worktreeinclude`, local configuration follows supported worktree creation automatically while remaining outside version control.

## Important distinction

`.worktreeinclude` is **not a native Git feature**. It is a convention implemented by tools such as Claude Code, Codex, and Conductor, and exact behavior can differ.

For example, Claude Code processes it for worktrees created through `--worktree`, isolated subagents, and its desktop app. Running `git worktree add` yourself does not make Git read the file or copy anything.

Use it for static local files that already exist. Use a setup script or secrets manager when a worktree must install dependencies, generate configuration, fetch credentials, or create isolated databases.

## Security note

Copying an ignored secret keeps it out of Git, but every worktree receives another local copy. Avoid production credentials, limit file permissions, and remember to remove abandoned worktrees.

## TIL

`.gitignore` defines what must stay out of version control; `.worktreeinclude` can define which of those ignored files a supported tool should carry into fresh worktrees.

## References

- [Claude Code: Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees#copy-gitignored-files-into-worktrees)
- [Conductor: `.worktreeinclude`](https://www.conductor.build/docs/reference/worktreeinclude)
- [Git worktree documentation](https://git-scm.com/docs/git-worktree)
