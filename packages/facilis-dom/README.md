# facilis-dom

DOM adapter for Facilis.

## `bind`

Bind a format to either an `HTMLInputElement` or a CSS selector that resolves
to one.

```ts
import { bind } from 'facilis-dom';
import { pattern } from 'facilis-formats';

bind(document.querySelector('#phone')!, pattern('(###) ###-####'));
bind('#phone', pattern('(###) ###-####'));
```
