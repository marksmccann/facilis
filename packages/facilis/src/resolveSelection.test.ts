import { describe, expect, it } from 'vitest';
import resolveSelection from './resolveSelection';
import type { FormatDefinition } from './types';

describe('resolveSelection', () => {
    it('maps a selection through normalization and formatting boundaries', () => {
        const definition: FormatDefinition = {
            name: 'selection-map',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        expect(
            resolveSelection(
                definition,
                {
                    value: 'a1b',
                    selectionStart: 3,
                    selectionEnd: 3,
                },
                {
                    value: 'a1bc',
                    selectionStart: 1,
                    selectionEnd: 4,
                },
                {
                    normalizedValue: 'ABC',
                    formattedValue: '[A][B][C]',
                    edit: {
                        kind: 'insert',
                        inputType: 'insertText',
                        previous: {
                            value: 'a1b',
                            selectionStart: 3,
                            selectionEnd: 3,
                        },
                        current: {
                            value: 'a1bc',
                            selectionStart: 4,
                            selectionEnd: 4,
                        },
                    },
                    rawToNormalized: [0, 1, 1, 2, 3],
                    normalizedToFormatted: [0, 3, 6, 9],
                },
            )
        ).toEqual({
            selectionStart: 3,
            selectionEnd: 9,
        });
    });

    it('preserves null selection boundaries', () => {
        const definition: FormatDefinition = {
            name: 'null-selection',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        expect(
            resolveSelection(
                definition,
                {
                    value: 'ab',
                    selectionStart: null,
                    selectionEnd: null,
                },
                {
                    value: 'ab',
                    selectionStart: null,
                    selectionEnd: null,
                },
                {
                    normalizedValue: 'ab',
                    formattedValue: 'ab',
                    edit: {
                        kind: 'unknown',
                        inputType: null,
                        previous: {
                            value: 'ab',
                            selectionStart: null,
                            selectionEnd: null,
                        },
                        current: {
                            value: 'ab',
                            selectionStart: null,
                            selectionEnd: null,
                        },
                    },
                    rawToNormalized: [0, 1, 2],
                    normalizedToFormatted: [0, 1, 2],
                },
            )
        ).toEqual({
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('clamps out-of-range boundaries to the last known formatted boundary', () => {
        const definition: FormatDefinition = {
            name: 'clamp-selection',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        expect(
            resolveSelection(
                definition,
                {
                    value: 'ab',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                {
                    value: 'ab',
                    selectionStart: 99,
                    selectionEnd: 99,
                },
                {
                    normalizedValue: 'ab',
                    formattedValue: '[a][b]',
                    edit: {
                        kind: 'unknown',
                        inputType: null,
                        previous: {
                            value: 'ab',
                            selectionStart: 2,
                            selectionEnd: 2,
                        },
                        current: {
                            value: 'ab',
                            selectionStart: 2,
                            selectionEnd: 2,
                        },
                    },
                    rawToNormalized: [0, 1, 2],
                    normalizedToFormatted: [0, 4, 8],
                },
            )
        ).toEqual({
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('applies the optional select override after resolving the default selection', () => {
        const definition: FormatDefinition = {
            name: 'select-override',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(`[${character}]`);
                state.advance();
            },
            select(context) {
                expect(context.resolvedSelection).toEqual({
                    selectionStart: 9,
                    selectionEnd: 9,
                });

                return {
                    selectionStart: 1,
                    selectionEnd: 1,
                };
            },
        };

        expect(
            resolveSelection(
                definition,
                {
                    value: 'ab',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                {
                    value: 'abc',
                    selectionStart: 3,
                    selectionEnd: 3,
                },
                {
                    normalizedValue: 'abc',
                    formattedValue: '[a][b][c]',
                    edit: {
                        kind: 'insert',
                        inputType: 'insertText',
                        previous: {
                            value: 'ab',
                            selectionStart: 2,
                            selectionEnd: 2,
                        },
                        current: {
                            value: 'abc',
                            selectionStart: 3,
                            selectionEnd: 3,
                        },
                    },
                    rawToNormalized: [0, 1, 2, 3],
                    normalizedToFormatted: [0, 3, 6, 9],
                }
            )
        ).toEqual({
            selectionStart: 1,
            selectionEnd: 1,
        });
    });
});
