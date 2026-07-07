import { describe, expect, it } from 'vitest';
import resolveBlur from './resolveBlur';
import type { FormatDefinition } from './types';

describe('resolveBlur', () => {
    it('returns the formatted value unchanged when no blur stage exists', () => {
        const definition: FormatDefinition = {
            name: 'no-blur',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        };

        expect(resolveBlur(definition, {
            normalizedValue: 'AB',
            formattedValue: 'AB',
            edit: {
                kind: 'unknown',
                inputType: null,
                previous: {
                    value: 'AB',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                current: {
                    value: 'AB',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
            },
            rawToNormalized: [0, 1, 2],
            normalizedToFormatted: [0, 1, 2],
        })).toEqual({
            blurredValue: 'AB',
        });
    });

    it('passes the formatted value to the blur stage', () => {
        const definition: FormatDefinition = {
            name: 'with-blur',
            normalize(character, state) {
                state.append(character);
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
            blur(context) {
                return `<${context.formattedValue}>`;
            },
        };

        expect(resolveBlur(definition, {
            normalizedValue: 'AB',
            formattedValue: 'AB',
            edit: {
                kind: 'unknown',
                inputType: null,
                previous: {
                    value: 'AB',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                current: {
                    value: 'AB',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
            },
            rawToNormalized: [0, 1, 2],
            normalizedToFormatted: [0, 1, 2],
        })).toEqual({
            blurredValue: '<AB>',
        });
    });
});
