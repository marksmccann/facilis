/**
 * Options for inserting thousands separators into a number-like string.
 *
 * @since 0.1.0
 */
export type InsertNumberThousandsSeparatorsOptions = {
    /**
     * The decimal separator that marks the start of the fractional portion.
     */
    decimalSeparator?: string;

    /**
     * The separator to insert between digit groups in the whole portion.
     */
    thousandsSeparator?: string;

    /**
     * Whether the value can contain a leading minus sign.
     */
    allowNegative?: boolean;
};

/**
 * Inserts thousands separators into the whole portion of a number-like string.
 *
 * @since 0.1.0
 */
export default function insertNumberThousandsSeparators(
    value: string,
    options: InsertNumberThousandsSeparatorsOptions = {}
) {
    const {
        allowNegative = false,
        decimalSeparator = '.',
        thousandsSeparator = ',',
    } = options;

    if (!thousandsSeparator) {
        return value;
    }

    const integerStart = allowNegative && value.startsWith('-') ? 1 : 0;
    const separatorIndex = value.indexOf(decimalSeparator);
    const integerEnd = separatorIndex === -1 ? value.length : separatorIndex;
    let formatted = '';

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];
        const isIntegerDigit = index >= integerStart && index < integerEnd;
        const isFirstIntegerDigit = index === integerStart;
        const integerDigitsRemaining = integerEnd - index;

        if (
            /\d/.test(character) &&
            isIntegerDigit &&
            !isFirstIntegerDigit &&
            integerDigitsRemaining % 3 === 0
        ) {
            formatted += thousandsSeparator;
        }

        formatted += character;
    }

    return formatted;
}
