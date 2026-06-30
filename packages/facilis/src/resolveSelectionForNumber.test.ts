import { describe, expect, it } from 'vitest';
import { resolveSelectionForNumber } from './resolveSelectionForNumber';

describe('resolveSelectionForNumber', () => {
    it('preserves a decimal separator when decimals are allowed', () => {
        expect(
            resolveSelectionForNumber(
                {
                    rawValue: '1234.56',
                    rawSelectionStart: 7,
                    rawSelectionEnd: 7,
                    normalizedValue: '1234.56',
                    formattedValue: '1,234.56',
                },
                {
                    allowDecimal: true,
                    decimalSeparator: '.',
                }
            )
        ).toEqual({
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('preserves a leading minus sign when negatives are allowed', () => {
        expect(
            resolveSelectionForNumber(
                {
                    rawValue: '-1234',
                    rawSelectionStart: 5,
                    rawSelectionEnd: 5,
                    normalizedValue: '-1234',
                    formattedValue: '-1,234',
                },
                {
                    allowNegative: true,
                }
            )
        ).toEqual({
            selectionStart: 6,
            selectionEnd: 6,
        });
    });

    it('ignores decimal separators when decimals are not allowed', () => {
        expect(
            resolveSelectionForNumber(
                {
                    rawValue: '1234.56',
                    rawSelectionStart: 7,
                    rawSelectionEnd: 7,
                    normalizedValue: '123456',
                    formattedValue: '123,456',
                },
                {
                    allowDecimal: false,
                    decimalSeparator: '.',
                }
            )
        ).toEqual({
            selectionStart: 7,
            selectionEnd: 7,
        });
    });
});
