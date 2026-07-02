import { describe, expect, it } from 'vitest';
import resolveSelectionBoundary from './resolveSelectionBoundary';

describe('resolveSelectionBoundary', () => {
    it('preserves null selection boundaries', () => {
        expect(resolveSelectionBoundary([0, 1, 2], null)).toBeNull();
    });

    it('returns the mapped boundary for in-range indexes', () => {
        expect(resolveSelectionBoundary([0, 1, 1, 2], 2)).toBe(1);
    });

    it('clamps oversized indexes to the last known boundary', () => {
        expect(resolveSelectionBoundary([0, 1, 1, 2], 10)).toBe(2);
    });
});
