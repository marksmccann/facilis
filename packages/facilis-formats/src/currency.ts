import {
    defineFormat,
    formatValueForNumber,
    normalizeValueForNumber,
    resolveSelectionByCharacterMatch,
    type Facilis,
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
export function currency(options?: CurrencyOptions): Facilis.FormatInstance {
    const currencyOptions = normalizeCurrencyOptions(options);
    const { decimalSeparator, includeCents, symbol, thousandsSeparator } =
        currencyOptions;

    return defineFormat({
        name: 'currency',
        normalizeValue({ rawValue }) {
            return normalizeValueForNumber(rawValue, {
                decimalSeparator,
                decimalPlaces: includeCents ? 2 : 0,
            });
        },
        formatValue({ normalizedValue }) {
            if (normalizedValue === '') return '';

            const formattedValue = formatValueForNumber(normalizedValue, {
                decimalSeparator,
                decimalPlaces: includeCents ? 2 : 0,
                thousandsSeparator,
            });

            return `${symbol}${formattedValue}`;
        },
        formatBlurValue({ formattedValue }) {
            if (formattedValue === '') return '';

            if (!includeCents) return formattedValue;

            if (!formattedValue.includes(decimalSeparator)) {
                return `${formattedValue}${decimalSeparator}00`;
            }

            const parts = formattedValue.split(decimalSeparator);
            const [integerPart = '', fractionalPart = ''] = parts;

            return `${integerPart}${decimalSeparator}${fractionalPart.padEnd(2, '0').slice(0, 2)}`;
        },
        resolveSelection(context) {
            const escapedDecimalSeparator = decimalSeparator.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            );
            const expression =
                !includeCents
                    ? /\d/
                    : new RegExp(`[\\d${escapedDecimalSeparator}]`);
            return resolveSelectionByCharacterMatch(expression, context);
        },
    })();
}
