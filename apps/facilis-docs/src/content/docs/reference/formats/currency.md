---
title: currency
description: Create a currency format instance with configurable symbol and cents behavior.
---

`currency()` creates a money-oriented format with grouped thousands, an
optional currency symbol, and configurable decimal handling.

[Play with the demos &rarr;](/facilis/demos/formats/currency/)

## Examples

With `currency()`:

- `12345` becomes `$12,345`
- `12345.6` becomes `$12,345.6` while focused
- `12345.6` becomes `$12,345.60` after blur

With `currency({ symbol: '€' })`:

- `12345` becomes `€12,345`

With `currency({ cents: 'never' })`:

- `12345.6` becomes `$12,345`

With `currency({ symbol: '', cents: 'never' })`:

- `12345.6` becomes `12,345`

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
const wholeNumberCurrencyFormat = currency({ symbol: '', cents: 'never' });
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

### `cents`

Controls whether decimal cents are included.

Default: `'always'`

Allowed values:

- `'always'`: keeps up to two decimal places while typing and pads to two
  digits on blur.
- `'never'`: strips decimals during normalization and formats only the integer
  portion.

Example:

```ts
const defaultCurrencyFormat = currency({ cents: 'always' });
const wholeNumberCurrencyFormat = currency({ cents: 'never' });
```

With raw input `12345.6`, `cents: 'always'` formats as `$12,345.6` while
focused and `$12,345.60` after blur. `cents: 'never'` formats as `$12,345`.

## Behavior

- Removes characters other than digits and a single decimal point during input
  normalization.
- Inserts comma separators in the integer portion.
- Preserves a partial decimal value while typing when `cents` is `'always'`.
- Pads the fractional portion to two digits on blur when `cents` is `'always'`.
