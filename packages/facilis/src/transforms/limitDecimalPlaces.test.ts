import { describe, expect, it } from 'vitest';
import limitDecimalPlaces from './limitDecimalPlaces';

describe('limitDecimalPlaces', () => {
    it('preserves values without a decimal separator', () => {
        expect(limitDecimalPlaces('123')).toBe('123');
    });

    it('limits digits after the decimal separator', () => {
        expect(
            limitDecimalPlaces('12.345', {
                decimalPlaces: 2,
            })
        ).toBe('12.34');
    });

    it('supports a custom decimal separator', () => {
        expect(
            limitDecimalPlaces('12,345', {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('12,34');
    });

    it('removes the fractional portion when decimal places is zero', () => {
        expect(
            limitDecimalPlaces('12.345', {
                decimalPlaces: 0,
            })
        ).toBe('12');
    });

    it('preserves a trailing decimal separator when decimals are allowed', () => {
        expect(
            limitDecimalPlaces('12.', {
                decimalPlaces: 2,
            })
        ).toBe('12.');
    });
});
