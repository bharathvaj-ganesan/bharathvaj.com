---
title: "HTTP proxy vs SOCKS proxy"
pubDatetime: 2026-11-15T00:00:00Z
type: til
tags:
  - networking
  - proxy
description: I learned how an HTTP proxy and a SOCKS proxy differ, down to the bytes the client sends.
---

While exploring Anthropic's sandbox runtime, I came across HTTP and SOCKS proxies. I got curious to understand what they are and how they work.

Both are middlemen. You ask them to connect to something for you, and they pass the bytes back and forth. The difference is how much they understand.

An HTTP proxy speaks HTTP. A SOCKS proxy only knows "connect me to this host and port", and after that it doesn't care what flows through.

## What the client actually sends

To reach `example.com` over HTTPS, an HTTP proxy gets a plain text request:

```text
CONNECT example.com:443 HTTP/1.1
Host: example.com:443
```

A SOCKS5 proxy gets raw bytes instead. Here is the same request built by hand in Node.js:

```js
const host = "example.com";

// 1. greeting: version 5, one auth method, "no auth"
const hello = Buffer.from([0x05, 0x01, 0x00]);

// 2. connect: version 5, CONNECT, reserved, domain name, host, port 443
const connect = Buffer.concat([
  Buffer.from([0x05, 0x01, 0x00, 0x03, host.length]),
  Buffer.from(host),
  Buffer.from([0x01, 0xbb]), // 0x01bb = 443
]);

console.log(hello);   // <Buffer 05 01 00>
console.log(connect); // <Buffer 05 01 00 03 0b 65 78 61 ... 01 bb>
```

The HTTP one starts with a letter (`C`). The SOCKS5 one starts with `0x05`. That is enough for a single port to tell them apart, which is how some tools serve both on one port.

## How an HTTP proxy works

An HTTP proxy handles two kinds of requests differently.

### Plain HTTP: the proxy reads and forwards the request

For `http://` URLs, the client sends the full URL on the request line instead of just the path. That is how the proxy knows where to forward it:

```text
GET http://example.com/hello?x=1 HTTP/1.1
Host: example.com
User-Agent: curl/8.4.0
Proxy-Connection: keep-alive
```

A direct request would say `GET /hello?x=1 HTTP/1.1`. The proxy can read every header and the body, so it can cache, log, rewrite, or block them.

### HTTPS: the proxy opens a tunnel

For `https://` URLs, the client first asks the proxy to open a tunnel with `CONNECT`. The proxy connects to the target, replies `200`, and from then on blindly copies bytes both ways. The TLS handshake happens through the tunnel, so the proxy can't read the content:

```text
→ CONNECT example.com:443 HTTP/1.1
→ Host: example.com:443
→
← HTTP/1.1 200 Connection Established
←
(TLS handshake and encrypted traffic flow through the tunnel)
```

### A tiny HTTP proxy in Node.js

Here is a working proxy in about 30 lines. The `request` handler covers plain HTTP and the `connect` handler covers HTTPS tunnels:

```js
import http from "node:http";
import net from "node:net";

const server = http.createServer((req, res) => {
  // req.url is the full URL, e.g. "http://example.com/hello"
  const url = new URL(req.url);
  console.log("HTTP   ", req.method, req.url);

  const upstream = http.request(
    {
      host: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: req.method,
      headers: req.headers,
    },
    (upRes) => {
      res.writeHead(upRes.statusCode, upRes.headers);
      upRes.pipe(res);
    }
  );
  upstream.on("error", () => res.writeHead(502).end());
  req.pipe(upstream);
});

// HTTPS: the client sends "CONNECT host:port"
server.on("connect", (req, clientSocket, head) => {
  const [host, port] = req.url.split(":");
  console.log("CONNECT", req.url);

  const upstream = net.connect(Number(port), host, () => {
    clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    upstream.write(head);
    upstream.pipe(clientSocket);
    clientSocket.pipe(upstream);
  });
  upstream.on("error", () => clientSocket.end("HTTP/1.1 502 Bad Gateway\r\n\r\n"));
  clientSocket.on("error", () => upstream.destroy());
});

server.listen(8080, () => console.log("proxy on :8080"));
```

Run it, then try the curl commands in the next section with `-v`. For `http://` you'll see the full URL and method logged. For `https://` you'll only see `CONNECT example.com:443`, which is all a proxy can know about encrypted traffic.

### Sending a request through it from Node.js

Node's `fetch` doesn't read proxy settings by default. With `undici` you can set one:

```js
import { ProxyAgent, fetch } from "undici";

const dispatcher = new ProxyAgent("http://localhost:8080");
const res = await fetch("https://example.com", { dispatcher });
console.log(res.status);
```

Most tools also respect environment variables, so you often don't need code at all:

```bash
export HTTP_PROXY=http://localhost:8080
export HTTPS_PROXY=http://localhost:8080
export NO_PROXY=localhost,127.0.0.1

curl https://example.com
```

## Using them with curl

```bash
# HTTP proxy, HTTPS site: -v shows "CONNECT example.com:443 HTTP/1.1"
curl -v -x http://localhost:8080 https://example.com

# HTTP proxy, plain HTTP site: -v shows "GET http://example.com/ HTTP/1.1"
curl -v -x http://localhost:8080 http://example.com

# SOCKS5 proxy
curl --proxy socks5h://localhost:1080 https://example.com
```

The `h` in `socks5h` means the proxy does the DNS lookup. Without it, curl resolves the hostname itself and sends the proxy an IP address, so the proxy never sees the name.

## A handy way to get a SOCKS proxy

SSH can open one for free:

```bash
ssh -D 1080 user@some-server
```

Now anything sent to `localhost:1080` goes out through `some-server`. This is the quickest SOCKS proxy I know of.

## So which one?

- **HTTP proxy:** web traffic only. Because it understands HTTP, it can cache, add headers, or filter by URL (for unencrypted traffic).
- **SOCKS proxy:** works for any TCP traffic, like SSH, databases, or chat. It's less smart, but it doesn't mind what you send.

For HTTPS, both only see the destination host and port. The content stays encrypted either way.

[SOCKS5 spec (RFC 1928)](https://datatracker.ietf.org/doc/html/rfc1928)
