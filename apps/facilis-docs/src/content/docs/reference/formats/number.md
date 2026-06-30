---
title: number
description: Create a numeric format instance with configurable decimal places, separators, and negative-value support.
---

`number()` creates a numeric format with optional decimal places, configurable
decimal and thousands separators, and optional negative-value support.

[Play with the demos &rarr;](/facilis/demos/formats/number/)

## Examples

With `number()`:

- `12345` becomes `12345`

With `number({ decimalPlaces: 2 })`:

- `12345.67` becomes `12345.67`

With `number({ decimalPlaces: 2, thousandsSeparator: ',' })`:

- `12345.67` becomes `12,345.67`

With `number({ decimalPlaces: 2, decimalSeparator: ',', thousandsSeparator: '.' })`:

- `12345,67` becomes `12.345,67`

With `number({ allowNegative: true, decimalPlaces: 2 })`:

- `-12345.67` becomes `-12345.67`

## Signature

```ts
function number(options?: NumberOptions): Facilis.FormatInstance;
```

## Import

```ts
import { number } from 'facilis-formats';
```

## Usage

```ts
const integerFormat = number();

const groupedDecimalFormat = number({
    decimalPlaces: 2,
    thousandsSeparator: ',',
});

const localizedDecimalFormat = number({
    decimalPlaces: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
});
```

## Options

### `decimalPlaces`

Controls how many decimal places are preserved.

Default: `0`

Example:

```ts
const integerFormat = number();
const decimalFormat = number({ decimalPlaces: 2 });
```

With raw input `12345.67`, `integerFormat` becomes `1234567`, while
`decimalFormat` becomes `12345.67`.

### `decimalSeparator`

Sets the separator used between the whole and fractional portions of the
number.

Default: `'.'`

Example:

```ts
const localizedDecimalFormat = number({
    decimalPlaces: 2,
    decimalSeparator: ',',
});
```

With raw input `12345,67`, this formats as `12345,67`.

### `thousandsSeparator`

Sets the separator used between digit groups in the whole portion of the
number.

Default: `''`

Example:

```ts
const groupedNumberFormat = number({
    decimalPlaces: 2,
    thousandsSeparator: ',',
});
```

With raw input `12345.67`, this formats as `12,345.67`.

### `allowNegative`

Controls whether a leading minus sign is preserved.

Default: `false`

Example:

```ts
const defaultNumberFormat = number();
const signedNumberFormat = number({ allowNegative: true });
```

With raw input `-12345`, `defaultNumberFormat` formats as `12345`, while
`signedNumberFormat` formats as `-12345`.

## Behavior

- Removes characters other than digits and the configured decimal separator
  during input normalization.
- Preserves only the first configured decimal separator when `decimalPlaces` is
  greater than `0`.
- Inserts the configured thousands separator into the whole portion during
  formatting.
- Preserves a lone `-` or partial decimal value like `-,` while typing when
  the corresponding options allow them.
