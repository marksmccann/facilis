---
title: currency
description: Create a currency format instance with configurable symbol, separators, and optional cents.
---

`currency()` creates a money-oriented format with grouped thousands, an
optional currency symbol, configurable decimal separators, and optional cents.

[Play with the demos &rarr;](/facilis/demos/formats/currency/)

## Examples

With `currency()`:

- `12345` becomes `$12,345`
- `12345.6` becomes `$12,345.6` while focused
- `12345.6` becomes `$12,345.60` after blur

With `currency({ symbol: '€' })`:

- `12345` becomes `€12,345`

With `currency({ symbol: '€', decimalSeparator: ',', thousandsSeparator: '.' })`:

- `12345,6` becomes `€12.345,6` while focused
- `12345,6` becomes `€12.345,60` after blur

With `currency({ includeCents: false })`:

- `12345.6` becomes `$123,456`

With `currency({ thousandsSeparator: '' })`:

- `12345.6` becomes `$12345.6` while focused
- `12345.6` becomes `$12345.60` after blur

With `currency({ symbol: '', includeCents: false })`:

- `12345.6` becomes `123456`

## Signature

```ts
function currency(options?: CurrencyOptions): Facilis.FormatInstance;
```

## Import

```ts
import { currency } from 'facilis-formats';
```

## Usage

```ts
const defaultCurrencyFormat = currency();
const euroCurrencyFormat = currency({ symbol: '€' });
const wholeNumberCurrencyFormat = currency({ includeCents: false });
```

## Options

### `symbol`

Prefixes the formatted value.

Default: `'$'`

Pass an empty string to omit the symbol entirely.

Example:

```ts
const defaultCurrencyFormat = currency();
const euroCurrencyFormat = currency({ symbol: '€' });
const symbolFreeCurrencyFormat = currency({ symbol: '' });
```

With raw input `12345`, these produce `$12,345`, `€12,345`, and `12,345`.

### `decimalSeparator`

Sets the separator used between the whole and fractional portions of the
currency value.

Default: `'.'`

Example:

```ts
const localizedCurrencyFormat = currency({
    symbol: '€',
    decimalSeparator: ',',
    thousandsSeparator: '.',
});
```

With raw input `12345,6`, this formats as `€12.345,6` while focused and
`€12.345,60` after blur.

### `thousandsSeparator`

Sets the separator used between digit groups in the whole portion of the
currency value.

Default: `','`

Example:

```ts
const groupedCurrencyFormat = currency();
const ungroupedCurrencyFormat = currency({ thousandsSeparator: '' });
```

With raw input `12345.6`, these format as `$12,345.6` and `$12345.6` while
focused.

### `includeCents`

Controls whether the formatted value includes cents.

Default: `true`

- `true`: keeps up to two decimal places while typing and pads to two digits
  on blur.
- `false`: removes decimal separators during normalization and merges the
  remaining digits into the whole portion.

Example:

```ts
const defaultCurrencyFormat = currency({ includeCents: true });
const wholeNumberCurrencyFormat = currency({ includeCents: false });
```

With raw input `12345.6`, `includeCents: true` formats as `$12,345.6` while
focused and `$12,345.60` after blur. `includeCents: false` formats as
`$123,456`.

## Behavior

- Removes characters other than digits and the configured decimal separator
  during input normalization.
- Inserts the configured thousands separator in the whole portion.
- Preserves a partial decimal value while typing when `includeCents` is `true`
  and a decimal separator is present.
- Pads the fractional portion to two digits on blur when `includeCents` is
  `true`.
