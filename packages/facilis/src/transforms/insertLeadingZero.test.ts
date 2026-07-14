import { describe, expect, it } from 'vitest';
import insertLeadingZero from './insertLeadingZero';

describe('insertLeadingZero', () => {
    it('inserts a leading zero before a decimal-only value', () => {
        expect(insertLeadingZero('.5')).toBe('0.5');
    });

    it('inserts a leading zero after a minus sign when negative values are enabled', () => {
        expect(
            insertLeadingZero('-.5', {
                allowNegative: true,
            })
        ).toBe('-0.5');
    });

    it('supports a custom decimal separator', () => {
        expect(
            insertLeadingZero(',5', {
                decimalSeparator: ',',
            })
        ).toBe('0,5');
    });

    it('leaves incomplete decimal values unchanged', () => {
        expect(insertLeadingZero('.')).toBe('.');
        expect(
            insertLeadingZero('-.', {
                allowNegative: true,
            })
        ).toBe('-.');
    });
});
