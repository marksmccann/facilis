/**
 * Options for removing extra decimal separators from a number-like string.
 *
 * @private
 */
type RemoveExtraDecimalSeparatorsOptions = {
    /**
     * The decimal separator that marks the start of the fractional portion.
     */
    decimalSeparator?: string;
};

/**
 * Keeps the first decimal separator and removes any additional decimal
 * separators from a number-like string.
 *
 * @since 0.1.0
 */
export default function removeExtraDecimalSeparators(
    value: string,
    options: RemoveExtraDecimalSeparatorsOptions = {}
) {
    const { decimalSeparator = '.' } = options;
    let hasDecimalSeparator = false;

    return Array.from(value)
        .filter((character) => {
            if (character !== decimalSeparator) {
                return true;
            }

            if (hasDecimalSeparator) {
                return false;
            }

            hasDecimalSeparator = true;
            return true;
        })
        .join('');
}
