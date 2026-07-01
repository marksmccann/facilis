import { describe, expect, it } from 'vitest';
import { normalizeValueForDate } from './normalizeValueForDate';

describe('normalizeValueForDate', () => {
    it('keeps only digits for a month-year pattern', () => {
        expect(
            normalizeValueForDate('0a1/2b6', {
                patternSegments: ['MM', 'YY'],
            })
        ).toBe('0126');
    });

    it('trims the normalized value to the total digit length allowed by the pattern', () => {
        expect(
            normalizeValueForDate('12/31/20267', {
                patternSegments: ['MM', 'DD', 'YYYY'],
            })
        ).toBe('12312026');
    });

    it('uses the configured pattern segments rather than any separator characters in the raw value', () => {
        expect(
            normalizeValueForDate('2024-01abc', {
                patternSegments: ['YYYY', 'MM'],
            })
        ).toBe('202401');
    });

    it('preserves the next digit for the following segment when insertLeadingZero is enabled', () => {
        expect(
            normalizeValueForDate('23456789', {
                insertLeadingZero: true,
                patternSegments: ['MM', 'DD', 'YYYY'],
            })
        ).toBe('2345678');
    });
});
