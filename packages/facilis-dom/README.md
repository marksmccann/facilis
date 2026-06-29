# facilis-dom

DOM adapter for Facilis.

## `bindFormat`

Bind a format to either an `HTMLInputElement` or a CSS selector that resolves
to one. Returns a cleanup function that removes the event listeners.

```ts
import { bindFormat } from 'facilis-dom';
import { pattern } from 'facilis-formats';

const cleanup = bindFormat(
    document.querySelector('#phone')!,
    pattern('(###) ###-####')
);

bindFormat('#phone', pattern('(###) ###-####'));
```
