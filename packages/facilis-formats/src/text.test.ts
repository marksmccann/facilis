import { describe, expect, it } from 'vitest';
import { applyBlur, applyInput, typeCharacters } from 'facilis-testing';
import { text } from './text';

describe('text', () => {
    it('preserves matching characters while typing', () => {
        const format = text({
            matches: /[a-z]/i,
        });

        expect(typeCharacters(format, 'ab12CD')).toEqual([
            {
                formattedValue: 'a',
                selectionStart: 1,
                selectionEnd: 1,
            },
            {
                formattedValue: 'ab',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: 'ab',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: 'ab',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: 'abC',
                selectionStart: 3,
                selectionEnd: 3,
            },
            {
                formattedValue: 'abCD',
                selectionStart: 4,
                selectionEnd: 4,
            },
        ]);
    });

    it('removes non-matching characters from pasted input', () => {
        const format = text({
            matches: /[a-z]/i,
        });

        expect(
            applyInput(format, {
                value: 'ab12CD34',
            })
        ).toEqual({
            formattedValue: 'abCD',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('supports more specific character sets', () => {
        const format = text({
            matches: /[a-f0-9]/i,
        });

        expect(
            applyInput(format, {
                value: 'g1h2Z3f',
            })
        ).toEqual({
            formattedValue: '123f',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('preserves selection when invalid characters are inserted in the middle', () => {
        const format = text({
            matches: /[a-z]/i,
        });

        expect(
            applyInput(format, {
                value: 'ab12cd',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: 'abcd',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('resets regex state before each character test', () => {
        const format = text({
            matches: /[a-z]/gi,
        });

        expect(
            applyInput(format, {
                value: 'ab12CD34',
            })
        ).toEqual({
            formattedValue: 'abCD',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('returns the formatted value unchanged on blur', () => {
        const format = text({
            matches: /[a-z]/i,
        });

        expect(
            applyBlur(format, {
                value: 'ab12CD34',
            })
        ).toEqual({
            formattedValue: 'abCD',
            selectionStart: null,
            selectionEnd: null,
        });
    });
});
