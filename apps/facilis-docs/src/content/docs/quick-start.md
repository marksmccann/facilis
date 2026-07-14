---
title: Quick Start
description: Install Facilis and format your first input.
---

Facilis is split into small packages. Install the adapter for your UI surface
and the formats package when you want the first-party formats.

```sh
npm install facilis facilis-formats facilis-dom
```

For React:

```sh
npm install facilis facilis-formats facilis-react
```

## Plain DOM

Use `bindFormat()` when you have an existing `HTMLInputElement` or selector.

```ts
import { bindFormat } from 'facilis-dom';
import { phoneNumber } from 'facilis-formats';

const cleanup = bindFormat('#phone', phoneNumber());
```

`bindFormat()` formats the mounted value, listens for `input` and `blur`, and
returns a cleanup function that removes its listeners.

## React

Use `useFormat()` when React owns the input.

```tsx
import { useFormat } from 'facilis-react';
import { currency } from 'facilis-formats';

function AmountInput() {
    const amount = useFormat(currency, {
        defaultValue: '1234.5',
        onValueChange(value) {
            console.log(value);
        },
    });

    return <input {...amount.inputProps} />;
}
```

The hook returns `inputProps` for the input and `inputRef` for direct access to
the underlying element.

## Next steps

- Read [Core Ideas](/facilis/core-ideas/) for the runtime model.
- Compare [first-party formats](/facilis/reference/formats/).
- Use the [DOM adapter](/facilis/adapters/dom/) or [React adapter](/facilis/adapters/react/) for adapter details.
- Create custom behavior with [Create a Format](/facilis/create-a-format/).
