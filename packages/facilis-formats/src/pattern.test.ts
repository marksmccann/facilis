import { describe, expect, it } from 'vitest';
import { applyBlur, applyInput, typeCharacters } from 'facilis-testing';
import { pattern } from './pattern';

describe('pattern', () => {
    it('formats a phone pattern while keeping the cursor after each typed digit', () => {
        const format = pattern('(###) ###-####');

        expect(typeCharacters(format, '1234567890')).toEqual([
            {
                formattedValue: '(1',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: '(12',
                selectionStart: 3,
                selectionEnd: 3,
            },
            {
                formattedValue: '(123',
                selectionStart: 4,
                selectionEnd: 4,
            },
            {
                formattedValue: '(123) 4',
                selectionStart: 7,
                selectionEnd: 7,
            },
            {
                formattedValue: '(123) 45',
                selectionStart: 8,
                selectionEnd: 8,
            },
            {
                formattedValue: '(123) 456',
                selectionStart: 9,
                selectionEnd: 9,
            },
            {
                formattedValue: '(123) 456-7',
                selectionStart: 11,
                selectionEnd: 11,
            },
            {
                formattedValue: '(123) 456-78',
                selectionStart: 12,
                selectionEnd: 12,
            },
            {
                formattedValue: '(123) 456-789',
                selectionStart: 13,
                selectionEnd: 13,
            },
            {
                formattedValue: '(123) 456-7890',
                selectionStart: 14,
                selectionEnd: 14,
            },
        ]);
    });

    it('keeps shorthand and explicit token definitions in sync', () => {
        const shorthand = pattern('(###) ###-####');
        const explicit = pattern({
            pattern: '(###) ###-####',
            tokens: {
                '#': {
                    matches: /\d/,
                },
            },
        });

        expect(
            typeCharacters(shorthand, '1234567890').map((result) => ({
                formattedValue: result.formattedValue,
                selectionStart: result.selectionStart,
                selectionEnd: result.selectionEnd,
            }))
        ).toEqual(
            typeCharacters(explicit, '1234567890').map((result) => ({
                formattedValue: result.formattedValue,
                selectionStart: result.selectionStart,
                selectionEnd: result.selectionEnd,
            }))
        );
    });

    it('supports custom tokens', () => {
        const format = pattern({
            pattern: 'AA-##',
            tokens: {
                A: {
                    matches: /[a-z]/i,
                },
                '#': {
                    matches: /\d/,
                },
            },
        });

        expect(
            applyInput(format, {
                value: 'ab12',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: 'ab-12',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('uses the preset any-character token in string shorthand mode', () => {
        const format = pattern('**-##');

        expect(
            applyInput(format, {
                value: 'ab12',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: 'ab-12',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('returns the formatted value unchanged on blur', () => {
        const format = pattern('(###) ###-####');

        expect(
            applyBlur(format, {
                value: '(123) 456-7890',
            })
        ).toEqual({
            formattedValue: '(123) 456-7890',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('fails on invalid pattern input', () => {
        expect(() => pattern('')).toThrowError(
            '[facilis-formats] ERR01: Pattern formats require a non-empty pattern string.'
        );
        expect(() =>
            pattern({
                pattern: '###',
                tokens: {},
            })
        ).toThrowError(
            '[facilis-formats] ERR02: Pattern formats require at least one token definition.'
        );
        expect(() =>
            pattern({
                pattern: '###',
                tokens: {
                    '##': {
                        matches: /\d/,
                    },
                },
            })
        ).toThrowError(
            '[facilis-formats] ERR03: Pattern format token keys must be a single character each.'
        );
        expect(() =>
            pattern({
                pattern: 'phone',
                tokens: {
                    '#': {
                        matches: /\d/,
                    },
                },
            })
        ).toThrowError(
            '[facilis-formats] ERR04: Pattern formats require the pattern string to include at least one token.'
        );
    });
});
