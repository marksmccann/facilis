---
title: Define a Format
description: Define a reusable Facilis format from core primitives.
---

Use `defineFormat()` when you want a reusable format that can work with any
adapter.

```ts
import { defineFormat } from 'facilis';

export const digitsOnly = () =>
    defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '');
        },
    });
```

Every format starts with `normalize`. It receives any display value and returns
the semantic value the format should work from.

## Add display formatting

Use `format` to build the focused display value from the normalized value.

```ts
export const groupedCode = () =>
    defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, 6);
        },
        format(normalized) {
            return normalized.replace(/(\d{3})(?=\d)/, '$1-');
        },
    });
```

## Add blur behavior

Use `blur` when the display should tighten up after the user leaves the field.

```ts
export const dollars = () =>
    defineFormat({
        normalize(raw) {
            return raw.replace(/[^\d.]/g, '');
        },
        format(normalized) {
            return normalized === '' ? '' : `$${normalized}`;
        },
        blur(formatted) {
            return formatted.endsWith('.5') ? `${formatted}0` : formatted;
        },
    });
```

## Handle specific edits

Most formats only need `normalize`, `format`, and sometimes `blur`. Use `edit`
hooks when a specific edit intent needs special handling.

Edit hooks can return:

- a string to override the formatted value;
- a text state to override both value and selection;
- `null` to reject the edit;
- `undefined` to keep the default formatted result.

The runtime currently recognizes append, insert, and backward-delete edit
intentions.
