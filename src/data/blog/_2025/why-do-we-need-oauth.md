---
title: Why do we need OAuth ?
slug: why-do-we-need-oauth
draft: false
pubDatetime: 2025-04-19T11:00:00.000Z
description: Discover why OAuth is essential in modern app integrations through a real-world example of a PDF editor uploading to Dropbox—highlighting security, delegation, and best practices.
tags:
  - authentication
  - oauth
  - sso
  - oidc
  - security
---

Imagine this: you’re using a slick new PDF editing app that lets you annotate, sign, and compress PDFs. Once you’re done editing, it prompts you:

> **“Enter your Dropbox email and password to upload the file.”**

Wait, what?

This moment, right here, is exactly **why we need OAuth**.

---

## The Problem With Asking for Passwords

When an app asks for your Dropbox **username and password**, it’s basically saying:

> “Trust me with full access to your Dropbox account.”

Here’s why that’s a terrible idea:

- **No Scope Control**  
  You just wanted to upload *one PDF*. But now the PDF app has the keys to your entire Dropbox—your tax documents, your family photos, everything.

- **Security Nightmare**  
  If the app gets hacked, your Dropbox credentials go down with it. It’s like giving a stranger your house keys to water one plant.

- **No Accountability**  
  Dropbox can't tell if you did something or if a third-party app did. It's all one set of credentials.

- **Bad User Experience**  
  Now users have to trust every app with their passwords. That’s a security risk, and users start feeling nervous or annoyed.

---

## OAuth to the Rescue

OAuth (Open Authorization) is the protocol that fixes this.

Instead of giving away your Dropbox password, the PDF app redirects you to Dropbox itself. You log in **on Dropbox’s own website**, and Dropbox says:

> “This PDF app wants to upload files to your Dropbox. Do you allow it?”

✅ Yes – and Dropbox gives the app a limited-use **access token** that lets it upload files, nothing more.  
❌ No – and the app never gets in.

You never shared your password. The app only gets the permission it *needs*, and Dropbox can revoke that permission anytime.

---

## Benefits of OAuth in This Scenario

Let’s revisit the PDF app with OAuth implemented:

- **You stay in control**: You authorize exactly what the app can do.
- **No password sharing**: Your credentials stay safe.
- **Better security**: If the PDF app misbehaves, you can revoke its access without changing your Dropbox password.
- **Granular access**: Dropbox can give the app *upload-only* permission, nothing else.

This is **secure delegation**—the whole point of OAuth.

---

##
