import type { PatternPart } from './parsePatternOptions';
import type { FormatValueContext } from './types';

export type FormatValueForPatternOptions = {
    patternParts: PatternPart[];
};

/**
 * Builds the formatted value by filling token parts from the normalized value
 * and including literal parts only after their preceding token count has been reached.
 *
 * @since 0.0.1
 */
export function formatValueForPattern(
    context: FormatValueContext,
    options: FormatValueForPatternOptions
) {
    const { normalizedValue } = context;
    const { patternParts } = options;

    if (normalizedValue === '') return '';

    let formattedValue = '';
    let tokenCount = 0;

    for (const part of patternParts) {
        if (part.kind === 'literal') {
            // Show a literal only after the user has filled enough
            // token parts to reach it in the pattern.
            if (normalizedValue.length > tokenCount) {
                formattedValue += part.character;
            }

            continue;
        }

        const character = normalizedValue[tokenCount];

        if (!character) break;

        formattedValue += character;
        tokenCount += 1;
    }

    return formattedValue;
}
