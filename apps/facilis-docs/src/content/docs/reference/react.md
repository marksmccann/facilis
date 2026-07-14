---
title: React Adapter
description: Reference for the facilis-react package.
---

The `facilis-react` package creates props for a React-managed input.

```tsx
import { useFormat } from 'facilis-react';
```

## useFormat

```ts
function useFormat(createFormat, options?): UseFormatResult;
```

`useFormat()` accepts a format factory and an options object. Format-specific
options are passed to the factory. React-specific options are handled by the
hook.

Reserved options:

- `defaultValue`
- `onInput`
- `onBlur`
- `onValueChange`

The hook returns:

- `inputProps`: props to spread onto an input.
- `inputRef`: direct access to the input element.

```tsx
import { useFormat } from 'facilis-react';
import { currency } from 'facilis-formats';

function AmountInput() {
    const amount = useFormat(currency, {
        defaultValue: '1234.5',
    });

    return <input {...amount.inputProps} />;
}
```
