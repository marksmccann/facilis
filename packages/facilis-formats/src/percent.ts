import {
    defineNumberFormat,
    type Format,
    type NumberFormatOptions,
} from 'facilis';

const PERCENT_SYMBOL = '%';

type PercentNumberOptions = Pick<
    NumberFormatOptions,
    | 'allowNegative'
    | 'decimalPlaces'
    | 'decimalSeparator'
    | 'max'
    | 'min'
    | 'padDecimalPlaces'
>;

/**
 * The configuration options for a percent format.
 *
 * @since 0.1.0
 */
export type PercentOptions = PercentNumberOptions & {
    /**
     * Whether to append the percent symbol to the formatted value. The default
     * is `true`.
     */
    includeSymbol?: boolean;
};

/**
 * Determines whether a normalized value is still an incomplete numeric shell.
 *
 * @private
 */
function isIncompletePercentValue(value: string, decimalSeparator: string) {
    return (
        value === '' ||
        value === '-' ||
        value === decimalSeparator ||
        value === `-${decimalSeparator}`
    );
}

/**
 * Creates a formatter for percent values.
 *
 * @since 0.1.0
 */
export function percent(options?: PercentOptions): Format {
    const {
        includeSymbol = true,
        allowNegative,
        decimalPlaces,
        decimalSeparator,
        padDecimalPlaces,
        max,
        min,
    } = options || {};

    return defineNumberFormat({
        allowNegative,
        decimalPlaces,
        decimalSeparator,
        insertLeadingZero: true,
        max,
        min,
        padDecimalPlaces,
        trimLeadingZeros: true,
        format(resolved, context) {
            const { normalized, decimalSeparator: separator } = context;

            if (
                !includeSymbol ||
                isIncompletePercentValue(normalized, separator)
            ) {
                return resolved;
            }

            return `${resolved}${PERCENT_SYMBOL}`;
        },
        blur(resolved, context) {
            const { decimalSeparator: separator } = context;

            if (
                !includeSymbol ||
                isIncompletePercentValue(resolved, separator)
            ) {
                return resolved;
            }

            return `${resolved}${PERCENT_SYMBOL}`;
        },
    });
}
