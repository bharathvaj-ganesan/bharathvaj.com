---
title: "Port 0 lets the kernel pick a free port"
pubDatetime: 2026-11-10T00:00:00Z
type: til
tags:
  - nodejs
  - networking
description: I learned that passing 0 as the port lets the kernel choose an available one.
---

Today I learned that I can pass `0` as the port when starting a server, and the kernel will pick an available port for me.

I came across this while working on a local proxy in Node.js. Here's a small demo—save it as `port-zero.mjs`:

```js
import http from "node:http";

const server = http.createServer((req, res) => res.end("Hello!"));

server.listen(0, "127.0.0.1", () => {
  console.log(`Listening at http://127.0.0.1:${server.address().port}`);
});
```

Run it with `node port-zero.mjs`. For example, it might print:

```text
Listening at http://127.0.0.1:53147
```

Opening that URL returns `Hello!`. The port can change each time I restart the script. Press `Ctrl+C` to stop it.

I usually hardcode something like `3000` and change it if it's already taken. Passing `0` asks the OS to choose and bind a free port in one step. Once the server is listening, `server.address().port` gives me the assigned number.

What I'd casually call a random port is really an OS-assigned unused port. Handy for temporary local proxies and tests running in parallel, where I don't need a fixed port.

[Node.js docs: `server.listen()`](https://nodejs.org/api/net.html#serverlistenport-host-backlog-callback)
