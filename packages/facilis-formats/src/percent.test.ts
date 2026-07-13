import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { percent } from './percent';

describe('percent', () => {
    it('appends the percent symbol by default', () => {
        const input = setupInput(percent());

        expect(input.type('123')).toEqual(textState('123%', 3));
    });

    it('supports omitting the percent symbol', () => {
        const input = setupInput(
            percent({
                includeSymbol: false,
            })
        );

        expect(input.type('123')).toEqual(textState('123', 3));
    });

    it('preserves decimal places when decimals are enabled', () => {
        const input = setupInput(
            percent({
                decimalPlaces: 2,
            })
        );

        expect(input.type('12.34')).toEqual(textState('12.34%', 5));
    });

    it('ignores extra fractional digits beyond decimalPlaces', () => {
        const input = setupInput(
            percent({
                decimalPlaces: 2,
            })
        );

        expect(input.type('12.345')).toEqual(textState('12.34%', 5));
    });

    it('pads decimal places on blur', () => {
        const input = setupInput(
            percent({
                decimalPlaces: 2,
                padDecimalPlaces: 2,
            })
        );

        expect(input.blur('12.5')).toEqual(textState('12.50%', null));
    });

    it('inserts a leading zero on blur for decimal-only values', () => {
        const input = setupInput(
            percent({
                decimalPlaces: 2,
                padDecimalPlaces: 2,
            })
        );

        expect(input.blur('.5')).toEqual(textState('0.50%', null));
    });

    it('supports a custom decimal separator', () => {
        const input = setupInput(
            percent({
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        );

        expect(input.type('12345,6')).toEqual(textState('12345,6%', 7));
    });

    it('preserves a leading minus sign when negative values are enabled', () => {
        const input = setupInput(
            percent({
                allowNegative: true,
                decimalPlaces: 2,
            })
        );

        expect(input.type('-12.5')).toEqual(textState('-12.5%', 5));
    });

    it('ignores a minus sign when negative values are disabled', () => {
        const input = setupInput(percent());

        expect(input.type('-12')).toEqual(textState('12%', 2));
    });

    it('clamps complete integers to the configured maximum while typing', () => {
        const input = setupInput(
            percent({
                max: 100,
            })
        );

        expect(input.type('150')).toEqual(textState('100%', 3));
    });

    it('clamps complete decimals to the configured minimum while typing', () => {
        const input = setupInput(
            percent({
                allowNegative: true,
                decimalPlaces: 2,
                min: 0,
            })
        );

        expect(input.append('', '-1.5')).toEqual(textState('0%', 1));
    });

    it('does not append the symbol to an incomplete minus sign', () => {
        const input = setupInput(
            percent({
                allowNegative: true,
            })
        );

        expect(input.type('-')).toEqual(textState('-', 1));
    });

    it('moves before the percent symbol when deleting backward over it', () => {
        const input = setupInput(percent());

        expect(input.deleteBackward('12%', 3)).toEqual(textState('12%', 2));
    });

    it('keeps the cursor before the percent symbol after deleting the previous digit', () => {
        const input = setupInput(percent());

        expect(input.deleteBackward('12%', 2)).toEqual(textState('1%', 1));
    });
});
