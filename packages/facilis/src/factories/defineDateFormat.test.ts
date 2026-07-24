import { describe, expect, it } from 'vitest';
import defineDateFormat from './defineDateFormat';
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

describe('defineDateFormat', () => {
    it('formats digits into the configured date pattern', () => {
        const format = defineDateFormat({
            pattern: 'MM/DD/YYYY',
        });

        expect(format.formatValue('01022026')).toBe('01/02/2026');
    });

    it('applies leading-zero and strict segment options before formatting', () => {
        const format = defineDateFormat({
            insertLeadingZero: true,
            pattern: 'MM/DD/YYYY',
            strictSegments: true,
        });

        expect(format.formatValue('24')).toBe('02/04');
        expect(format.formatValue('13')).toBe('1');
    });

    it('validates required and supported options', () => {
        expect(() =>
            defineDateFormat(
                undefined as unknown as Parameters<typeof defineDateFormat>[0]
            )
        ).toThrow(/ERR05/);
        expect(() =>
            defineDateFormat({
                pattern: 'YYYY-DD-MM',
            } as unknown as Parameters<typeof defineDateFormat>[0])
        ).toThrow(/ERR07/);
        expect(() =>
            defineDateFormat({
                pattern: 'MM/DD/YYYY',
                separator: ':',
            } as unknown as Parameters<typeof defineDateFormat>[0])
        ).toThrow(/ERR08/);
    });

    it('passes built-in append state and resolved config to factory hooks', () => {
        const contexts: unknown[] = [];
        const nextStates: TextState[] = [];
        const format = defineDateFormat({
            pattern: 'MM/DD/YYYY',
            separator: '-',
            append(next, context) {
                nextStates.push(next);
                contexts.push(context);
                return next;
            },
        });

        append(format, '01', '-');

        expect(nextStates[0]).toEqual(state('01-', 3));
        expect(contexts[0]).toMatchObject({
            intent: 'append',
            previous: '01',
            attempted: '01-',
            appended: '-',
            pattern: 'MM/DD/YYYY',
            separator: '-',
            strictSegments: false,
        });
    });
});
