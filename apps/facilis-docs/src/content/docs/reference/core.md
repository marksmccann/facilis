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
- `edit`: optional. Intercepts append, insert, and backward-delete intentions.

## Runtime types

- `TextState`: `{ value, selectionStart, selectionEnd }`.
- `Selection`: selection-only state.
- `InputDetails`: normalized input event details.
- `Format`: adapter-facing runtime with `onMount`, `onInput`, and `onBlur`.
- `FormatEditResult`: return type for edit hooks.

## Format factories

Layered factories provide common behavior for format families while still
returning regular formats.

- `defineSegmentedFormat`
- `definePatternFormat`
- `defineDateFormat`
- `defineTimeFormat`
- `defineNumberFormat`
