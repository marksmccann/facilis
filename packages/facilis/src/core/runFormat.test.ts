import { describe, expect, it } from 'vitest';
import runFormat from './runFormat';

describe('runFormat', () => {
    it('returns the normalized value when no format hook is defined', () => {
        expect(runFormat({ normalize: (raw) => raw }, '123')).toBe('123');
    });

    it('formats the normalized value through the definition hook', () => {
        expect(
            runFormat(
                {
                    normalize: (raw) => raw,
                    format: (normalized) => `(${normalized})`,
                },
                '123'
            )
        ).toBe('(123)');
    });
});
