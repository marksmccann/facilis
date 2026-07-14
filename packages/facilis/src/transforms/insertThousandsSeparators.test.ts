import { describe, expect, it } from 'vitest';
import insertThousandsSeparators from './insertThousandsSeparators';

describe('insertThousandsSeparators', () => {
    it('groups the whole portion into thousands', () => {
        expect(insertThousandsSeparators('12345')).toBe('12,345');
    });

    it('leaves the fractional portion unchanged', () => {
        expect(
            insertThousandsSeparators('12345.67', {
                decimalSeparator: '.',
            })
        ).toBe('12,345.67');
    });

    it('supports custom separators', () => {
        expect(
            insertThousandsSeparators('12345,67', {
                decimalSeparator: ',',
                thousandsSeparator: '.',
            })
        ).toBe('12.345,67');
    });

    it('preserves a leading minus sign', () => {
        expect(
            insertThousandsSeparators('-12345', {
                allowNegative: true,
            })
        ).toBe('-12,345');
    });

    it('returns the original value when thousands separators are disabled', () => {
        expect(
            insertThousandsSeparators('12345.67', {
                thousandsSeparator: '',
            })
        ).toBe('12345.67');
    });
});
