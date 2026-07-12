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

## Signature

```ts
function expirationDate(): Facilis.Format;
```

## Import

```ts
import { expirationDate } from 'facilis-formats';
```

## Usage

```ts
const expirationDateFormat = expirationDate();
```

## Behavior

- Keeps only digit characters in the normalized expiration date.
- Formats values as `MM/YY`.
- Ignores extra digits beyond the 4-digit expiration-date length.
- Lets expected punctuation move naturally through the slash.
