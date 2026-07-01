import type { FormatSelectionContext, FormatSelectionResult } from './types';

/**
 * The configuration options for text-based selection resolution.
 *
 * @since 0.0.1
 */
export type ResolveSelectionForTextOptions = {
    /**
     * The regular expression that determines which characters should count as
     * meaningful while resolving the next selection range.
     */
    characterMatches: RegExp;
};

/**
 * Counts how many characters in the provided value satisfy the match rule.
 */
function countMatchedCharacters(value: string, characterMatch: RegExp): number {
    return value.split('').filter((character) => {
        characterMatch.lastIndex = 0;

        return characterMatch.test(character);
    }).length;
}

/**
 * Maps a matched-character count to the corresponding cursor position in the
 * formatted value.
 */
function getFormattedSelectionPosition(
    formattedValue: string,
    targetCount: number,
    characterMatch: RegExp
) {
    if (targetCount <= 0) {
        return 0;
    }

    let count = 0;

    for (
        let currentIndex = 0;
        currentIndex < formattedValue.length;
        currentIndex += 1
    ) {
        const character = formattedValue[currentIndex];

        characterMatch.lastIndex = 0;

        if (characterMatch.test(character)) {
            count += 1;

            if (count === targetCount) {
                return currentIndex + 1;
            }
        }
    }

    return formattedValue.length;
}

/**
 * Resolves the next selection range for text-oriented formats by counting how
 * many meaningful characters appear before the raw selection and mapping that
 * count onto the formatted value.
 *
 * @since 0.0.1
 */
export function resolveSelectionForText(
    context: FormatSelectionContext,
    options: ResolveSelectionForTextOptions
): FormatSelectionResult {
    const { characterMatches } = options;

    const selectionStartCount = Math.min(
        countMatchedCharacters(
            context.rawValue.slice(0, context.rawSelectionStart),
            characterMatches
        ),
        countMatchedCharacters(context.normalizedValue, characterMatches)
    );
    const selectionEndCount = Math.min(
        countMatchedCharacters(
            context.rawValue.slice(0, context.rawSelectionEnd),
            characterMatches
        ),
        countMatchedCharacters(context.normalizedValue, characterMatches)
    );

    return {
        selectionStart: getFormattedSelectionPosition(
            context.formattedValue,
            selectionStartCount,
            characterMatches
        ),
        selectionEnd: getFormattedSelectionPosition(
            context.formattedValue,
            selectionEndCount,
            characterMatches
        ),
    };
}
