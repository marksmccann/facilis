# facilis-formats

First-party format definitions for Facilis.

## `currency`

Create a currency formatter with comma-separated thousands and up to two
decimal places.

```ts
import { bind } from 'facilis-dom';
import { currency } from 'facilis-formats';

bind(input, currency());
```

## `domesticPhoneNumber`

Create a dedicated formatter for a 10-digit domestic phone number in the
`(###) ###-####` format.

```ts
import { bind } from 'facilis-dom';
import { domesticPhoneNumber } from 'facilis-formats';

bind(input, domesticPhoneNumber());
```

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
