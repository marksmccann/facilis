import {
    defineFormat,
    filterNumberCharacters,
    insertLeadingZero,
    insertThousandsSeparators,
    isDeleteBackwardBeforeFormatting,
    isDeleteBackwardOverFormatting,
    limitDecimalPlaces,
    padDecimalPlaces,
    resolveSelectionAtDeletedBoundary,
    resolveSelectionBeforeFormatting,
    trimLeadingZeros,
    type Format,
} from 'facilis';

/**
 * The configuration options for a currency format.
 *
 * @since 0.0.1
 */
export type CurrencyOptions = {
    /**
     * The currency symbol to prefix the formatted value with. Use an empty
     * string to omit the symbol entirely.
     */
    symbol?: string;

    /**
     * The separator to use between the whole and fractional portions of the
     * formatted value. The default is `'.'`.
     */
    decimalSeparator?: string;

    /**
     * The separator to use between digit groups in the whole portion of the
     * formatted value. The default is `','`.
     */
    thousandsSeparator?: string;

    /**
     * Controls whether the formatted value includes cents.
     */
    includeCents?: boolean;
};

/**
 * Applies the default currency symbol and cents behavior when an option is
 * omitted.
 *
 * @private
 */
function normalizeCurrencyOptions(options: CurrencyOptions = {}) {
    return {
        decimalSeparator: options.decimalSeparator ?? '.',
        includeCents: options.includeCents ?? true,
        symbol: options.symbol ?? '$',
        thousandsSeparator: options.thousandsSeparator ?? ',',
    };
}

/**
 * Creates a formatter for currency values.
 *
 * @since 0.0.1
 */
export function currency(options?: CurrencyOptions): Format {
    const normalizedOptions = normalizeCurrencyOptions(options);
    const { decimalSeparator, includeCents, symbol, thousandsSeparator } =
        normalizedOptions;

    return defineFormat({
        normalize(raw) {
            let value = raw;

            value = filterNumberCharacters(value, {
                decimalPlaces: includeCents ? 2 : 0,
                decimalSeparator,
            });

            value = limitDecimalPlaces(value, {
                decimalPlaces: includeCents ? 2 : 0,
                decimalSeparator,
            });

            return trimLeadingZeros(value, {
                decimalSeparator,
            });
        },
        format(normalized) {
            if (normalized === '') return '';

            const formattedValue = insertThousandsSeparators(normalized, {
                decimalSeparator,
                thousandsSeparator,
            });

            return `${symbol}${formattedValue}`;
        },
        blur(formatted) {
            let value = formatted;

            if (!includeCents) return formatted;

            if (symbol) value = value.slice(symbol.length);

            value = insertLeadingZero(value, { decimalSeparator });

            value = padDecimalPlaces(value, {
                decimalPlaces: 2,
                decimalSeparator,
            });

            return `${symbol}${value}`;
        },
        edit: {
            deleteBackward(context) {
                const { cursor, formatted, previous, start } = context;
                const formatting = thousandsSeparator;

                // prettier-ignore
                const selectionBeforeSeparator = resolveSelectionBeforeFormatting({
                    value: previous,
                    position: cursor,
                    formatting,
                });

                if (
                    selectionBeforeSeparator &&
                    isDeleteBackwardOverFormatting(context)
                ) {
                    return {
                        value: previous,
                        ...selectionBeforeSeparator,
                    };
                }

                if (isDeleteBackwardOverFormatting(context)) {
                    return {
                        value: previous,
                        selectionStart: cursor - 1,
                        selectionEnd: cursor - 1,
                    };
                }

                if (isDeleteBackwardBeforeFormatting(context, formatting)) {
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
