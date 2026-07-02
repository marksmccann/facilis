import { describe, expect, it } from 'vitest';
import { matchesText } from './matchesText';

describe('matchesText', () => {
    it('returns whether text matches the expression', () => {
        expect(matchesText('1', /\d/)).toBe(true);
        expect(matchesText('a', /\d/)).toBe(false);
        expect(matchesText('123', /\d+/)).toBe(true);
    });

    it('resets the expression lastIndex before testing', () => {
        const expression = /\d/g;

        expression.lastIndex = 2;

        expect(matchesText('1', expression)).toBe(true);
        expect(expression.lastIndex).toBe(1);
    });
});
