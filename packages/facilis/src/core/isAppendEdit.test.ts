import { describe, expect, it } from 'vitest';
import isAppendEdit from './isAppendEdit';
import type { InputDetails, TextState } from '../types/input';

const insertDetails: InputDetails = {
    inputType: 'insertText',
    data: 'd',
};

function state(
    value: string,
    selectionStart = value.length,
    selectionEnd = selectionStart
): TextState {
    return { value, selectionStart, selectionEnd };
}

describe('isAppendEdit', () => {
    it('detects inserted text added after a cursor at the end', () => {
        expect(isAppendEdit(insertDetails, state('abc'), state('abcd'))).toBe(
            true
        );
    });

    it('ignores non-insert input types', () => {
        expect(
            isAppendEdit(
                { inputType: 'deleteContentBackward', data: null },
                state('abc'),
                state('abcd')
            )
        ).toBe(false);
    });

    it('ignores insertions when the previous selection was not at the end', () => {
        expect(
            isAppendEdit(insertDetails, state('abc', 1), state('adbc'))
        ).toBe(false);
    });

    it('ignores insertions that do not preserve the previous prefix', () => {
        expect(isAppendEdit(insertDetails, state('abc'), state('abdc'))).toBe(
            false
        );
    });
});
