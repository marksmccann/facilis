import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { number } from './number';

describe('number', () => {
    it('keeps digits in the order they were entered', () => {
        const input = setupInput(number());

        expect(input.append('', '12345')).toEqual(textState('12345', 5));
    });

    it('removes non-digit characters from the value', () => {
        const input = setupInput(number());

        expect(input.append('', '1a2-b3')).toEqual(textState('123', 3));
    });

    it('uses the same pipeline on blur and clears selection', () => {
        const input = setupInput(number());

        expect(input.blur('1a2-b3', 1, 5)).toEqual(textState('123', null));
    });

    it('preserves one decimal separator when decimals are enabled', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
            })
        );

        expect(input.append('', '12.34')).toEqual(textState('12.34', 5));
    });

    it('keeps only the first decimal separator when decimals are enabled', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
            })
        );

        expect(input.append('', '1.2.3')).toEqual(textState('1.23', 4));
    });

    it('supports a custom decimal separator', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        );

        expect(input.append('', '12,34')).toEqual(textState('12,34', 5));
    });

    it('ignores extra fractional digits beyond decimalPlaces', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
            })
        );

        expect(input.append('', '12.345')).toEqual(textState('12.34', 5));
    });

    it('still allows unlimited whole digits when decimalPlaces is set', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
            })
        );

        expect(input.append('', '12345.67')).toEqual(textState('12345.67', 8));
    });

    it('preserves one leading minus sign when negative values are enabled', () => {
        const input = setupInput(
            number({
                allowNegative: true,
            })
        );

        expect(input.append('', '-123')).toEqual(textState('-123', 4));
    });

    it('ignores a minus sign when negative values are disabled', () => {
        const input = setupInput(number());

        expect(input.append('', '-123')).toEqual(textState('123', 3));
    });

    it('ignores minus signs that do not appear at the start', () => {
        const input = setupInput(
            number({
                allowNegative: true,
            })
        );

        expect(input.append('', '1-2-3')).toEqual(textState('123', 3));
    });

    it('inserts a leading zero on blur for decimal-only values', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                insertLeadingZero: true,
            })
        );

        expect(input.blur('.5')).toEqual(textState('0.5', null));
    });

    it('inserts a leading zero on blur for negative decimal-only values', () => {
        const input = setupInput(
            number({
                allowNegative: true,
                decimalPlaces: 2,
                insertLeadingZero: true,
            })
        );

        expect(input.blur('-.5')).toEqual(textState('-0.5', null));
    });

    it('leaves the value unchanged on blur when insertLeadingZero is disabled', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
            })
        );

        expect(input.blur('.5')).toEqual(textState('.5', null));
    });

    it('pads an existing fractional portion on blur', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                padDecimalPlaces: 2,
            })
        );

        expect(input.blur('1.5')).toEqual(textState('1.50', null));
    });

    it('creates a fractional portion on blur when one does not exist', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                padDecimalPlaces: 2,
            })
        );

        expect(input.blur('1')).toEqual(textState('1.00', null));
    });

    it('leaves longer fractional portions unchanged on blur', () => {
        const input = setupInput(
            number({
                decimalPlaces: 4,
                padDecimalPlaces: 2,
            })
        );

        expect(input.blur('1.234')).toEqual(textState('1.234', null));
    });

    it('composes leading-zero insertion with decimal padding on blur', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                insertLeadingZero: true,
                padDecimalPlaces: 2,
            })
        );

        expect(input.blur('.5')).toEqual(textState('0.50', null));
    });

    it('trims unnecessary leading zeros from whole numbers while typing', () => {
        const input = setupInput(
            number({
                trimLeadingZeros: true,
            })
        );

        expect(input.append('', '00012')).toEqual(textState('12', 2));
    });

    it('preserves a single zero when the integer portion is all zeros', () => {
        const input = setupInput(
            number({
                trimLeadingZeros: true,
            })
        );

        expect(input.append('', '000')).toEqual(textState('0', 1));
    });

    it('trims leading zeros before a fractional portion while typing', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                trimLeadingZeros: true,
            })
        );

        expect(input.append('', '000.5')).toEqual(textState('0.5', 3));
    });

    it('preserves an in-progress zero before the decimal separator', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                trimLeadingZeros: true,
            })
        );

        expect(input.append('', '0.')).toEqual(textState('0.', 2));
    });

    it('trims unnecessary leading zeros after a minus sign', () => {
        const input = setupInput(
            number({
                allowNegative: true,
                trimLeadingZeros: true,
            })
        );

        expect(input.append('', '-00012')).toEqual(textState('-12', 3));
    });

    it('inserts thousands separators into the integer portion', () => {
        const input = setupInput(
            number({
                thousandsSeparator: ',',
            })
        );

        expect(input.append('', '12345')).toEqual(textState('12,345', 6));
    });

    it('leaves the fractional portion unchanged when grouping', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                thousandsSeparator: ',',
            })
        );

        expect(input.append('', '12345.67')).toEqual(textState('12,345.67', 9));
    });

    it('preserves a leading minus sign when grouping', () => {
        const input = setupInput(
            number({
                allowNegative: true,
                thousandsSeparator: ',',
            })
        );

        expect(input.append('', '-12345')).toEqual(textState('-12,345', 7));
    });

    it('maps selection through inserted thousands separators', () => {
        const input = setupInput(
            number({
                thousandsSeparator: ',',
            })
        );

        expect(input.mount('12345', 2, 4)).toEqual(textState('12,345', 3, 5));
    });

    it('clamps complete integers to the configured minimum while typing', () => {
        const input = setupInput(
            number({
                allowNegative: true,
                min: 0,
            })
        );

        expect(input.append('', '-5')).toEqual(textState('0', 1));
    });

    it('clamps complete integers to the configured maximum while typing', () => {
        const input = setupInput(
            number({
                max: 100,
            })
        );

        expect(input.append('', '150')).toEqual(textState('100', 3));
    });

    it('does not clamp an incomplete minus sign while typing', () => {
        const input = setupInput(
            number({
                allowNegative: true,
                min: 0,
            })
        );

        expect(input.append('', '-')).toEqual(textState('-', 1));
    });

    it('clamps complete decimal values to the configured maximum while typing', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                max: 10,
            })
        );

        expect(input.append('', '12.5')).toEqual(textState('10', 2));
    });

    it('clamps complete decimal values to the configured minimum while typing', () => {
        const input = setupInput(
            number({
                allowNegative: true,
                decimalPlaces: 2,
                min: 0,
            })
        );

        expect(input.append('', '-1.5')).toEqual(textState('0', 1));
    });

    it('does not clamp values that end with the decimal separator', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                max: 10,
            })
        );

        expect(input.append('', '12.')).toEqual(textState('12.', 3));
    });

    it('supports decimal clamping with a custom decimal separator', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                decimalSeparator: ',',
                max: 10,
            })
        );

        expect(input.append('', '12,5')).toEqual(textState('10', 2));
    });

    it('preserves the decimal separator when clamping to a decimal bound', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                decimalSeparator: ',',
                min: 0.5,
            })
        );

        expect(input.append('', '0,4')).toEqual(textState('0,5', 3));
    });

    it('does not clamp an incomplete negative decimal while typing', () => {
        const input = setupInput(
            number({
                allowNegative: true,
                decimalPlaces: 2,
                min: 0,
            })
        );

        expect(input.append('', '-.')).toEqual(textState('-.', 2));
    });

    it('leaves in-range decimal values unchanged while typing', () => {
        const input = setupInput(
            number({
                decimalPlaces: 2,
                max: 10,
            })
        );

        expect(input.append('', '9.5')).toEqual(textState('9.5', 3));
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
