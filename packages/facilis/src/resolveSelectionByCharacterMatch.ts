import type { Facilis } from './types';

function countMatchedCharacters(value: string, characterMatch: RegExp): number {
    return value
        .split('')
        .filter((character) => {
            characterMatch.lastIndex = 0;

            return characterMatch.test(character);
        }).length;
}

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
 * Resolves the next selection range by counting how many characters match the
 * provided regular expression before the raw selection and mapping that count
 * onto the formatted value.
 */
export function resolveSelectionByCharacterMatch(
    characterMatch: RegExp,
    context: Facilis.FormatSelectionContext
): Facilis.FormatSelectionResult {
    const selectionStartCount = Math.min(
        countMatchedCharacters(
            context.rawValue.slice(0, context.rawSelectionStart),
            characterMatch
        ),
        countMatchedCharacters(context.normalizedValue, characterMatch)
    );
    const selectionEndCount = Math.min(
        countMatchedCharacters(
            context.rawValue.slice(0, context.rawSelectionEnd),
            characterMatch
        ),
        countMatchedCharacters(context.normalizedValue, characterMatch)
    );

    return {
        selectionStart: getFormattedSelectionPosition(
            context.formattedValue,
            selectionStartCount,
            characterMatch
        ),
        selectionEnd: getFormattedSelectionPosition(
            context.formattedValue,
            selectionEndCount,
            characterMatch
        ),
    };
}
