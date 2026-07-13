import {
    clampNumber,
    defineFormat,
    filterNumberCharacters,
    insertNumberLeadingZero,
    isDeleteBackwardBeforeFormatting,
    limitNumberDecimalPlaces,
    padNumberDecimalPlaces,
    resolveSelectionAtDeletedBoundary,
    trimNumberLeadingZeros,
    type Format,
} from 'facilis';

const PERCENT_SYMBOL = '%';

/**
 * The configuration options for a percent format.
 *
 * @since 0.0.1
 */
export type PercentOptions = {
    /**
     * The maximum number of decimal places to preserve. The default is `0`,
     * which produces an integer-only percent format.
     */
    decimalPlaces?: number;

    /**
     * The minimum number of decimal places that should exist after blur. The
     * default is `0`, which leaves the fractional portion unchanged on blur.
     */
    padDecimalPlaces?: number;

    /**
     * The separator to use between the whole and fractional portions of the
     * formatted percent value. The default is `'.'`.
     */
    decimalSeparator?: string;

    /**
     * Whether to preserve a leading minus sign for negative values. The
     * default is `false`.
     */
    allowNegative?: boolean;

    /**
     * The minimum complete percent value to allow while typing.
     */
    min?: number;

    /**
     * The maximum complete percent value to allow while typing.
     */
    max?: number;

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
 * @since 0.0.1
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
        padDecimalPlaces,
    } = normalizedOptions;
    const symbol = includeSymbol ? PERCENT_SYMBOL : '';

    return defineFormat({
        normalize(raw) {
            let value = raw;

            value = filterNumberCharacters(value, {
                allowNegative,
                decimalPlaces,
                decimalSeparator,
            });

            value = limitNumberDecimalPlaces(value, {
                decimalPlaces,
                decimalSeparator,
            });

            value = trimNumberLeadingZeros(value, {
                allowNegative,
                decimalSeparator,
            });

            return clampNumber(value, {
                decimalSeparator,
                max,
                min,
            });
        },
        format(normalized) {
            const formattedValue = normalized;

            if (
                !includeSymbol ||
                isIncompletePercentValue(formattedValue, { decimalSeparator })
            ) {
                return formattedValue;
            }

            return `${formattedValue}${PERCENT_SYMBOL}`;
        },
        blur(formatted) {
            let value = formatted;

            if (symbol && value.endsWith(symbol)) {
                value = value.slice(0, -symbol.length);
            }

            value = insertNumberLeadingZero(value, {
                allowNegative,
                decimalSeparator,
            });

            value = padNumberDecimalPlaces(value, {
                decimalPlaces: padDecimalPlaces,
                decimalSeparator,
            });

            if (
                !includeSymbol ||
                isIncompletePercentValue(value, { decimalSeparator })
            ) {
                return value;
            }

            return `${value}${PERCENT_SYMBOL}`;
        },
        edit: {
            append(context) {
                if (!symbol || !context.formatted.endsWith(symbol)) return;

                const cursor = context.formatted.length - symbol.length;

                return {
                    value: context.formatted,
                    selectionStart: cursor,
                    selectionEnd: cursor,
                };
            },
            insert(context) {
                if (!symbol || !context.formatted.endsWith(symbol)) return;

                const cursor = context.formatted.length - symbol.length;

                return {
                    value: context.formatted,
                    selectionStart: cursor,
                    selectionEnd: cursor,
                };
            },
            deleteBackward(context) {
                const { formatted, previous, start } = context;

                if (
                    symbol &&
                    context.deleted === symbol &&
                    context.normalized.deleted === ''
                ) {
                    return {
                        value: previous,
                        selectionStart: start,
                        selectionEnd: start,
                    };
                }

                if (isDeleteBackwardBeforeFormatting(context, symbol)) {
                    const selection = resolveSelectionAtDeletedBoundary({
                        previous,
                        formatted,
                        start,
                        normalize: context.normalize,
                    });

                    if (selection) {
                        return {
                            value: formatted,
                            ...selection,
                        };
                    }
                }
            },
        },
    });
}
