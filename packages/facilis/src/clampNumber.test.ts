import { describe, expect, it } from 'vitest';
import clampNumber from './clampNumber';

describe('clampNumber', () => {
    it('clamps values below the configured minimum', () => {
        expect(clampNumber('-5', { min: 0 })).toBe('0');
    });

    it('clamps values above the configured maximum', () => {
        expect(clampNumber('150', { max: 100 })).toBe('100');
    });

    it('preserves values within the configured bounds', () => {
        expect(clampNumber('9.5', { max: 10 })).toBe('9.5');
    });

    it('preserves incomplete number values', () => {
        expect(clampNumber('')).toBe('');
        expect(clampNumber('-')).toBe('-');
        expect(clampNumber('.')).toBe('.');
        expect(clampNumber('-.')).toBe('-.');
        expect(clampNumber('12.', { max: 10 })).toBe('12.');
    });

    it('supports a custom decimal separator', () => {
        expect(
            clampNumber('0,4', {
                decimalSeparator: ',',
                min: 0.5,
            })
        ).toBe('0,5');
    });
});
