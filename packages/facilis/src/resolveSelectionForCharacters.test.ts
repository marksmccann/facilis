import { describe, expect, it } from 'vitest';
import { resolveSelectionForCharacters } from './resolveSelectionForCharacters';

describe('resolveSelectionForCharacters', () => {
    it('maps matched characters onto the formatted value', () => {
        expect(
            resolveSelectionForCharacters(
                {
                    rawValue: '(123) 4',
                    rawSelectionStart: 7,
                    rawSelectionEnd: 7,
                    normalizedValue: '1234',
                    formattedValue: '(123) 4',
                },
                /\d/
            )
        ).toEqual({
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('clamps the selection count to the normalized value length', () => {
        expect(
            resolveSelectionForCharacters(
                {
                    rawValue: '(123) 456999',
                    rawSelectionStart: 12,
                    rawSelectionEnd: 12,
                    normalizedValue: '123456',
                    formattedValue: '(123) 456',
                },
                /\d/
            )
        ).toEqual({
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('returns zeroed selections when no matched characters precede the cursor', () => {
        expect(
            resolveSelectionForCharacters(
                {
                    rawValue: '(',
                    rawSelectionStart: 1,
                    rawSelectionEnd: 1,
                    normalizedValue: '',
                    formattedValue: '',
                },
                /\d/
            )
        ).toEqual({
            selectionStart: 0,
            selectionEnd: 0,
        });
    });

    it('supports selection ranges with non-digit match rules', () => {
        expect(
            resolveSelectionForCharacters(
                {
                    rawValue: 'ab-',
                    rawSelectionStart: 1,
                    rawSelectionEnd: 2,
                    normalizedValue: 'ab',
                    formattedValue: 'AB',
                },
                /[a-z]/i
            )
        ).toEqual({
            selectionStart: 1,
            selectionEnd: 2,
        });
    });
});
