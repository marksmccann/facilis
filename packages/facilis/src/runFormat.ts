import type { FormatDefinition } from './types';
import { reporter } from './reporter';

/**
 * The output of one format stage run, including the formatted value and a
 * boundary map from every normalized boundary to its corresponding formatted
 * boundary.
 *
 * @private
 */
type RunFormatResult = {
    /** The visible formatted value produced from the normalized input. */
    formattedValue: string;

    /**
     * Maps each normalized boundary index, including the start and end of the
     * normalized value, to the formatted boundary index it lands on after
     * formatting. For example, when `"AB"` formats to `"[A][B]"`, this becomes
     * `[0, 3, 6]`.
     */
    normalizedToFormatted: number[];
};

/**
 * Runs one format definition's format stage across the normalized value and
 * returns the visible formatted result plus a normalized-to-formatted
 * boundary map.
 *
 * @private
 */
export default function runFormat(
    definition: FormatDefinition,
    normalized: string
): RunFormatResult {
    let formatted = '';
    let normalizedPosition = 0;
    const normalizedToFormatted = [0];

    for (const [index, character] of Array.from(normalized).entries()) {
        let nextNormalizedPosition = normalizedPosition;

        definition.format(character, {
            index,
            normalized,
            get formatted() {
                return formatted;
            },
            get normalizedPosition() {
                return nextNormalizedPosition;
            },
            append(text) {
                formatted += text;
            },
            advance(amount = 1) {
                if (amount < 0) reporter.fail('ERR01', { amount });
                nextNormalizedPosition += amount;
            },
        });

        // Fill every normalized boundary reached during this step with the
        // current formatted boundary after the appended output settles.
        while (normalizedToFormatted.length <= nextNormalizedPosition) {
            normalizedToFormatted.push(formatted.length);
        }

        normalizedPosition = nextNormalizedPosition;
    }

    while (normalizedToFormatted.length <= normalized.length) {
        normalizedToFormatted.push(formatted.length);
    }

    return {
        formattedValue: formatted,
        normalizedToFormatted,
    };
}
