---
title: "Use Claude to rewrite Chrome history"
pubDatetime: 2026-11-14T00:00:00Z
type: til
tags:
  - chrome
  - sqlite
  - github
  - developer-experience
description: After our private repos moved into a new Enterprise Managed org, my browser kept sending me to the old URLs. Here is how I cleaned up the history.
---

Last month my company moved from GitHub Cloud to an Enterprise Managed org. The migration itself went smoothly. Private repos were moved into the new org, the CI pipelines were updated, and everyone got back to work.

Then the small annoyances started. I'd type a repo name into the address bar and Chrome would autocomplete it to `github.com/old-org/payments-service`. I'd click the link, and GitHub would show a 404 page for the old repo URL. There was no redirect to the new org, just a dead end. I had to notice the change, remember the new name, and retype it.

My history was full of these links, a few hundred of them from the last couple of years. Every search for something I'd looked at before pulled up the old org. Clearing history was out of the question, since I'd lose everything else with it. I just wanted the old URLs rewritten.

Chrome keeps history in a SQLite file called `History`, inside the profile folder. It's an ordinary database, and the `urls` table has a `url` column. That means the fix is one SQL statement, as long as you're careful with it.

I worked through it in a terminal with Claude Code. First I asked it to count the matches on a copy of the file, so the real database stayed untouched. Then I quit Chrome completely, because while Chrome is open the file is locked and writes fail with "database is locked." I made a backup of the original file before changing anything.

The update itself is short:

```sql
BEGIN;
UPDATE urls
SET url = 'https://github.com/new-org/' || substr(url, length('https://github.com/old-org/') + 1)
WHERE url LIKE 'https://github.com/old-org/%';
COMMIT;
```

`substr` keeps everything after the prefix, so the repo name, the path, and any query string survive. The transaction means a failed statement doesn't leave the database half-updated.

The first command Claude wrote had a stray line in it, which failed to parse. Nothing had been committed, so nothing changed. It was a good reminder to read the output and not just the exit code.

After the update I counted old and new URLs, ran `PRAGMA integrity_check`, which returned `ok`, and reopened Chrome. Four old links remained. They were Gmail links wrapped in `google.com/url?q=...`, with the GitHub address sitting inside a query parameter. The prefix rule doesn't match those, and I decided that was fine.

A few things I'd check before doing this yourself:

- If Chrome Sync is on, old entries can come back from Google's servers.
- Omnibox shortcuts live in a separate database, so this doesn't touch them.
- Keep the backup for a few days in case something in your history looks wrong.

## TIL

Chrome stores history in an embeddable database, SQLite. Quit the browser, back up its History file, and rewrite URL prefixes inside a transaction. Check the counts before you reopen Chrome.

## References

- [SQLite: UPDATE](https://sqlite.org/lang_update.html)
- [SQLite: Core functions (`substr`, `length`)](https://sqlite.org/lang_corefunc.html)
- [SQLite: `PRAGMA integrity_check`](https://sqlite.org/pragma.html#pragma_integrity_check)
