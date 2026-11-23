---
title: "Node2Shell: What We Patched and What We Learned"
pubDatetime: 2026-11-16T00:00:00Z
type: tutorial
tags:
  - nodejs
  - security
  - brotli
  - devops
description: A practical guide to finding, patching, and verifying Node.js services affected by the Node2Shell Brotli vulnerability, CVE-2026-111497.
---

At my organization, we were patching Node2Shell across our Node.js services. The first question sounded simple: which package should we upgrade?

It turned out to be the wrong question.

Node2Shell, tracked as [CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497), is not an npm dependency that appears in `package-lock.json`. The bug is in the native Brotli decoder bundled with Node.js. Updating an application dependency does not remove it. We had to find every runtime, understand where untrusted Brotli data could reach it, replace the runtime, rebuild the artifacts, and verify what was actually running.

This post is the checklist I wish I had when we started.

## What is Node2Shell?

Brotli is a compression format, usually identified by `Content-Encoding: br`. Node.js exposes Brotli decompression through `node:zlib`, and frameworks or HTTP clients can invoke it without application code calling the decoder directly.

A malformed Brotli stream can make an affected decoder continue after an error and write beyond the end of a buffer. That makes this a memory-safety vulnerability in a native library. A crash is the easiest outcome to reproduce, but researchers have also demonstrated memory disclosure and code execution in the Node.js process under specific conditions.

The important distinction is that **running Node.js is not, by itself, the attack path**. A service becomes reachable when it decodes Brotli data controlled by an attacker.

Examples include:

- Express 5 applications using `express.json()` with request inflation enabled, which is the default
- server-side `fetch()` calls where an attacker can influence the destination or response
- direct use of `createBrotliDecompress()` with untrusted input
- Koa body parsers that inflate Brotli request bodies
- Fastify applications using request decompression through `@fastify/compress`

A plain Node.js HTTP server does not automatically decompress incoming request bodies. That difference helped us prioritize internet-facing services instead of treating every process as equally exposed.

## Which versions are fixed?

The fixed Node.js releases are:

| Release line | First fixed version |
| ------------ | ------------------- |
| Node.js 22   | `22.23.4`           |
| Node.js 24   | `24.22.1`           |
| Node.js 26   | `26.12.1`           |

Node.js 20, 25, and older release lines are end-of-life and do not receive a fix. They need to move to a supported line rather than wait for a patch.

Bun also uses the affected Brotli code. If it exists in the estate, upgrade it to `1.4.4` or newer.

There is one complication: some Linux distributions build Node.js against the operating system's Brotli library instead of Node's bundled copy. In that case, the distro's `brotli` package is the component that needs patching. Debian 12 and 13, for example, subsequently shipped a fixed Brotli package. The Node.js version alone is therefore not enough evidence for distro-managed installations.

## The patching plan

### 1. Inventory the runtime, not only the repositories

Searching `package.json` files finds applications, but it misses places where Node.js is embedded or installed separately. We checked:

- production containers and their base images
- virtual machines and long-running hosts
- CI runners and build images
- serverless functions
- developer tooling images
- jobs and scripts outside the main deployment path

Start with the running version:

```bash
node --version
node -p "process.execPath"
```

For containers, ask the deployed image instead of trusting the Dockerfile in Git:

```bash
docker run --rm your-image:tag node --version
```

An image may have been built before a floating base tag was updated, or restored from a build cache. The source configuration says what we intended to deploy; the running workload says what we actually deployed.

### 2. Find the reachable services first

We searched for direct decoder use and common decompression entry points:

```bash
rg "createBrotliDecompress|brotliDecompress|express\.json|bodyParser|@fastify/compress|@koa/bodyparser|koa-body"
```

That search is only a starting point. We also reviewed:

- routes that accept compressed request bodies
- webhook, URL preview, proxy, and import features that fetch remote URLs
- HTTP clients that automatically decompress responses
- whether a reverse proxy rejects or forwards Brotli request bodies

A public API that inflates arbitrary request bodies should be patched before an internal build script with no untrusted input. Both should be upgraded, but reachability gives the rollout an order.

### 3. Upgrade the Node.js runtime

For a Docker image, pin at least the first fixed patch release for the chosen supported line:

```dockerfile
FROM node:24.22.1-bookworm-slim
```

Then pull and rebuild the image. Do not assume a normal cached build fetched the new base:

```bash
docker pull node:24.22.1-bookworm-slim
docker build --pull --no-cache -t your-image:patched .
```

`--no-cache` is not required for every future build, but it is useful during an incident when proving that no stale runtime layer survived matters more than build speed.

