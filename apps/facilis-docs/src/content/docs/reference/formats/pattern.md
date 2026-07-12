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

With `pattern('aa-####')`:

- `AB12CD34` becomes `AB-1234`

With `pattern({ pattern: '##/##/####' })`:

- `01022026` becomes `01/02/2026`

With:

```ts
pattern({
    pattern: 'LL-####',
    tokens: {
        L: { matches: /[A-Z]/i },
        '#': { matches: /\d/ },
    },
});
```

- `AB12CD34` becomes `AB-1234`

## Signature

```ts
function pattern(input: string): Facilis.Format;
function pattern(input: PatternOptions): Facilis.Format;
```

## Import

```ts
import { pattern } from 'facilis-formats';
```

## Usage

```ts
const phonePattern = pattern('(###) ###-####');

const codePattern = pattern('aa-####');

const customPattern = pattern({
    pattern: 'LL-####',
    tokens: {
        L: { matches: /[A-Z]/i },
        '#': { matches: /\d/ },
    },
});
```

## Shorthand Syntax

When `input` is a string, `pattern()` uses built-in token definitions.

Built-in tokens:

- `#` matches a digit with `/\d/`
- `a` matches an ASCII letter with `/[A-Za-z]/`
- `*` matches any character with `/./`

This is the fastest form when the built-in tokens are enough.
Use the object form with custom `tokens` when you need one of these characters
to remain a literal part of the pattern.

Example:

```ts
const phonePattern = pattern('(###) ###-####');
const codePattern = pattern('aa-####');
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
- `a` for ASCII letters
- `*` for any character

Example:

```ts
const codePattern = pattern({
    pattern: 'LL-####',
    tokens: {
        L: { matches: /[A-Z]/i },
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
