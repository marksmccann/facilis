import { describe, expect, it } from 'vitest';
import resolveEditNext from './resolveEditNext';
import type { FormatAppendHookContext } from '../types/hooks';
import type { TextState } from '../types/input';

const fallback: TextState = {
    value: 'fallback',
    selectionStart: 8,
    selectionEnd: 8,
};

const context: FormatAppendHookContext = {
    intent: 'append',
    previous: '12',
    attempted: '123',
    formatted: '123',
    normalize: (raw) => raw,
    normalized: {
        previous: '12',
        attempted: '123',
        appended: '3',
    },
    cursor: 2,
    start: 2,
    end: 2,
    appended: '3',
};

describe('resolveEditNext', () => {
    it('uses the fallback state for undefined results', () => {
        expect(resolveEditNext(undefined, fallback, context)).toBe(fallback);
    });

    it('restores the previous text at the edit cursor for null results', () => {
        expect(resolveEditNext(null, fallback, context)).toEqual({
            value: '12',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('resolves string results to an end-collapsed text state', () => {
        expect(resolveEditNext('next', fallback, context)).toEqual({
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

        expect(resolveEditNext(result, fallback, context)).toBe(result);
    });
});
