import { describe, expect, it } from 'vitest';
import filterNumberCharacters from './filterNumberCharacters';

describe('filterNumberCharacters', () => {
    it('keeps digits in the order they appear', () => {
        expect(filterNumberCharacters('1a2-b3')).toBe('123');
    });

    it('preserves one configured decimal separator', () => {
        expect(
            filterNumberCharacters('1,2,3', {
                decimalPlaces: 2,
                decimalSeparator: ',',
            })
        ).toBe('1,23');
    });

    it('preserves the default decimal separator when decimal places are supported', () => {
        expect(
            filterNumberCharacters('1.2.3', {
                decimalPlaces: 2,
            })
        ).toBe('1.23');
    });

    it('filters decimal separators when decimal places are not supported', () => {
        expect(
            filterNumberCharacters('12.34', {
                decimalPlaces: 0,
            })
        ).toBe('1234');
    });

    it('preserves one leading minus sign when negative values are enabled', () => {
        expect(
            filterNumberCharacters('a-1-2', {
                allowNegative: true,
            })
        ).toBe('-12');
    });

    it('ignores minus signs after the first numeric character', () => {
        expect(
            filterNumberCharacters('1-2-3', {
                allowNegative: true,
            })
        ).toBe('123');
    });
});
