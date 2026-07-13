---
title: time
description: Format numeric times with explicit time-part patterns.
---

`time()` creates a reusable time format that keeps only digits and displays
them using one explicit numeric time pattern.

[Play with the demos &rarr;](/facilis/demos/formats/time/)

## Examples

With `time({ pattern: 'HH:mm' })`:

- `1430` becomes `14:30`
- `14 : 30 ext. 5` becomes `14:30`

With `time({ pattern: 'HH:mm:ss' })`:

- `143005` becomes `14:30:05`

With `time({ pattern: 'hh:mm' })`:

- `0930` becomes `09:30`

With `time({ pattern: 'HH:mm', insertLeadingZero: true })`:

- `930` becomes `09:30`
- `126` becomes `12:06`

With `time({ pattern: 'HH:mm', strictTimeParts: true })`:

- Appending `9` to `2` keeps the value at `2`
- Appending `6` to `12` keeps the value at `12`

With `time({ pattern: 'hh:mm', strictTimeParts: true })`:

- Appending `3` to `1` keeps the value at `1`

## Signature

```ts
function time(options: TimeOptions): Facilis.Format;
```

## Import

```ts
import { time } from 'facilis-formats';
```

## Usage

```ts
const timeFormat = time({
    pattern: 'HH:mm',
});
```

## Options

### pattern

```ts
type TimePattern = 'HH:mm' | 'HH:mm:ss' | 'hh:mm' | 'hh:mm:ss';
```

The `pattern` option is required. Pattern strings use `:` as the canonical
separator between time parts.

`HH` formats 24-hour values. `hh` formats 12-hour values. The pattern controls
which hour range `strictTimeParts` enforces.

### separator

```ts
type TimeSeparator = ':' | '.';
```

The `separator` option controls the rendered separator. The default is `:`.

```ts
const dottedTimeFormat = time({
    pattern: 'HH:mm',
    separator: '.',
});
```

With raw input `1430`, this formats as `14.30`.

### insertLeadingZero

```ts
type InsertLeadingZero = boolean;
```

The `insertLeadingZero` option pads safe single-digit time part values while
typing. The default is `false`.

```ts
const forgivingTimeFormat = time({
    pattern: 'HH:mm',
    insertLeadingZero: true,
});
```

With raw input `930`, this formats as `09:30`. With raw input `126`, this
formats as `12:06`.

### strictTimeParts

```ts
type StrictTimeParts = boolean;
```

The `strictTimeParts` option rejects impossible hour, minute, and second values
while typing. The default is `false`.

```ts
const strictTimeFormat = time({
    pattern: 'HH:mm',
    strictTimeParts: true,
});
```

For `HH` patterns, hours must resolve to `00` through `23`. For `hh` patterns,
hours must resolve to `01` through `12`. Minutes and seconds must resolve to
`00` through `59`.

## Behavior

- Keeps only digit characters in the normalized time.
- Formats digits according to the configured pattern.
- Ignores extra digits beyond the configured pattern length.
- Lets expected punctuation move naturally through configured separators.
- Can insert leading zeros for safe single-digit hour, minute, and second
  values.
- Can reject impossible hour, minute, and second segment values.
- Does not preserve or format AM/PM markers.
