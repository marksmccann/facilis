import { describe, expect, it } from 'vitest';
import padDecimalPlaces from './padDecimalPlaces';

describe('padDecimalPlaces', () => {
    it('pads an existing fractional portion', () => {
        expect(padDecimalPlaces('1.5', { decimalPlaces: 2 })).toBe(
            '1.50'
        );
    });

    it('creates a fractional portion when one does not exist', () => {
        expect(padDecimalPlaces('1', { decimalPlaces: 2 })).toBe('1.00');
    });

    it('leaves longer fractional portions unchanged', () => {
        expect(padDecimalPlaces('1.234', { decimalPlaces: 2 })).toBe(
            '1.234'
        );
    });

    it('supports a custom decimal separator', () => {
        expect(
            padDecimalPlaces('1,5', {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('1,50');
    });

    it('leaves empty and punctuation-only values unchanged', () => {
        expect(padDecimalPlaces('', { decimalPlaces: 2 })).toBe('');
        expect(padDecimalPlaces('.', { decimalPlaces: 2 })).toBe('.');
        expect(padDecimalPlaces('-.', { decimalPlaces: 2 })).toBe('-.');
    });
});
