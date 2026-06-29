---
title: domesticPhoneNumber
description: Create a format instance for a 10-digit domestic phone number.
---

`domesticPhoneNumber()` creates a dedicated 10-digit phone number format that
progressively renders as `(###) ###-####`.

[Play with the demos &rarr;](/facilis/demos/formats/domestic-phone-number/)

## Examples

- `4` becomes `(4`
- `414555` becomes `(414) 555`
- `4145551212` becomes `(414) 555-1212`

## Signature

```ts
function domesticPhoneNumber(): Facilis.FormatInstance;
```

## Import

```ts
import { domesticPhoneNumber } from 'facilis-formats';
```

## Usage

```ts
const phoneNumberFormat = domesticPhoneNumber();
```

## Behavior

- Keeps digits only.
- Limits the normalized value to 10 digits.
- Formats incrementally as `(###) ###-####`.

Use this when you want a purpose-built phone format instead of recreating the
same shape with a generic pattern string.
