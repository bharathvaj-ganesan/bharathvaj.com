---

title: Guaranteeing webhook delivery in NextJS Application
slug: implement-webhook-nextjs
draft: false
pubDatetime: 2023-01-04T02:58:08.065Z
description: Let us implement webhook at scale in NextJS
tags:
  - Nextjs
  - Webhooks
  - System Design
---

[Webhooks](https://en.wikipedia.org/wiki/Webhook) are a powerful tool that allow your SAAS application to send real-time updates to other applications. In this blog post, we'll walk through the process of adding webhook support to your next app.

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1673787030/webhook_bthkyu.png" />

A webhook is just an HTTP request to another server that gets automatically sent whenever some data in your app changes. There could be more than one webhook configured by your users.

However, there are a few factors that make it tricky to manage the life cycle of a webhook, such as:

- Dealing with server failures on both the sending and the receiving end.
- Managing HTTP timeouts.
- Retrying the requests gracefully without overloading the recipients.
- Avoiding retry loop on the sending side.
- Monitoring and providing scope for manual interventions.
- Scaling them quickly; either vertically or horizontally.
- Decoupling webhook management logic from your primary application logic.

Properly dealing with these concerns can be cumbersome; especially when sending webhooks is just another small part of your application and you just want it to work without you having to deal with all the hairy details every time.
Let's solve it.

## Steps

We'll not be getting into the details of creating NextJS application from scratch nor into its details as it is not a focus for today's topic. We'll assume that we have a app and we are adding webhook capability to it.

The simplified webhook architecture will looks something this:

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1673790923/webhook-arch_yba55r.png" />

Let's assume we have a webhook setting page like shown below where the user can configure their webhooks. We will be also having a table called `webhooks` where we will be saving all the webhooks configured. User can control the events for which they are subscribing for to reduce the noise.

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1673791590/screenshotr_2023-1-15T19-36-18_ei0ezn.png" alt="Cal.com Webhooks"/>

### Step 1: Setup Quirrel

[Quirrel](https://quirrel.dev/) is a popular open-source webhook framework that makes it easy to add webhook support to your app. It makes uses of [redis](https://redis.io/) under the hood.

We need to run Quirrel server separately. It is easy to deploy to popular services like [FLY](https://fly.io/).

You can install Quirrel simply by running the following command

```bash
npm install quirrel

```

**Tip:** You can also modify your npm script as follows so we run two services parallely.

```json
// package.json
"scripts": {
  "dev": "concurrently 'next dev' 'quirrel'"
}
```

### Step 2: Creating Webhook Queue

Create a new API Route at `pages/api/queues/webhook.ts`. This job queue serverless handler which will get invoked by Quirrel when processing a message queue.

Here we are simply calling the webhook subscription url configured by the user. Nothing fancy. This handler gets two major info. One the actual `event` object and the `webhook` object which contains which URL this event needs to be fired. It could contain other events as well.

Here if the webhook event is sent successfully then the item is removed from the queue else it will added back to the queue by Quirrel itself.

```ts
import { Queue } from 'quirrel/next';
import fetch from '@/utils/fetch';

export default Queue('api/queues/webhook', async (job: any) => {
  const { event, webhook } = job;
  const headerName = process.env.HEADER_NAME || 'MY APP';

  const config = {
    headers: {
      ['X-' + headerName + '-Event-Type']: event.type,
      'User-Agent': headerName + '-Webhook/1.0',
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  };

  try {
    await fetch(webhook.subscriberUrl, {
      method: 'POST',
      body: JSON.stringify(event.payload),
      ...config,
    });
    // update this event webhook status in events DB so the user knows the status
  } catch (error: any) {
    console.log(error);
    console.log('bharath errror');
    if (error.code && error.code === 'ECONNABORTED') {
      throw new Error('Response exceeded timeout of : ' + 10000 + 'ms');
    }

    if (error.response && error.response.status) {
      throw new Error('Callback POST failed with status code: ' + error.response.status);
    }
  }
});
```

### Step 3: Adding to Webook Queue

Let's say we need to send notification via webhooks whenever a customer is created in our app. Here we create a util call `WebhookNotifier` which takes care of sending the event to the consumers. Here for simplicity sake we call function `sendEvent` it queries for currently configured webhooks and adds it to the message queue.

```ts
// WebhookNotifier.ts

export default class WebhookNotifier {
  static async sendEvent(userId, event) {
    // fetch all webhooks configured for the current event for the current user.
    const configuredWebhooks = await prisma.webhooks.find({
      where: {
        userId: userId,
      },
    });

    const subscribedWebhooksForThisEvent = configuredWebhooks.filter((w) => w.eventType === event.eventType);
    for (const webhook of subscribedWebhooksForThisEvent) {
      // Adding to the queue
      WebhookQueue.enqueue(
        {
          webhook: {
            id: webhook.id, // eg. "chargebee_customer",
            subscriberUrl: webhook.subscriberUrl, // eg. "https://webhook.site/e1f703ef-da81-4145-8698-790f5eee8cd0"
            secret: webhook.secret, // eg. "*****",
          },
          event: {
            type: event.eventType, // eg 'CUSTOMER_CREATED',
            payload: {
              type: event.eventType,
              data: {
                ...event.payload, // {} name: 'Bharath', age: 26, }
              },
            },
          },
        },
        {
          retry: ['10sec', '5min', '1h'], // or output of https://www.npmjs.com/package/exponential-backoff-generator
        }
      );
    }
  }
}
```

```ts
// api/customer/create
import WebhookNotifier from 'src/utils/WebhookNotifier.ts';

export default function customerRouter(req, res) {
  // Code to Create Customer in APP Database
  const customer = await prisma.customer.upsert();
  // Send Webhook Notification
  WebhookNotifier.sendEvent( , { event: 'CUSTOMER_CREATED', payload: customer })
  return res.ok();
}
```

Let's assume if the webhook failed due to the consumer service is not responding. Then the job will fail and adds back to queue. Here we have mentioned retry time interval as `10sec`, `5min`. We can customize as your SLA. You can also follow linear or exponential backoff strategy so that we don't add more pressure to the consumer apps.

We have successfully implemented a super scalable webhook notification solution using message queue on top of Redis.

There are other things to consider here like sending the signature of the event for security purpose. You can also provide way to customize the event object while configuring the webhook which improves the DX.

Happy Building!!!
