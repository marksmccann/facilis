import { describe, expect, it } from 'vitest';
import runBlur from './runBlur';
import type { FormatDefinition } from './types';

describe('runBlur', () => {
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

        expect(runBlur(definition, 'AB')).toEqual({
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

        expect(runBlur(definition, 'AB')).toEqual({
            blurredValue: '<AB>',
        });
    });
});
