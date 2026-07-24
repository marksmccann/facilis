---
title: React
description: Create input props with the Facilis React adapter.
---

Use `facilis-react` when React owns the input.

```tsx
import { useState } from 'react';
import { useFormat, useFormattedInput } from 'facilis-react';
import { currency, number } from 'facilis-formats';

function QuantityInput() {
    const [value, setValue] = useState('12');
    const quantityFormat = useFormat(number, {
        trimLeadingZeros: true,
    });
    const quantity = useFormattedInput(quantityFormat, {
        value,
        onValueChange: setValue,
    });

    return <input {...quantity.inputProps} />;
}
```

`useFormat()` receives a format factory and format options. It returns a Facilis
format instance. `useFormattedInput()` receives that format and React-specific
input options.

## Input options

- `value`: current formatted display value for controlled inputs.
- `defaultValue`: initial value to format for uncontrolled inputs.
- `onInput`: receives the React input event before Facilis updates state.
- `onBlur`: receives the React blur event before Facilis updates state.
- `onValueChange`: receives the next formatted value when the display value
  changes. Controlled inputs require it.

## Returned values

The hook returns:

- `inputProps`: `ref`, `value`, `onInput`, and `onBlur` props to spread onto an
  input.
- `inputRef`: the same input ref, exposed directly for code that needs the
  underlying element.

```tsx
const amountFormat = useFormat(currency, {
    includeCents: true,
});
const amount = useFormattedInput(amountFormat, {
    defaultValue: '1234.5',
    onValueChange(value) {
        console.log(value);
    },
});

return <input {...amount.inputProps} />;
```

Use `value` with `onValueChange` when the formatted display value lives in your
component state. Use `defaultValue` when the hook should own it.
Pass an already formatted initial value when you do not want `onValueChange` to
run on mount.

## Standalone values

Use the format instance directly or `useFormattedValue()` when a React component
needs display-only formatting.

```tsx
import { useFormat, useFormattedValue } from 'facilis-react';
import { currency } from 'facilis-formats';

const amountFormat = useFormat(currency, {
    includeCents: true,
});
const amount = useFormattedValue(amountFormat, '1234.5');
```

See the [React API reference](/facilis/reference/react/) for the exact export
shape.
