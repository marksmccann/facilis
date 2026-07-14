---
title: Transforms
description: Reuse core value-shaping helpers when creating custom formats.
---

Transforms are small string helpers for building `normalize`, `format`, and
`blur` pipelines.

```ts
import { defineFormat } from 'facilis';
import {
    filterNumberCharacters,
    insertLeadingZero,
    padDecimalPlaces,
} from 'facilis/transforms';

export const decimalValue = () =>
    defineFormat({
        normalize(raw) {
            return filterNumberCharacters(raw);
        },
        blur(formatted) {
            return padDecimalPlaces(insertLeadingZero(formatted), {
                decimalPlaces: 2,
            });
        },
    });
```

## Number normalization

Use these in `normalize` when raw input should become a number-like string.

- `filterNumberCharacters(raw, options?)`: keeps digits, minus signs, and the
  configured decimal separator.
- `normalizeNegativeSign(value, options?)`: removes unsupported minus signs or
  keeps one leading minus sign.
- `removeExtraDecimalSeparators(value, options?)`: keeps the first decimal
  separator and removes the rest.
- `limitDecimalPlaces(value, options?)`: limits the fractional portion.
- `clampNumber(value, options?)`: clamps complete number-like strings to
  `min` and `max`.

## Number display and blur

Use these in `format` or `blur` when a normalized number-like value needs
display shaping.

- `insertThousandsSeparators(value, options?)`: groups the whole portion.
- `insertLeadingZero(value, options?)`: turns decimal-only values like `.5`
  into `0.5`.
- `trimLeadingZeros(value, options?)`: removes unnecessary leading zeros.
- `padDecimalPlaces(value, options?)`: pads the fractional portion to a minimum
  width.

## Structural formatting

Use these when values have positional formatting or segment rules.

- `insertSeparators(value, options)`: inserts separators before configured
  display positions.
- `insertBeforeCharacter(value, rules)`: conditionally inserts text before
  matching characters at configured positions.
- `rejectInvalidSegments(value, segments, accept)`: rejects the first character
  that would make a segment invalid.

Transforms do not know about DOM events or framework adapters. They are plain
value helpers for reusable format definitions.
