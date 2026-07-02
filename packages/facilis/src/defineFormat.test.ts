import { describe, expect, it } from 'vitest';
import { defineFormat } from './defineFormat';

describe('defineFormat', () => {
    it('runs the formatting pipeline on mount', () => {
        const format = defineFormat({
            name: 'mount-pipeline',
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
            format.onMount({
                value: 'a1b',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            value: '[A][B]',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

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

        const result = format.onInput(
            null,
            {
                value: 'a1',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                value: 'a1b',
                selectionStart: 2,
                selectionEnd: 2,
            }
        );

        expect(result).toEqual({
            value: '[A][B]',
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

        const result = format.onInput(
            null,
            {
                value: 'ab#',
                selectionStart: 3,
                selectionEnd: 3,
            },
            {
                value: 'ab#c',
                selectionStart: 4,
                selectionEnd: 4,
            }
        );

        expect(result).toEqual({
            value: '!c',
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
            format.onInput(
                null,
                {
                    value: '',
                    selectionStart: null,
                    selectionEnd: null,
                },
                {
                    value: 'ab',
                    selectionStart: null,
                    selectionEnd: null,
                }
            ).value
        ).toBe('0:a1:b');

        expect(
            format.onInput(null, {
                value: 'ab',
                selectionStart: null,
                selectionEnd: null,
            }, {
                value: 'c',
                selectionStart: null,
                selectionEnd: null,
            }).value
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
            value: '[1][2]',
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
            format.onInput(
                null,
                {
                    value: 'a1b',
                    selectionStart: 1,
                    selectionEnd: 3,
                },
                {
                    value: 'a1bc',
                    selectionStart: 1,
                    selectionEnd: 4,
                }
            )
        ).toEqual({
            value: '[A][B][C]',
            selectionStart: 3,
            selectionEnd: 9,
        });
    });

    it('exposes the normalized edit transition while normalizing', () => {
        let seenEdit: string | null = null;

        const format = defineFormat({
            name: 'edit-state',
            normalize(character, state) {
                if (state.index === 0) {
                    seenEdit = [
                        state.edit.kind,
                        state.edit.previous.value,
                        String(state.edit.previous.selectionStart),
                        String(state.edit.previous.selectionEnd),
                    ].join('|');
                }

                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        });

        format.onInput(
            'deleteContentBackward',
            {
                value: '1/2',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                value: '12',
                selectionStart: 1,
                selectionEnd: 1,
            }
        );

        expect(seenEdit).toBe('delete-backward|1/2|2|2');
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
            value: '<AB>',
            selectionStart: null,
            selectionEnd: null,
        });
    });
});
