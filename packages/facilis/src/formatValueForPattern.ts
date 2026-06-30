import type { PatternPart } from './parsePatternOptions';

/**
 * Builds the formatted value by filling token parts from the normalized value
 * and including literal parts only after their preceding token count has been reached.
 *
 * @since 0.0.1
 */
export function formatValueForPattern(
    normalizedValue: string,
    patternParts: PatternPart[]
) {
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
