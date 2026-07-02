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
    const { decimalSeparator, includeCents, symbol, thousandsSeparator } =
        normalizeCurrencyOptions(options);
    const decimalPlaces = includeCents ? 2 : 0;

    return defineFormat({
        name: 'currency',
        normalize(character, state) {
            if (isDigit(character)) {
                const fractionDigitCount = countFractionDigits(
                    state.normalized,
                    decimalSeparator
                );

                // Once we are in the fractional portion, stop accepting digits
                // after the configured decimal-place limit has been reached.
                if (
                    decimalPlaces > 0 &&
                    state.normalized.includes(decimalSeparator) &&
                    fractionDigitCount >= decimalPlaces
                ) {
                    return;
                }

                state.append(character);

                const trimmedValue = trimLeadingZerosInValue(
                    state.normalized,
                    decimalSeparator,
                    false
                );

                state.replace(trimmedValue);

                return;
            }

            // Allow a decimal separator only when decimals are enabled and
            // the normalized value does not already contain one.
            if (
                decimalPlaces > 0 &&
                isDecimalSeparator(character, decimalSeparator) &&
                !state.normalized.includes(decimalSeparator)
            ) {
                state.append(character);

                const trimmedValue = trimLeadingZerosInValue(
                    state.normalized,
                    decimalSeparator,
                    false
                );

                state.replace(trimmedValue);
            }
        },
        format(character, state) {
            if (state.normalizedPosition === 0 && symbol) {
                state.append(symbol);
            }

            if (
                thousandsSeparator &&
                isDigit(character) &&
                shouldInsertThousandsSeparator(
                    state.normalized,
                    state.normalizedPosition,
                    decimalSeparator,
                    false
                )
            ) {
                state.append(thousandsSeparator);
            }

            state.append(character);
            state.advance();
        },
        blur(context) {
            if (!includeCents) {
                return context.formattedValue;
            }

            const valueWithoutSymbol = symbol
                ? context.formattedValue.slice(symbol.length)
                : context.formattedValue;
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
