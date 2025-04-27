---
title: How To Add Simple Download Verification for Your Users
slug: verify-downloads-safely
draft: false
pubDatetime: 2025-04-22T11:00:00.000Z
description: Learn how to build trust by making it easy for your users to verify the authenticity and integrity of the files they download from your site.
tags:
  - security
---

When downloading apps or files, you might sometimes see a "Verify Download" option.  
It’s a small step, but an important one — it helps users make sure the file hasn’t been tampered with or corrupted.

![Example Download](@/assets/images/sha256-download.png)

As a developer or creator, adding an easy verification method builds trust and protects your users.

The simplest way?  
Provide a **`.sha256` file** along with your download.

Here’s how you can do it.

## Step 1: Generate a `.sha256` file for your download

First, generate a checksum and store it in a `.sha256` file.

On **macOS** or **Linux**, run:

```bash
shasum -a 256 yourapp.dmg > yourapp.dmg.sha256
```

On **Windows**, you can generate the checksum like this:

```cmd
CertUtil -hashfile path\to\yourapp.dmg SHA256 > yourapp.dmg.sha256
```

This creates a small `.sha256` file that contains the checksum of your download.

## Step 2: Publish both files

When offering your app or file, publish **both**:

- the main file (e.g., `yourapp.dmg`)
- the checksum file (e.g., `yourapp.dmg.sha256`)

Example:

---
**Download yourapp:** [Download v1.0](https://example.com/download/yourapp.dmg)  
**Checksum file:** [Download .sha256](https://example.com/download/yourapp.dmg.sha256)
---

## Step 3: Help users verify the download

Tell users how they can quickly verify the file using the `.sha256` file. They have to download both the files.

Once downloaded, they can run the following command to verify.

### On macOS / Linux:

```bash
shasum -a 256 -c path/to/downloaded/yourapp.dmg.sha256
```

### On Windows (manually compare):

Open the `.sha256` file and manually compare the checksum with the one you generate using:

```cmd
CertUtil -hashfile path\to\downloaded\yourapp.dmg SHA256
```

If the checksums match, the file is safe.  
If not, users should **not** install or open the file.

## Final Thoughts

Adding a `.sha256` verification is a simple, no-fuss way to show users you care about their security.  
It protects your app’s reputation and makes the download experience safer and more professional.

Next time you share a file, publish a checksum too.  
Your users (and your future self) will thank you.