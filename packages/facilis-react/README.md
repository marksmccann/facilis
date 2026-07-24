# facilis-react

React adapter for Facilis.

## `useFormat`

Create a Facilis format instance from a format factory.

```tsx
import { useState } from 'react';
import { useFormat, useFormattedInput } from 'facilis-react';
import { number } from 'facilis-formats';

function AmountInput() {
    const amountFormat = useFormat(number, {
        decimalPlaces: 2,
    });
    const [value, setValue] = useState('1,234.50');
    const amount = useFormattedInput(amountFormat, {
        value,
        onValueChange: setValue,
    });

    return <input {...amount.inputProps} />;
}
```

Use `defaultValue` instead when the hook should own the formatted display
value.

Use `amount.inputRef` when you need access to the input element.

## `useFormattedValue`

Format a standalone string for display.

```tsx
import { useFormat, useFormattedValue } from 'facilis-react';
import { currency } from 'facilis-formats';

function AmountText({ value }: { value: string }) {
    const amountFormat = useFormat(currency, {
        includeCents: true,
    });
    const amount = useFormattedValue(amountFormat, value);

    return <span>{amount}</span>;
}
```
