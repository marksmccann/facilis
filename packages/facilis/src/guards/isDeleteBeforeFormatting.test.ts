import { describe, expect, it } from 'vitest';
import isDeleteBeforeFormatting from './isDeleteBeforeFormatting';
import type { FormatDeleteHookContext } from '../types/hooks';

function context(
    overrides: Partial<FormatDeleteHookContext> = {}
): FormatDeleteHookContext {
    return {
        intent: 'delete',
        previous: '12,345',
        attempted: '1,345',
        formatted: '1,345',
        resolved: {
            value: '1,345',
            selectionStart: 1,
            selectionEnd: 1,
        },
        normalize: (raw) => raw.replace(/\D/g, ''),
        cursor: 2,
        start: 1,
        end: 2,
        deleted: '2',
        normalized: {
            previous: '12345',
            attempted: '1345',
            deleted: '2',
        },
        ...overrides,
    };
}

describe('isDeleteBeforeFormatting', () => {
    it('returns true when semantic text was deleted immediately before formatting', () => {
        expect(isDeleteBeforeFormatting(context(), ',')).toBe(true);
    });

    it('returns false when the deleted text did not change the normalized value', () => {
        expect(
            isDeleteBeforeFormatting(
                context({
                    deleted: ',',
                    normalized: {
                        previous: '12345',
                        attempted: '12345',
                        deleted: '',
                    },
                }),
                ','
            )
        ).toBe(false);
    });

    it('returns false when the cursor is not before the formatting text', () => {
        expect(isDeleteBeforeFormatting(context({ cursor: 1 }), ',')).toBe(
            false
        );
    });
});
