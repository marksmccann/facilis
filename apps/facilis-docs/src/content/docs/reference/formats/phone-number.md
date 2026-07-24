---
title: phoneNumber
description: Format 10-digit North American phone numbers with the default local layout.
---

`phoneNumber()` creates a reusable phone-number format that keeps only digits
and displays them with the familiar 10-digit North American layout:
`(###) ###-####`. Pass options to change the rendered separator or display the
area code without parentheses.

[Play with the demos &rarr;](/facilis/demos/formats/phone-number/)

## Examples

With `phoneNumber()`:

- `4145551212` becomes `(414) 555-1212`
- `(414)555-1212` becomes `(414) 555-1212`
- `414.555.1212` becomes `(414) 555-1212`

With `phoneNumber({ separator: '.' })`:

- `4145551212` becomes `(414) 555.1212`

With `phoneNumber({ includeAreaCodeParens: false })`:

- `4145551212` becomes `414-555-1212`

With `phoneNumber({ includeAreaCodeParens: false, separator: '.' })`:

- `4145551212` becomes `414.555.1212`

## Signature

```ts
function phoneNumber(options?: PhoneNumberOptions): Facilis.Format;
```

## Import

```ts
import { phoneNumber } from 'facilis-formats';
```

## Usage

```ts
const contactPhoneFormat = phoneNumber();
const dottedPhoneFormat = phoneNumber({ separator: '.' });
const plainPhoneFormat = phoneNumber({ includeAreaCodeParens: false });
const plainDottedPhoneFormat = phoneNumber({
    includeAreaCodeParens: false,
    separator: '.',
});
```

## Options

```ts
type PhoneNumberOptions = {
    includeAreaCodeParens?: boolean;
    separator?: '-' | '.' | ' ';
};
```

### `includeAreaCodeParens`

Controls whether the area code is wrapped in parentheses.

Default: `true`

- `true`: formats the value as `(###) ###-####`.
- `false`: formats the value as `###-###-####` with the configured separator.

Example:

```ts
const defaultPhoneFormat = phoneNumber();
const plainPhoneFormat = phoneNumber({ includeAreaCodeParens: false });
```

With raw input `4145551212`, these produce `(414) 555-1212` and
`414-555-1212`.

### `separator`

Sets the rendered separator used before the line-number group. When
`includeAreaCodeParens` is `false`, the separator is also used after the area
code.

Default: `'-'`

Supported values: `'-'`, `'.'`, and `' '`

Example:

```ts
const defaultPhoneFormat = phoneNumber();
const dottedPhoneFormat = phoneNumber({ separator: '.' });
const spacedPhoneFormat = phoneNumber({
    includeAreaCodeParens: false,
    separator: ' ',
});
```

With raw input `4145551212`, these produce `(414) 555-1212`,
`(414) 555.1212`, and `414 555 1212`.

## Behavior

- Keeps only digit characters in the normalized phone number.
- Formats the default value as `(###) ###-####`.
- Formats plain area-code values as `###-###-####` when
  `includeAreaCodeParens` is `false`.
- Renders phone-number separators with `'-'`, `'.'`, or `' '`.
- Ignores extra digits beyond the 10-digit limit.
- Lets expected punctuation move naturally through the phone-number literals.
