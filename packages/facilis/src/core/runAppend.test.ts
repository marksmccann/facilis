import { describe, expect, it } from 'vitest';
import runAppend from './runAppend';
import type { RunEditContext } from '../types/internal';

const baseContext: RunEditContext = {
    definition: {
        normalize(raw) {
            return raw.replace(/\D/g, '');
        },
    },
    previous: { value: '12', selectionStart: 2, selectionEnd: 2 },
    current: { value: '123a', selectionStart: 4, selectionEnd: 4 },
    normalized: '123',
    formatted: '123',
    resolved: { value: '123', selectionStart: 3, selectionEnd: 3 },
};

describe('runAppend', () => {
    it('returns undefined when no append hook is defined', () => {
        expect(runAppend(baseContext)).toBeUndefined();
    });

    it('runs the append hook with next state and edit context', () => {
        const contexts: unknown[] = [];
        const nextStates: unknown[] = [];
        const result = runAppend({
            ...baseContext,
            definition: {
                ...baseContext.definition,
                append(next, context) {
                    nextStates.push(next);
                    contexts.push(context);
                    return 'next';
                },
            },
        });

        expect(result).toBe('next');
        expect(nextStates[0]).toEqual({
            value: '123',
            selectionStart: 3,
            selectionEnd: 3,
        });
        expect(contexts[0]).toMatchObject({
            intent: 'append',
            previous: '12',
            attempted: '123a',
            formatted: '123',
            cursor: 2,
            start: 2,
            end: 2,
            appended: '3a',
            normalized: {
                previous: '12',
                attempted: '123',
                appended: '3',
            },
        });
        expect('resolved' in (contexts[0] as object)).toBe(false);
    });
});
