---
title: Guards
description: Use core guard helpers inside custom format edit hooks.
---

Guards answer yes/no questions about one edit context. They are useful inside
`edit` hooks when a custom format needs to reject an edit, preserve a previous
value, or place the cursor deliberately.

```ts
import { defineFormat } from 'facilis';
import { isAppendAtMaxLength } from 'facilis/guards';

export const fourDigits = () =>
    defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, 4);
        },
        edit: {
            append(context) {
                if (isAppendAtMaxLength(context, 4)) {
                    return context.previous;
                }
            },
        },
    });
```

## Append guards

Use append guards when a user types or pastes at the end of the field.

- `isAppendFormatting(context)`: appended text did not change the normalized
  value.
- `isAppendDuplicateFormatting(context)`: appended formatting was already at
  the end of the previous display value.
- `isAppendExpectedFormattingAt(context, expectedFormatting, position)`:
  appended formatting matches expected formatting at one display position.
- `isAppendDuplicateFormattingAt(context, expectedFormatting, position)`:
  appended formatting duplicates expected formatting that is already pending at
  one display position.
- `isAppendAtMaxLength(context, maxLength)`: the previous normalized value was
  already at a maximum length.

## Insert guards

Use insert guards when a user types or pastes before the end of the field.

- `isInsertAtMaxLength(context, maxLength)`: the insert added semantic text
  after the previous normalized value already reached a maximum length.

## Backward-delete guards

Use backward-delete guards when separators or prefixes need special cursor
behavior.

- `isDeleteBackwardOverFormatting(context)`: the deleted display text did not
  contribute to the normalized value.
- `isDeleteBackwardBeforeFormatting(context, formatting)`: the user deleted
  semantic text immediately before known formatting text.

## Return values

A guard only identifies a situation. The edit hook still decides what happens
next by returning a string, a text state, `null`, or `undefined`.
