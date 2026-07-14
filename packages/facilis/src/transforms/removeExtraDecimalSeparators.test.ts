import { describe, expect, it } from 'vitest';
import removeExtraDecimalSeparators from './removeExtraDecimalSeparators';

describe('removeExtraDecimalSeparators', () => {
    it('keeps the first decimal separator', () => {
        expect(removeExtraDecimalSeparators('1.2.3')).toBe('1.23');
    });

    it('supports a custom decimal separator', () => {
        expect(
            removeExtraDecimalSeparators('1,2,3', {
                decimalSeparator: ',',
            })
        ).toBe('1,23');
    });

    it('preserves values without a decimal separator', () => {
        expect(removeExtraDecimalSeparators('123')).toBe('123');
    });
});
