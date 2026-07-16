import {
    defineNumberFormat,
    type Format,
    type NumberFormatOptions,
} from 'facilis';

type CurrencyNumberOptions = Pick<
    NumberFormatOptions,
    'decimalSeparator' | 'thousandsSeparator'
>;

/**
 * The configuration options for a currency format.
 *
 * @since 0.1.0
 */
export type CurrencyOptions = CurrencyNumberOptions & {
    /**
     * The currency symbol to prefix the formatted value with. Use an empty
     * string to omit the symbol entirely.
     */
    symbol?: string;

    /**
     * Controls whether the formatted value includes cents.
     */
    includeCents?: boolean;
};

/**
 * Creates a formatter for currency values.
 *
 * @since 0.1.0
 */
export function currency(options: CurrencyOptions = {}): Format {
    const {
        decimalSeparator = '.',
        includeCents = true,
        symbol = '$',
        thousandsSeparator = ',',
    } = options;

    return defineNumberFormat({
        decimalPlaces: includeCents ? 2 : 0,
        decimalSeparator,
        insertLeadingZero: includeCents,
        padDecimalPlaces: includeCents ? 2 : 0,
        thousandsSeparator,
        trimLeadingZeros: true,
        format(resolved) {
            if (resolved === '') return '';

            return `${symbol}${resolved}`;
        },
        blur(resolved) {
            if (resolved === '') return '';

            return `${symbol}${resolved}`;
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
