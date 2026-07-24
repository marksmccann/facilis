import { describe, expect, it } from 'vitest';
import isInsertEdit from './isInsertEdit';
import type { InputDetails, TextState } from '../types/input';

const insertDetails: InputDetails = {
    inputType: 'insertText',
    data: 'x',
};

function state(
    value: string,
    selectionStart = value.length,
    selectionEnd = selectionStart
): TextState {
    return { value, selectionStart, selectionEnd };
}

describe('isInsertEdit', () => {
    it('detects text inserted at a collapsed cursor before the end', () => {
        expect(
            isInsertEdit(insertDetails, state('abc', 1), state('axbc', 2))
        ).toBe(true);
    });

    it('ignores appended text at the end', () => {
        expect(isInsertEdit(insertDetails, state('abc'), state('abcd'))).toBe(
            false
        );
    });

    it('ignores replacement edits from an expanded selection', () => {
        expect(
            isInsertEdit(insertDetails, state('abc', 1, 2), state('axc', 2))
        ).toBe(false);
    });

    it('ignores insert-like events without a usable cursor', () => {
        expect(
            isInsertEdit(
                insertDetails,
                { value: 'abc', selectionStart: null, selectionEnd: null },
                state('xabc', 1)
            )
        ).toBe(false);
    });

    it('ignores non-insert input types', () => {
        expect(
            isInsertEdit(
                { inputType: 'deleteContentBackward', data: null },
                state('abc', 1),
                state('ac', 1)
            )
        ).toBe(false);
    });
});
