import { describe, expect, it } from 'vitest';
import trimLeadingZeros from './trimLeadingZeros';

describe('trimLeadingZeros', () => {
    it('removes unnecessary leading zeros from whole numbers', () => {
        expect(trimLeadingZeros('00012')).toBe('12');
    });

    it('preserves one zero when the integer portion is all zeros', () => {
        expect(trimLeadingZeros('000')).toBe('0');
    });

    it('preserves one zero before the fractional portion', () => {
        expect(trimLeadingZeros('000.5')).toBe('0.5');
    });

    it('preserves an incomplete decimal value', () => {
        expect(trimLeadingZeros('.5')).toBe('.5');
    });

    it('trims zeros after a leading minus sign when negative values are enabled', () => {
        expect(
            trimLeadingZeros('-00012', {
                allowNegative: true,
            })
        ).toBe('-12');
    });

    it('supports a custom decimal separator', () => {
        expect(
            trimLeadingZeros('000,5', {
                decimalSeparator: ',',
            })
        ).toBe('0,5');
    });
});
