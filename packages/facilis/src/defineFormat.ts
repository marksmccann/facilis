import type { Facilis } from './types';

/**
 * Counts the meaningful characters in a value.
 */
function countMeaningfulCharacters(
    value: string,
    isMeaningfulCharacter: (context: { character: string }) => boolean
): number {
    return value
        .split('')
        .filter((character) => isMeaningfulCharacter({ character })).length;
}

/**
 * Finds the selection position within the normalized value by preserving the
 * count of meaningful characters before the raw cursor position.
 */
function getNormalizedSelectionPosition(
    rawValue: string,
    rawSelectionPosition: number,
    normalizedValue: string,
    isMeaningfulCharacter: (context: { character: string }) => boolean
): number {
    const meaningfulPrefixCount = countMeaningfulCharacters(
        rawValue.slice(0, rawSelectionPosition),
        isMeaningfulCharacter
    );

    if (meaningfulPrefixCount === 0) {
        return 0;
    }

    return Math.min(
        meaningfulPrefixCount,
        countMeaningfulCharacters(normalizedValue, isMeaningfulCharacter)
    );
}

/**
 * Maps a raw cursor position to the corresponding selection position in the
 * formatted value.
 */
function getSelectionPosition(
    rawValue: string,
    rawSelectionPosition: number,
    normalizedValue: string,
    formattedValue: string,
    isMeaningfulCharacter: (context: { character: string }) => boolean
): number {
    const targetCount = getNormalizedSelectionPosition(
        rawValue,
        rawSelectionPosition,
        normalizedValue,
        isMeaningfulCharacter
    );

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

        if (isMeaningfulCharacter({ character })) {
            count += 1;

            if (count === targetCount) {
                return currentIndex + 1;
            }
        }
    }

    return formattedValue.length;
}

/**
 * Creates a reusable format factory from a format definition.
 *
 * @since 0.0.1
 */
export function defineFormat(
    definition: Facilis.FormatDefinition
): Facilis.FormatFactory {
    return function createFormatInstance(): Facilis.FormatInstance {
        const {
            name,
            isMeaningfulCharacter,
            normalizeValue,
            formatValue,
            formatBlurValue = ({ formattedValue }) => formattedValue,
        } = definition;

        return {
            name,
            onInput(options) {
                // Handle the value
                const rawValue = options.value;
                const normalizedValue = normalizeValue({ rawValue });
                const formattedValue = formatValue({ normalizedValue });

                // Handle the selection start
                const selectionStart = getSelectionPosition(
                    rawValue,
                    options.selectionStart ?? 0,
                    normalizedValue,
                    formattedValue,
                    isMeaningfulCharacter
                );

                // Handle the selection end
                const selectionEnd = getSelectionPosition(
                    rawValue,
                    options.selectionEnd ?? 0,
                    normalizedValue,
                    formattedValue,
                    isMeaningfulCharacter
                );

                // Assemble the result
                const result: Facilis.FormatResult = {
                    formattedValue,
                    selectionStart,
                    selectionEnd,
                };

                return result;
            },
            onBlur(options) {
                const rawValue = options.value;
                const normalizedValue = normalizeValue({ rawValue });
                const formattedValue = formatValue({ normalizedValue });
                const finalizedValue = formatBlurValue({
                    formattedValue,
                });

                return {
                    formattedValue: finalizedValue,
                    selectionStart: null,
                    selectionEnd: null,
                };
            },
        };
    };
}
