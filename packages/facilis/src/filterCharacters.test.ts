import { describe, expect, it } from 'vitest';
import { filterCharacters } from './filterCharacters';

describe('filterCharacters', () => {
    it('keeps only the characters marked for preservation', () => {
        expect(
            filterCharacters('1a2b3c', (character) => {
                return /\d/.test(character) ? 'keep' : 'discard';
            })
        ).toBe('123');
    });

    it('tracks the number of kept characters for the predicate', () => {
        expect(
            filterCharacters('a1b2c3d4', (character, context) => {
                if (context.keptCount >= 2) {
                    return 'discard';
                }

                return /\d/.test(character) ? 'keep' : 'discard';
            })
        ).toBe('12');
    });

    it('stops once the predicate returns stop', () => {
        const visitedCharacters: string[] = [];

        expect(
            filterCharacters('123abc', (character, context) => {
                visitedCharacters.push(character);

                if (context.keptCount >= 2) {
                    return 'stop';
                }

                return 'keep';
            })
        ).toBe('12');
        expect(visitedCharacters).toEqual(['1', '2', '3']);
    });
});
