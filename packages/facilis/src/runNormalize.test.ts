import { describe, expect, it } from 'vitest';
import runNormalize from './runNormalize';
import type { FormatDefinition } from './types';

describe('runNormalize', () => {
    it('builds a normalized value by appending accepted characters', () => {
        const definition: FormatDefinition = {
            name: 'letters-only',
            normalize(character, state) {
                if (/[a-z]/i.test(character)) {
                    state.append(character.toUpperCase());
                }
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        expect(
            runNormalize(definition, {
                value: 'a1b',
                selectionStart: null,
                selectionEnd: null,
            })
        ).toEqual({
            normalizedValue: 'AB',
            rawToNormalized: [0, 1, 1, 2],
        });
    });

    it('exposes the current normalized value while iterating', () => {
        const seen: string[] = [];
        const definition: FormatDefinition = {
            name: 'snapshot',
            normalize(character, state) {
                seen.push(`${state.index}:${state.normalized}`);
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        const result = runNormalize(definition, {
            value: 'abc',
            selectionStart: null,
            selectionEnd: null,
        });

        expect(seen).toEqual(['0:', '1:a', '2:ab']);
        expect(result.rawToNormalized).toEqual([0, 1, 2, 3]);
    });

    it('supports replacing the normalized value in progress', () => {
        const definition: FormatDefinition = {
            name: 'replace',
            normalize(character, state) {
                if (character === '#') {
                    state.replace('!');
                    return;
                }

                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        expect(
            runNormalize(definition, {
                value: 'ab#c',
                selectionStart: null,
                selectionEnd: null,
            })
        ).toEqual({
            normalizedValue: '!c',
            rawToNormalized: [0, 1, 2, 1, 2],
        });
    });
});
