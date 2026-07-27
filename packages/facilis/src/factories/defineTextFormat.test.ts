import { describe, expect, it } from 'vitest';
import defineTextFormat from './defineTextFormat';
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

describe('defineTextFormat', () => {
    it('filters, transforms, and limits normalized text', () => {
        const format = defineTextFormat({
            matches: /[a-z]/i,
            maxLength: 3,
            transform: 'uppercase',
        });

        expect(format.formatValue('a1bcD')).toBe('ABC');
    });

    it('preserves all characters when matches is omitted', () => {
        const format = defineTextFormat({
            maxLength: 4,
            transform: 'lowercase',
        });

        expect(format.formatValue('AB12CD')).toBe('ab12');
    });

    it('passes resolved text config to normalize, format, and blur hooks', () => {
        const contexts: unknown[] = [];
        const format = defineTextFormat({
            maxLength: 4,
            transform: 'uppercase',
            normalize(resolved, context) {
                contexts.push({ stage: 'normalize', resolved, context });
                return resolved;
            },
            format(resolved, context) {
                contexts.push({ stage: 'format', resolved, context });
                return resolved;
            },
            blur(resolved, context) {
                contexts.push({ stage: 'blur', resolved, context });
                return resolved;
            },
        });

        expect(format.formatValue('ab12cd')).toBe('AB12');
        expect(contexts).toMatchObject([
            {
                stage: 'normalize',
                resolved: 'AB12',
                context: {
                    maxLength: 4,
                    raw: 'ab12cd',
                    transform: 'uppercase',
                },
            },
            {
                stage: 'format',
                resolved: 'AB12',
                context: {
                    maxLength: 4,
                    normalized: 'AB12',
                    transform: 'uppercase',
                },
            },
            {
                stage: 'blur',
                resolved: 'AB12',
                context: {
                    formatted: 'AB12',
                    maxLength: 4,
                    transform: 'uppercase',
                },
            },
        ]);
    });

    it('passes built-in append state and config to factory hooks', () => {
        const contexts: unknown[] = [];
        const nextStates: TextState[] = [];
        const format = defineTextFormat({
            maxLength: 3,
            transform: 'uppercase',
            append(next, context) {
                nextStates.push(next);
                contexts.push(context);
                return next;
            },
        });

        append(format, 'AB', 'c');

        expect(nextStates[0]).toEqual(state('ABC', 3));
        expect(contexts[0]).toMatchObject({
            intent: 'append',
            previous: 'AB',
            attempted: 'ABc',
            appended: 'c',
            maxLength: 3,
            transform: 'uppercase',
            normalized: {
                previous: 'AB',
                attempted: 'ABC',
                appended: 'C',
            },
        });
        expect('resolved' in (contexts[0] as object)).toBe(false);
    });
});
