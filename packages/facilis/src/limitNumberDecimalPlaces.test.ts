import { describe, expect, it } from 'vitest';
import limitNumberDecimalPlaces from './limitNumberDecimalPlaces';

describe('limitNumberDecimalPlaces', () => {
    it('preserves values without a decimal separator', () => {
        expect(limitNumberDecimalPlaces('123')).toBe('123');
    });

    it('limits digits after the decimal separator', () => {
        expect(
            limitNumberDecimalPlaces('12.345', {
                decimalPlaces: 2,
            })
        ).toBe('12.34');
    });

    it('supports a custom decimal separator', () => {
        expect(
            limitNumberDecimalPlaces('12,345', {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('12,34');
    });

    it('removes the fractional portion when decimal places is zero', () => {
        expect(
            limitNumberDecimalPlaces('12.345', {
                decimalPlaces: 0,
            })
        ).toBe('12');
    });

    it('preserves a trailing decimal separator when decimals are allowed', () => {
        expect(
            limitNumberDecimalPlaces('12.', {
                decimalPlaces: 2,
            })
        ).toBe('12.');
    });
});
