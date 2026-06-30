import {
    defineFormat,
    formatBlurValueForNumber,
    formatValueForNumber,
    normalizeValueForNumber,
    resolveSelectionForNumber,
    type FormatInstance,
} from 'facilis';

/**
 * The configuration options for a number format.
 *
 * @since 0.0.1
 */
export type NumberOptions = {
    /**
     * The maximum number of decimal places to preserve. The default is `0`,
     * which produces an integer-only format.
     */
    decimalPlaces?: number;

    /**
     * The minimum number of decimal places that should exist after blur. The
     * default is `0`, which leaves the fractional portion unchanged on blur.
     */
    padDecimalPlaces?: number;

    /**
     * The separator to use between the whole and fractional portions of the
     * formatted number value. The default is `'.'`.
     */
    decimalSeparator?: string;

    /**
     * The thousands separator to insert into the formatted integer portion.
     * The default is an empty string, which disables thousands separators.
     */
    thousandsSeparator?: string;

    /**
     * Whether to preserve a leading minus sign for negative values. The
     * default is `false`.
     */
    allowNegative?: boolean;

    /**
     * The minimum numeric value allowed while typing. Values below this
     * boundary clamp to the minimum as soon as they resolve to a complete
     * number.
     */
    min?: number;

    /**
     * The maximum numeric value allowed while typing. Values above this
     * boundary clamp to the maximum as soon as they resolve to a complete
     * number.
     */
    max?: number;
};

/**
 * Applies the default number-format options when an option is omitted.
 */
function normalizeNumberOptions(options: NumberOptions = {}) {
    return {
        allowNegative: options.allowNegative ?? false,
        decimalPlaces: Math.max(0, options.decimalPlaces ?? 0),
        padDecimalPlaces: Math.max(0, options.padDecimalPlaces ?? 0),
        decimalSeparator: options.decimalSeparator ?? '.',
        max: options.max,
        min: options.min,
        thousandsSeparator: options.thousandsSeparator ?? '',
    };
}

/**
 * Creates a formatter for numeric input with optional decimal precision.
 *
 * @since 0.0.1
 */
export function number(options?: NumberOptions): FormatInstance {
    const numberOptions = normalizeNumberOptions(options);
    const {
        allowNegative,
        decimalPlaces,
        padDecimalPlaces,
        decimalSeparator,
        max,
        min,
        thousandsSeparator,
    } = numberOptions;

    return defineFormat({
        name: 'number',
        normalizeValue({ rawValue }) {
            return normalizeValueForNumber(rawValue, {
                allowNegative,
                decimalPlaces,
                decimalSeparator,
                max,
                min,
            });
        },
        formatValue({ normalizedValue }) {
            return formatValueForNumber(normalizedValue, {
                decimalPlaces,
                decimalSeparator,
                thousandsSeparator,
            });
        },
        resolveSelection(context) {
            return resolveSelectionForNumber(context, {
                allowDecimal: decimalPlaces > 0,
                allowNegative,
                decimalSeparator,
            });
        },
        formatBlurValue({ formattedValue }) {
            return formatBlurValueForNumber(formattedValue, {
                decimalSeparator,
                padDecimalPlaces,
            });
        },
    })();
}
