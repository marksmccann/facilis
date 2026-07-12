import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { number } from './number';

function input(
    format: ReturnType<typeof number>,
    current: Parameters<typeof format.onMount>[0]
) {
    return format.onInput(
        {
            inputType: 'insertText',
            data: null,
        },
        textState('', 0),
        current
    );
}

describe('number', () => {
    it('keeps digits in the order they were entered', () => {
        const format = number();

        expect(
            input(format, {
                value: '12345',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '12345',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('removes non-digit characters from the value', () => {
        const format = number();

        expect(
            input(format, {
                value: '1a2-b3',
                selectionStart: 6,
                selectionEnd: 6,
            })
        ).toEqual({
            value: '123',
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
            value: '123',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('preserves one decimal separator when decimals are enabled', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            input(format, {
                value: '12.34',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '12.34',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('keeps only the first decimal separator when decimals are enabled', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            input(format, {
                value: '1.2.3',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '1.23',
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
            input(format, {
                value: '12,34',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '12,34',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('ignores extra fractional digits beyond decimalPlaces', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            input(format, {
                value: '12.345',
                selectionStart: 6,
                selectionEnd: 6,
            })
        ).toEqual({
            value: '12.34',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('still allows unlimited whole digits when decimalPlaces is set', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            input(format, {
                value: '12345.67',
                selectionStart: 8,
                selectionEnd: 8,
            })
        ).toEqual({
            value: '12345.67',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('preserves one leading minus sign when negative values are enabled', () => {
        const format = number({
            allowNegative: true,
        });

        expect(
            input(format, {
                value: '-123',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            value: '-123',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('ignores a minus sign when negative values are disabled', () => {
        const format = number();

        expect(
            input(format, {
                value: '-123',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            value: '123',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('ignores minus signs that do not appear at the start', () => {
        const format = number({
            allowNegative: true,
        });

        expect(
            input(format, {
                value: '1-2-3',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '123',
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
            value: '0.5',
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
            value: '-0.5',
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
            value: '.5',
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
            value: '1.50',
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
            value: '1.00',
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
            value: '1.234',
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
            value: '0.50',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('trims unnecessary leading zeros from whole numbers while typing', () => {
        const format = number({
            trimLeadingZeros: true,
        });

        expect(
            input(format, {
                value: '00012',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '12',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('preserves a single zero when the integer portion is all zeros', () => {
        const format = number({
            trimLeadingZeros: true,
        });

        expect(
            input(format, {
                value: '000',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            value: '0',
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
            input(format, {
                value: '000.5',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '0.5',
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
            input(format, {
                value: '0.',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            value: '0.',
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
            input(format, {
                value: '-00012',
                selectionStart: 6,
                selectionEnd: 6,
            })
        ).toEqual({
            value: '-12',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('inserts thousands separators into the integer portion', () => {
        const format = number({
            thousandsSeparator: ',',
        });

        expect(
            input(format, {
                value: '12345',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '12,345',
            selectionStart: 6,
            selectionEnd: 6,
        });
    });

    it('leaves the fractional portion unchanged when grouping', () => {
        const format = number({
            decimalPlaces: 2,
            thousandsSeparator: ',',
        });

        expect(
            input(format, {
                value: '12345.67',
                selectionStart: 8,
                selectionEnd: 8,
            })
        ).toEqual({
            value: '12,345.67',
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('preserves a leading minus sign when grouping', () => {
        const format = number({
            allowNegative: true,
            thousandsSeparator: ',',
        });

        expect(
            input(format, {
                value: '-12345',
                selectionStart: 6,
                selectionEnd: 6,
            })
        ).toEqual({
            value: '-12,345',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('maps selection through inserted thousands separators', () => {
        const format = number({
            thousandsSeparator: ',',
        });

        expect(
            input(format, {
                value: '12345',
                selectionStart: 2,
                selectionEnd: 4,
            })
        ).toEqual({
            value: '12,345',
            selectionStart: 3,
            selectionEnd: 5,
        });
    });

    it('clamps complete integers to the configured minimum while typing', () => {
        const format = number({
            allowNegative: true,
            min: 0,
        });

        expect(
            input(format, {
                value: '-5',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            value: '0',
            selectionStart: 1,
            selectionEnd: 1,
        });
    });

    it('clamps complete integers to the configured maximum while typing', () => {
        const format = number({
            max: 100,
        });

        expect(
            input(format, {
                value: '150',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            value: '100',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('does not clamp an incomplete minus sign while typing', () => {
        const format = number({
            allowNegative: true,
            min: 0,
        });

        expect(
            input(format, {
                value: '-',
                selectionStart: 1,
                selectionEnd: 1,
            })
        ).toEqual({
            value: '-',
            selectionStart: 1,
            selectionEnd: 1,
        });
    });

    it('clamps complete decimal values to the configured maximum while typing', () => {
        const format = number({
            decimalPlaces: 2,
            max: 10,
        });

        expect(
            input(format, {
                value: '12.5',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            value: '10',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('clamps complete decimal values to the configured minimum while typing', () => {
        const format = number({
            allowNegative: true,
            decimalPlaces: 2,
            min: 0,
        });

        expect(
            input(format, {
                value: '-1.5',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            value: '0',
            selectionStart: 1,
            selectionEnd: 1,
        });
    });

    it('does not clamp values that end with the decimal separator', () => {
        const format = number({
            decimalPlaces: 2,
            max: 10,
        });

        expect(
            input(format, {
                value: '12.',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            value: '12.',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('supports decimal clamping with a custom decimal separator', () => {
        const format = number({
            decimalPlaces: 2,
            decimalSeparator: ',',
            max: 10,
        });

        expect(
            input(format, {
                value: '12,5',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            value: '10',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('preserves the decimal separator when clamping to a decimal bound', () => {
        const format = number({
            decimalPlaces: 2,
            decimalSeparator: ',',
            min: 0.5,
        });

        expect(
            input(format, {
                value: '0,4',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            value: '0,5',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('does not clamp an incomplete negative decimal while typing', () => {
        const format = number({
            allowNegative: true,
            decimalPlaces: 2,
            min: 0,
        });

        expect(
            input(format, {
                value: '-.',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            value: '-.',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('leaves in-range decimal values unchanged while typing', () => {
        const format = number({
            decimalPlaces: 2,
            max: 10,
        });

        expect(
            input(format, {
                value: '9.5',
                selectionStart: 3,
                selectionEnd: 3,
            })
        ).toEqual({
            value: '9.5',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('moves before a thousands separator when deleting backward over it', () => {
        const input = setupInput(number({ thousandsSeparator: ',' }));

        expect(input.deleteBackward('12,345', 3)).toEqual(
            textState('12,345', 2)
        );
    });

    it('keeps the cursor before a thousands separator after deleting the previous digit', () => {
        const input = setupInput(number({ thousandsSeparator: ',' }));

        expect(input.deleteBackward('12,345', 2)).toEqual(
            textState('1,345', 1)
        );
    });
});
