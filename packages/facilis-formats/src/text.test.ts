import { describe, expect, it } from 'vitest';
import { text } from './text';

describe('text', () => {
    it('keeps characters that match the provided expression', () => {
        const format = text({
            matches: /[a-z]/i,
        });

        expect(
            format.onInput({
                value: 'abc',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            formattedValue: 'abc',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('removes characters that do not match the provided expression', () => {
        const format = text({
            matches: /[a-z]/i,
        });

        expect(
            format.onInput({
                value: 'a1b2c',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: 'abc',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('uses the same output on blur while clearing selection', () => {
        const format = text({
            matches: /[a-z]/i,
        });

        expect(
            format.onBlur({
                value: 'a1b2c',
                selectionStart: 1,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: 'abc',
            selectionStart: null,
            selectionEnd: null,
        });
    });
});
