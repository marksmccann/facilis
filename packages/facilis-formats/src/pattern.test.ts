import { describe, expect, it } from 'vitest';
import { pattern } from './pattern';

describe('pattern', () => {
    it('fills token slots in order and inserts literals', () => {
        const format = pattern('###-##');

        expect(
            format.onInput({
                value: '12345',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '123-45',
            selectionStart: 6,
            selectionEnd: 6,
        });
    });

    it('ignores raw characters that do not match the next token slot', () => {
        const format = pattern('###-##');

        expect(
            format.onInput({
                value: '12a34',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '123-4',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('supports explicit token definitions for mixed token types', () => {
        const format = pattern({
            pattern: '##-AA',
            tokens: {
                '#': { matches: /\d/ },
                A: { matches: /[A-Z]/i },
            },
        });

        expect(
            format.onInput({
                value: '1a2Bc',
                selectionStart: 5,
                selectionEnd: 5,
            }).formattedValue
        ).toBe('12-Bc');
    });

    it('uses the same value pipeline on blur and clears selection', () => {
        const format = pattern('###-##');

        expect(
            format.onBlur({
                value: '12a34',
                selectionStart: 1,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: '123-4',
            selectionStart: null,
            selectionEnd: null,
        });
    });
});
