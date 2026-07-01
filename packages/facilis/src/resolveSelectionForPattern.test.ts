import { describe, expect, it } from 'vitest';
import { resolveSelectionForPattern } from './resolveSelectionForPattern';
import { parsePatternOptions } from './parsePatternOptions';

describe('resolveSelectionForPattern', () => {
    it('maps the raw selection to the formatted selection position', () => {
        const patternParts = parsePatternOptions({
            pattern: '(###) ###-####',
            tokens: {
                '#': { matches: /\d/ },
            },
        });

        expect(
            resolveSelectionForPattern(
                {
                    rawValue: '1234567',
                    rawSelectionStart: 7,
                    rawSelectionEnd: 7,
                    normalizedValue: '1234567',
                    formattedValue: '(123) 456-7',
                },
                { patternParts }
            )
        ).toEqual({
            selectionStart: 11,
            selectionEnd: 11,
        });
    });
});
