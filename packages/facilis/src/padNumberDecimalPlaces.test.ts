import { describe, expect, it } from 'vitest';
import padNumberDecimalPlaces from './padNumberDecimalPlaces';

describe('padNumberDecimalPlaces', () => {
    it('pads an existing fractional portion', () => {
        expect(padNumberDecimalPlaces('1.5', { decimalPlaces: 2 })).toBe(
            '1.50'
        );
    });

    it('creates a fractional portion when one does not exist', () => {
        expect(padNumberDecimalPlaces('1', { decimalPlaces: 2 })).toBe('1.00');
    });

    it('leaves longer fractional portions unchanged', () => {
        expect(padNumberDecimalPlaces('1.234', { decimalPlaces: 2 })).toBe(
            '1.234'
        );
    });

    it('supports a custom decimal separator', () => {
        expect(
            padNumberDecimalPlaces('1,5', {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('1,50');
    });

    it('leaves empty and punctuation-only values unchanged', () => {
        expect(padNumberDecimalPlaces('', { decimalPlaces: 2 })).toBe('');
        expect(padNumberDecimalPlaces('.', { decimalPlaces: 2 })).toBe('.');
        expect(padNumberDecimalPlaces('-.', { decimalPlaces: 2 })).toBe('-.');
    });
});
