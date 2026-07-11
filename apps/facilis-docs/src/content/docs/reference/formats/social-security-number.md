---
title: socialSecurityNumber
description: Format Social Security numbers with the default 9-digit layout.
---

`socialSecurityNumber()` creates a reusable Social Security number format that
keeps only digits and displays them with the standard SSN layout:
`###-##-####`.

[Play with the demos &rarr;](/facilis/demos/formats/social-security-number/)

## Examples

With `socialSecurityNumber()`:

- `123456789` becomes `123-45-6789`
- `123-45-6789` stays `123-45-6789`
- `123 45 6789 ext. 0` becomes `123-45-6789`

## Signature

```ts
function socialSecurityNumber(): Facilis.Format;
```

## Import

```ts
import { socialSecurityNumber } from 'facilis-formats';
```

## Usage

```ts
const ssnFormat = socialSecurityNumber();
```

## Behavior

- Keeps only digit characters in the normalized Social Security number.
- Formats the value as `###-##-####`.
- Ignores extra digits beyond the 9-digit limit.
- Lets expected punctuation move naturally through the SSN hyphens.
