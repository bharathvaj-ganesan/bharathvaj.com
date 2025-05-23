---
title: How to get a free AWS SSL certificate for your service.
slug: add-ssl-domain-aws-alb
draft: false
pubDatetime: 2025-04-23T14:17:00.000Z
description: Secure traffic to your domain or subdomain by enabling SSL/TLS (HTTPS) when it points to an AWS Application Load Balancer (ALB).
tags:
  - AWS
  - route53
  - SSL
---

You've set up your web service on AWS, placed it behind an Application Load Balancer (ALB), and successfully pointed your domain to the ALB using your DNS provider. Great! The next crucial step is enabling HTTPS to secure the traffic between your users and your service.

Fortunately, AWS provides free public SSL/TLS certificates through AWS Certificate Manager (ACM) that integrate seamlessly with ALBs. This guide shows you exactly how to request one and configure your existing ALB to use it.

**Scenario:**

* You have a web server (e.g., on EC2/ECS) running your application.
* An AWS Application Load Balancer (ALB) routes traffic to your web server.
* Your custom domain (e.g., `myapp.yourdomain.com`) already has a DNS record (like CNAME or ALIAS) pointing to the ALB's DNS name.
* You want to enable `https://myapp.yourdomain.com`.

---

## Prerequisites

- Existing AWS ALB.
- Access to manage your domain’s DNS settings (e.g., Route 53, Cloudflare, GoDaddy).

---

## Steps

### 1. Request SSL/TLS Certificate (ACM)

- Open AWS Certificate Manager (ACM) in the same region as your ALB.
- Request a **public certificate** for your domain (wildcards like `*.yourdomain.com` are supported).
![ACM request](@/assets/images/acm-1.png)
- **Validate ownership:**
  - **DNS Validation (Recommended):** Add ACM-provided CNAME to your DNS.
  - **Email Validation:** (Alternative) Approve via domain contact email.

- Once you have added the values to prove your ownership. Wait for the certificate status to show **Issued**.

### 2. Configure ALB HTTPS Listener

- Go to **EC2 → Load Balancers**.
- Select your ALB → **Listeners** tab.
- Add or edit HTTPS listener:
  - **Protocol:** HTTPS
  - **Port:** 443
  - **Default Action:** Forward to target group. Select your target group.
  - **SSL Certificate:** Select the ACM certificate
  - **Security Policy:** Choose a modern policy (e.g., `ELBSecurityPolicy-TLS13-1-2-2021-06`)
  - **Default SSL/TLS server certificate:** Choose from ACM and select the certificate that was requested.

### 3. Get ALB DNS Name

- Find the ALB’s **DNS name** (e.g., `your-alb-name-1234567890.region.elb.amazonaws.com`) under ALB details.

### 4. Update DNS Records

Depending on where you want SSL:

- **Subdomain (e.g., `app.yourdomain.com`):**
  - Create a **CNAME** pointing to the ALB DNS name.

- **Root domain (e.g., `yourdomain.com`):**
  - **Route 53:** Create an **Alias A record** pointing to the ALB.
  - **Other DNS providers:** Use **ANAME** or **CNAME Flattening** if supported.

> Note: CNAMEs are not allowed directly at root domains without ALIAS/ANAME/Flattening.

### 5. Verify Setup

- Wait for DNS propagation.
- Use tools like `dig` or `nslookup`:
  
  ```bash
  dig www.yourdomain.com
  dig yourdomain.com
  ```

- Visit your domain via HTTPS and check for a valid SSL certificate.

---

By following these steps, your domain is now securely accessible over HTTPS through AWS ALB.