import { describe, expect, it } from 'vitest';
import { normalizeValueForPattern } from './normalizeValueForPattern';
import { parsePatternOptions } from './parsePatternOptions';

describe('normalizeValueForPattern', () => {
    it('fills token parts in order from matching raw characters', () => {
        const patternParts = parsePatternOptions({
            pattern: '(###) ###-####',
            tokens: {
                '#': { matches: /\d/ },
            },
        });

        expect(normalizeValueForPattern('1a2b3c4d5e6f7g8h9i0', patternParts)).toBe(
            '1234567890'
        );
    });
});
