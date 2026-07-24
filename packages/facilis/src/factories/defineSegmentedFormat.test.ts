import { describe, expect, it } from 'vitest';
import defineSegmentedFormat from './defineSegmentedFormat';
import type { Format } from '../types/format';
import type { TextState } from '../types/input';

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

describe('defineSegmentedFormat', () => {
    it('filters raw text and inserts literal segments', () => {
        const format = defineSegmentedFormat({
            matches: /\d/g,
            segments: [2, '-', 2],
        });

        expect(format.formatValue('a1b2c3')).toBe('12-3');
    });

    it('resolves dynamic segments from the normalized value', () => {
        const format = defineSegmentedFormat({
            matches: /\d/,
            segments(normalized) {
                return normalized.length > 4 ? [3, '-', 3] : [2, '-', 2];
            },
        });

        expect(format.formatValue('12345')).toBe('123-45');
    });

    it('accepts expected formatting typed at a segment boundary', () => {
        const format = defineSegmentedFormat({
            matches: /\d/,
            segments: [2, '/', 2],
        });

        expect(append(format, '12', '/')).toEqual(state('12/', 3));
    });

    it('passes built-in append results and config to factory hooks', () => {
        const contexts: unknown[] = [];
        const nextStates: TextState[] = [];
        const format = defineSegmentedFormat({
            matches: /\d/,
            segments: [2, '/', 2],
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
            segments: [2, '/', 2],
            normalized: {
                previous: '12',
                attempted: '12',
                appended: '',
            },
        });
        expect('resolved' in (contexts[0] as object)).toBe(false);
    });
});
