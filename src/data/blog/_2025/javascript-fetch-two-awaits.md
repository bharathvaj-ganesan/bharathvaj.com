---
title: Why Does JavaScript Fetch Need Two Awaits?
slug: javascript-fetch-two-awaits
draft: false
pubDatetime: 2025-04-10T00:00:00.000Z
description: Understand why JavaScript's Fetch API uses two await calls and what happens if you skip parsing the response body.
tags:
  - javascript
  - Fetch API
  - Web Development
---

If you've worked with the Fetch API in JavaScript, you've probably seen this pattern:

```js
const response = await fetch(url);
const data = await response.json();
```

At first glance, it seems like we’re doing **two separate awaits for one operation**. So what’s going on under the hood?

Let’s break it down.

---

## 🚀 The Two Awaits Explained

### 1. `await fetch(url)`

This sends the request and waits for the **HTTP response headers** to arrive.

- ✅ The request is sent.
- ✅ Headers (status, content type, etc.) are received.
- ❌ The body is **not** yet read or downloaded.

This gives you a `Response` object, which you can inspect before deciding what to do next.

---

### 2. `await response.json()` (or `.text()`, `.blob()`, etc.)

This reads and parses the response **body**.

- ✅ Downloads the body stream.
- ✅ Parses it according to the method you choose (e.g., JSON, text, Blob).
- ❌ Doesn’t happen automatically—you **must** initiate it.

---

## 🧠 Why Are They Separate?

This design is intentional. The Fetch API gives you:

- **Fine-grained control** over network operations.
- The ability to check the response status or headers before downloading the body.
- Better performance and resource usage, especially for large or streaming data.

Example:

```js
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json(); // Only parse if OK
```

---

## 🤔 What If You Skip `response.json()`?

Great question.

If you only do:

```js
const response = await fetch(url);
```

And don’t follow up with `.json()` or `.text()`:

- The **body is not downloaded.**
- The **stream remains open**, which can lead to memory leaks or unused network connections.
- The browser **won’t read or parse** anything further unless you explicitly do it.

## 🤔 How to verify this ?

You can check by opening the network tab. You will see a blank screen in the response tab.


## 🤔 How to Cancel/Close a Fetch Response (If You Don't Want the Body)

✅ Option 1: Use response.body.cancel()

```js
const response = await fetch(url);

if (!response.ok) {
  // Cancel the stream if you're not going to read it
  response.body?.cancel();
  throw new Error(`Request failed with status ${response.status}`);
}
```

✅ Option 2: Use AbortController to Cancel Entire Request

```js
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });

  if (!response.ok) {
    response.body?.cancel();
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  clearTimeout(timeoutId);
  console.log(data);
} catch (err) {
  console.error("Fetch aborted or failed", err);
}
```

---

## ✅ Quick Summary

| Action                  | Body Downloaded?  | Body Parsed? |
| ----------------------- | ----------------- | ------------ |
| `await fetch(url)`      | ❌ (just headers) | ❌           |
| `await response.json()` | ✅                | ✅ (as JSON) |
| `await response.text()` | ✅                | ✅ (as text) |
| No body read at all     | ❌                | ❌           |

---

## 🏁 Conclusion

The two-step `await fetch()` + `await response.json()` pattern is by design. It provides flexibility, improves efficiency, and avoids unnecessary processing when you don’t need the response body.

Next time you use `fetch`, you’ll know exactly what’s happening—and when!
