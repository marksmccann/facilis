import type { BlurContext, FormatDefinition } from './types';

/**
 * The output of one blur stage run.
 *
 * @private
 */
type RunBlurResult = {
    /** The blur-time value that should be written back on blur. */
    blurredValue: string;
};

/**
 * Runs one format definition's blur stage against the formatted value and
 * returns the blur-time result that should be written back to the input.
 *
 * @private
 */
export default function runBlur(
    definition: FormatDefinition,
    formattedValue: string
): RunBlurResult {
    if (!definition.blur) {
        return {
            blurredValue: formattedValue,
        };
    }

    const context: BlurContext = {
        formattedValue,
    };

    return {
        blurredValue: definition.blur(context),
    };
}
