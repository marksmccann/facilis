import { describe, expect, it } from 'vitest';
import isDeleteOverFormatting from './isDeleteOverFormatting';
import type { FormatDeleteHookContext } from '../types/hooks';

function context(
    overrides: Partial<FormatDeleteHookContext> = {}
): FormatDeleteHookContext {
    return {
        intent: 'delete',
        previous: '12/3',
        attempted: '123',
        formatted: '123',
        resolved: { value: '123', selectionStart: 2, selectionEnd: 2 },
        normalize: (raw) => raw.replace(/\D/g, ''),
        normalized: {
            previous: '123',
            attempted: '123',
            deleted: '',
        },
        cursor: 3,
        start: 2,
        end: 3,
        deleted: '/',
        ...overrides,
    };
}

describe('isDeleteOverFormatting', () => {
    it('detects deletion of display-only formatting before the end', () => {
        expect(isDeleteOverFormatting(context())).toBe(true);
    });

    it('ignores semantic deleted text', () => {
        expect(
            isDeleteOverFormatting(
                context({
                    deleted: '2',
                    normalized: {
                        previous: '123',
                        attempted: '13',
                        deleted: '2',
                    },
                })
            )
        ).toBe(false);
    });

    it('ignores empty deleted text', () => {
        expect(isDeleteOverFormatting(context({ deleted: '' }))).toBe(false);
    });

    it('ignores formatting at the end of the value', () => {
        expect(isDeleteOverFormatting(context({ cursor: 4 }))).toBe(false);
    });
});
