import { describe, expect, it } from 'vitest';
import { normalizeValueForNumber } from './normalizeValueForNumber';

describe('normalizeValueForNumber', () => {
    it('keeps only digits by default', () => {
        expect(normalizeValueForNumber({ rawValue: '1a2b3c4' })).toBe('1234');
    });

    it('supports decimal precision when configured', () => {
        expect(
            normalizeValueForNumber({ rawValue: '1234.567' }, {
                decimalPlaces: 2,
            })
        ).toBe('1234.56');
    });

    it('supports a custom decimal separator', () => {
        expect(
            normalizeValueForNumber({ rawValue: '1234,567' }, {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('1234,56');
    });

    it('keeps only the first decimal point when decimals are enabled', () => {
        expect(
            normalizeValueForNumber({ rawValue: '12.3.4' }, {
                decimalPlaces: 2,
            })
        ).toBe('12.34');
    });

    it('preserves a leading minus sign when negative values are allowed', () => {
        expect(
            normalizeValueForNumber({ rawValue: '-1234' }, {
                allowNegative: true,
            })
        ).toBe('-1234');
    });

    it('ignores minus signs when negative values are not allowed', () => {
        expect(
            normalizeValueForNumber({ rawValue: '-1234' }, {
                allowNegative: false,
            })
        ).toBe('1234');
    });

    it('preserves a negative decimal value when enabled', () => {
        expect(
            normalizeValueForNumber({ rawValue: '-1234.567' }, {
                allowNegative: true,
                decimalPlaces: 2,
            })
        ).toBe('-1234.56');
    });

    it('preserves a lone minus sign as an in-progress negative value', () => {
        expect(
            normalizeValueForNumber({ rawValue: '-' }, {
                allowNegative: true,
            })
        ).toBe('-');
    });

    it('preserves a negative partial decimal as an in-progress value', () => {
        expect(
            normalizeValueForNumber({ rawValue: '-.' }, {
                allowNegative: true,
                decimalPlaces: 2,
            })
        ).toBe('-.');
    });

    it('preserves a negative partial decimal with a custom separator', () => {
        expect(
            normalizeValueForNumber({ rawValue: '-,' }, {
                allowNegative: true,
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('-,');
    });

    it('trims unnecessary leading zeros from an integer value', () => {
        expect(
            normalizeValueForNumber({ rawValue: '00012' }, {
                trimLeadingZeros: true,
            })
        ).toBe('12');
    });

    it('trims unnecessary leading zeros from a decimal value', () => {
        expect(
            normalizeValueForNumber({ rawValue: '00012.34' }, {
                decimalPlaces: 2,
                trimLeadingZeros: true,
            })
        ).toBe('12.34');
    });

    it('clamps values above the configured maximum', () => {
        expect(
            normalizeValueForNumber({ rawValue: '101' }, {
                max: 100,
            })
        ).toBe('100');
    });

    it('clamps values below the configured minimum', () => {
        expect(
            normalizeValueForNumber({ rawValue: '-5' }, {
                allowNegative: true,
                min: 0,
            })
        ).toBe('0');
    });

    it('preserves partial decimal values before they resolve to a complete number', () => {
        expect(
            normalizeValueForNumber({ rawValue: '10.' }, {
                decimalPlaces: 2,
                max: 10,
            })
        ).toBe('10.');
    });

    it('clamps decimal values and trims trailing zero padding', () => {
        expect(
            normalizeValueForNumber({ rawValue: '10.5' }, {
                decimalPlaces: 2,
                max: 10,
            })
        ).toBe('10');
    });

    it('clamps decimal values with a custom separator', () => {
        expect(
            normalizeValueForNumber({ rawValue: '10,5' }, {
                decimalPlaces: 2,
                decimalSeparator: ',',
                max: 10,
            })
        ).toBe('10');
    });
});
