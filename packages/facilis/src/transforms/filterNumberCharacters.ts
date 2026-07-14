/**
 * Options for filtering raw text into a number-like string.
 *
 * @since 0.1.0
 */
export type FilterNumberCharactersOptions = {
    /**
     * The decimal separator to preserve when decimal places are supported.
     */
    decimalSeparator?: string;
};

/**
 * Filters raw text down to digits, decimal separators, and minus signs.
 *
 * @since 0.1.0
 */
export default function filterNumberCharacters(
    raw: string,
    options: FilterNumberCharactersOptions = {}
) {
    const { decimalSeparator = '.' } = options;
    const filtered = Array.from(raw).filter(
        (character) =>
            /\d/.test(character) ||
            character === '-' ||
            character === decimalSeparator
    );

    return filtered.join('');
}
