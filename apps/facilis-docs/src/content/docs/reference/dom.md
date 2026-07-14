---
title: DOM Adapter
description: Reference for the facilis-dom package.
---

The `facilis-dom` package binds a Facilis format to an `HTMLInputElement`.

```ts
import { bindFormat } from 'facilis-dom';
```

## bindFormat

```ts
function bindFormat(target: Element | string, format: Format): () => void;
```

`bindFormat()` accepts an input element or a selector, applies the format to the
mounted value, listens for `input` and `blur`, and returns a cleanup function.

```ts
import { bindFormat } from 'facilis-dom';
import { phoneNumber } from 'facilis-formats';

const cleanup = bindFormat('#phone', phoneNumber());
```

The adapter owns DOM wiring. The format itself remains reusable by other
adapters and tests.
