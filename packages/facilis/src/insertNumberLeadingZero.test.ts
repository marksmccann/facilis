import { describe, expect, it } from 'vitest';
import insertNumberLeadingZero from './insertNumberLeadingZero';

describe('insertNumberLeadingZero', () => {
    it('inserts a leading zero before a decimal-only value', () => {
        expect(insertNumberLeadingZero('.5')).toBe('0.5');
    });

    it('inserts a leading zero after a minus sign when negative values are enabled', () => {
        expect(
            insertNumberLeadingZero('-.5', {
                allowNegative: true,
            })
        ).toBe('-0.5');
    });

    it('supports a custom decimal separator', () => {
        expect(
            insertNumberLeadingZero(',5', {
                decimalSeparator: ',',
            })
        ).toBe('0,5');
    });

    it('leaves incomplete decimal values unchanged', () => {
        expect(insertNumberLeadingZero('.')).toBe('.');
        expect(
            insertNumberLeadingZero('-.', {
                allowNegative: true,
            })
        ).toBe('-.');
    });
});
