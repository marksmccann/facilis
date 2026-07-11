---
title: phoneNumber
description: Format 10-digit North American phone numbers with the default local layout.
---

`phoneNumber()` creates a reusable phone-number format that keeps only digits
and displays them with the familiar 10-digit North American layout:
`(###) ###-####`.

[Play with the demos &rarr;](/facilis/demos/formats/phone-number/)

## Examples

With `phoneNumber()`:

- `4145551212` becomes `(414) 555-1212`
- `(414)555-1212` becomes `(414) 555-1212`
- `414.555.1212` becomes `(414) 555-1212`

## Signature

```ts
function phoneNumber(): Facilis.Format;
```

## Import

```ts
import { phoneNumber } from 'facilis-formats';
```

## Usage

```ts
const contactPhoneFormat = phoneNumber();
```

## Behavior

- Keeps only digit characters in the normalized phone number.
- Formats the value as `(###) ###-####`.
- Ignores extra digits beyond the 10-digit limit.
- Lets expected punctuation move naturally through the phone-number literals.
