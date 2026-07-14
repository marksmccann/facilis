---
title: Core
description: Reference for the framework-agnostic facilis package.
---

The `facilis` package contains the framework-agnostic runtime contract.

```ts
import { defineFormat } from 'facilis';
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

## Guards

Guard helpers live under `facilis/guards` and are useful when custom formats
need to recognize common editing situations.
See [Guards](/facilis/create-a-format/guards/) for usage guidance.

```ts
import { isAppendFormatting } from 'facilis/guards';
```

## Selection helpers

Selection helpers live under `facilis/selection`.
See [Selection](/facilis/create-a-format/selection/) for usage guidance.

```ts
import { resolveSelectionBeforeFormatting } from 'facilis/selection';
```

## Transforms

Reusable value transforms live under `facilis/transforms`. They cover common
number and separator operations used by first-party formats.
See [Transforms](/facilis/create-a-format/transforms/) for usage guidance.

```ts
import { insertThousandsSeparators, trimLeadingZeros } from 'facilis/transforms';
```
