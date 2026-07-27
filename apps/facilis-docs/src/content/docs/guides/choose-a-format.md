---
title: Choose a Format
description: Decide between first-party formats, pattern, text, and custom formats.
---

Start with a named first-party format when the field has a common domain shape.

- Use `phoneNumber()` for US phone numbers.
- Use `creditCard()` for payment card numbers.
- Use `currency()`, `number()`, or `percent()` for numeric display rules.
- Use `date()`, `time()`, or `expirationDate()` for supported date/time shapes.
- Use `ein()`, `socialSecurityNumber()`, or `zipCode()` for common US identity
  and address fields.
- Use `vin()` for Vehicle Identification Numbers.

See the [Formats Overview](/facilis/reference/formats/) for the full list.

## Use pattern for structured text

Use `pattern()` when the field has a clear token structure.

```ts
import { pattern } from 'facilis-formats';

const accountCode = pattern('aa-####');
```

The preset string form supports `#` for digits, `a` for ASCII letters, and `*`
for any character. Use the object form when you need custom token definitions.

## Use text for filtering

Use `text()` when the important rule is which characters are allowed, not where
separators go.

```ts
import { text } from 'facilis-formats';

const lettersOnly = text({ matches: /[a-z]/i });
```

## Create a custom format

Use `defineFormat()` when the behavior has domain rules that do not fit an
existing format, pattern tokens, or simple character filtering.

Custom formats are also the right choice when editing behavior needs special
handling, such as rejecting an insert at a boundary or moving selection around
formatting characters.

Start with [Create a Format](/facilis/create-a-format/) when you need to create one.
