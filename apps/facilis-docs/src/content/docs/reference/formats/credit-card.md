---
title: creditCard
description: Format credit card numbers with automatic American Express grouping.
---

`creditCard()` creates a reusable card-number format that keeps only digits,
groups most cards into four-digit blocks, and automatically switches to the
American Express layout when the digits begin with `34` or `37`.

[Play with the demos &rarr;](/facilis/demos/formats/credit-card/)

## Examples

With `creditCard()`:

- `4111111111111111` becomes `4111 1111 1111 1111`
- `371449635398431` becomes `3714 496353 98431`
- `4111x1111` becomes `4111 1111`

## Signature

```ts
function creditCard(): Facilis.Format;
```

## Import

```ts
import { creditCard } from 'facilis-formats';
```

## Usage

```ts
const cardNumberFormat = creditCard();
```

## Behavior

- Keeps only digit characters in the normalized card number.
- Formats most card numbers as `#### #### #### ####`.
- Switches to the American Express layout `#### ###### #####` when the digits
  begin with `34` or `37`.
- Ignores extra digits beyond the active card-length limit.
- Lets ignored non-digit input advance across separator boundaries so typing
  can move naturally through the spaces.
