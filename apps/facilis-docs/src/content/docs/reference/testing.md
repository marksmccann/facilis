---
title: Testing
description: Reference for the facilis-testing package.
---

The `facilis-testing` package drives formats through input-like operations in
tests.

```ts
import { setupInput, textState } from 'facilis-testing';
```

## setupInput

`setupInput(format)` creates a stateless test input for one Facilis format.

The returned helper supports:

- `mount(value, selectionStart?, selectionEnd?)`
- `blur(value, selectionStart?, selectionEnd?)`
- `append(previous, text)`
- `insert(previous, text, selectionStart, selectionEnd?)`
- `deleteBackward(previous, cursor?)`
- `type(text)`

Each method returns a Facilis `TextState`.

## textState

`textState(value, selectionStart?, selectionEnd?)` creates the object used for
expected values and exact input snapshots.

```ts
import { setupInput, textState } from 'facilis-testing';
import { phoneNumber } from 'facilis-formats';

const input = setupInput(phoneNumber());

expect(input.type('5551234567')).toEqual(textState('(555) 123-4567', 14));
```
