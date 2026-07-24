import { describe, expect, it } from 'vitest';
import definePatternFormat from './definePatternFormat';
import type { Format } from '../types/format';
import type { TextState } from '../types/input';

const digitTokens = {
    '#': { matches: /\d/g },
};

function state(
    value: string,
    selectionStart = value.length,
    selectionEnd = selectionStart
): TextState {
    return { value, selectionStart, selectionEnd };
}

function append(format: Format, previous: string, text: string) {
    const attempted = previous + text;

    return format.onInput(
        { inputType: 'insertText', data: text },
        state(previous),
        state(attempted)
    );
}

describe('definePatternFormat', () => {
    it('fills token slots and inserts literal pattern text', () => {
        const format = definePatternFormat({
            pattern: '##-##',
            tokens: digitTokens,
        });

        expect(format.formatValue('1a2b3c4')).toBe('12-34');
    });

    it('requires a non-empty pattern with token definitions', () => {
        expect(() =>
            definePatternFormat({
                pattern: '',
                tokens: digitTokens,
            })
        ).toThrow(/ERR01/);

        expect(() =>
            definePatternFormat({
                pattern: '##',
                tokens: {},
            })
        ).toThrow(/ERR02/);
    });

    it('requires single-character token keys and at least one token slot', () => {
        expect(() =>
            definePatternFormat({
                pattern: '##',
                tokens: {
                    token: { matches: /\d/ },
                },
            })
        ).toThrow(/ERR03/);

        expect(() =>
            definePatternFormat({
                pattern: '--',
                tokens: digitTokens,
            })
        ).toThrow(/ERR04/);
    });

    it('passes built-in append results and config to factory hooks', () => {
        const contexts: unknown[] = [];
        const nextStates: TextState[] = [];
        const format = definePatternFormat({
            pattern: '##/##',
            tokens: digitTokens,
            append(next, context) {
                nextStates.push(next);
                contexts.push(context);
                return next;
            },
        });

        append(format, '12', 'x');

        expect(nextStates[0]).toEqual(state('12/', 3));
        expect(contexts[0]).toMatchObject({
            intent: 'append',
            previous: '12',
            attempted: '12x',
            appended: 'x',
            pattern: '##/##',
            tokens: digitTokens,
        });
        expect('resolved' in (contexts[0] as object)).toBe(false);
    });
});
