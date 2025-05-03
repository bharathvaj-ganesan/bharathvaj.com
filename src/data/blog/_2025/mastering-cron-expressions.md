---
title: Mastering CRON Expressions - A Developer's Quick Guide
slug: mastering-cron-expressions
draft: false
pubDatetime: 2025-05-02T00:00:00.000Z
description: Learn how to read and write CRON expressions with confidence. This quick guide covers syntax, examples, special characters, and tools to schedule tasks like a pro.
tags:
  - cron
---

[CRON](https://en.wikipedia.org/wiki/Cron) expressions are powerful tools for scheduling tasks — from backups to emails — across servers, cloud platforms, and CI/CD pipelines. While they may look cryptic at first, once you decode the pattern, you unlock a whole new level of automation.

---

### 🔹 What is a CRON Expression?

A CRON expression is a string with **5 space-separated fields** (sometimes 6 or 7 depending on the system) that define a recurring schedule.

```
┌──────── minute (0 - 59)
│ ┌────── hour (0 - 23)
│ │ ┌──── day of month (1 - 31)
│ │ │ ┌── month (1 - 12 or JAN-DEC)
│ │ │ │ ┌─ day of week (0 - 6 or SUN-SAT)
│ │ │ │ │
* * * * *
```

---

### 🔹 Common Examples

| Expression       | Meaning                      |
|------------------|-------------------------------|
| `0 0 * * *`      | Every day at midnight         |
| `*/5 * * * *`    | Every 5 minutes               |
| `0 9 * * 1-5`    | 9 AM on weekdays              |
| `30 14 1 * *`    | 2:30 PM on the 1st of each month |
| `@daily`         | Shortcut for `0 0 * * *`      |

---

### 🔹 Special Characters

| Symbol | Meaning                                  |
|--------|-------------------------------------------|
| `*`    | Every value                               |
| `,`    | List (e.g., `MON,WED,FRI`)                |
| `-`    | Range (e.g., `1-5`)                       |
| `/`    | Step (e.g., `*/10` → every 10 units)      |

---

### 🔹 Special Strings

| String       | Equivalent CRON      | Description               |
|--------------|----------------------|---------------------------|
| `@reboot`    | —                    | Run at system startup     |
| `@yearly`    | `0 0 1 1 *`           | Once a year               |
| `@monthly`   | `0 0 1 * *`           | Once a month              |
| `@weekly`    | `0 0 * * 0`           | Every Sunday              |
| `@daily`     | `0 0 * * *`           | Every day at midnight     |
| `@hourly`    | `0 * * * *`           | Every hour                |

---

### 🔹 Tips & Tools

- **Always test** your expressions using tools like [crontab.guru](https://crontab.guru) or [Cronhub](https://cronhub.io).
- Redirect output in real jobs: `0 0 * * * /path/to/script.sh >> /var/log/cron.log 2>&1`
- For cloud platforms (e.g., AWS CloudWatch, Quartz), be aware of 6–7 field variants.