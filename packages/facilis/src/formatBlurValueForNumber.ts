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

    /**
     * Whether to insert a leading zero when a decimal value has no integer
     * portion, such as converting `.5` to `0.5` on blur. The default is
     * `false`.
     */
    insertLeadingZero?: boolean;
};

/**
 * Applies the default numeric blur-formatting options when an option is
 * omitted.
 */
function normalizeOptions(options: FormatBlurValueForNumberOptions = {}) {
    return {
        decimalSeparator: options.decimalSeparator ?? '.',
        insertLeadingZero: options.insertLeadingZero ?? false,
        padDecimalPlaces: Math.max(0, options.padDecimalPlaces ?? 0),
    };
}

/**
 * Inserts a leading zero into decimal values like `.5` or `-.5` during blur
 * formatting while preserving partial edit states like `.` and `-.`.
 */
function insertLeadingZeroIntoBlurValue(
    formattedValue: string,
    decimalSeparator: string
) {
    if (
        formattedValue === decimalSeparator ||
        formattedValue === `-${decimalSeparator}`
    ) {
        return formattedValue;
    }

    if (formattedValue.startsWith(`-${decimalSeparator}`)) {
        return formattedValue.replace(
            `-${decimalSeparator}`,
            `-0${decimalSeparator}`
        );
    }

    if (formattedValue.startsWith(decimalSeparator)) {
        return `0${formattedValue}`;
    }

    return formattedValue;
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
    const { decimalSeparator, insertLeadingZero, padDecimalPlaces } =
        normalizedOptions;

    if (insertLeadingZero) {
        formattedValue = insertLeadingZeroIntoBlurValue(
            formattedValue,
            decimalSeparator
        );
    }

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
