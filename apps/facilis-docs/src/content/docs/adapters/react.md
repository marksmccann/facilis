---
title: React
description: Create input props with the Facilis React adapter.
---

Use `facilis-react` when React owns the input.

```tsx
import { useFormat } from 'facilis-react';
import { currency, number } from 'facilis-formats';

function QuantityInput() {
    const quantity = useFormat(number, {
        trimLeadingZeros: true,
        defaultValue: '0012',
    });

    return <input {...quantity.inputProps} />;
}
```

`useFormat()` receives a format factory as the first argument and an options
object as the second argument. Options that belong to the format are passed to
the factory. React-specific options are reserved by the hook.

## Reserved options

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
const amount = useFormat(currency, {
    defaultValue: '1234.5',
    onValueChange(value) {
        console.log(value);
    },
});

return <input {...amount.inputProps} />;
```

The adapter keeps Facilis as the source for the displayed input value. Use
`onValueChange` when the formatted value needs to leave the component.

See the [React API reference](/facilis/reference/react/) for the exact export
shape.
