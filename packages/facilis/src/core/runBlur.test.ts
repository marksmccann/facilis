import { describe, expect, it } from 'vitest';
import runBlur from './runBlur';

describe('runBlur', () => {
    it('returns the formatted value when no blur hook is defined', () => {
        expect(runBlur({ normalize: (raw) => raw }, '123')).toBe('123');
    });

    it('passes the formatted value through the blur hook', () => {
        expect(
            runBlur(
                {
                    normalize: (raw) => raw,
                    blur: (formatted) => `${formatted}!`,
                },
                '123'
            )
        ).toBe('123!');
    });
});
