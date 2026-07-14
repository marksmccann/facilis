---
title: Core Ideas
description: The concepts that make Facilis formats portable across adapters.
---

Facilis treats a **format** as the reusable unit.

A format knows how to turn raw input into a normalized value, how to display
that value, how to adjust it on blur, and how to handle exceptional edit cases.
Adapters know how to connect that format to a real input.

## Normalized and formatted values

The normalized value is the semantic string a format works from. It usually
removes display-only characters.

The formatted value is what the user sees in the input.

For a phone number, `5551234567` can be the normalized value while
`(555) 123-4567` is the formatted value.

## Blur behavior

Some formatting is helpful only after the user leaves the field. Currency and
number formats can keep partial decimal values while focused, then pad decimal
places on blur.

Facilis keeps that behavior explicit with a `blur` hook instead of making every
formatting pass final.

## Selection

Formatting often inserts characters the user did not type. Facilis tracks value
and selection together so a format can keep the cursor in a useful place after
separators, prefixes, or ignored characters appear.

## Adapters

Adapters translate platform events into Facilis runtime calls:

- `facilis-dom` binds a format to an `HTMLInputElement`.
- `facilis-react` returns props for a React-managed input.
- `facilis-testing` drives a format through input-like operations in tests.

The core package stays DOM-agnostic, which is what makes formats reusable across
those surfaces. See [Adapters](/facilis/adapters/) for the usage-oriented
adapter docs.
