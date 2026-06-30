# facilis-formats

First-party format definitions for Facilis.

## `currency`

Create a currency formatter with comma-separated thousands, a configurable
currency symbol, and optional cents.

```ts
import { bindFormat } from 'facilis-dom';
import { currency } from 'facilis-formats';

bindFormat(input, currency());
bindFormat(input, currency({ symbol: '€' }));
bindFormat(input, currency({ symbol: '', includeCents: false }));
```

## `pattern`

Create a format from either a pattern string with preset tokens or an explicit
pattern object with custom tokens.

```ts
import { bindFormat } from 'facilis-dom';
import { pattern } from 'facilis-formats';

bindFormat(input, pattern('(###) ###-####'));

bindFormat(
    input,
    pattern({
        pattern: 'AA-####',
        tokens: {
            A: { matches: /[A-Z]/ },
            '#': { matches: /\d/ },
        },
    })
);
```

The preset string form includes:

- `#` for digits
- `*` for any character

Use the object form whenever you need custom tokens.
