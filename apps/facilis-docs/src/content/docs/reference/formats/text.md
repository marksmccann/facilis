---
title: text
description: Create a text format that preserves only characters matched by a regular expression.
---

`text()` creates a generic text format whose normalization step keeps only the
characters matched by a regular expression.

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

## Signature

```ts
function text(options: TextOptions): Facilis.FormatInstance;
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
```

## Options

### `matches`

Defines which characters are retained in the normalized value.

Example:

```ts
const letterText = text({
    matches: /[a-z]/i,
});
```

With raw input `ab12CD34`, this formats as `abCD`.

Use a character-level regular expression here. `text()` tests each character
individually rather than evaluating the full string as a single candidate.

## Behavior

- Scans the raw value character by character and keeps only the characters that
  satisfy `matches`.
- Returns the normalized text unchanged as the formatted value.
- Resolves selection by tracking how many matched characters appear before the
  cursor in the raw value.
