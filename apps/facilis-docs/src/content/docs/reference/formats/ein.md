---
title: ein
description: Format Employer Identification Numbers with the default 9-digit EIN layout.
---

`ein()` creates a reusable Employer Identification Number format that keeps only
digits and displays them with the standard EIN layout: `##-#######`.

[Play with the demos &rarr;](/facilis/demos/formats/ein/)

## Examples

With `ein()`:

- `123456789` becomes `12-3456789`
- `12-3456789` stays `12-3456789`
- `12 3456789 ext. 0` becomes `12-3456789`

## Signature

```ts
function ein(): Facilis.Format;
```

## Import

```ts
import { ein } from 'facilis-formats';
```

## Usage

```ts
const employerIdFormat = ein();
```

## Behavior

- Keeps only digit characters in the normalized EIN.
- Formats the value as `##-#######`.
- Ignores extra digits beyond the 9-digit limit.
- Lets expected punctuation move naturally through the EIN hyphen.
