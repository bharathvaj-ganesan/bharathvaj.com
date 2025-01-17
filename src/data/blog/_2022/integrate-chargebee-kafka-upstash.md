---

title: Integrate Chargebee and Kafka Using Upstash Webhook API
slug: integrate-chargebee-kafka-upstash
draft: false
pubDatetime: 2022-12-18T01:43:57.425Z
description: Discover the use cases by integrating Chargebee with Kafka
tags:
  - Chargebee
  - Kafka
  - System Design
  - Webhooks
  - Upstash
---

Today, lets see how to push Chargebee events to Apache Kafka using Upstash Webhook API. Once data is in Kafka there are many use cases how you can use it:

* Processing subscription events (with Apache Flink or Spark) to notify your business and sales team.

* Trigger notification such as sending messages on slack or email if a payment fails during subscription.

* Using a Kafka connector to move the data to a database or data warehouse to feed reporting and analytics applications.

* Feeding your subscription activity data to your CRM.

## Upstash Webhook API
Upstash Kafka has an HTTP based [Webhook API](https://docs.upstash.com/kafka/webhook) which pushes the incoming requests’ payload to the Kafka. With this, you don't need to write code to move data or build a separate connector setup.

### Step 1: Configuring Kafka
If you don’t already have an Upstash account, you can sign up [here](https://console.upstash.com/login). You’ll see the Upstash [console](https://console.upstash.com/) afterward. Select the Kafka tab at the top navbar. You can create a cluster by clicking on the __create button__.

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1671323214/Screenshot_2022-12-18_at_5.56.36_AM_avnp9p.png" />

Create a topic in the second page of the form:

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1671323182/Screenshot_2022-12-18_at_5.56.05_AM_mmprom.png" />

On Kafka Details page, scroll down to the Webhook section. You will be needing the URL in the next step.

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1671323112/Screenshot_2022-12-18_at_5.50.19_AM_iiroyh.png" />

### Step 2: Configuring Chargebee Webhook
Sign in to your Chargebee account, then click the Webhook settings page (Configure Chargebee > Webhooks). Click the __Add Webhook__ button.

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1671323113/Screenshot_2022-12-18_at_5.53.14_AM_se2a4s.png" />

Now, you need to enter the webhook URL copied from Upstash Console. The url should have topic, user and pass parameters. You may want to change the topic parameter if you have more than one topic.

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1671323233/Screenshot_2022-12-18_at_5.57.02_AM_tjr1d2.png" />

You can select for which events this webbooks needs to be sent by Chargebee. Then click on __create__ and you are done.

### Step 3: Testing the Webhook
Now we have the pipeline, we can test it. Copy the curl command for Consumer REST API from the Upstash console.

<img src="https://res.cloudinary.com/dpxhm3lg3/image/upload/v1671363862/Screenshot_2022-12-18_at_5.13.07_PM_xds0fb.png" />


Run it on your terminal, it should output an empty message.

```
curl "https://liberal-koi-5246-us1-rest-kafka.upstash.io/consume/GROUP_NAME/GROUP_INSTANCE_NAME/subscription-management" \
  -H "Kafka-Auto-Offset-Reset: earliest" \
  -u "bGliZXJhbC1rb2ktNTI0NiS784JLgaTMgMsi4Zpoc-C_JztacpOWy86NHApNkvQ:mJ5EoF3FNoFgUG7HMewHN3uwFoOsHmHp9LifZibcjF0qf0lpz3AmwKbWVwFbAVYtf7jpXA=="

[]
```

Now click on the __Test Webhook__ action and click proceed with any event from the dropdown. You should see the Chargebee event is saved to Kafka topic.

```
curl "https://liberal-koi-5246-us1-rest-kafka.upstash.io/consume/GROUP_NAME/GROUP_INSTANCE_NAME/subscription-management" \
  -H "Kafka-Auto-Offset-Reset: earliest" \
  -u "bGliZXJhbC1rb2ktNTI0NiS784JLgaTMgMsi4Zpoc-C_JztacpOWy86NHApNkvQ:mJ5EoF3FNoFgUG7HMewHN3uwFoOsHmHp9LifZibcjF0qf0lpz3AmwKbWVwFbAVYtf7jpXA=="

[
  {
  "topic" : "subscription-management",
  "partition" : 0,
  "offset" : 4,
  "timestamp" : 1671294211309,
  "key" : "",
  "value" : "{YOUR_CHARGEBEE_EVENT}",
]
```

Here, we managed to integrate Chargebee to Upstash Kafka without writing code and running a connector, but this is possible for any service which have a webhook support.