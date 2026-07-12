import { describe, expect, it } from 'vitest';
import defineFormat from './defineFormat';

describe('defineFormat', () => {
    it('passes the active normalize function to edit hooks', () => {
        let normalizedPrefix: string | undefined;
        const format = defineFormat({
            normalize(raw) {
                return raw.replace(/\D/g, '');
            },
            edit: {
                deleteBackward(context) {
                    normalizedPrefix = context.normalize('$12');
                    return context.formatted;
                },
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
