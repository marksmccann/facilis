/**
 * Options for limiting the fractional portion of a number-like string.
 *
 * @since 0.1.0
 */
export type LimitDecimalPlacesOptions = {
    /**
     * The decimal separator that marks the start of the fractional portion.
     */
    decimalSeparator?: string;

    /**
     * The maximum number of fractional digits to preserve.
     */
    decimalPlaces?: number;
};

/**
 * Limits the number of digits after the decimal separator.
 *
 * @since 0.1.0
 */
export default function limitDecimalPlaces(
    value: string,
    options: LimitDecimalPlacesOptions = {}
) {
    const { decimalPlaces = 0, decimalSeparator = '.' } = options;
    const separatorIndex = value.indexOf(decimalSeparator);

    if (separatorIndex === -1) {
        return value;
    }

    const limit = Math.max(0, decimalPlaces);
    const integerPart = value.slice(0, separatorIndex);
    const fractionStart = separatorIndex + decimalSeparator.length;
    const fractionPart = value.slice(fractionStart, fractionStart + limit);

    if (limit === 0) {
        return integerPart;
    }

    return `${integerPart}${decimalSeparator}${fractionPart}`;
}
