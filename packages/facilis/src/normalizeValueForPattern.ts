import type { PatternPart } from './parsePatternOptions';
import type { NormalizeValueContext } from './types';

export type NormalizeValueForPatternOptions = {
    patternParts: PatternPart[];
};

/**
 * Returns only the token parts from the parsed pattern.
 */
function getTokenParts(patternParts: PatternPart[]) {
    return patternParts.filter((part) => part.kind === 'token');
}

/**
 * Tests whether a raw character satisfies a token part's matching rule.
 */
function characterMatchesToken(
    tokenPart: ReturnType<typeof getTokenParts>[number],
    character: string
) {
    const { matches } = tokenPart.definition;
    matches.lastIndex = 0;
    return matches.test(character);
}

/**
 * Normalizes the raw value by scanning characters left to right and filling
 * token parts in order with the first matching characters that appear.
 *
 * @since 0.0.1
 */
export function normalizeValueForPattern(
    context: NormalizeValueContext,
    options: NormalizeValueForPatternOptions
) {
    const { rawValue } = context;
    const { patternParts } = options;
    const tokenParts = getTokenParts(patternParts);
    let tokenIndex = 0;
    let normalizedValue = '';

    for (const character of rawValue) {
        const tokenPart = tokenParts[tokenIndex];

        if (!tokenPart) break;

        if (!characterMatchesToken(tokenPart, character)) {
            continue;
        }

        normalizedValue += character;
        tokenIndex += 1;
    }

    return normalizedValue;
}
