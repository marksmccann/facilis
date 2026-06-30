import { describe, expect, it } from 'vitest';
import { formatValueForNumber } from './formatValueForNumber';

describe('formatValueForNumber', () => {
    it('returns integer values unchanged by default', () => {
        expect(formatValueForNumber('1234')).toBe('1234');
    });

    it('supports thousands separators', () => {
        expect(
            formatValueForNumber('1234567', {
                thousandsSeparator: ',',
            })
        ).toBe('1,234,567');
    });

    it('preserves fractional digits up to the configured decimal places', () => {
        expect(
            formatValueForNumber('1234.567', {
                decimalPlaces: 2,
            })
        ).toBe('1234.56');
    });

    it('formats grouped decimal values', () => {
        expect(
            formatValueForNumber('1234567.89', {
                decimalPlaces: 2,
                thousandsSeparator: ',',
            })
        ).toBe('1,234,567.89');
    });

    it('supports a custom decimal separator', () => {
        expect(
            formatValueForNumber('1234567,89', {
                decimalPlaces: 2,
                decimalSeparator: ',',
                thousandsSeparator: '.',
            })
        ).toBe('1.234.567,89');
    });

    it('preserves a negative sign when present', () => {
        expect(
            formatValueForNumber('-1234567.89', {
                decimalPlaces: 2,
                thousandsSeparator: ',',
            })
        ).toBe('-1,234,567.89');
    });

    it('omits the fractional portion when decimal places are disabled', () => {
        expect(
            formatValueForNumber('1234.56', {
                decimalPlaces: 0,
                thousandsSeparator: ',',
            })
        ).toBe('1,234');
    });

    it('preserves in-progress negative values', () => {
        expect(
            formatValueForNumber('-', {
                decimalPlaces: 2,
                thousandsSeparator: ',',
            })
        ).toBe('-');
    });

    it('preserves a custom decimal separator for partial decimal values', () => {
        expect(
            formatValueForNumber('-,', {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('-,');
    });
});
