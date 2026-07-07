import { describe, expect, it } from 'vitest';
import resolveValue from './resolveValue';
import type { FormatDefinition } from './types';

describe('resolveValue', () => {
    it('runs normalize and format together and returns both boundary maps', () => {
        const definition: FormatDefinition = {
            name: 'letters-only',
            normalize(character, state) {
                if (/[a-z]/i.test(character)) {
                    state.append(character.toUpperCase());
                }
            },
            format(character, state) {
                state.append(`[${character}]`);
                state.advance();
            },
        };

        expect(
            resolveValue(
                definition,
                'insertText',
                {
                    value: 'a1',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                {
                    value: 'a1b',
                    selectionStart: 3,
                    selectionEnd: 3,
                }
            )
        ).toEqual({
            normalizedValue: 'AB',
            formattedValue: '[A][B]',
            edit: {
                kind: 'insert',
                inputType: 'insertText',
                previous: {
                    value: 'a1',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                current: {
                    value: 'a1b',
                    selectionStart: 3,
                    selectionEnd: 3,
                },
            },
            rawToNormalized: [0, 1, 1, 2],
            normalizedToFormatted: [0, 3, 6],
        });
    });

    it('exposes the current normalized value while normalizing', () => {
        const seen: string[] = [];
        const definition: FormatDefinition = {
            name: 'normalize-snapshot',
            normalize(character, state) {
                seen.push(`${state.index}:${state.normalized}`);
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        const result = resolveValue(
            definition,
            null,
            {
                value: 'abc',
                selectionStart: null,
                selectionEnd: null,
            },
            {
                value: 'abc',
                selectionStart: null,
                selectionEnd: null,
            }
        );

        expect(seen).toEqual(['0:', '1:a', '2:ab']);
        expect(result.rawToNormalized).toEqual([0, 1, 2, 3]);
    });

    it('supports setting the normalized value in progress', () => {
        const definition: FormatDefinition = {
            name: 'set-normalized',
            normalize(character, state) {
                if (character === '#') {
                    state.set('!');
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
            resolveValue(
                definition,
                null,
                {
                    value: 'ab#c',
                    selectionStart: null,
                    selectionEnd: null,
                },
                {
                    value: 'ab#c',
                    selectionStart: null,
                    selectionEnd: null,
                }
            )
        ).toEqual(
            expect.objectContaining({
                normalizedValue: '!c',
                rawToNormalized: [0, 1, 2, 1, 2],
                formattedValue: '!c',
                normalizedToFormatted: [0, 1, 2],
            })
        );
    });

    it('exposes formatted output built so far while formatting', () => {
        const seen: string[] = [];
        const definition: FormatDefinition = {
            name: 'format-snapshot',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                seen.push(`${state.index}:${state.formatted}`);
                state.append(character);
                state.advance();
            },
        };

        const result = resolveValue(
            definition,
            null,
            {
                value: 'abc',
                selectionStart: null,
                selectionEnd: null,
            },
            {
                value: 'abc',
                selectionStart: null,
                selectionEnd: null,
            }
        );

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

        const result = resolveValue(
            definition,
            null,
            {
                value: 'abc',
                selectionStart: null,
                selectionEnd: null,
            },
            {
                value: 'abc',
                selectionStart: null,
                selectionEnd: null,
            }
        );

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

        expect(
            resolveValue(
                definition,
                null,
                {
                    value: 'AB',
                    selectionStart: null,
                    selectionEnd: null,
                },
                {
                    value: 'AB',
                    selectionStart: null,
                    selectionEnd: null,
                }
            )
        ).toEqual(
            expect.objectContaining({
                formattedValue: 'A-B-',
                normalizedToFormatted: [0, 2, 4],
            })
        );
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

        expect(
            () =>
                resolveValue(
                    definition,
                    null,
                    {
                        value: 'A',
                        selectionStart: null,
                        selectionEnd: null,
                    },
                    {
                        value: 'A',
                        selectionStart: null,
                        selectionEnd: null,
                    }
                )
        ).toThrow(
            '[facilis] ERR01: Format state `advance` requires a non-negative amount, but received -1.'
        );
    });
});
