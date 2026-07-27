---
title: text
description: Create a text format that filters characters, limits length, and optionally transforms letter case.
---

`text()` creates a generic text format whose normalization step optionally keeps
matching characters, optionally transforms letter case, and optionally caps the
normalized text length.

[Play with the demos &rarr;](/facilis/demos/formats/text/)

## Examples

With:

```ts
text({
    matches: /[a-z]/i,
});
```

- `ab12CD34` becomes `abCD`

With:

```ts
text({
    matches: /\d/,
});
```

- `A1B2C3` becomes `123`

With:

```ts
text({
    matches: /[a-f0-9]/i,
});
```

- `g1h2Z3f` becomes `123f`

With:

```ts
text({
    transform: 'uppercase',
});
```

- `ab12CD34` becomes `AB12CD34`

With:

```ts
text({
    maxLength: 6,
    transform: 'lowercase',
});
```

- `ABCdef123` becomes `abcdef`

## Signature

```ts
function text(options?: TextOptions): Facilis.Format;
```

## Import

```ts
import { text } from 'facilis-formats';
```

## Usage

```ts
const letterText = text({
    matches: /[a-z]/i,
});

const digitText = text({
    matches: /\d/,
});

const hexText = text({
    matches: /[a-f0-9]/i,
});

const uppercaseText = text({
    transform: 'uppercase',
});

const shortCodeText = text({
    maxLength: 6,
    transform: 'lowercase',
});
```

## Options

```ts
type TextOptions = {
    matches?: RegExp;
    maxLength?: number;
    transform?: 'uppercase' | 'lowercase';
};
```

### `matches`

Defines which characters are retained in the normalized value.

Default: all characters are retained.

Example:

```ts
const letterText = text({
    matches: /[a-z]/i,
});
```

With raw input `ab12CD34`, this formats as `abCD`.

Use a character-level regular expression here. `text()` tests each character
individually rather than evaluating the full string as a single candidate.

Leave `matches` undefined when the text should preserve all characters before
`transform` and `maxLength` run.

### `maxLength`

Limits the normalized text to a maximum number of characters.

Example:

```ts
const shortCodeText = text({
    maxLength: 6,
});
```

With raw input `abcdefghi`, this formats as `abcdef`.

`maxLength` limits the canonical text value. It does not validate that the value
has reached a required length.

### `transform`

Transforms the normalized text after optional `matches` filtering.

Accepted values:

- `'uppercase'`
- `'lowercase'`

Example:

```ts
const uppercaseText = text({
    transform: 'uppercase',
});
```

With raw input `ab12CD34`, this formats as `AB12CD34`.

Leave `transform` undefined to preserve the text as typed.

## Behavior

- When `matches` is configured, scans the raw value character by character and
  keeps only the characters that satisfy it.
- When `matches` is omitted, preserves all raw characters.
- Applies `transform` when one is configured.
- Ignores extra characters beyond `maxLength` when one is configured.
- Returns the normalized text as the formatted value.
- Resolves selection by tracking normalized text boundaries through the raw
  value.
