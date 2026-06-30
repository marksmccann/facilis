import {
    defineFormat,
    formatValueForNumber,
    normalizeValueForNumber,
    resolveSelectionByCharacterMatch,
    type Facilis,
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
};

/**
 * Applies the default number-format options when an option is omitted.
 */
function normalizeNumberOptions(options: NumberOptions = {}) {
    return {
        allowNegative: options.allowNegative ?? false,
        decimalPlaces: Math.max(0, options.decimalPlaces ?? 0),
        decimalSeparator: options.decimalSeparator ?? '.',
        thousandsSeparator: options.thousandsSeparator ?? '',
    };
}

/**
 * Creates a formatter for numeric input with optional decimal precision.
 *
 * @since 0.0.1
 */
export function number(options?: NumberOptions): Facilis.FormatInstance {
    const numberOptions = normalizeNumberOptions(options);
    const {
        allowNegative,
        decimalPlaces,
        decimalSeparator,
        thousandsSeparator,
    } = numberOptions;

    return defineFormat({
        name: 'number',
        normalizeValue({ rawValue }) {
            return normalizeValueForNumber(rawValue, {
                allowNegative,
                decimalPlaces,
                decimalSeparator,
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
            const escapedDecimalSeparator = decimalSeparator.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            );
            const expression =
                decimalPlaces > 0
                    ? allowNegative
                        ? new RegExp(`[\\d${escapedDecimalSeparator}-]`)
                        : new RegExp(`[\\d${escapedDecimalSeparator}]`)
                    : allowNegative
                      ? /[\d-]/
                      : /\d/;

            return resolveSelectionByCharacterMatch(expression, context);
        },
    })();
}
