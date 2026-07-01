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
     * Whether to insert a leading zero on blur when the value contains a
     * decimal without an integer portion, such as converting `.5` to `0.5`.
     * The default is `false`.
     */
    insertLeadingZero?: boolean;

    /**
     * Whether to trim unnecessary leading zeros from the integer portion,
     * such as converting `00012` to `12`. The default is `false`.
     */
    trimLeadingZeros?: boolean;

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
        insertLeadingZero: options.insertLeadingZero ?? false,
        max: options.max,
        min: options.min,
        thousandsSeparator: options.thousandsSeparator ?? '',
        trimLeadingZeros: options.trimLeadingZeros ?? false,
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
        insertLeadingZero,
        max,
        min,
        thousandsSeparator,
        trimLeadingZeros,
    } = numberOptions;

    return defineFormat({
        name: 'number',
        normalizeValue(context) {
            return normalizeValueForNumber(context, {
                allowNegative,
                decimalPlaces,
                decimalSeparator,
                max,
                min,
                trimLeadingZeros,
            });
        },
        formatValue(context) {
            return formatValueForNumber(context, {
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
        formatBlurValue(context) {
            return formatBlurValueForNumber(context, {
                decimalSeparator,
                insertLeadingZero,
                padDecimalPlaces,
            });
        },
    })();
}
