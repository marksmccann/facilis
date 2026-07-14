---
title: Test a Format
description: Drive Facilis formats through input-like behavior in tests.
---

Use `facilis-testing` when you want to test format behavior without a browser
adapter.

```ts
import { setupInput, textState } from 'facilis-testing';
import { creditCard, percent } from 'facilis-formats';

const input = setupInput(creditCard());

expect(input.append('4111', '1')).toEqual(textState('4111 1', 6));
```

`setupInput()` creates a stateless test input around one format. Each method
receives the previous value it should act on and returns the next Facilis text
state.

## Common scenarios

Use `type()` to check a full typing sequence from an empty value.

```ts
expect(input.type('4111111111111111')).toEqual(
    textState('4111 1111 1111 1111', 19)
);
```

Use `append()` and `insert()` when the exact edit intent matters.

```ts
expect(input.append('4111', '1')).toEqual(textState('4111 1', 6));
```

Use `deleteBackward()` for separator behavior.

```ts
expect(input.deleteBackward('4111 1')).toEqual(textState('4111', 4));
```

Use `blur()` for blur-time formatting.

```ts
const percentInput = setupInput(percent({ padDecimalPlaces: 2 }));

expect(percentInput.blur('12.5')).toEqual(textState('12.50%', null));
```

The examples above are sketches of the testing shape. The expected values
should match the specific format being tested.
