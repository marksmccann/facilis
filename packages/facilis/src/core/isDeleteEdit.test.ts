import { describe, expect, it } from 'vitest';
import isDeleteEdit from './isDeleteEdit';
import type { TextState } from '../types/input';

function state(
    value: string,
    selectionStart = value.length,
    selectionEnd = selectionStart
): TextState {
    return { value, selectionStart, selectionEnd };
}

describe('isDeleteEdit', () => {
    it('detects backward deletion from a collapsed cursor', () => {
        expect(
            isDeleteEdit(
                { inputType: 'deleteContentBackward', data: null },
                state('abc', 2)
            )
        ).toBe(true);
    });

    it('ignores other input types', () => {
        expect(
            isDeleteEdit(
                { inputType: 'deleteContentForward', data: null },
                state('abc', 2)
            )
        ).toBe(false);
    });

    it('ignores expanded selections', () => {
        expect(
            isDeleteEdit(
                { inputType: 'deleteContentBackward', data: null },
                state('abc', 1, 2)
            )
        ).toBe(false);
    });

    it('ignores missing selections', () => {
        expect(
            isDeleteEdit(
                { inputType: 'deleteContentBackward', data: null },
                { value: 'abc', selectionStart: null, selectionEnd: null }
            )
        ).toBe(false);
    });
});
