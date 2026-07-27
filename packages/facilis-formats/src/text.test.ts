import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { text } from './text';

describe('text', () => {
    it('preserves all characters when matches is omitted', () => {
        const input = setupInput(text());

        expect(input.type('a1B2')).toEqual(textState('a1B2', 4));
    });

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

    it('transforms text without requiring a matching expression', () => {
        const input = setupInput(
            text({
                transform: 'uppercase',
            })
        );

        expect(input.type('a1b')).toEqual(textState('A1B', 3));
    });

    it('limits normalized text without requiring a matching expression', () => {
        const input = setupInput(
            text({
                maxLength: 3,
            })
        );

        expect(input.type('abcd')).toEqual(textState('abc', 3));
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
