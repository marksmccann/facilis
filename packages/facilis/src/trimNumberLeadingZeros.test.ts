import { describe, expect, it } from 'vitest';
import trimNumberLeadingZeros from './trimNumberLeadingZeros';

describe('trimNumberLeadingZeros', () => {
    it('removes unnecessary leading zeros from whole numbers', () => {
        expect(trimNumberLeadingZeros('00012')).toBe('12');
    });

    it('preserves one zero when the integer portion is all zeros', () => {
        expect(trimNumberLeadingZeros('000')).toBe('0');
    });

    it('preserves one zero before the fractional portion', () => {
        expect(trimNumberLeadingZeros('000.5')).toBe('0.5');
    });

    it('preserves an incomplete decimal value', () => {
        expect(trimNumberLeadingZeros('.5')).toBe('.5');
    });

    it('trims zeros after a leading minus sign when negative values are enabled', () => {
        expect(
            trimNumberLeadingZeros('-00012', {
                allowNegative: true,
            })
        ).toBe('-12');
    });

    it('supports a custom decimal separator', () => {
        expect(
            trimNumberLeadingZeros('000,5', {
                decimalSeparator: ',',
            })
        ).toBe('0,5');
    });
});
