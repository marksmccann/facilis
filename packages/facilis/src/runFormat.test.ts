import { describe, expect, it } from 'vitest';
import runFormat from './runFormat';
import type { FormatDefinition } from './types';

describe('runFormat', () => {
    it('builds a formatted value by appending visible text', () => {
        const definition: FormatDefinition = {
            name: 'wrapped',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(`[${character}]`);
                state.advance();
            },
        };

        expect(runFormat(definition, 'AB')).toEqual({
            formattedValue: '[A][B]',
            normalizedToFormatted: [0, 3, 6],
        });
    });

    it('exposes formatted output built so far while iterating', () => {
        const seen: string[] = [];
        const definition: FormatDefinition = {
            name: 'snapshot',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                seen.push(`${state.index}:${state.formatted}`);
                state.append(character);
                state.advance();
            },
        };

        const result = runFormat(definition, 'abc');

        expect(seen).toEqual(['0:', '1:a', '2:ab']);
        expect(result.normalizedToFormatted).toEqual([0, 1, 2, 3]);
    });

    it('tracks normalized position through advance calls', () => {
        const seen: number[] = [];
        const definition: FormatDefinition = {
            name: 'position',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                seen.push(state.normalizedPosition);
                state.append(character);
                state.advance(2);
            },
        };

        const result = runFormat(definition, 'abc');

        expect(seen).toEqual([0, 2, 4]);
        expect(result.normalizedToFormatted).toEqual([0, 1, 1, 2, 2, 3, 3]);
    });

    it('maps trailing literals to the advanced normalized boundary', () => {
        const definition: FormatDefinition = {
            name: 'trailing-literal',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
                state.append('-');
            },
        };

        expect(runFormat(definition, 'AB')).toEqual({
            formattedValue: 'A-B-',
            normalizedToFormatted: [0, 2, 4],
        });
    });

    it('fails when advance receives a negative amount', () => {
        const definition: FormatDefinition = {
            name: 'invalid-advance',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance(-1);
            },
        };

        expect(() => runFormat(definition, 'A')).toThrow(
            '[facilis] ERR01: Format state `advance` requires a non-negative amount, but received -1.'
        );
    });
});
