# facilis-formats

First-party format definitions for Facilis.

## `pattern`

Create a format from either a pattern string with preset tokens or an explicit
pattern object with custom tokens.

```ts
import { bind } from 'facilis-dom';
import { pattern } from 'facilis-formats';

bind(input, pattern('(###) ###-####'));

bind(
    input,
    pattern({
        pattern: 'AA-####',
        tokens: {
            A: {
                matches: /[A-Z]/,
                transform: ({ character }) => character.toUpperCase(),
            },
            '#': {
                matches: /\d/,
            },
        },
    })
);
```

The preset string form includes:

- `#` for digits
- `*` for any character

Use the object form whenever you need custom tokens or token transforms.
