import { describe, expect, it } from 'vitest';
import { formatBlurValueForNumber } from './formatBlurValueForNumber';

describe('formatBlurValueForNumber', () => {
    it('returns the formatted value unchanged by default', () => {
        expect(formatBlurValueForNumber('1234.5')).toBe('1234.5');
    });

    it('pads a missing fractional portion when minimum decimal places are configured', () => {
        expect(
            formatBlurValueForNumber('1234', {
                padDecimalPlaces: 2,
            })
        ).toBe('1234.00');
    });

    it('pads an incomplete fractional portion', () => {
        expect(
            formatBlurValueForNumber('1,234.5', {
                padDecimalPlaces: 2,
            })
        ).toBe('1,234.50');
    });

    it('preserves a full fractional portion that already matches the configured blur precision', () => {
        expect(
            formatBlurValueForNumber('1,234.56', {
                padDecimalPlaces: 2,
            })
        ).toBe('1,234.56');
    });

    it('preserves a longer fractional portion when blur padding is smaller', () => {
        expect(
            formatBlurValueForNumber('1,234.5678', {
                padDecimalPlaces: 2,
            })
        ).toBe('1,234.5678');
    });

    it('supports a custom decimal separator', () => {
        expect(
            formatBlurValueForNumber('1.234,5', {
                decimalSeparator: ',',
                padDecimalPlaces: 2,
            })
        ).toBe('1.234,50');
    });

    it('inserts a leading zero into a completed decimal value on blur', () => {
        expect(
            formatBlurValueForNumber('.5', {
                insertLeadingZero: true,
            })
        ).toBe('0.5');
    });

    it('inserts a leading zero into a completed negative decimal value on blur', () => {
        expect(
            formatBlurValueForNumber('-.5', {
                decimalSeparator: '.',
                insertLeadingZero: true,
            })
        ).toBe('-0.5');
    });

    it('preserves partial values that do not contain digits', () => {
        expect(
            formatBlurValueForNumber('-', {
                padDecimalPlaces: 2,
            })
        ).toBe('-');
    });

    it('preserves partial decimal values while blurring', () => {
        expect(
            formatBlurValueForNumber('.', {
                insertLeadingZero: true,
            })
        ).toBe('.');
    });
});
