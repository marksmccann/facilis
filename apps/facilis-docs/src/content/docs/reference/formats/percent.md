---
title: percent
description: Create a percent format instance with optional decimal places, range limits, negative-value support, and an optional percent symbol.
---

`percent()` creates a percent-oriented numeric format with optional decimal
places, a configurable decimal separator, optional live range limits, optional
negative-value support, and an optional trailing percent symbol.

The format does not scale values. Raw input `12` formats as `12%`, not
`1200%`.

[Play with the demos &rarr;](/facilis/demos/formats/percent/)

## Examples

With `percent()`:

- `12` becomes `12%`
- `00012` becomes `12%`

With `percent({ includeSymbol: false })`:

- `12` becomes `12`

With `percent({ decimalPlaces: 2 })`:

- `12.345` becomes `12.34%`

With `percent({ decimalPlaces: 2, padDecimalPlaces: 2 })`:

- `12.5` becomes `12.50%` after blur
- `.5` becomes `0.50%` after blur

With `percent({ decimalPlaces: 2, decimalSeparator: ',' })`:

- `12345,6` becomes `12345,6%`

With `percent({ allowNegative: true, decimalPlaces: 2 })`:

- `-12.5` becomes `-12.5%`

With `percent({ max: 100 })`:

- `150` becomes `100%` while typing

## Signature

```ts
function percent(options?: PercentOptions): Facilis.Format;
```

## Import

```ts
import { percent } from 'facilis-formats';
```

## Usage

```ts
const defaultPercentFormat = percent();

const decimalPercentFormat = percent({
    decimalPlaces: 2,
});

const paddedPercentFormat = percent({
    decimalPlaces: 2,
    padDecimalPlaces: 2,
});

const localizedPercentFormat = percent({
    decimalPlaces: 2,
    decimalSeparator: ',',
});

const clampedPercentFormat = percent({
    min: 0,
    max: 100,
});

const barePercentFormat = percent({
    includeSymbol: false,
});
```

## Options

### `decimalPlaces`

Controls how many decimal places are preserved.

Default: `0`

Example:

```ts
const integerPercentFormat = percent();
const decimalPercentFormat = percent({ decimalPlaces: 2 });
```

With raw input `12.34`, `integerPercentFormat` becomes `1234%`, while
`decimalPercentFormat` becomes `12.34%`.

### `padDecimalPlaces`

Controls the minimum number of decimal places that should exist after blur.

Default: `0`

Example:

```ts
const paddedPercentFormat = percent({
    decimalPlaces: 2,
    padDecimalPlaces: 2,
});
```

With raw input `12.5`, this formats as `12.50%` after blur.

### `decimalSeparator`

Sets the separator used between the whole and fractional portions of the
percent value.

Default: `'.'`

Example:

```ts
const localizedPercentFormat = percent({
    decimalPlaces: 2,
    decimalSeparator: ',',
});
```

With raw input `12,5`, this formats as `12,5%`.

### `allowNegative`

Controls whether a leading minus sign is preserved.

Default: `false`

Example:

```ts
const defaultPercentFormat = percent();
const signedPercentFormat = percent({ allowNegative: true });
```

With raw input `-12`, `defaultPercentFormat` formats as `12%`, while
`signedPercentFormat` formats as `-12%`.

### `min`

Sets the minimum percent value allowed while typing.

Default: none

Example:

```ts
const positivePercentFormat = percent({
    allowNegative: true,
    min: 0,
});
```

With raw input `-5`, this formats as `0%` as soon as the value resolves to a
complete number.

### `max`

Sets the maximum percent value allowed while typing.

Default: none

Example:

```ts
const cappedPercentFormat = percent({
    max: 100,
});
```

With raw input `150`, this formats as `100%` as soon as the value resolves to a
complete number.

### `includeSymbol`

Controls whether the formatted value includes the trailing percent symbol.

Default: `true`

Example:

```ts
const defaultPercentFormat = percent();
const barePercentFormat = percent({ includeSymbol: false });
```

With raw input `12`, these format as `12%` and `12`.

## Behavior

- Removes characters other than digits, the configured decimal separator, and
  an allowed leading minus sign during input normalization.
- Removes unnecessary leading zeros from the integer portion while typing.
- Preserves only the first configured decimal separator when `decimalPlaces` is
  greater than `0`.
- Appends `%` when `includeSymbol` is `true` and the value is more complete than
  a lone sign or decimal separator.
- Inserts a leading zero into completed decimals like `.5` on blur.
- Clamps complete numeric values to `min` and `max` immediately during input
  normalization when those range limits are configured.
- Pads the fractional portion with trailing zeroes on blur when
  `padDecimalPlaces` is greater than `0`.
