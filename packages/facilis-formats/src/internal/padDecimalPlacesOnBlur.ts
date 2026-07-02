import countFractionDigits from './countFractionDigits';

/**
 * Pads the fractional portion on blur until the configured width is reached.
 *
 * @private
 */
export default function padDecimalPlacesOnBlur(
    value: string,
    decimalSeparator: string,
    padDecimalPlaces: number
) {
    if (padDecimalPlaces <= 0) {
        return value;
    }

    if (!value.includes(decimalSeparator)) {
        return `${value}${decimalSeparator}${'0'.repeat(padDecimalPlaces)}`;
    }

    const fractionDigitCount = countFractionDigits(value, decimalSeparator);

    if (fractionDigitCount >= padDecimalPlaces) {
        return value;
    }

    return `${value}${'0'.repeat(padDecimalPlaces - fractionDigitCount)}`;
}
