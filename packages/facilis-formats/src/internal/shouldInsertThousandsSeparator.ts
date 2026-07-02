/**
 * Determines whether a thousands separator should appear before the current
 * integer digit while formatting.
 *
 * @private
 */
export default function shouldInsertThousandsSeparator(
    value: string,
    normalizedPosition: number,
    decimalSeparator: string,
    allowNegative: boolean
) {
    const integerStart = allowNegative && value.startsWith('-') ? 1 : 0;
    const separatorIndex = value.indexOf(decimalSeparator);
    const integerEnd = separatorIndex === -1 ? value.length : separatorIndex;
    const isIntegerDigit =
        normalizedPosition >= integerStart && normalizedPosition < integerEnd;

    if (!isIntegerDigit || normalizedPosition === integerStart) {
        return false;
    }

    const integerDigitsRemaining = integerEnd - normalizedPosition;
    return integerDigitsRemaining % 3 === 0;
}
