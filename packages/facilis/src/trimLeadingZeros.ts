/**
 * Options for trimming unnecessary leading zeros from a number-like string.
 *
 * @since 0.1.0
 */
export type TrimLeadingZerosOptions = {
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
 * Trims unnecessary leading zeros from the integer portion of a number-like
 * string while preserving incomplete decimal values.
 *
 * @since 0.1.0
 */
export default function trimLeadingZeros(
    value: string,
    options: TrimLeadingZerosOptions = {}
) {
    const { allowNegative = false, decimalSeparator = '.' } = options;
    const sign = allowNegative && value.startsWith('-') ? '-' : '';
    const unsignedValue = sign ? value.slice(1) : value;
    const separatorIndex = unsignedValue.indexOf(decimalSeparator);
    const hasFraction = separatorIndex !== -1;
    let integerPart = unsignedValue;
    let fractionalPart = '';

    if (hasFraction) {
        integerPart = unsignedValue.slice(0, separatorIndex);
        fractionalPart = unsignedValue.slice(separatorIndex);
    }

    if (integerPart.length === 0) {
        return `${sign}${unsignedValue}`;
    }

    if (/^0+$/.test(integerPart)) {
        return `${sign}0${fractionalPart}`;
    }

    return `${sign}${integerPart.replace(/^0+/, '')}${fractionalPart}`;
}
