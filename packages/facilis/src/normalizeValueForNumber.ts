/**
 * The configuration options for numeric value normalization.
 *
 * @since 0.0.1
 */
export type NormalizeValueForNumberOptions = {
    /**
     * The maximum number of decimal places to preserve. The default is `0`,
     * which produces an integer-only normalized value.
     */
    decimalPlaces?: number;

    /**
     * The decimal separator to recognize in the raw input. The default is
     * `'.'`.
     */
    decimalSeparator?: string;

    /**
     * Whether to preserve a leading minus sign for negative values. The
     * default is `false`.
     */
    allowNegative?: boolean;
};

/**
 * Applies the default numeric-normalization options when an option is omitted.
 */
function normalizeOptions(options: NormalizeValueForNumberOptions = {}) {
    return {
        allowNegative: options.allowNegative ?? false,
        decimalSeparator: options.decimalSeparator ?? '.',
        decimalPlaces: Math.max(0, options.decimalPlaces ?? 0),
    };
}

/**
 * Creates a global regular expression that matches one literal separator.
 */
function createSeparatorExpression(value: string) {
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedValue, 'g');
}

/**
 * Normalizes the raw numeric characters by keeping only digits and the
 * configured decimal separator.
 */
function normalizeCharacters(rawValue: string, decimalSeparator: string) {
    const { source } = createSeparatorExpression(decimalSeparator);

    // Remove all non-numeric characters from string
    const numericCharacters = rawValue.replace(
        new RegExp(`[^\\d${source}]`, 'g'),
        ''
    );

    return numericCharacters;
}

/**
 * Normalizes the decimal portion by keeping only the first decimal point and
 * trimming the fractional portion to the configured precision.
 */
function normalizeDecimalValue(
    normalizedCharacters: string,
    firstDecimalIndex: number,
    decimalPlaces: number,
    decimalSeparator: string
) {
    const integerDigits = normalizedCharacters.slice(0, firstDecimalIndex);
    const fractionalDigits = normalizedCharacters.slice(firstDecimalIndex + 1);
    const separatorExpression = createSeparatorExpression(decimalSeparator);
    // prettier-ignore
    const fractionalCharacters = fractionalDigits.replace(separatorExpression, '');
    const fractionalValue = fractionalCharacters.slice(0, decimalPlaces);

    return `${integerDigits}${decimalSeparator}${fractionalValue}`;
}

/**
 * Normalizes one raw input value into its semantic numeric string by removing
 * non-essential characters, keeping at most one decimal point, and truncating
 * the fractional portion to the configured precision.
 *
 * @since 0.0.1
 */
export function normalizeValueForNumber(
    rawValue: string,
    options?: NormalizeValueForNumberOptions
) {
    // prettier-ignore
    const { allowNegative, decimalPlaces, decimalSeparator } = normalizeOptions(options);
    // prettier-ignore
    const normalizedCharacters = normalizeCharacters(rawValue, decimalSeparator);
    const hasLeadingNegativeSign = /^\s*-/.test(rawValue);
    const firstDecimalIndex = normalizedCharacters.indexOf(decimalSeparator);
    let normalizedValue: string;

    if (decimalPlaces === 0) {
        // decimals are not supported, remove them
        normalizedValue = normalizedCharacters.replace(
            createSeparatorExpression(decimalSeparator),
            ''
        );
    } else if (firstDecimalIndex === -1) {
        // decimals are supported, but there aren't any
        normalizedValue = normalizedCharacters;
    } else {
        // decimals are support and they exist
        normalizedValue = normalizeDecimalValue(
            normalizedCharacters,
            firstDecimalIndex,
            decimalPlaces,
            decimalSeparator
        );
    }

    if (allowNegative && hasLeadingNegativeSign) {
        normalizedValue = `-${normalizedValue}`;
    }

    return normalizedValue;
}
