/**
 * Determines whether a character is the configured decimal separator.
 *
 * @private
 */
export default function isDecimalSeparator(
    character: string,
    decimalSeparator: string
) {
    return character === decimalSeparator;
}
