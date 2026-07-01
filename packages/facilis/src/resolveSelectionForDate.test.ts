import { describe, expect, it } from 'vitest';
import { resolveSelectionForDate } from './resolveSelectionForDate';

describe('resolveSelectionForDate', () => {
    it('keeps the cursor after each typed digit in a formatted full date', () => {
        expect(
            resolveSelectionForDate({
                rawValue: '1',
                rawSelectionStart: 1,
                rawSelectionEnd: 1,
                normalizedValue: '1',
                formattedValue: '1',
            }, {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 1,
            selectionEnd: 1,
        });

        expect(
            resolveSelectionForDate({
                rawValue: '12',
                rawSelectionStart: 2,
                rawSelectionEnd: 2,
                normalizedValue: '12',
                formattedValue: '12',
            }, {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 2,
            selectionEnd: 2,
        });

        expect(
            resolveSelectionForDate({
                rawValue: '123',
                rawSelectionStart: 3,
                rawSelectionEnd: 3,
                normalizedValue: '123',
                formattedValue: '12/3',
            }, {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 4,
            selectionEnd: 4,
        });

        expect(
            resolveSelectionForDate({
                rawValue: '12312026',
                rawSelectionStart: 8,
                rawSelectionEnd: 8,
                normalizedValue: '12312026',
                formattedValue: '12/31/2026',
            }, {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 10,
            selectionEnd: 10,
        });
    });

    it('ignores raw separators while mapping the cursor into the formatted value', () => {
        expect(
            resolveSelectionForDate({
                rawValue: '12-3',
                rawSelectionStart: 4,
                rawSelectionEnd: 4,
                normalizedValue: '123',
                formattedValue: '12/3',
            }, {
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('preserves selection ranges by digit count', () => {
        expect(
            resolveSelectionForDate({
                rawValue: '1231',
                rawSelectionStart: 1,
                rawSelectionEnd: 4,
                normalizedValue: '1231',
                formattedValue: '12/31',
            }, {
                patternSegments: ['MM', 'DD'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 1,
            selectionEnd: 5,
        });
    });

    it('keeps the cursor after a padded single-digit month', () => {
        expect(
            resolveSelectionForDate({
                rawValue: '2',
                rawSelectionStart: 1,
                rawSelectionEnd: 1,
                normalizedValue: '2',
                formattedValue: '02',
            }, {
                insertLeadingZero: true,
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('keeps the cursor after the following segment digit when a leading zero is inserted', () => {
        expect(
            resolveSelectionForDate({
                rawValue: '23',
                rawSelectionStart: 2,
                rawSelectionEnd: 2,
                normalizedValue: '23',
                formattedValue: '02/3',
            }, {
                insertLeadingZero: true,
                patternSegments: ['MM', 'DD', 'YYYY'],
                separator: '/',
            })
        ).toEqual({
            selectionStart: 4,
            selectionEnd: 4,
        });
    });
});
