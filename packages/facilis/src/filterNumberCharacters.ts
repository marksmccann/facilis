/**
 * Options for filtering raw text into a number-like string.
 *
 * @since 0.1.0
 */
export type FilterNumberCharactersOptions = {
    /**
     * The maximum number of decimal places the value can support. The decimal
     * separator is filtered out when this is `0`.
     */
    decimalPlaces?: number;

    /**
     * The decimal separator to preserve when decimal places are supported.
     */
    decimalSeparator?: string;

    /**
     * Whether to preserve one leading minus sign.
     */
    allowNegative?: boolean;
};

/**
 * Filters raw text down to digits, one optional decimal separator, and one
 * optional leading minus sign.
 *
 * @since 0.1.0
 */
export default function filterNumberCharacters(
    raw: string,
    options: FilterNumberCharactersOptions = {}
) {
    const {
        allowNegative = false,
        decimalPlaces = 0,
        decimalSeparator = '.',
    } = options;
    const allowDecimalSeparator = decimalPlaces > 0;
    let hasDecimalSeparator = false;
    let value = '';

    for (const character of raw) {
        if (allowNegative && character === '-' && value.length === 0) {
            value += character;
            continue;
        }

        if (/\d/.test(character)) {
            value += character;
            continue;
        }

        if (
            allowDecimalSeparator &&
            character === decimalSeparator &&
            !hasDecimalSeparator
        ) {
            value += decimalSeparator;
            hasDecimalSeparator = true;
        }
    }

    return value;
}
