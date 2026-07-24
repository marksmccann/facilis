import { describe, expect, it } from 'vitest';
import resolveEditResult from './resolveEditResult';
import type { TextState } from '../types/input';

const previous: TextState = {
    value: 'previous',
    selectionStart: 2,
    selectionEnd: 2,
};

const fallback: TextState = {
    value: 'fallback',
    selectionStart: 8,
    selectionEnd: 8,
};

describe('resolveEditResult', () => {
    it('uses the fallback state for undefined hook results', () => {
        expect(resolveEditResult(undefined, previous, fallback)).toBe(fallback);
    });

    it('restores the previous state for null hook results', () => {
        expect(resolveEditResult(null, previous, fallback)).toBe(previous);
    });

    it('moves the cursor to the end of string hook results', () => {
        expect(resolveEditResult('next', previous, fallback)).toEqual({
            value: 'next',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('passes explicit text states through unchanged', () => {
        const result: TextState = {
            value: 'next',
            selectionStart: 1,
            selectionEnd: 3,
        };

        expect(resolveEditResult(result, previous, fallback)).toBe(result);
    });
});
