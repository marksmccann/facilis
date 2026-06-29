# facilis-formats

First-party format definitions for Facilis.

## `currency`

Create a currency formatter with comma-separated thousands and configurable
currency symbol and cents behavior.

```ts
import { bindFormat } from 'facilis-dom';
import { currency } from 'facilis-formats';

bindFormat(input, currency());
bindFormat(input, currency({ symbol: '€' }));
bindFormat(input, currency({ symbol: '', cents: 'never' }));
```

## `domesticPhoneNumber`

Create a dedicated formatter for a 10-digit domestic phone number in the
`(###) ###-####` format.

```ts
import { bindFormat } from 'facilis-dom';
import { domesticPhoneNumber } from 'facilis-formats';

bindFormat(input, domesticPhoneNumber());
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
