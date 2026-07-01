import {
    defineFormat,
    formatBlurValueForNumber,
    formatValueForNumber,
    normalizeValueForNumber,
    resolveSelectionForNumber,
    type FormatInstance,
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
 * Creates a formatter for currency values with comma-separated thousands,
 * an optional configurable currency symbol, and configurable decimal display.
 */
export function currency(options?: CurrencyOptions): FormatInstance {
    const currencyOptions = normalizeCurrencyOptions(options);
    const { decimalSeparator, includeCents, symbol, thousandsSeparator } =
        currencyOptions;

    return defineFormat({
        name: 'currency',
        normalizeValue(context) {
            return normalizeValueForNumber(context, {
                decimalSeparator,
                decimalPlaces: includeCents ? 2 : 0,
            });
        },
        formatValue(context) {
            const formattedValue = formatValueForNumber(context, {
                decimalSeparator,
                decimalPlaces: includeCents ? 2 : 0,
                thousandsSeparator,
            });

            return `${symbol}${formattedValue}`;
        },
        resolveSelection(context) {
            return resolveSelectionForNumber(context, {
                allowDecimal: includeCents,
                decimalSeparator,
            });
        },
        formatBlurValue(context) {
            if (!includeCents) return context.formattedValue;

            return formatBlurValueForNumber(context, {
                decimalSeparator,
                padDecimalPlaces: 2,
            });
        },
    })();
}
