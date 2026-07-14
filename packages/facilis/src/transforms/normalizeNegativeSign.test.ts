import { describe, expect, it } from 'vitest';
import normalizeNegativeSign from './normalizeNegativeSign';

describe('normalizeNegativeSign', () => {
    it('removes minus signs when negatives are not supported', () => {
        expect(normalizeNegativeSign('-12-3')).toBe('123');
    });

    it('keeps one leading minus sign when negatives are supported', () => {
        expect(
            normalizeNegativeSign('-12-3', {
                allowNegative: true,
            })
        ).toBe('-123');
    });

    it('removes non-leading minus signs when negatives are supported', () => {
        expect(
            normalizeNegativeSign('1-2-3', {
                allowNegative: true,
            })
        ).toBe('123');
    });
});
