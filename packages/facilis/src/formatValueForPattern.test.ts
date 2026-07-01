import { describe, expect, it } from 'vitest';
import { formatValueForPattern } from './formatValueForPattern';
import { parsePatternOptions } from './parsePatternOptions';

describe('formatValueForPattern', () => {
    it('formats one normalized value with literals revealed as tokens are filled', () => {
        const patternParts = parsePatternOptions({
            pattern: '(###) ###-####',
            tokens: {
                '#': { matches: /\d/ },
            },
        });

        expect(
            formatValueForPattern(
                { normalizedValue: '1234567' },
                { patternParts }
            )
        ).toBe('(123) 456-7');
    });
});
