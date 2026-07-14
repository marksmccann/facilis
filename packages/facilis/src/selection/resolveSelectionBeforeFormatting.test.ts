import { describe, expect, it } from 'vitest';
import resolveSelectionBeforeFormatting from './resolveSelectionBeforeFormatting';

describe('resolveSelectionBeforeFormatting', () => {
    it('resolves a collapsed selection to the start of formatting before a position', () => {
        expect(
            resolveSelectionBeforeFormatting({
                value: '12,345',
                position: 3,
                formatting: ',',
            })
        ).toEqual({
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('supports multi-character formatting', () => {
        expect(
            resolveSelectionBeforeFormatting({
                value: '(123) 456',
                position: 6,
                formatting: ') ',
            })
        ).toEqual({
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('returns undefined when the formatting is empty', () => {
        expect(
            resolveSelectionBeforeFormatting({
                value: '123',
                position: 1,
                formatting: '',
            })
        ).toBeUndefined();
    });

    it('returns undefined when formatting is not before the position', () => {
        expect(
            resolveSelectionBeforeFormatting({
                value: '12345',
                position: 3,
                formatting: ',',
            })
        ).toBeUndefined();
    });
});
