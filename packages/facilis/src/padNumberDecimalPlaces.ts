/**
 * Options for padding the fractional portion of a number-like string.
 *
 * @since 0.1.0
 */
export type PadNumberDecimalPlacesOptions = {
    /**
     * The decimal separator that marks the start of the fractional portion.
     */
    decimalSeparator?: string;

    /**
     * The minimum number of fractional digits that should exist.
     */
    decimalPlaces?: number;
};

/**
 * Pads the fractional portion of a number-like string until it reaches the
 * requested width.
 *
 * @since 0.1.0
 */
export default function padNumberDecimalPlaces(
    value: string,
    options: PadNumberDecimalPlacesOptions = {}
) {
    const { decimalPlaces = 0, decimalSeparator = '.' } = options;
    const places = Math.max(0, decimalPlaces);

    if (places <= 0) {
        return value;
    }

    if (value === '' || !/\d/.test(value)) {
        return value;
    }

    if (!value.includes(decimalSeparator)) {
        return `${value}${decimalSeparator}${'0'.repeat(places)}`;
    }

    const separatorIndex = value.indexOf(decimalSeparator);
    const fractionStart = separatorIndex + decimalSeparator.length;
    const fractionDigitCount = value.slice(fractionStart).length;

    if (fractionDigitCount >= places) {
        return value;
    }

    return `${value}${'0'.repeat(places - fractionDigitCount)}`;
}
