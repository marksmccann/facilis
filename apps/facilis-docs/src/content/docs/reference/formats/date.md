---
title: date
description: Format numeric dates with explicit date-part patterns.
---

`date()` creates a reusable date format that keeps only digits and displays
them using one explicit numeric date pattern.

[Play with the demos &rarr;](/facilis/demos/formats/date/)

## Examples

With `date({ pattern: 'MM/DD/YYYY' })`:

- `01022026` becomes `01/02/2026`
- `01 / 02 / 2026 ext. 9` becomes `01/02/2026`

With `date({ pattern: 'YYYY/MM', separator: '-' })`:

- `202601` becomes `2026-01`

With `date({ pattern: 'MM/DD/YYYY', insertLeadingZero: true })`:

- `2` becomes `02`
- `24` becomes `02/04`

## Signature

```ts
function date(options: DateOptions): Facilis.Format;
```

## Import

```ts
import { date } from 'facilis-formats';
```

## Usage

```ts
const dateFormat = date({
    pattern: 'MM/DD/YYYY',
});
```

## Options

### pattern

```ts
type DatePattern =
    | 'MM/DD/YY'
    | 'MM/DD/YYYY'
    | 'DD/MM/YY'
    | 'DD/MM/YYYY'
    | 'YY/MM/DD'
    | 'YYYY/MM/DD'
    | 'MM/YY'
    | 'MM/YYYY'
    | 'YY/MM'
    | 'YYYY/MM';
```

The `pattern` option is required. Pattern strings use `/` as the canonical
separator between date parts.

### separator

```ts
type DateSeparator = '/' | '-' | '.';
```

The `separator` option controls the rendered separator. The default is `/`.

```ts
const dashedDateFormat = date({
    pattern: 'MM/DD/YYYY',
    separator: '-',
});
```

With raw input `01022026`, this formats as `01-02-2026`.

### insertLeadingZero

```ts
type InsertLeadingZero = boolean;
```

The `insertLeadingZero` option pads safe single-digit month and day values while
typing. The default is `false`.

```ts
const forgivingDateFormat = date({
    pattern: 'MM/DD/YYYY',
    insertLeadingZero: true,
});
```

With raw input `24`, this formats as `02/04`. Months `2` through `9` and days
`4` through `9` can be padded because those digits cannot validly begin a
two-digit month or day.

## Behavior

- Keeps only digit characters in the normalized date.
- Formats digits according to the configured pattern.
- Ignores extra digits beyond the configured pattern length.
- Lets expected punctuation move naturally through configured separators.
- Can insert leading zeros for safe single-digit month and day values.
- Does not validate real calendar dates or month/day ranges.
