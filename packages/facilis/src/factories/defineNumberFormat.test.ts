import { describe, expect, it } from 'vitest';
import defineNumberFormat from './defineNumberFormat';
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

function deleteBackward(
    format: Format,
    previous: string,
    cursor = previous.length
) {
    const current = previous.slice(0, cursor - 1) + previous.slice(cursor);

    return format.onInput(
        { inputType: 'deleteContentBackward', data: null },
        state(previous, cursor),
        state(current, cursor - 1)
    );
}

describe('defineNumberFormat', () => {
    it('normalizes, groups, inserts a leading zero, and pads on blur', () => {
        const format = defineNumberFormat({
            decimalPlaces: 2,
            insertLeadingZero: true,
            padDecimalPlaces: 2,
            thousandsSeparator: ',',
        });

        expect(format.formatValue('$1234.5')).toBe('1,234.50');
        expect(format.formatValue('.5')).toBe('0.50');
    });

    it('passes resolved config to normalize, format, and blur hooks', () => {
        const contexts: unknown[] = [];
        const format = defineNumberFormat({
            allowNegative: true,
            decimalPlaces: 2,
            decimalSeparator: ',',
            max: 10,
            min: -10,
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

        expect(format.formatValue('1,5')).toBe('1,5');
        expect(contexts).toMatchObject([
            {
                stage: 'normalize',
                resolved: '1,5',
                context: {
                    allowNegative: true,
                    decimalPlaces: 2,
                    decimalSeparator: ',',
                    max: 10,
                    min: -10,
                    raw: '1,5',
                },
            },
            {
                stage: 'format',
                resolved: '1,5',
                context: {
                    normalized: '1,5',
                },
            },
            {
                stage: 'blur',
                resolved: '1,5',
                context: {
                    formatted: '1,5',
                },
            },
        ]);
    });

    it('passes built-in append state and config to factory hooks', () => {
        const contexts: unknown[] = [];
        const nextStates: TextState[] = [];
        const format = defineNumberFormat({
            decimalPlaces: 2,
            append(next, context) {
                nextStates.push(next);
                contexts.push(context);
                return next;
            },
        });

        append(format, '1', '.5');

        expect(nextStates[0]).toEqual(state('1.5', 3));
        expect(contexts[0]).toMatchObject({
            intent: 'append',
            previous: '1',
            attempted: '1.5',
            appended: '.5',
            decimalPlaces: 2,
            normalized: {
                previous: '1',
                attempted: '1.5',
                appended: '.5',
            },
        });
        expect('resolved' in (contexts[0] as object)).toBe(false);
    });

    it('keeps the cursor before grouping text when deleting near a separator', () => {
        const format = defineNumberFormat({
            thousandsSeparator: ',',
        });

        expect(deleteBackward(format, '12,345', 2)).toEqual(state('1,345', 1));
    });

    it('accepts the built-in delete result when a factory hook returns undefined', () => {
        const format = defineNumberFormat({
            thousandsSeparator: ',',
            delete() {},
        });

        expect(deleteBackward(format, '12,345', 2)).toEqual(state('1,345', 1));
    });
});
