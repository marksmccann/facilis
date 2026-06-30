import { describe, expect, it } from 'vitest';
import { normalizeValueForNumber } from './normalizeValueForNumber';

describe('normalizeValueForNumber', () => {
    it('keeps only digits by default', () => {
        expect(normalizeValueForNumber('1a2b3c4')).toBe('1234');
    });

    it('supports decimal precision when configured', () => {
        expect(
            normalizeValueForNumber('1234.567', {
                decimalPlaces: 2,
            })
        ).toBe('1234.56');
    });

    it('supports a custom decimal separator', () => {
        expect(
            normalizeValueForNumber('1234,567', {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('1234,56');
    });

    it('keeps only the first decimal point when decimals are enabled', () => {
        expect(
            normalizeValueForNumber('12.3.4', {
                decimalPlaces: 2,
            })
        ).toBe('12.34');
    });

    it('preserves a leading minus sign when negative values are allowed', () => {
        expect(
            normalizeValueForNumber('-1234', {
                allowNegative: true,
            })
        ).toBe('-1234');
    });

    it('ignores minus signs when negative values are not allowed', () => {
        expect(
            normalizeValueForNumber('-1234', {
                allowNegative: false,
            })
        ).toBe('1234');
    });

    it('preserves a negative decimal value when enabled', () => {
        expect(
            normalizeValueForNumber('-1234.567', {
                allowNegative: true,
                decimalPlaces: 2,
            })
        ).toBe('-1234.56');
    });

    it('preserves a lone minus sign as an in-progress negative value', () => {
        expect(
            normalizeValueForNumber('-', {
                allowNegative: true,
            })
        ).toBe('-');
    });

    it('preserves a negative partial decimal as an in-progress value', () => {
        expect(
            normalizeValueForNumber('-.', {
                allowNegative: true,
                decimalPlaces: 2,
            })
        ).toBe('-.');
    });

    it('preserves a negative partial decimal with a custom separator', () => {
        expect(
            normalizeValueForNumber('-,', {
                allowNegative: true,
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('-,');
    });
});
