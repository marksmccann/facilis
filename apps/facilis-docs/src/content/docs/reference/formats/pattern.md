---
title: pattern
description: Create a format instance from a tokenized pattern string or explicit token definitions.
---

`pattern()` creates a reusable format from either a shorthand pattern string or
an explicit token configuration object.

[Play with the demos &rarr;](/facilis/demos/formats/pattern/)

## Examples

With `pattern('##/##/####')`:

- `01022026` becomes `01/02/2026`

With `pattern('(###) ###-####')`:

- `4145551212` becomes `(414) 555-1212`

With `pattern({ pattern: '##/##/####' })`:

- `01022026` becomes `01/02/2026`

With:

```ts
pattern({
    pattern: 'AA-####',
    tokens: {
        A: { matches: /[A-Z]/ },
        '#': { matches: /\d/ },
    },
});
```

- `AB12CD34` becomes `AB-1234`

## Signature

```ts
function pattern(input: string): Facilis.FormatInstance;
function pattern(input: PatternOptions): Facilis.FormatInstance;
```

## Import

```ts
import { pattern } from 'facilis-formats';
```

## Usage

```ts
const phonePattern = pattern('(###) ###-####');

const codePattern = pattern({
    pattern: 'AA-####',
    tokens: {
        A: { matches: /[A-Z]/ },
        '#': { matches: /\d/ },
    },
});
```

## Shorthand Syntax

When `input` is a string, `pattern()` uses built-in token definitions.

Built-in tokens:

- `#` matches a digit with `/\d/`
- `*` matches any character with `/./`

This is the fastest form when the built-in tokens are enough.

Example:

```ts
const phonePattern = pattern('(###) ###-####');
const datePattern = pattern('##/##/####');
```

## Options

### `pattern`

Defines the literal characters and token slots that make up the formatted
output.

_Note: When `tokens` is omitted, `pattern()` falls back to the same built-in token definitions used by
shorthand syntax._

Example:

```ts
const datePattern = pattern({
    pattern: '##/##/####',
});
```

With raw input `01022026`, this formats as `01/02/2026`.

### `tokens`

Defines the matching rule for each token symbol used in `pattern`.

Default: the same built-in token set used by shorthand syntax.

When omitted, `pattern()` uses:

- `#` for digits
- `*` for any character

Example:

```ts
const codePattern = pattern({
    pattern: 'AA-####',
    tokens: {
        A: { matches: /[A-Z]/ },
        '#': { matches: /\d/ },
    },
});
```

With raw input `AB12CD34`, this formats as `AB-1234`. Characters that do not
match the next token are skipped during normalization.

## Behavior

- Scans the raw value left to right and keeps only characters that satisfy the
  next available token.
- Inserts literal characters from the pattern only after the preceding token
  positions have been filled.
- Resolves selection based on token progress so the cursor tracks the formatted
  output shape.
