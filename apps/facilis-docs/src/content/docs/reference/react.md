---
title: React Adapter
description: Reference for the facilis-react package.
---

The `facilis-react` package creates stable format instances, input props, and
display values for React components.

```tsx
import { useFormat, useFormattedInput, useFormattedValue } from 'facilis-react';
```

## useFormat

```ts
function useFormat(factory, options?): Format;
```

`useFormat()` accepts a format factory and format-specific options. It returns a
Facilis format instance.

```tsx
import { useFormat } from 'facilis-react';
import { currency } from 'facilis-formats';

const amountFormat = useFormat(currency, {
    includeCents: true,
});
```

## useFormattedInput

```ts
function useFormattedInput(format, options?): UseFormattedInputResult;
```

`useFormattedInput()` accepts a format instance and React-specific input
options.

Input options:

- `defaultValue`
- `onInput`
- `onBlur`
- `onValueChange`

The hook returns:

- `inputProps`: props to spread onto an input.
- `inputRef`: direct access to the input element.

```tsx
import { useFormat, useFormattedInput } from 'facilis-react';
import { currency } from 'facilis-formats';

function AmountInput() {
    const amountFormat = useFormat(currency, {
        includeCents: true,
    });
    const amount = useFormattedInput(amountFormat, {
        defaultValue: '1234.5',
    });

    return <input {...amount.inputProps} />;
}
```

## useFormattedValue

```ts
function useFormattedValue(format, value): string;
```

`useFormattedValue()` formats a standalone string value with
`format.formatValue(value)` and memoizes the result.

```tsx
function AmountText({ value }: { value: string }) {
    const amountFormat = useFormat(currency, {
        includeCents: true,
    });
    const amount = useFormattedValue(amountFormat, value);

    return <span>{amount}</span>;
}
```
