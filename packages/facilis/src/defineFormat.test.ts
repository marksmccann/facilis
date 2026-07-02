import { describe, expect, it } from 'vitest';
import { defineFormat } from './defineFormat';

describe('defineFormat', () => {
    it('normalizes raw input before formatting it', () => {
        const format = defineFormat({
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
        });

        const result = format.onInput({
            value: 'a1b',
            selectionStart: 2,
            selectionEnd: 2,
        });

        expect(result).toEqual({
            formattedValue: '[A][B]',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('supports replacing the normalized value while normalizing', () => {
        const format = defineFormat({
            name: 'replace-normalized',
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
        });

        const result = format.onInput({
            value: 'ab#c',
            selectionStart: 4,
            selectionEnd: 4,
        });

        expect(result).toEqual({
            formattedValue: '!c',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('creates isolated format instances', () => {
        const format = defineFormat({
            name: 'isolated',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(`${state.index}:${character}`);
                state.advance();
            },
        });

        expect(
            format.onInput({
                value: 'ab',
                selectionStart: null,
                selectionEnd: null,
            }).formattedValue
        ).toBe('0:a1:b');

        expect(
            format.onInput({
                value: 'c',
                selectionStart: null,
                selectionEnd: null,
            }).formattedValue
        ).toBe('0:c');
    });

    it('runs the same pipeline on blur before clearing selection', () => {
        const format = defineFormat({
            name: 'blur-pipeline',
            normalize(character, state) {
                if (/\d/.test(character)) {
                    state.append(character);
                }
            },
            format(character, state) {
                state.append(`[${character}]`);
                state.advance();
            },
        });

        expect(
            format.onBlur({
                value: 'a1b2',
                selectionStart: 1,
                selectionEnd: 3,
            })
        ).toEqual({
            formattedValue: '[1][2]',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('maps selection ranges through normalization and formatting', () => {
        const format = defineFormat({
            name: 'selection-range',
            normalize(character, state) {
                if (/[a-z]/i.test(character)) {
                    state.append(character.toUpperCase());
                }
            },
            format(character, state) {
                state.append(`[${character}]`);
                state.advance();
            },
        });

        expect(
            format.onInput({
                value: 'a1bc',
                selectionStart: 1,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: '[A][B][C]',
            selectionStart: 3,
            selectionEnd: 9,
        });
    });

    it('runs the blur stage on blur when one exists', () => {
        const format = defineFormat({
            name: 'blur-on-blur',
            normalize(character, state) {
                if (/[a-z]/i.test(character)) {
                    state.append(character.toUpperCase());
                }
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
            blur(context) {
                return `<${context.formattedValue}>`;
            },
        });

        expect(
            format.onBlur({
                value: 'ab1',
                selectionStart: 0,
                selectionEnd: 2,
            })
        ).toEqual({
            formattedValue: '<AB>',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('removes a reinserted literal run on backspace when edit context is provided', () => {
        const format = defineFormat({
            name: 'literal-delete-backward',
            normalize(character, state) {
                if (/\d/.test(character)) {
                    state.append(character);
                }
            },
            format(character, state) {
                state.append(character);
                state.advance();

                if (state.index === 1) {
                    state.append('/ ');
                }
            },
        });

        expect(
            format.onInput({
                value: '1234',
                selectionStart: 3,
                selectionEnd: 3,
                inputType: 'deleteContentBackward',
                previousValue: '12/ 34',
                previousSelectionStart: 4,
                previousSelectionEnd: 4,
            })
        ).toEqual({
            formattedValue: '1234',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('removes a reinserted literal run on forward delete when edit context is provided', () => {
        const format = defineFormat({
            name: 'literal-delete-forward',
            normalize(character, state) {
                if (/\d/.test(character)) {
                    state.append(character);
                }
            },
            format(character, state) {
                state.append(character);
                state.advance();

                if (state.index === 1) {
                    state.append('/ ');
                }
            },
        });

        expect(
            format.onInput({
                value: '1234',
                selectionStart: 2,
                selectionEnd: 2,
                inputType: 'deleteContentForward',
                previousValue: '12/ 34',
                previousSelectionStart: 2,
                previousSelectionEnd: 2,
            })
        ).toEqual({
            formattedValue: '1234',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });
});
