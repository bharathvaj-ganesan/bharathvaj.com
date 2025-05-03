---
title: Quartz CRON Explained
slug: quartz-cron-explained
draft: false
pubDatetime: 2025-05-03T10:00:00.000Z
description: Discover how Quartz CRON differs from traditional CRON and why it's widely for scheduling tasks in Java applications.
tags:
  - cron
  - Quartz Scheduler
  - Java
---

At work, I recently encountered [**Quartz CRON**](https://www.quartz-scheduler.org/) — a more powerful and flexible version of the classic UNIX CRON. It's mainly used in **Java applications** with the **Quartz Scheduler**, and I found it really useful for managing complex job schedules.

If you're looking to understand the basics of CRON, check out my [previous blog](https://bharathvaj.com/posts/mastering-cron-expressions/) for a detailed explanation.

### 🧩 Quartz CRON Syntax

Unlike UNIX CRON, which uses **5 fields**, Quartz CRON has **7 fields**, including seconds and an optional year field. Here’s what it looks like:

```
┌───────────── second (0 - 59)
│ ┌─────────── minute (0 - 59)
│ │ ┌───────── hour (0 - 23)
│ │ │ ┌─────── day of month (1 - 31)
│ │ │ │ ┌───── month (1 - 12 or JAN-DEC)
│ │ │ │ │ ┌─── day of week (1 - 7 or SUN-SAT)
│ │ │ │ │ │ ┌─ year (optional)
│ │ │ │ │ │ │
* * * * * * *
```

### ✅ Why It’s Better

- **Second-level precision**: You can schedule jobs as frequently as every second.
- **Optional year field**: This makes it easy to add or omit year-based scheduling.
- **Flexible day/week options**: It supports advanced patterns like “first Monday of the month” or “last day of the month.”

### ⚙️ Common Examples

- `0 0 12 * * ?` → Every day at 12 PM
- `0 15 10 ? * MON-FRI` → 10:15 AM, Monday to Friday
- `0 0/5 14 * * ?` → Every 5 minutes starting at 2 PM

### ⚠️ Quartz vs UNIX CRON

Quartz CRON extends the traditional format with:
- **7 fields** instead of 5.
- **Second-level precision**.
- **Special characters** like `?`, `L`, `W`, and `#`.

Happy Scheduling!