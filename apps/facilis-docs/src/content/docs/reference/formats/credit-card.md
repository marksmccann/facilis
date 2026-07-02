---
title: credit-card
description: Create a credit card format instance with default grouping and American Express-aware formatting.
---

`creditCard()` creates a card-number format that preserves only digits,
switches to an American Express layout when appropriate, and inserts spaces
between digit groups.

[Play with the demos &rarr;](/facilis/demos/formats/credit-card/)

## Examples

With `creditCard()`:

- `4111111111111111` becomes `4111 1111 1111 1111`
- `378282246310005` becomes `3782 822463 10005`

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
const cardFormat = creditCard();
```

## Behavior

- Removes non-digit characters during input normalization.
- Uses a `4-4-4-4` grouping for most card numbers.
- Switches to a `4-6-5` grouping when the digits indicate American Express.
- Ignores extra digits beyond the active card pattern length.
- Reuses the live formatting output on blur.
