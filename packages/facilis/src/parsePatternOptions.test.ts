import { describe, expect, it } from 'vitest';
import { parsePatternOptions } from './parsePatternOptions';

describe('parsePatternOptions', () => {
    it('parses token and literal parts from one pattern definition', () => {
        expect(
            parsePatternOptions({
                pattern: '(###) ###-####',
                tokens: {
                    '#': { matches: /\d/ },
                },
            })
        ).toEqual([
            { kind: 'literal', character: '(' },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'literal', character: ')' },
            { kind: 'literal', character: ' ' },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'literal', character: '-' },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
            { kind: 'token', symbol: '#', definition: { matches: /\d/ } },
        ]);
    });

    it('fails when the pattern string is empty', () => {
        expect(() =>
            parsePatternOptions({
                pattern: '',
                tokens: {
                    '#': { matches: /\d/ },
                },
            })
        ).toThrowError(
            '[facilis] ERR01: Pattern formats require a non-empty pattern string.'
        );
    });
});
