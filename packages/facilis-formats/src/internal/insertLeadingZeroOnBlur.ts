/**
 * Inserts a leading zero before a decimal-only value when configured to do so.
 *
 * @private
 */
export default function insertLeadingZeroOnBlur(
    value: string,
    decimalSeparator: string,
    allowNegative: boolean
) {
    if (value.startsWith(decimalSeparator)) {
        return `0${value}`;
    }

    if (allowNegative && value.startsWith(`-${decimalSeparator}`)) {
        return `-0${value.slice(1)}`;
    }

    return value;
}
