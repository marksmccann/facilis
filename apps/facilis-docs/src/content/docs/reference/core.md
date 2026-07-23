---
title: Core
description: Reference for the framework-agnostic facilis package.
---

The `facilis` package contains the framework-agnostic runtime contract.

```ts
import { defineFormat, defineNumberFormat } from 'facilis';
import type { Format, FormatDefinition, TextState } from 'facilis';
```

## defineFormat

`defineFormat(definition)` creates a reusable format from a format definition.
See [Define a Format](/facilis/create-a-format/define-a-format/) for authoring
guidance.

A `FormatDefinition` can include:

- `normalize(raw)`: required. Extracts the semantic value from any display
  value.
- `format(normalized)`: optional. Builds the focused display value.
- `blur(formatted)`: optional. Adjusts the formatted value when the field
  blurs.
- `append`, `insert`, and `delete`: optional. Intercept editing intentions.

## Runtime types

- `TextState`: `{ value, selectionStart, selectionEnd }`.
- `Selection`: selection-only state.
- `InputDetails`: normalized input event details.
- `Format`: reusable runtime with `formatValue`, `onMount`, `onInput`, and
  `onBlur`.
- `FormatEditResult`: return type for edit hooks.

## formatValue

`format.formatValue(value)` formats a standalone string for display. It runs the
same normalized display pipeline a blurred input uses.

```ts
import { creditCard } from 'facilis-formats';

const card = creditCard();

card.formatValue('4111111111111111');
// "4111 1111 1111 1111"
```

## Format factories

Layered factories provide common behavior for format families while still
returning regular formats.

- `defineSegmentedFormat`
- `definePatternFormat`
- `defineDateFormat`
- `defineTimeFormat`
- `defineNumberFormat`
