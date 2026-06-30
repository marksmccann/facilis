/**
 * The configuration options for numeric blur-value formatting.
 *
 * @since 0.0.1
 */
export type FormatBlurValueForNumberOptions = {
    /**
     * The decimal separator to use in the finalized value. The default is
     * `'.'`.
     */
    decimalSeparator?: string;

    /**
     * The number of decimal places that should be padded on blur. The default
     * is `0`, which leaves the value unchanged.
     */
    padDecimalPlaces?: number;
};

/**
 * Applies the default numeric blur-formatting options when an option is
 * omitted.
 */
function normalizeOptions(options: FormatBlurValueForNumberOptions = {}) {
    return {
        decimalSeparator: options.decimalSeparator ?? '.',
        padDecimalPlaces: Math.max(0, options.padDecimalPlaces ?? 0),
    };
}

/**
 * Finalizes a formatted numeric string for blur-time display.
 *
 * @since 0.0.1
 */
export function formatBlurValueForNumber(
    formattedValue: string,
    options?: FormatBlurValueForNumberOptions
) {
    const normalizedOptions = normalizeOptions(options);
    const { decimalSeparator, padDecimalPlaces } = normalizedOptions;

    if (padDecimalPlaces === 0 || !/\d/.test(formattedValue)) {
        return formattedValue;
    }

    if (!formattedValue.includes(decimalSeparator)) {
        return `${formattedValue}${decimalSeparator}${'0'.repeat(padDecimalPlaces)}`;
    }

    const parts = formattedValue.split(decimalSeparator);
    const [integerPart = '', fractionalPart = ''] = parts;
    const paddedFraction = fractionalPart.padEnd(padDecimalPlaces, '0');

    return `${integerPart}${decimalSeparator}${paddedFraction}`;
}
