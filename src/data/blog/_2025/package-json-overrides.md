---
title: How to patch vulnerable sub-dependencies with overrides in package.json
slug: package-json-overrides
draft: false
pubDatetime: 2025-07-27T10:00:00.000Z
description: See how to quickly patch a vulnerable sub-dependency in your Node.js project using the overrides field in package.json, with a real-world example and advanced usage.
tags:
  - npm
  - nodejs
---

Suppose you’re building a front end app and your `package.json` includes `react-scripts` (used by Create React App). Suddenly, your security scanner flags a **high-severity vulnerability in lodash**—but you’re not using lodash directly.  
Instead, lodash is a dependency of several libraries, including `react-scripts`, and those libraries haven’t updated yet.

**You want to fix the vulnerability now, not weeks later.**

## Solution 

Use overrides in `package.json`. Add an override to force every dependency to use a safe version of `lodash`:

```json
{
  "overrides": {
    "lodash": "4.17.21"
  }
}
```

After running `npm install`, **all nested dependencies will use the patched version** of `lodash`, even if their maintainers haven’t updated yet.

### Target and patch specific dependency

You can also target and override a dependency for a specific package, rather than applying it globally. 

Suppose you use `express`, which relies on `lodash@3.16`, and you need to upgrade just `lodash` used by `express`:

```json
{
  "overrides": {
    "express": {
      "lodash": "4.17.21"
    }
  }
}
```

### Nested Patch

You can also do nested patch, Let’s say `express` → `body-parser` → `qs`, and only `qs` inside `body-parser` needs an update:

```json
{
  "overrides": {
    "express": {
      "body-parser": {
        "qs": "6.11.0"
      }
    }
  }
}
```


### Other Common Use Cases

* **Resolve version conflicts:** Make all dependencies use a consistent version, avoiding duplication and bugs.
* **Test unreleased or experimental versions:** Try a fix or feature from a specific sub-dependency before it’s officially released.
* **Quickly unblock development:** Patch issues in your dependency tree without forking or waiting on upstream changes.

With `overrides`, you control your dependency tree. It’s a lifesaver when security and stability can’t wait.

Happy Maintenance!!