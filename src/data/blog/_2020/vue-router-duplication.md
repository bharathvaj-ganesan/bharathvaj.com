---
title: 'How to fix NavigationDuplicated Vue Router error'
pubDatetime: 2020-10-03T16:00:21.780Z
template: 'post'
draft: false
slug: vue-router-duplication
tags:
  - 'vue'
  - 'javascript'
description: 'Learn how to fix "NavigationDuplicated" error thrown by Vue Router'
---

Since version 3.3.0, Vue Router throws a couple of errors as a part of its promise API. "NavigationDuplicated" is one such error being thrown explicitly when the user clicks `<router-link>` or ( `router.push()` / `router.replace()` called programmatically) to view a page component that is already in current view.

Major router errors introduced includes,

- NavigationDuplicated
- NavigationCancelled
- NavigationRedirected
- NavigationAborted

To solve this error, we basically need to catch the error being thrown by the API methods. But adding catch statements to all the push and replace methods scattered across the codebase is really painful and time-consuming.

There are a couple of solutions to solve this issue, but the most optimized solution is to modify the router's methods with our own custom methods by adding that catch statement in one place as follows.

_Note: Make sure to include this script at the root of the project along with other polyfills_

```js
// polyfills/router.js

**
 * Wraps Vue Router - push() and replace()
 */
import Router from 'vue-router';

['push','replace'].forEach(method => {
  const originalMethod = Router.prototype[method];
  Router.prototype[method] = function m(location) {
    return originalMethod.call(this, location).catch(error => {
      if (error.name !== 'NavigationDuplicated') {
        // capture exception
      }
    })
  };
});

```

## Reference

- [Vue Router Changelog](https://github.com/vuejs/vue-router/blob/dev/CHANGELOG.md)
- [Stackoverflow Question](https://stackoverflow.com/questions/57837758/navigationduplicated-navigating-to-current-location-search-is-not-allowed)
