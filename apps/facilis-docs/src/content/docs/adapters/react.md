---
title: React
description: Create input props with the Facilis React adapter.
---

Use `facilis-react` when React owns the input.

```tsx
import { useFormat, useFormattedInput } from 'facilis-react';
import { currency, number } from 'facilis-formats';

function QuantityInput() {
    const quantityFormat = useFormat(number, {
        trimLeadingZeros: true,
    });
    const quantity = useFormattedInput(quantityFormat, {
        defaultValue: '0012',
    });

    return <input {...quantity.inputProps} />;
}
```

`useFormat()` receives a format factory and format options. It returns a Facilis
format instance. `useFormattedInput()` receives that format and React-specific
input options.

## Input options

- `defaultValue`: initial value to format when the input mounts.
- `onInput`: receives the React input event before Facilis updates state.
- `onBlur`: receives the React blur event before Facilis updates state.
- `onValueChange`: receives the next formatted value after input or blur when
  the display value changes.

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

The adapter keeps Facilis as the source for the displayed input value. Use
`onValueChange` when the formatted value needs to leave the component.

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
