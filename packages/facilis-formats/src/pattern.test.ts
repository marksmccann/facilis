import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { pattern } from './pattern';

describe('pattern', () => {
    it('fills token slots in order and inserts literals', () => {
        const input = setupInput(pattern('###-##'));

        expect(input.type('12345')).toEqual(textState('123-45', 6));
    });

    it('ignores raw characters that do not match the next token slot', () => {
        const input = setupInput(pattern('###-##'));

        expect(input.type('12a34')).toEqual(textState('123-4', 5));
    });

    it('supports explicit token definitions for mixed token types', () => {
        const input = setupInput(
            pattern({
                pattern: '##-AA',
                tokens: {
                    '#': { matches: /\d/ },
                    A: { matches: /[A-Z]/i },
                },
            })
        );

        expect(input.type('1a2Bc')).toEqual(textState('12-Bc', 5));
    });

    it('supports built-in alpha tokens', () => {
        const input = setupInput(pattern('aa-####'));

        expect(input.type('AB12CD34')).toEqual(textState('AB-1234', 7));
    });

    it('uses the same value pipeline on blur and clears selection', () => {
        const input = setupInput(pattern('###-##'));

        expect(input.blur('12a34', 1, 4)).toEqual(textState('123-4', null));
    });

    it('inserts a literal run when any character is typed at its boundary', () => {
        const input = setupInput(pattern('##/##'));

        expect(input.append('12', 'x')).toEqual(textState('12/', 3));
    });

    it('keeps typed literals when they match the next literal run', () => {
        const input = setupInput(pattern('##/##'));

        expect(input.append('12', '/')).toEqual(textState('12/', 3));
    });

    it('inserts the next token too when the typed character matches it', () => {
        const input = setupInput(pattern('##/##'));

        expect(input.append('12', '3')).toEqual(textState('12/3', 4));
    });

    it('rejects a duplicate pending literal run', () => {
        const input = setupInput(pattern('##/##'));

        expect(input.append('12/', '/')).toEqual(textState('12/', 3));
    });

    it('rejects a middle token insertion when the pattern is already full', () => {
        const input = setupInput(pattern('##/##'));

        expect(input.insert('12/34', '9', 2)).toEqual(textState('12/34', 2));
    });

    it('deletes a trailing literal run at the end', () => {
        const input = setupInput(pattern('(###) ###-####'));

        expect(input.delete('(123) ')).toEqual(textState('(123', 4));
    });

    it('moves delete selection before a middle literal run', () => {
        const input = setupInput(pattern('(###) ###-####'));

        expect(input.delete('(123) 456-7890', 6)).toEqual(
            textState('(123) 456-7890', 4)
        );
    });

    it('trims trailing literals left behind after deleting the last token', () => {
        const input = setupInput(pattern('(###) ###-####'));

        expect(input.delete('(555) 5')).toEqual(textState('(555', 4));
    });
});
