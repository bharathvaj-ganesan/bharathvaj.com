---
title: Deploy NextJS to Surge.sh
slug: remove-service-worker
draft: false
pubDatetime: 2022-12-23T03:43:57.425Z
description: Learn how to deploy NextJS to surge.sh
tags:
  - nextjs
  - surge
  - hosting
---

[NextJS](https://nextjs.org/) is a special web framework that is built on top of the React library. It allows you to create React applications quickly due to its various helpful features, such as optimization for images, automatic configuration, incremental static generation, file system-based routing, code splitting and bundling, and much more.

It lets you deploy mainly in two ways:

* **Static Export**
  - Hosting static HTML files using a regular CDN
  - Best suited to host a site having pure static content
  - Providers - Surge, GitHub Pages, AWS Cloudfront

* **Custom Server**
  - Hosting dynamic HTML files using a custom node runtime server optimized for performance.
  - Best suited to host a site having some dynamic content
  - Providers - Vercel, Netlify

Using [Surge.sh](https://surge.sh/) you can deploy the static site faster. 

### Creating a Basic NextJS Application

First, create the Next.js app with the `create-next-app` command using npx:

```
npx create-next-app my-app
```

This creates the `my-app` directory, initializes the directory as a Git repository, and makes an initial commit:

```
Creating a new Next.js app in /Users/bharath/personal/projects/my-app.

Using npm.

Installing dependencies:
- react
- react-dom
- next
- @next/font
- typescript
- @types/react
- @types/node
- @types/react-dom

....

Initializing project with the template: default

Initialized a git repository.

Success! Created my-app at /Users/bharath/personal/projects/my-app
```

Open `package.json` in your editor and add the following export script to the file:

```
"export": "npm run build && next export"
```

After adding the above script, now the `package.json` file scripts section should look like this.

```
"scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "npm run build && next export"
},
```

### Deployment


Inside the newly created directory, run the following commands,

```
// Export the built project into static HTML
npm run export

// Deploy the artifact to surge
npx surge out
```

You need to login into surge to host the site, once the deployment is successful you might see a message similar to this.

```
Running as random-user@random-email.com (Student)

        project: out
         domain: my-next-surge-app.surge.sh
         upload: [====================] 100% eta: 0.0s (24 files, 562445 bytes)
            CDN: [====================] 100%
     encryption: *.surge.sh, surge.sh (141 days)
             IP: 138.197.235.123

   Success! - Published to my-next-surge-app.surge.sh
```

You can now open the URL displayed to visit your app in the browser. In this case, it is `my-next-surge-app.surge.sh` Depending upon your website size, NextJS build time exporting to HTML might take some time. You can redeploy the changes by following the same step, but make sure to the give same subdomain.


<div style="text-align:center">
  <img src="https://i.imgur.com/DU01P76.png" width="600" />
</div>


### What’s Next?

Showcase what you achieved to the world.

You can also modify the domain with a custom one. [Here](https://surge.sh/help/adding-a-custom-domain) is the official doc that helps you to achieve this. Please note that it is paid Surge.sh feature.

Happy Hosting!
