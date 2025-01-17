---

title: What the heck is instantSearchSDKJSBridgeClearHighlight captured by Sentry?
slug: instant-search-sdk-bridge-function
draft: false
pubDatetime: 2022-03-03T04:58:08.065Z
description: Learn in detail about this instantSearchSDKJSBridgeClearHighlight
  error to know about why this occurs.
tags:
  - bug
  - sentry
  - edge
  - bing
---
Recently at work, encountered this interesting error on Sentry logs and there were multiple events for this one so as usual started debugging.

When Googled, landed on [a StackOverflow Q&A](https://stackoverflow.com/questions/69261499/what-is-instantsearchsdkjsbridgeclearhighlight) which was the only post available regarding this issue.

<div style="text-align:center">
 <img src="https://media1.giphy.com/media/WsNbxuFkLi3IuGI9NU/giphy.gif" width="320" />
</div>

After going through all the answers and comments in Q&A, the issue seems to occur only on Edge on iOS mobile. This is a harmless cross-browser issue that we can ignore in Sentry.

The reason for this one is Edge uses Safari's WkWebView instead of its own Blink. In order to implement features like Bing's instant search, etc Edge injected these methods into the loaded pages and then the outer browser calls those JavaScript functions that were injected.

Here, someone had goofed and got rid of (or renamed) the injected JavaScript function, but failed to remove/update the browser code that tries to call that injected JavaScript. Since Sentry captures all the errors logged to the console, it is logged to our app errors. 
So for me, it is one less issue to worry about, I assume the same for you.


<div style="text-align:center">
 <img src="https://media1.giphy.com/media/l2JdVRfJozpjq70SA/giphy.gif" width="320" />
</div>

Happy Hacking!!!