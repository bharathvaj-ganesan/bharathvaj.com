---

title: Focus vs Focus-Within vs Focus-Visible
slug: focus-vs-within-vs-visible
draft: false
pubDatetime: 2021-05-02T13:00:00.000Z
description: What are these pseudo-classes and how does each differ from the other
tags:
  - css
  - Web Development
---
Today, we will be discussing focusable pseudo-classes supported by modern browsers, but before we dive deeper, it's worth understanding what *focusable* and *tabbable* means in the context of CSS.

### Focusable Element
The element will be focused by the script `(element.focus())` and possibly the mouse (or pointer), but not the keyboard.

### Tabbable Element
The element will be keyboard focusable ("tabbable"), as it is part of the document's sequential focus navigation order. Also focusable by the script and possibly the mouse (or pointer).

These pseudo-classes are triggered when the user focuses on an element in different ways.

## :focus

Triggered when the user clicks or taps on an element or selects it with the keyboard's `Tab` key.

```css
/* Selects any <input> when focused */
input:focus {
  background: yellow;
  color: red;
}
```

This applies only to the focused element. Here, only the input tag will be highlighted

<iframe height="265" style="width: 100%;display:flex;" scrolling="no" title=":focus pseudo-class example" src="https://codepen.io/bharathvaj1995/embed/eYvmzWV?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/bharathvaj1995/pen/eYvmzWV'>:focus pseudo-class example</a> by Bharathvaj
  (<a href='https://codepen.io/bharathvaj1995'>@bharathvaj1995</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## :focus-within
Triggered when the user clicks or taps on any of its child element or itself

```css
/* Selects a <div> when one of its descendants is focused */
div:focus-within {
  background: cyan;
}
```

Here if any of that div's children receive focus that this selector will get applied.

<iframe height="265" style="width: 100%;display:flex;" scrolling="no" title=":focus-within pseudo-class example" src="https://codepen.io/bharathvaj1995/embed/LYWEZOa?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/bharathvaj1995/pen/LYWEZOa'>:focus-within pseudo-class example</a> by Bharathvaj
  (<a href='https://codepen.io/bharathvaj1995'>@bharathvaj1995</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## :focus-visible

Triggered by User-Agent on elements having `:focus` selector based on some heuristics that determine which one of the active elements should receive focus.

This selector is mostly useful to provide a different focus indicator based on the user’s input modality (mouse vs. keyboard).

For instance, let's say you have `<a>` tag, you want to remove the focus outline when user focuses it via mouse but want to have retain an outline that goes in with the site theme when user focuses via keyboard.

<img width="100%" src="https://i1.wp.com/css-tricks.com/wp-content/uploads/2019/01/unwanted-outline.png?ssl=1" >

```css
.next-image-button:focus {
  outline: none;
}
.next-image-button:focus-visible {
  outline: 3px solid currentColor; /* That'll show 'em */
}
```

<img width="100%" src="https://i1.wp.com/css-tricks.com/wp-content/uploads/2019/01/focus-visible-outline.png?ssl=1" >

So, when we use mouse there won't be any visual outline but with keyboard, there will be a nice visual focus indication that goes along with the site theme.

These CSS pseudo-classes will definitely improve site accessibility when used correctly.

<div style="text-align:center">
<img width="240px"  height="240px" src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"></div>
<p>Happy Hacking!!!</p>
</div>



