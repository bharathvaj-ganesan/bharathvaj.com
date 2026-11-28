---
title: "Portless: Need of the Hour"
pubDatetime: 2026-11-18T00:00:00Z
type: til
tags:
  - tools
  - dev-environment
  - localhost
description: Portless runs your dev server behind a stable named .localhost URL, so you can stop remembering port numbers.
---

I often run several AI agents on the same project, each in its own Git worktree. My workflow has a verification step where the agent starts the dev server and checks its own changes. With multiple agents doing this at once, they all fight for the same port. One gets `3000`, the next gets "port already in use", and the verification breaks or lands on the wrong app.

That's where Portless comes in.

## How it works

Portless is a local reverse proxy. It picks a free port itself, passes it to your app through the `PORT` environment variable (or a `--port` flag for tools that ignore it), and serves the app at a named URL.

```bash
npm install -g portless

portless myapp next dev       # https://myapp.localhost
portless api pnpm start       # https://api.localhost
portless api.myapp pnpm start # https://api.myapp.localhost
```

Run `portless` with no arguments and it runs your `dev` script, taking the name from the package, Git root or directory. You can also pin the name in `portless.json`:

```json
{ "name": "myapp" }
```

## Why I like it

- **Readable URLs.** Services get subdomains like `api.myapp.localhost` and `docs.myapp.localhost`.
- **No script changes.** Your existing `dev` script stays as it is.
- **Git worktrees.** A worktree called `fix-ui` gets `fix-ui.myapp.localhost`, so several branches can run side by side with no conflicts.
- **AI coding agents.** Each agent gets its own stable URL to verify against, without having to find a free port.
