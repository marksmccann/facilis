import { describe, expect, it } from 'vitest';
import { buildText } from './buildText';

describe('buildText', () => {
    it('builds text by concatenating each item result', () => {
        expect(buildText(['a', 'b', 'c'], (character) => character)).toBe(
            'abc'
        );
    });

    it('passes the current built text into the callback', () => {
        expect(
            buildText(['a', 'b', 'c'], (character, context) => {
                if (context.builtText === '') {
                    return character.toUpperCase();
                }

                return context.builtText === 'A' ? `-${character}` : character;
            })
        ).toBe('A-bc');
    });
});
