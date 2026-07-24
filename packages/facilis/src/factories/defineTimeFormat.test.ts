import { describe, expect, it } from 'vitest';
import defineTimeFormat from './defineTimeFormat';
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

describe('defineTimeFormat', () => {
    it('formats digits into the configured time pattern', () => {
        const format = defineTimeFormat({
            pattern: 'HH:mm:ss',
        });

        expect(format.formatValue('143005')).toBe('14:30:05');
    });

    it('applies leading-zero and strict time options before formatting', () => {
        const format = defineTimeFormat({
            insertLeadingZero: true,
            pattern: 'HH:mm',
            strictTimeParts: true,
        });

        expect(format.formatValue('306')).toBe('03:06');
        expect(format.formatValue('29')).toBe('2');
    });

    it('validates required and supported options', () => {
        expect(() =>
            defineTimeFormat(
                undefined as unknown as Parameters<typeof defineTimeFormat>[0]
            )
        ).toThrow(/ERR09/);
        expect(() =>
            defineTimeFormat({
                pattern: 'HH',
            } as unknown as Parameters<typeof defineTimeFormat>[0])
        ).toThrow(/ERR10/);
        expect(() =>
            defineTimeFormat({
                pattern: 'HH:mm',
                separator: '/',
            } as unknown as Parameters<typeof defineTimeFormat>[0])
        ).toThrow(/ERR11/);
    });

    it('passes built-in append state and resolved config to factory hooks', () => {
        const contexts: unknown[] = [];
        const nextStates: TextState[] = [];
        const format = defineTimeFormat({
            pattern: 'HH:mm',
            separator: '.',
            append(next, context) {
                nextStates.push(next);
                contexts.push(context);
                return next;
            },
        });

        append(format, '14', '.');

        expect(nextStates[0]).toEqual(state('14.', 3));
        expect(contexts[0]).toMatchObject({
            intent: 'append',
            previous: '14',
            attempted: '14.',
            appended: '.',
            pattern: 'HH:mm',
            separator: '.',
            strictTimeParts: false,
        });
    });
});
