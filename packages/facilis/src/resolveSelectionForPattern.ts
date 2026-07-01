import type { PatternPart } from './parsePatternOptions';
import type { FormatSelectionContext, FormatSelectionResult } from './types';

export type ResolveSelectionForPatternOptions = {
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
 * Counts how many token parts are matched before the raw selection position,
 * clamped to the normalized value length.
 */
function countTokensBeforeSelection(
    rawValue: string,
    rawSelectionPosition: number,
    normalizedValue: string,
    patternParts: PatternPart[]
) {
    const tokenParts = getTokenParts(patternParts);
    const rawCharacters = rawValue.slice(0, rawSelectionPosition).split('');
    let tokenCount = 0;

    for (const character of rawCharacters) {
        const tokenPart = tokenParts[tokenCount];

        if (!tokenPart) break;

        if (!characterMatchesToken(tokenPart, character)) {
            continue;
        }

        tokenCount += 1;
    }

    return Math.min(tokenCount, normalizedValue.length);
}

/**
 * Maps the raw selection position to the corresponding position in the
 * formatted value by counting matched token parts before the selection.
 */
function getSelectionPosition(
    normalizedValue: string,
    rawValue: string,
    rawSelectionPosition: number,
    patternParts: PatternPart[]
) {
    const tokensBeforeSelection = countTokensBeforeSelection(
        rawValue,
        rawSelectionPosition,
        normalizedValue,
        patternParts
    );

    if (tokensBeforeSelection <= 0) return 0;

    let selectionPosition = 0;
    let tokenCount = 0;

    for (const part of patternParts) {
        if (part.kind === 'literal') {
            // Count a visible literal toward the formatted selection position
            // once the filled token count has progressed past it.
            if (normalizedValue.length > tokenCount) {
                selectionPosition += 1;
            }

            continue;
        }

        if (tokenCount === tokensBeforeSelection) break;

        selectionPosition += 1;
        tokenCount += 1;

        if (tokenCount === tokensBeforeSelection) {
            return selectionPosition;
        }
    }

    return selectionPosition;
}

/**
 * Resolves the next selection range for a tokenized pattern value.
 *
 * @since 0.0.1
 */
export function resolveSelectionForPattern(
    context: FormatSelectionContext,
    options: ResolveSelectionForPatternOptions
): FormatSelectionResult {
    const { patternParts } = options;

    return {
        selectionStart: getSelectionPosition(
            context.normalizedValue,
            context.rawValue,
            context.rawSelectionStart,
            patternParts
        ),
        selectionEnd: getSelectionPosition(
            context.normalizedValue,
            context.rawValue,
            context.rawSelectionEnd,
            patternParts
        ),
    };
}
