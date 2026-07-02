import { describe, expect, it } from 'vitest';
import runInputPipeline from './runInputPipeline';
import type { FormatDefinition } from './types';

describe('runInputPipeline', () => {
    it('maps the current selection through normalization and formatting', () => {
        const definition: FormatDefinition = {
            name: 'selection-map',
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
            runInputPipeline(
                definition,
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
            runInputPipeline(
                definition,
                null,
                {
                    value: 'ab',
                    selectionStart: null,
                    selectionEnd: null,
                },
                {
                    value: 'ab',
                    selectionStart: null,
                    selectionEnd: null,
                }
            )
        ).toEqual({
            value: 'ab',
            selectionStart: null,
            selectionEnd: null,
        });
    });
});
