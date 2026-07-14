/**
 * Options for inserting a leading zero into a number-like string.
 *
 * @since 0.1.0
 */
export type InsertLeadingZeroOptions = {
    /**
     * The decimal separator that marks the start of the fractional portion.
     */
    decimalSeparator?: string;

    /**
     * Whether the value can contain a leading minus sign.
     */
    allowNegative?: boolean;
};

/**
 * Inserts a leading zero before a decimal-only number-like string.
 *
 * @since 0.1.0
 */
export default function insertLeadingZero(
    value: string,
    options: InsertLeadingZeroOptions = {}
) {
    const { allowNegative = false, decimalSeparator = '.' } = options;

    if (
        value.startsWith(decimalSeparator) &&
        /\d/.test(value.slice(decimalSeparator.length))
    ) {
        return `0${value}`;
    }

    if (
        allowNegative &&
        value.startsWith(`-${decimalSeparator}`) &&
        /\d/.test(value.slice(decimalSeparator.length + 1))
    ) {
        return `-0${value.slice(1)}`;
    }

    return value;
}
