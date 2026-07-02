/**
 * Trims unnecessary leading zeros from the integer portion of a value.
 *
 * @private
 */
export default function trimLeadingZerosInValue(
    value: string,
    decimalSeparator: string,
    allowNegative: boolean
) {
    const sign = allowNegative && value.startsWith('-') ? '-' : '';
    const unsignedValue = sign ? value.slice(1) : value;
    const separatorIndex = unsignedValue.indexOf(decimalSeparator);
    const hasFraction = separatorIndex !== -1;
    const integerPart = hasFraction
        ? unsignedValue.slice(0, separatorIndex)
        : unsignedValue;
    const fractionalPart = hasFraction
        ? unsignedValue.slice(separatorIndex)
        : '';

    if (integerPart.length === 0) {
        return `${sign}${unsignedValue}`;
    }

    if (/^0+$/.test(integerPart)) {
        return `${sign}0${fractionalPart}`;
    }

    return `${sign}${integerPart.replace(/^0+/, '')}${fractionalPart}`;
}
