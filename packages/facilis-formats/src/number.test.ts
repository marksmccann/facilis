import { describe, expect, it } from 'vitest';
import { number } from './number';

describe('number', () => {
    it('keeps digits in the order they were entered', () => {
        const format = number();

        expect(
            format.onInput({
                value: '12345',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '12345',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('removes non-digit characters from the value', () => {
        const format = number();

        expect(
            format.onInput({
                value: '1a2-b3',
                selectionStart: 6,
                selectionEnd: 6,
            })
        ).toEqual({
            formattedValue: '123',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('uses the same pipeline on blur and clears selection', () => {
        const format = number();

        expect(
            format.onBlur({
                value: '1a2-b3',
                selectionStart: 1,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '123',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('preserves one decimal separator when decimals are enabled', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            format.onInput({
                value: '12.34',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '12.34',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('keeps only the first decimal separator when decimals are enabled', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            format.onInput({
                value: '1.2.3',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '1.23',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('supports a custom decimal separator', () => {
        const format = number({
            decimalPlaces: 2,
            decimalSeparator: ',',
        });

        expect(
            format.onInput({
                value: '12,34',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '12,34',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('ignores extra fractional digits beyond decimalPlaces', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            format.onInput({
                value: '12.345',
                selectionStart: 6,
                selectionEnd: 6,
            })
        ).toEqual({
            formattedValue: '12.34',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('still allows unlimited whole digits when decimalPlaces is set', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            format.onInput({
                value: '12345.67',
                selectionStart: 8,
                selectionEnd: 8,
            })
        ).toEqual({
            formattedValue: '12345.67',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('preserves one leading minus sign when negative values are enabled', () => {
        const format = number({
            allowNegative: true,
        });

        expect(
            format.onInput({
                value: '-123',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: '-123',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('ignores a minus sign when negative values are disabled', () => {
        const format = number();

        expect(
            format.onInput({
                value: '-123',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: '123',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('ignores minus signs that do not appear at the start', () => {
        const format = number({
            allowNegative: true,
        });

        expect(
            format.onInput({
                value: '1-2-3',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '123',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('inserts a leading zero on blur for decimal-only values', () => {
        const format = number({
            decimalPlaces: 2,
            insertLeadingZero: true,
        });

        expect(
            format.onBlur({
                value: '.5',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            formattedValue: '0.5',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('inserts a leading zero on blur for negative decimal-only values', () => {
        const format = number({
            allowNegative: true,
            decimalPlaces: 2,
            insertLeadingZero: true,
        });

        expect(
            format.onBlur({
                value: '-.5',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            formattedValue: '-0.5',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('leaves the value unchanged on blur when insertLeadingZero is disabled', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            format.onBlur({
                value: '.5',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            formattedValue: '.5',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('pads an existing fractional portion on blur', () => {
        const format = number({
            decimalPlaces: 2,
            padDecimalPlaces: 2,
        });

        expect(
            format.onBlur({
                value: '1.5',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            formattedValue: '1.50',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('creates a fractional portion on blur when one does not exist', () => {
        const format = number({
            decimalPlaces: 2,
            padDecimalPlaces: 2,
        });

        expect(
            format.onBlur({
                value: '1',
                selectionStart: 1,
                selectionEnd: 1,
            })
        ).toEqual({
            formattedValue: '1.00',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('leaves longer fractional portions unchanged on blur', () => {
        const format = number({
            decimalPlaces: 4,
            padDecimalPlaces: 2,
        });

        expect(
            format.onBlur({
                value: '1.234',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '1.234',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('composes leading-zero insertion with decimal padding on blur', () => {
        const format = number({
            decimalPlaces: 2,
            insertLeadingZero: true,
            padDecimalPlaces: 2,
        });

        expect(
            format.onBlur({
                value: '.5',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            formattedValue: '0.50',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('trims unnecessary leading zeros from whole numbers while typing', () => {
        const format = number({
            trimLeadingZeros: true,
        });

        expect(
            format.onInput({
                value: '00012',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '12',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('preserves a single zero when the integer portion is all zeros', () => {
        const format = number({
            trimLeadingZeros: true,
        });

        expect(
            format.onInput({
                value: '000',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            formattedValue: '0',
            selectionStart: 1,
            selectionEnd: 1,
        });
    });

    it('trims leading zeros before a fractional portion while typing', () => {
        const format = number({
            decimalPlaces: 2,
            trimLeadingZeros: true,
        });

        expect(
            format.onInput({
                value: '000.5',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '0.5',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('preserves an in-progress zero before the decimal separator', () => {
        const format = number({
            decimalPlaces: 2,
            trimLeadingZeros: true,
        });

        expect(
            format.onInput({
                value: '0.',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            formattedValue: '0.',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('trims unnecessary leading zeros after a minus sign', () => {
        const format = number({
            allowNegative: true,
            trimLeadingZeros: true,
        });

        expect(
            format.onInput({
                value: '-00012',
                selectionStart: 6,
                selectionEnd: 6,
            })
        ).toEqual({
            formattedValue: '-12',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });
});
