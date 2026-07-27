---
title: vin
description: Format Vehicle Identification Numbers as uppercase 17-character VIN text.
---

`vin()` creates a reusable Vehicle Identification Number format. It keeps
VIN-safe letters and digits, transforms letters to uppercase, and caps the value
at 17 characters.

[Play with the demos &rarr;](/facilis/demos/formats/vin/)

## Examples

With `vin()`:

- `1hgcm82633a004352` becomes `1HGCM82633A004352`
- `1hg cm82633a004352` becomes `1HGCM82633A004352`
- `1hgcm82633a004352999` becomes `1HGCM82633A004352`
- `ioq123` becomes `123`

## Signature

```ts
function vin(): Facilis.Format;
```

## Import

```ts
import { vin } from 'facilis-formats';
```

## Usage

```ts
const vinFormat = vin();
```

## Behavior

- Keeps only ASCII letters and digits valid for VIN text.
- Excludes `I`, `O`, and `Q`.
- Converts letters to uppercase.
- Ignores extra characters beyond the 17-character VIN length.
- Does not validate that the value is a complete VIN while the user is typing.
