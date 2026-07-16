---
title: expirationDate
description: Format card expiration dates with the common MM/YY layout.
---

`expirationDate()` creates a reusable card expiration-date format that keeps
only digits and displays them with the common `MM/YY` layout.

[Play with the demos &rarr;](/facilis/demos/formats/expiration-date/)

## Examples

With `expirationDate()`:

- `1234` becomes `12/34`
- `12/34` stays `12/34`
- `12 / 34 ext. 5` becomes `12/34`

With `expirationDate({ separator: '-' })`:

- `1234` becomes `12-34`

With `expirationDate({ strictMonth: true })`:

- `13` becomes `1`

## Signature

```ts
function expirationDate(options?: ExpirationDateOptions): Facilis.Format;
```

## Import

```ts
import { expirationDate } from 'facilis-formats';
```

## Usage

```ts
const expirationDateFormat = expirationDate();
```

## Options

### separator

```ts
type ExpirationDateSeparator = '/' | '-' | '.';
```

The `separator` option controls the rendered separator. The default is `/`.

```ts
const dashedExpirationDateFormat = expirationDate({
    separator: '-',
});
```

With raw input `1234`, this formats as `12-34`.

### strictMonth

```ts
type StrictMonth = boolean;
```

The `strictMonth` option rejects impossible standalone month values while
typing. The default is `false`.

```ts
const strictExpirationDateFormat = expirationDate({
    strictMonth: true,
});
```

With raw input `13`, this stays at `1` because `13` is not a possible month.

## Behavior

- Keeps only digit characters in the normalized expiration date.
- Formats values as `MM/YY`.
- Ignores extra digits beyond the 4-digit expiration-date length.
- Lets expected punctuation move naturally through the slash.
- Can reject impossible standalone month values.
