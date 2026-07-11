# facilis-testing

Testing helpers for Facilis formats and adapters.

## Usage

```ts
import { setupInput, textState } from 'facilis-testing';
import { creditCard } from 'facilis-formats';

const input = setupInput(creditCard());

expect(input.append('4111', '1')).toEqual(textState('4111 1', 6));
```

`setupInput()` creates a stateless test input around one Facilis format. Each
method call derives its own text snapshots from the arguments passed to that
call.

`textState()` creates the `{ value, selectionStart, selectionEnd }` object used
by Facilis format results.