For Node version managers, update both the local runtime and the file that selects it. For example, with `nvm`:

```bash
nvm install 24.22.1
nvm use 24.22.1
node --version
```

Changing `.nvmrc`, `.node-version`, a CI action, or a Dockerfile independently is not enough. They should all resolve to a fixed runtime.

For operating-system packages, use the vendor's security update and confirm whether Node.js uses bundled or system Brotli. Do not replace a distro package with an arbitrary upstream binary without considering how that installation is maintained.

### 4. Rebuild and restart everything that carries Node.js

Updating a version file does not modify an existing container, serverless bundle, or running process. We rebuilt artifacts, deployed them, and restarted long-running services.

This matters for multi-stage Dockerfiles too. Node.js may exist in the builder stage, the runtime stage, or both. A patched runtime image does not fix a vulnerable build stage pulled from another tag, and patching only the builder does not fix the process serving traffic.

### 5. Verify after deployment

We added a version check to the deployment evidence:

```bash
node -p "({ version: process.version, execPath: process.execPath })"
```

For Kubernetes, run it inside the deployed pod:

```bash
kubectl exec deploy/your-service -- node --version
```

We also checked the image digest, because a reused tag can point to different content at different times. For distro-linked builds, we verified the installed Brotli package against the vendor advisory as well.

The success condition was not "the pull request changed the version." It was "every running workload reports a fixed runtime or a vendor-patched Brotli library."

## What if you cannot patch immediately?

Compensating controls can reduce exposure, but they are not substitutes for replacing the vulnerable decoder.

If clients do not need compressed request bodies, Express can reject all request decompression:

```js
app.use(express.json({ inflate: false }));
```

This rejects Brotli, gzip, and deflate bodies, so test client behavior before enabling it. A reverse proxy can also reject request bodies with `Content-Encoding: br` on routes that never require them.

Those controls do not protect outbound requests. Audit server-side fetches, especially SSRF-sensitive features where a user supplies a URL. Restrict destinations and egress where possible.

Finally, contain what successful code execution could do:

- run the Node.js process as a non-root, unprivileged user
- use a read-only filesystem where practical
- keep secrets out of broad process environments
- restrict network egress
- alert when a Node.js process spawns a shell or makes an unexpected outbound connection

Failed exploitation may appear as repeated Node.js crashes. Successful exploitation may look like shell execution, socket redirection, secret access, or a download from an unfamiliar host. Runtime monitoring is useful for those effects even when it cannot see the original out-of-bounds write.

## The easy mistakes

The patch was straightforward once we understood the boundary. These were the traps:

1. **Running `npm update`.** Brotli is inside the runtime or supplied by the OS, not an ordinary npm dependency.
2. **Updating only `package.json`.** The Node.js engine field documents compatibility; it does not install a new production runtime.
3. **Trusting a floating container tag.** A cached `node:24` layer may still contain the vulnerable version.
4. **Checking only Node's version on distro builds.** A system-linked Brotli package may determine whether the installation is fixed.
5. **Patching source but not running workloads.** Existing images, pods, functions, and processes must be rebuilt or restarted.
6. **Treating a WAF rule as the fix.** It may reduce reachable traffic, but it cannot repair the decoder or cover every path.

## Final checklist

- [ ] Inventory Node.js and Bun in containers, hosts, CI, and serverless workloads.
- [ ] Identify services that decode attacker-controlled Brotli data.
- [ ] Upgrade Node.js to `22.23.4`, `24.22.1`, or `26.12.1` or newer.
- [ ] Move end-of-life Node.js releases to a supported line.
- [ ] Upgrade Bun to `1.4.4` or newer.
- [ ] Apply the vendor Brotli update to system-linked Node.js builds.
- [ ] Pull base images, rebuild artifacts, redeploy, and restart processes.
- [ ] Verify versions inside the running workloads.
- [ ] Temporarily reject unneeded Brotli input while the rollout completes.
- [ ] Monitor crashes, shell spawns, and unusual outbound connections.

Node2Shell was a useful reminder that an application's security boundary extends below npm. Native libraries, base images, runtime caches, and distribution packages are part of the application too. The safest patch is the one you can verify in the process that is actually serving traffic.

## References

- [Sysdig: Node2Shell (CVE-2026-111497) — Detecting the Node.js Brotli RCE](https://www.sysdig.com/blog/node2shell-cve-2026-111497-detecting-the-node-js-brotli-rce)
- [Node.js security releases](https://nodejs.org/en/blog/vulnerability/)
- [NVD: CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497)
