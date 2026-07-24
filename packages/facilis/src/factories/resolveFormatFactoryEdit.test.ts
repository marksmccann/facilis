import { describe, expect, it } from 'vitest';
import {
    resolveFormatFactoryEditHookContext,
    resolveFormatFactoryEditResult,
} from './resolveFormatFactoryEdit';
import type { FormatAppendHookContext } from '../types/hooks';

const appendContext: FormatAppendHookContext = {
    intent: 'append',
    previous: '12',
    attempted: '123',
    formatted: '123',
    resolved: { value: '123', selectionStart: 3, selectionEnd: 3 },
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

describe('resolveFormatFactoryEditHookContext', () => {
    it('removes the built-in resolved state and merges factory options', () => {
        const context = resolveFormatFactoryEditHookContext(appendContext, {
            pattern: '##',
        });

        expect(context).toMatchObject({
            intent: 'append',
            previous: '12',
            attempted: '123',
            pattern: '##',
        });
        expect('resolved' in context).toBe(false);
    });
});

describe('resolveFormatFactoryEditResult', () => {
    it('uses the built-in resolved state for undefined results', () => {
        expect(
            resolveFormatFactoryEditResult(undefined, appendContext)
        ).toEqual({
            value: '123',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('restores the previous value at the edit cursor for null results', () => {
        expect(resolveFormatFactoryEditResult(null, appendContext)).toEqual({
            value: '12',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('resolves string results to an end-collapsed text state', () => {
        expect(resolveFormatFactoryEditResult('next', appendContext)).toEqual({
            value: 'next',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });
});
