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
 * The complete percent-format options after defaults have been applied.
 *
 * @private
 */
type NormalizedPercentOptions = Required<Omit<PercentOptions, 'max' | 'min'>> &
    Pick<PercentOptions, 'max' | 'min'>;

/**
 * Applies the default percent-format options when an option is omitted.
 *
 * @private
 */
function normalizePercentOptions(
    options: PercentOptions = {}
): NormalizedPercentOptions {
    return {
        allowNegative: options.allowNegative ?? false,
        decimalPlaces: Math.max(0, options.decimalPlaces ?? 0),
        decimalSeparator: options.decimalSeparator ?? '.',
        includeSymbol: options.includeSymbol ?? true,
        max: options.max,
        min: options.min,
        padDecimalPlaces: Math.max(0, options.padDecimalPlaces ?? 0),
    };
}

/**
 * Determines whether a normalized value is still an incomplete numeric shell.
 *
 * @private
 */
function isIncompletePercentValue(
    value: string,
    options: Pick<NormalizedPercentOptions, 'decimalSeparator'>
) {
    const { decimalSeparator } = options;

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
    const normalizedOptions = normalizePercentOptions(options);
    const {
        allowNegative,
        decimalPlaces,
        decimalSeparator,
        includeSymbol,
        max,
        min,
        padDecimalPlaces: decimalPlacesToPad,
    } = normalizedOptions;

    return defineNumberFormat({
        allowNegative,
        decimalPlaces,
        decimalSeparator,
        insertLeadingZero: true,
        max,
        min,
        padDecimalPlaces: decimalPlacesToPad,
        trimLeadingZeros: true,
        format(resolved, context) {
            if (
                !includeSymbol ||
                isIncompletePercentValue(context.normalized, {
                    decimalSeparator,
                })
            ) {
                return resolved;
            }

            return `${resolved}${PERCENT_SYMBOL}`;
        },
        blur(resolved) {
            if (
                !includeSymbol ||
                isIncompletePercentValue(resolved, {
                    decimalSeparator,
                })
            ) {
                return resolved;
            }

            return `${resolved}${PERCENT_SYMBOL}`;
        },
    });
}
