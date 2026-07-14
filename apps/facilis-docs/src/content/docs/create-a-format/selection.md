---
title: Selection
description: Resolve custom cursor behavior when creating custom formats.
---

Facilis tracks value and selection together. The default runtime maps selection
through `normalize` and `format`, which is enough for many formats.

Use selection helpers when an `edit` hook overrides the default result and
needs to control where the cursor lands.

## resolveSelectionBeforeFormatting

Use `resolveSelectionBeforeFormatting()` when the cursor should move to the
start of known formatting text immediately before a position.

```ts
import { resolveSelectionBeforeFormatting } from 'facilis/selection';

const selection = resolveSelectionBeforeFormatting({
    value: '12,345',
    position: 3,
    formatting: ',',
});
```

This returns a collapsed selection before the comma.

## resolveSelectionAtDeletedBoundary

Use `resolveSelectionAtDeletedBoundary()` when a deletion removes semantic text
and the next cursor should land at the equivalent normalized boundary in the
newly formatted value.

```ts
import { resolveSelectionAtDeletedBoundary } from 'facilis/selection';

const selection = resolveSelectionAtDeletedBoundary({
    previous: '12,345',
    formatted: '1,345',
    start: 1,
    normalize(raw) {
        return raw.replace(/\D/g, '');
    },
});
```

This is most useful in backward-delete edit hooks for formats with separators,
prefixes, or other display-only text.

## Returning selection from edit hooks

When an edit hook needs to control selection, return a text state:

```ts
return {
    value: context.formatted,
    selectionStart: 2,
    selectionEnd: 2,
};
```

Return `undefined` when the default runtime selection is good enough.
