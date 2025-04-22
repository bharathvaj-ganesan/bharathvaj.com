---
title: JSON-RPC Uncovered
slug: json-rpc-uncovered
draft: false
pubDatetime: 2025-04-20T01:00:00.000Z
description: A fun, concise dive into JSON-RPC, its role in remote calls, and a Node.js demo with notifications.
tags:
  - json-rpc
  - rpc
---

While tinkering with [Agentic MCP servers](https://modelcontextprotocol.io/introduction) at work, I ran into JSON-RPC, the slick tech driving parts of the MCP system. Talk about a *remote*ly cool find! It fired up my curiosity, so I dug in. Here’s a quick, casual scoop on JSON-RPC, including notifications, using the `jsonrpc-lite` npm package in a Node.js server and client—puns included!

## What’s JSON-RPC?

JSON-RPC is like texting your server to run a function. It’s a lightweight protocol using JSON for messages:
- **Request**: Names a method, sends params, and tracks with an optional ID.
- **Response**: Returns a result or error, tied to the ID.
- **Notification**: A request without an ID—no reply needed.

It vibes over HTTP, WebSocket, or TCP, sticking to JSON-RPC 2.0 for *rpc-king* simplicity.

## Why’s It Awesome?

JSON-RPC makes remote calls a breeze by:
1. **Playing Nice**: JSON works everywhere.
2. **Staying Lean**: Ditches the bloat of SOAP or complex REST.
3. **Feeling Local**: Remote functions act like they’re next door.
4. **Flexing**: Handles requests and one-way notifications.

Perfect for microservices, IoT, or any app needing a fast *rpc-ket* to the server.

### HandsOn

Let’s build a JSON-RPC server and client for cleaner message handling. The server supports:
- `add`: Sums two numbers.
- `greet`: Returns a greeting.
- `log`: A notification to log a message.

We’ll use nodejs with HTTP for easy implementation.

#### 1. Setup the project

```bash
mkdir json-rpc-jam
cd json-rpc-jam
npm init -y
npm install express body-parser jsonrpc-lite
```

#### 2. Create client and server files.

**client.js**
```js
const jsonrpc = require("jsonrpc-lite");

async function sendRpcRequest(body, skipResponse = false) {
  const res = await fetch("http://localhost:3000/rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (skipResponse) {
    return res.status;
  }
  return await res.json();
}

async function test() {
  console.log("add([5, 3]):", await sendRpcRequest(jsonrpc.request(1, "add", [5, 3])));
  console.log("greet({ name: 'Alice' }):", await sendRpcRequest(jsonrpc.request(2, "greet", { name: "Alice" })));
  console.log("notification:", await sendRpcRequest(jsonrpc.notification("log", {
    message: "Hello"
  }), true));
  console.log("bogus method:", await sendRpcRequest(jsonrpc.request(3, "not-a-method", [5, 3])));
}

test();
```

**server.js**
```js
const express = require("express");
const jsonrpc = require("jsonrpc-lite");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const methods = {
  add: (params) => {
    if (!Array.isArray(params) || params.length !== 2)
      throw jsonrpc.JsonRpcError.invalidParams("Bad params, no sum!");
    return params[0] + params[1];
  },
  greet: (params) => {
    if (!params?.name)
      throw jsonrpc.JsonRpcError.invalidParams("No name, no fame!");
    return `Yo, ${params.name}, what’s good?`;
  },
  log: (params) => {
    if (!params?.message)
      throw jsonrpc.JsonRpcError.invalidParams("No message to log!");
    console.log(`Notification: ${params.message}`);
    return null;
  },
};

app.post("/rpc", (req, res) => {
  // Parse incoming request with jsonrpc-lite
  const parsed = jsonrpc.parseObject(req.body);
  console.log(parsed);

  // Handle invalid JSON-RPC
  if (parsed.type === "invalid") {
    return res
      .status(400)
      .json(jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest()));
  }

  const { type, payload } = parsed;

  // Handle notifications (no ID)
  if (type === "notification") {
    try {
      if (!methods[payload.method]) throw jsonrpc.JsonRpcError.methodNotFound();
      methods[payload.method](payload.params);
      return res.status(204).send();
    } catch (error) {
      return res.status(204).send(); // Silent for notifications
    }
  }

  // Handle requests
  if (type === "request") {
    try {
      if (!methods[payload.method]) throw jsonrpc.JsonRpcError.methodNotFound();
      const result = methods[payload.method](payload.params);
      res.json(jsonrpc.success(payload.id, result));
    } catch (error) {
      res.status(400).json(jsonrpc.error(payload.id, error));
    }
  }
});

app.listen(3000, () =>
  console.log("Server’s JSON-RPC at http://localhost:3000")
);
```

#### 3. Run both server and client

```bash
node server.js

# In a different terminal
node client.js
```

We will be seeing the following logs in the client terminal

```bash
add([5, 3]): { jsonrpc: '2.0', id: 1, result: 8 }
greet({ name: 'Alice' }): { jsonrpc: '2.0', id: 2, result: 'Yo, Alice, what’s good?' }
notification: 204
bogus method: {
  jsonrpc: '2.0',
  id: 3,
  error: { message: 'Method not found', code: -32601 }
}
```

## Wrap-Up

JSON-RPC, is a total game-changer for zipping remote calls and notifications with minimal fuss. It’s like sending a quick DM to your server and getting a reply before you can say *rpc-ord* time! 

What’s next? Here are a couple of ideas to take this forward.
- **Add Authentication**: Secure your JSON-RPC endpoint with JWT or API keys for safe vibes.
- **Go WebSocket**: Swap HTTP for WebSocket to unlock real-time, two-way *rpc-king* action.
- **Expand Methods**: Toss in more complex methods to handle bigger tasks and flex JSON-RPC’s power.

Keep *rpc-king* it!