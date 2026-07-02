import {
    defineFormat,
    type Format,
} from 'facilis';

/**
 * The configuration options for a currency format.
 *
 * @since 0.0.1
 */
export type CurrencyOptions = {
    symbol?: string;
    decimalSeparator?: string;
    thousandsSeparator?: string;
    includeCents?: boolean;
};

/**
 * Creates a formatter for currency values.
 *
 * @since 0.0.1
 */
export function currency(_options?: CurrencyOptions): Format {
    return defineFormat({
        name: 'currency',
        normalize(_character, _state) {},
        format(_character, _state) {},
    });
}
