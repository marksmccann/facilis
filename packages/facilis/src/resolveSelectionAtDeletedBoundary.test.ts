import { describe, expect, it } from 'vitest';
import resolveSelectionAtDeletedBoundary from './resolveSelectionAtDeletedBoundary';

const normalizeDigits = (raw: string) => raw.replace(/\D/g, '');

describe('resolveSelectionAtDeletedBoundary', () => {
    it('resolves the first formatted boundary for the normalized deleted boundary', () => {
        expect(
            resolveSelectionAtDeletedBoundary({
                previous: '12,345',
                formatted: '1,345',
                start: 1,
                normalize: normalizeDigits,
            })
        ).toEqual({
            selectionStart: 1,
            selectionEnd: 1,
        });
    });

    it('accounts for formatting before the deleted boundary', () => {
        expect(
            resolveSelectionAtDeletedBoundary({
                previous: '$12,345',
                formatted: '$1,345',
                start: 2,
                normalize: normalizeDigits,
            })
        ).toEqual({
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('falls back to the end of the formatted value when no boundary matches', () => {
        expect(
            resolveSelectionAtDeletedBoundary({
                previous: 'abc',
                formatted: 'xy',
                start: 2,
                normalize: (raw) => raw,
            })
        ).toEqual({
            selectionStart: 2,
            selectionEnd: 2,
        });
    });
});
