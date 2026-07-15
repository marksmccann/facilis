import { defineNumberFormat, type Format } from 'facilis';

/**
 * The configuration options for a currency format.
 *
 * @since 0.1.0
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
 * @since 0.1.0
 */
export function currency(options?: CurrencyOptions): Format {
    const normalizedOptions = normalizeCurrencyOptions(options);
    const { decimalSeparator, includeCents, symbol, thousandsSeparator } =
        normalizedOptions;

    return defineNumberFormat({
        decimalPlaces: includeCents ? 2 : 0,
        decimalSeparator,
        insertLeadingZero: includeCents,
        padDecimalPlaces: includeCents ? 2 : 0,
        thousandsSeparator,
        trimLeadingZeros: true,
        format(normalized, context) {
            if (normalized === '') return '';

            return `${symbol}${context.resolved}`;
        },
        blur(_formatted, context) {
            if (context.resolved === '') return '';

            return `${symbol}${context.resolved}`;
        },
        edit: {
            deleteBackward(context) {
                if (
                    symbol &&
                    context.deleted === symbol &&
                    context.normalized.deleted === ''
                ) {
                    return {
                        value: context.previous,
                        selectionStart: context.start,
                        selectionEnd: context.start,
                    };
                }

                return context.resolved;
            },
        },
    });
}
