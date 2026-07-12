import { describe, expect, it } from 'vitest';
import isDeleteBackwardBeforeFormatting from './isDeleteBackwardBeforeFormatting';
import type { DeleteBackwardEditContext } from './types';

function context(
    overrides: Partial<DeleteBackwardEditContext> = {}
): DeleteBackwardEditContext {
    return {
        intent: 'deleteBackward',
        previous: '12,345',
        attempted: '1,345',
        formatted: '1,345',
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

describe('isDeleteBackwardBeforeFormatting', () => {
    it('returns true when semantic text was deleted immediately before formatting', () => {
        expect(isDeleteBackwardBeforeFormatting(context(), ',')).toBe(true);
    });

    it('returns false when the deleted text did not change the normalized value', () => {
        expect(
            isDeleteBackwardBeforeFormatting(
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
        expect(
            isDeleteBackwardBeforeFormatting(context({ cursor: 1 }), ',')
        ).toBe(false);
    });
});
