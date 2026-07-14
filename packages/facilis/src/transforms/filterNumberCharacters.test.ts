import { describe, expect, it } from 'vitest';
import filterNumberCharacters from './filterNumberCharacters';

describe('filterNumberCharacters', () => {
    it('keeps digits in the order they appear', () => {
        expect(filterNumberCharacters('1a2b3')).toBe('123');
    });

    it('keeps decimal separators', () => {
        expect(
            filterNumberCharacters('1,2,3', {
                decimalSeparator: ',',
            })
        ).toBe('1,2,3');
    });

    it('keeps minus signs', () => {
        expect(filterNumberCharacters('a-1-2')).toBe('-1-2');
    });

    it('removes non-number characters', () => {
        expect(filterNumberCharacters('$1a2-b3.4')).toBe('12-3.4');
    });
});
