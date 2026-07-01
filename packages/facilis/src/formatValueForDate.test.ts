import { describe, expect, it } from 'vitest';
import { formatValueForDate } from './formatValueForDate';

describe('formatValueForDate', () => {
    it('returns an empty string when the normalized value is empty', () => {
        expect(
            formatValueForDate('', {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toBe('');
    });

    it('formats a partial full date as digits are added', () => {
        expect(
            formatValueForDate('123', {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toBe('12/3');
    });

    it('formats a complete full date with the default separator', () => {
        expect(
            formatValueForDate('12312026', {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toBe('12/31/2026');
    });

    it('formats a partial month-year value with a custom separator', () => {
        expect(
            formatValueForDate('123', {
                patternSegments: ['MM', 'YY'],
                separator: '-',
            })
        ).toBe('12-3');
    });

    it('formats a year-month value with a custom separator', () => {
        expect(
            formatValueForDate('202401', {
                patternSegments: ['YYYY', 'MM'],
                separator: '.',
            })
        ).toBe('2024.01');
    });

    it('pads a safe single-digit month and preserves the next digit for the following segment', () => {
        expect(
            formatValueForDate('23', {
                insertLeadingZero: true,
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toBe('02/3');
    });
});
