import { describe, expect, it } from 'vitest';
import runInsert from './runInsert';
import type { RunEditContext } from '../types/internal';

const baseContext: RunEditContext = {
    definition: {
        normalize(raw) {
            return raw.replace(/\D/g, '');
        },
    },
    previous: { value: '124', selectionStart: 2, selectionEnd: 2 },
    current: { value: '1234', selectionStart: 3, selectionEnd: 3 },
    normalized: '1234',
    formatted: '1234',
    resolved: { value: '1234', selectionStart: 3, selectionEnd: 3 },
};

describe('runInsert', () => {
    it('returns undefined when no insert hook is defined', () => {
        expect(runInsert(baseContext)).toBeUndefined();
    });

    it('runs the insert hook with the inserted middle text', () => {
        const contexts: unknown[] = [];
        const nextStates: unknown[] = [];
        const result = runInsert({
            ...baseContext,
            definition: {
                ...baseContext.definition,
                insert(next, context) {
                    nextStates.push(next);
                    contexts.push(context);
                    return 'next';
                },
            },
        });

        expect(result).toBe('next');
        expect(nextStates[0]).toEqual({
            value: '1234',
            selectionStart: 3,
            selectionEnd: 3,
        });
        expect(contexts[0]).toMatchObject({
            intent: 'insert',
            previous: '124',
            attempted: '1234',
            cursor: 2,
            start: 2,
            end: 2,
            inserted: '3',
            normalized: {
                previous: '124',
                attempted: '1234',
                inserted: '3',
            },
        });
    });

    it('does not run the hook when the previous cursor is missing', () => {
        const contexts: unknown[] = [];

        expect(
            runInsert({
                ...baseContext,
                previous: {
                    value: '124',
                    selectionStart: null,
                    selectionEnd: null,
                },
                definition: {
                    ...baseContext.definition,
                    insert(_next, context) {
                        contexts.push(context);
                    },
                },
            })
        ).toBeUndefined();
        expect(contexts).toEqual([]);
    });
});
