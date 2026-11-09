# Bharathvaj.com

This is my personal site where you can learn with me everyday.

## Writing a TIL

Add a Markdown file in `src/data/blog/_2026/` (or the current year), using a unique filename such as `hello-world.md`:

```yaml
---
title: Hello World
pubDatetime: 2026-11-09T00:00:00Z
type: til
tags:
  - learning
description: A short summary of what I learned.
---
```

Write the note below the frontmatter. Set `draft: true` to keep unfinished notes unpublished. Future-dated notes are withheld from listings and feeds until the configured publishing window.

Published TILs appear at `/til/`, in the homepage's Today I Learned section, and in the dedicated `/til/rss.xml` feed. They also use the existing post pages, tags, archives, site-wide RSS, and search. The first note lives at `/posts/hello-world/`.

Run `pnpm dev` to preview and `pnpm build` to validate the site and rebuild the search index.

**Credits**

Hard fork of v5.2.0 (2025-03-22) https://github.com/satnaing/astro-paper
