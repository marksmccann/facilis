import { describe, expect, it } from 'vitest';
import runDelete from './runDelete';
import type { RunEditContext } from '../types/internal';

const baseContext: RunEditContext = {
    definition: {
        normalize(raw) {
            return raw.replace(/\D/g, '');
        },
    },
    previous: { value: '12-3', selectionStart: 3, selectionEnd: 3 },
    current: { value: '123', selectionStart: 2, selectionEnd: 2 },
    normalized: '123',
    formatted: '123',
    resolved: { value: '123', selectionStart: 2, selectionEnd: 2 },
};

describe('runDelete', () => {
    it('returns undefined when no delete hook is defined', () => {
        expect(runDelete(baseContext)).toBeUndefined();
    });

    it('runs the delete hook with the deleted character', () => {
        const contexts: unknown[] = [];
        const nextStates: unknown[] = [];
        const result = runDelete({
            ...baseContext,
            definition: {
                ...baseContext.definition,
                delete(next, context) {
                    nextStates.push(next);
                    contexts.push(context);
                    return null;
                },
            },
        });

        expect(result).toBeNull();
        expect(nextStates[0]).toEqual({
            value: '123',
            selectionStart: 2,
            selectionEnd: 2,
        });
        expect(contexts[0]).toMatchObject({
            intent: 'delete',
            previous: '12-3',
            attempted: '123',
            cursor: 3,
            start: 2,
            end: 3,
            deleted: '-',
            normalized: {
                previous: '123',
                attempted: '123',
                deleted: '',
            },
        });
    });

    it('does not run the hook when the previous cursor is missing', () => {
        const contexts: unknown[] = [];

        expect(
            runDelete({
                ...baseContext,
                previous: {
                    value: '12-3',
                    selectionStart: null,
                    selectionEnd: null,
                },
                definition: {
                    ...baseContext.definition,
                    delete(_next, context) {
                        contexts.push(context);
                    },
                },
            })
        ).toBeUndefined();
        expect(contexts).toEqual([]);
    });
});
