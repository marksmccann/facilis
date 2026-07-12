import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { text } from './text';

describe('text', () => {
    it('keeps characters that match the provided expression', () => {
        const input = setupInput(
            text({
                matches: /[a-z]/i,
            })
        );

        expect(input.type('abc')).toEqual(textState('abc', 3));
    });

    it('removes characters that do not match the provided expression', () => {
        const input = setupInput(
            text({
                matches: /[a-z]/i,
            })
        );

        expect(input.type('a1b2c')).toEqual(textState('abc', 3));
    });

    it('uses the same output on blur while clearing selection', () => {
        const input = setupInput(
            text({
                matches: /[a-z]/i,
            })
        );

        expect(input.blur('a1b2c', 1, 4)).toEqual(textState('abc', null));
    });
});
