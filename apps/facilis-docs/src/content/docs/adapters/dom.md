---
title: DOM
description: Bind a Facilis format to a plain HTML input.
---

Use `facilis-dom` when you are working with an `HTMLInputElement` directly.

```ts
import { bindFormat } from 'facilis-dom';
import { currency, phoneNumber } from 'facilis-formats';

const cleanup = bindFormat('#phone', phoneNumber());
```

`bindFormat()` accepts either an input element or a selector that resolves to an
input element.

```ts
const input = document.querySelector<HTMLInputElement>('#amount');
const format = currency();

if (input !== null) {
    bindFormat(input, format);
}
```

## What the adapter does

The DOM adapter reads the input value and selection, passes input events through
the Facilis runtime, writes the formatted value back to the input, and restores
the next selection when the format provides one.

It also listens for blur so formats can apply blur-only behavior, such as
padding currency cents.

## Cleanup

`bindFormat()` returns a cleanup function. Call it when the input is removed or
when your app replaces the binding.

```ts
const cleanup = bindFormat('#amount', currency());

cleanup();
```

## When to use another adapter

Use the React adapter instead when React owns the input value and event props.
Use the core package directly when you are writing your own adapter or a custom
format.

See the [DOM API reference](/facilis/reference/dom/) for the exact export shape.
