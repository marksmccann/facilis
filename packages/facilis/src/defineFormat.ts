import type { Facilis } from './types';

/**
 * Finds the selection position within the normalized value by matching the
 * meaningful characters before the raw cursor position.
 */
function getNormalizedSelectionPosition(
    rawValue: string,
    rawSelectionPosition: number,
    normalizedValue: string,
    isMeaningfulCharacter: (context: { character: string }) => boolean
): number {
    const meaningfulPrefix = rawValue
        .slice(0, rawSelectionPosition)
        .split('')
        .filter((character) => isMeaningfulCharacter({ character }));

    if (meaningfulPrefix.length === 0) {
        return 0;
    }

    let matchedCount = 0;
    let normalizedSelectionPosition = 0;

    for (
        let currentIndex = 0;
        currentIndex < normalizedValue.length;
        currentIndex += 1
    ) {
        const character = normalizedValue[currentIndex];

        if (isMeaningfulCharacter({ character })) {
            normalizedSelectionPosition += 1;

            if (character === meaningfulPrefix[matchedCount]) {
                matchedCount += 1;

                if (matchedCount === meaningfulPrefix.length) {
                    return normalizedSelectionPosition;
                }
            }
        }
    }

    return normalizedSelectionPosition;
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
