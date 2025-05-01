---
title: How to remove old service worker?
slug: remove-service-worker
draft: false
pubDatetime: 2022-12-26T03:43:57.425Z
description: Let us learn how to remove old service worker
tags:
  - Browser
  - Javascript
---

Recently, I revamped my blogging site from [Gatsby](https://www.gatsbyjs.com/) to [NextJS](https://nextjs.org/). 

My new personal site was built from scratch where I focused more on the design and migrating the contents from the old to new one.

All set, so hosted the site on [Vercel](https://vercel.com/) and modified the DNS settings to map the domain `bharathvaj.me`.

To my surprise, I was still seeing the old one. After scratching my head a bit then figured out I completely forgot to handle the service worker. The service worker cached my old site and served it as it should be but unfortunately not for my case.

If you are someone like me, here is the solution for you that worked for me.

**Step 1**

Replace everything about your previous ServiceWorker with the following code
```js
/public/sw.js

/**
 * Self-Destroy service worker
 */

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    });
});
```

**Step 2**

Just, Deploy your project! 🎉

### How it works?

This code will listen for two major events,

* **Install Event** which is fired when `ServiceWorkerRegistration` acquires a new worker. When fired, we are forcing the current waiting service worker to become an active service worker.

* **Activate Event** which is fired when the service worker becomes the active worker for a page. When the activate event is fired, the service worker will unregister itself using the `self.registration.unregister()` method.


**Caveat** New service worker will get enabled only for the newly opened tabs and not the existing ones. If there are any existing open tabs, then they will still reflect old content.

Happy hacking!