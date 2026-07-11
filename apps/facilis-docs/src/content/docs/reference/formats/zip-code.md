---
title: zipCode
description: Format ZIP codes with optional ZIP+4 support.
---

`zipCode()` creates a reusable ZIP code format that keeps only digits and
displays them with the default 5-digit ZIP layout. Pass
`includePlusFour: true` to support the combined ZIP+4 layout: `#####-####`.

[Play with the demos &rarr;](/facilis/demos/formats/zip-code/)

## Examples

With `zipCode()`:

- `12345` stays `12345`
- `123456789` becomes `12345`
- `12345-6789` becomes `12345`

With `zipCode({ includePlusFour: true })`:

- `12345` stays `12345`
- `123456789` becomes `12345-6789`
- `12345-6789` stays `12345-6789`

## Signature

```ts
function zipCode(options?: ZipCodeOptions): Facilis.Format;
```

## Options

```ts
type ZipCodeOptions = {
    includePlusFour?: boolean;
};
```

## Import

```ts
import { zipCode } from 'facilis-formats';
```

## Usage

```ts
const zipFormat = zipCode();
const zipPlusFourFormat = zipCode({ includePlusFour: true });
```

## Behavior

- Keeps only digit characters in the normalized ZIP code.
- Formats the default value as `#####`.
- Formats ZIP+4 values as `#####-####` when `includePlusFour` is `true`.
- Ignores extra digits beyond the active ZIP code length.
- Lets expected punctuation move naturally through the ZIP+4 hyphen.
