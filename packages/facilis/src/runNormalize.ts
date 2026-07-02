import type { FormatDefinition, FormatInput } from './types';

/**
 * The output of one normalize stage run, including the normalized value and a
 * boundary map from every raw input boundary to its corresponding normalized
 * boundary.
 *
 * @private
 */
type RunNormalizeResult = {
    /** The normalized value produced from the raw input. */
    normalizedValue: string;

    /**
     * Maps each raw boundary index, including the start and end of the raw
     * value, to the normalized boundary index it lands on after normalization.
     * For example, when `"a1b"` normalizes to `"ab"`, this becomes `[0, 1, 1, 2]`.
     */
    rawToNormalized: number[];
};

/**
 * Runs one format definition's normalize stage across the raw input value and
 * returns the normalized result plus a raw-to-normalized boundary map.
 *
 * @private
 */
export default function runNormalize(
    definition: FormatDefinition,
    input: FormatInput
): RunNormalizeResult {
    let normalized = '';
    const rawToNormalized = [0];

    for (const [index, character] of Array.from(input.value).entries()) {
        definition.normalize(character, {
            index,
            rawValue: input.value,
            get normalized() {
                return normalized;
            },
            append(text) {
                normalized += text;
            },
            replace(text) {
                normalized = text;
            },
        });

        rawToNormalized.push(normalized.length);
    }

    return {
        normalizedValue: normalized,
        rawToNormalized,
    };
}
