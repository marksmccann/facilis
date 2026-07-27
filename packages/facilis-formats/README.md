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

## `percent`

Create a percent formatter with optional decimal places, range limits, and an
optional percent symbol.

```ts
import { bindFormat } from 'facilis-dom';
import { percent } from 'facilis-formats';

bindFormat(input, percent());
bindFormat(input, percent({ decimalPlaces: 2, padDecimalPlaces: 2 }));
bindFormat(input, percent({ includeSymbol: false }));
```

## `pattern`

Create a format from either a pattern string with preset tokens or an explicit
pattern object with custom tokens.

```ts
import { bindFormat } from 'facilis-dom';
import { pattern } from 'facilis-formats';

bindFormat(input, pattern('(###) ###-####'));
bindFormat(input, pattern('aa-####'));

bindFormat(
    input,
    pattern({
        pattern: 'LL-####',
        tokens: {
            L: { matches: /[A-Z]/ },
            '#': { matches: /\d/ },
        },
    })
);
```

The preset string form includes:

- `#` for digits
- `a` for ASCII letters
- `*` for any character

Use the object form whenever you need custom tokens.

## `text`

Create a text format that can keep only the characters matched by a regular
expression, transform letter case, and limit length.

```ts
import { bindFormat } from 'facilis-dom';
import { text } from 'facilis-formats';

bindFormat(
    input,
    text({
        matches: /[a-z]/i,
    })
);

bindFormat(
    input,
    text({
        matches: /\d/,
    })
);

bindFormat(
    input,
    text({
        maxLength: 6,
        transform: 'uppercase',
    })
);
```

## `vin`

Create a Vehicle Identification Number format that preserves VIN-safe letters
and digits, converts letters to uppercase, and limits the value to 17
characters.

```ts
import { bindFormat } from 'facilis-dom';
import { vin } from 'facilis-formats';

bindFormat(input, vin());
```
