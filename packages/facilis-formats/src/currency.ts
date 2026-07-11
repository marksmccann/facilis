import { defineFormat, type Format } from 'facilis';
import countFractionDigits from './internal/countFractionDigits';
import insertLeadingZeroOnBlur from './internal/insertLeadingZeroOnBlur';
import isDecimalSeparator from './internal/isDecimalSeparator';
import isDigit from './internal/isDigit';
import padDecimalPlacesOnBlur from './internal/padDecimalPlacesOnBlur';
import shouldInsertThousandsSeparator from './internal/shouldInsertThousandsSeparator';
import trimLeadingZerosInValue from './internal/trimLeadingZerosInValue';

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
 * Extracts the numeric currency value from one display value.
 *
 * @private
 */
function normalizeCurrencyValue(
    raw: string,
    {
        decimalSeparator,
        includeCents,
    }: ReturnType<typeof normalizeCurrencyOptions>
) {
    let value = '';

    for (const character of raw) {
        if (isDigit(character)) {
            const fractionDigitCount = countFractionDigits(
                value,
                decimalSeparator
            );

            if (
                includeCents &&
                value.includes(decimalSeparator) &&
                fractionDigitCount >= 2
            ) {
                continue;
            }

            value += character;
            value = trimLeadingZerosInValue(value, decimalSeparator, false);
            continue;
        }

        if (
            includeCents &&
            isDecimalSeparator(character, decimalSeparator) &&
            !value.includes(decimalSeparator)
        ) {
            value += decimalSeparator;
            value = trimLeadingZerosInValue(value, decimalSeparator, false);
        }
    }

    return value;
}

/**
 * Formats one normalized currency value for display.
 *
 * @private
 */
function formatCurrencyValue(
    value: string,
    {
        decimalSeparator,
        symbol,
        thousandsSeparator,
    }: ReturnType<typeof normalizeCurrencyOptions>
) {
    if (value === '') {
        return '';
    }

    let formattedValue = symbol;

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];

        if (
            thousandsSeparator &&
            isDigit(character) &&
            shouldInsertThousandsSeparator(
                value,
                index,
                decimalSeparator,
                false
            )
        ) {
            formattedValue += thousandsSeparator;
        }

        formattedValue += character;
    }

    return formattedValue;
}

/**
 * Creates a formatter for currency values.
 *
 * @since 0.0.1
 */
export function currency(options?: CurrencyOptions): Format {
    const normalizedOptions = normalizeCurrencyOptions(options);
    const { decimalSeparator, includeCents, symbol } = normalizedOptions;

    return defineFormat({
        normalize(raw) {
            return normalizeCurrencyValue(raw, normalizedOptions);
        },
        format(normalized) {
            return formatCurrencyValue(normalized, normalizedOptions);
        },
        blur(formatted) {
            if (!includeCents) {
                return formatted;
            }

            const valueWithoutSymbol = symbol
                ? formatted.slice(symbol.length)
                : formatted;
            const withLeadingZero = insertLeadingZeroOnBlur(
                valueWithoutSymbol,
                decimalSeparator,
                false
            );
            const paddedValue = padDecimalPlacesOnBlur(
                withLeadingZero,
                decimalSeparator,
                2
            );

            return `${symbol}${paddedValue}`;
        },
    });
}
