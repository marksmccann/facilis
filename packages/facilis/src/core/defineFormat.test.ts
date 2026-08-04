import { describe, expect, it } from 'vitest';
import defineFormat from './defineFormat';

describe('defineFormat', () => {
    it('formats standalone values through normalize, format, and blur', () => {
        const format = defineFormat({
            normalize(raw) {
                return raw.replace(/[^a-z]/gi, '').toUpperCase();
            },
            format(normalized) {
                return `>${normalized}`;
            },
            blur(formatted) {
                return `${formatted}!`;
            },
        });

        expect(format.formatValue('a-b')).toBe('>AB!');
    });

    it('passes the active normalize function to edit hooks', () => {
        let normalizedPrefix: string | undefined;
        const format = defineFormat({
            normalize(raw) {
                return raw.replace(/\D/g, '');
            },
            delete(_next, context) {
                normalizedPrefix = context.normalize('$12');
                return context.formatted;
            },
        });

        format.onInput(
            { inputType: 'deleteContentBackward', data: null },
            { value: '$12', selectionStart: 3, selectionEnd: 3 },
            { value: '$1', selectionStart: 2, selectionEnd: 2 }
        );

        expect(normalizedPrefix).toBe('12');
    });
});
