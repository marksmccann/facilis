import { describe, expect, it } from 'vitest';
import insertNumberThousandsSeparators from './insertNumberThousandsSeparators';

describe('insertNumberThousandsSeparators', () => {
    it('groups the whole portion into thousands', () => {
        expect(insertNumberThousandsSeparators('12345')).toBe('12,345');
    });

    it('leaves the fractional portion unchanged', () => {
        expect(
            insertNumberThousandsSeparators('12345.67', {
                decimalSeparator: '.',
            })
        ).toBe('12,345.67');
    });

    it('supports custom separators', () => {
        expect(
            insertNumberThousandsSeparators('12345,67', {
                decimalSeparator: ',',
                thousandsSeparator: '.',
            })
        ).toBe('12.345,67');
    });

    it('preserves a leading minus sign', () => {
        expect(
            insertNumberThousandsSeparators('-12345', {
                allowNegative: true,
            })
        ).toBe('-12,345');
    });

    it('returns the original value when thousands separators are disabled', () => {
        expect(
            insertNumberThousandsSeparators('12345.67', {
                thousandsSeparator: '',
            })
        ).toBe('12345.67');
    });
});
