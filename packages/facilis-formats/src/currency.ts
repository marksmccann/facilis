import {
    defineFormat,
    resolveSelectionByCharacterMatch,
    type Facilis,
} from 'facilis';

/**
 * Controls whether a currency format should include cents.
 *
 * @since 0.0.1
 */
export type CurrencyCents = 'always' | 'never';

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
     * Controls whether cents are included in the formatted value.
     */
    cents?: CurrencyCents;
};

/**
 * Applies the default currency symbol and cents mode when an option is
 * omitted.
 */
function normalizeCurrencyOptions(options: CurrencyOptions = {}) {
    return {
        symbol: options.symbol ?? '$',
        cents: options.cents ?? 'always',
    };
}

/**
 * Creates a formatter for currency values with comma-separated thousands,
 * an optional configurable currency symbol, and configurable decimal display.
 */
export function currency(options?: CurrencyOptions): Facilis.FormatInstance {
    const currencyOptions = normalizeCurrencyOptions(options);
    const { symbol, cents } = currencyOptions;

    return defineFormat({
        name: 'currency',
        normalizeValue({ rawValue }) {
            const cleaned = rawValue.replace(/[^\d.]/g, '');
            const firstDecimalIndex = cleaned.indexOf('.');

            if (firstDecimalIndex === -1) {
                return cleaned.replace(/\./g, '');
            }

            const integerPart = cleaned.slice(0, firstDecimalIndex);

            if (cents === 'never') {
                return integerPart.replace(/\./g, '');
            }

            const afterFirstDecimal = cleaned.slice(firstDecimalIndex + 1);
            const fractionalPart = afterFirstDecimal.replace(/\./g, '');

            return `${integerPart}.${fractionalPart.slice(0, 2)}`;
        },
        formatValue({ normalizedValue }) {
            if (normalizedValue === '') return '';

            const commasRegex = /\B(?=(\d{3})+(?!\d))/g;
            const hasDecimal = normalizedValue.includes('.');
            const parts = normalizedValue.split('.');
            const [integerPart = '', fractionalPart = ''] = parts;
            const formattedInteger = integerPart.replace(commasRegex, ',');

            if (!hasDecimal || cents === 'never') {
                return `${symbol}${formattedInteger}`;
            }

            return `${symbol}${formattedInteger}.${fractionalPart}`;
        },
        formatBlurValue({ formattedValue }) {
            if (formattedValue === '') return '';

            if (cents === 'never') return formattedValue;

            if (!formattedValue.includes('.')) return `${formattedValue}.00`;

            const parts = formattedValue.split('.');
            const [integerPart = '', fractionalPart = ''] = parts;

            return `${integerPart}.${fractionalPart.padEnd(2, '0').slice(0, 2)}`;
        },
        resolveSelection(context) {
            const expression = cents === 'never' ? /\d/ : /[\d.]/;
            return resolveSelectionByCharacterMatch(expression, context);
        },
    })();
}
