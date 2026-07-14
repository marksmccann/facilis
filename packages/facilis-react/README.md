# facilis-react

React adapter for Facilis.

## `useFormat`

Create props for a React-managed input backed by a Facilis format factory.

```tsx
import { useFormat } from 'facilis-react';
import { number } from 'facilis-formats';

function AmountInput() {
    const amount = useFormat(number, {
        decimalPlaces: 2,
        defaultValue: '1234.5',
        onValueChange(value) {
            console.log(value);
        },
    });

    return <input {...amount.inputProps} />;
}
```

Use `amount.inputRef` when you need access to the input element.
