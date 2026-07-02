/**
 * Counts the digits that currently exist after the decimal separator.
 *
 * @private
 */
export default function countFractionDigits(
    value: string,
    decimalSeparator: string
) {
    const separatorIndex = value.indexOf(decimalSeparator);

    if (separatorIndex === -1) {
        return 0;
    }

    const startOfFraction = separatorIndex + decimalSeparator.length;
    return value.slice(startOfFraction).length;
}
