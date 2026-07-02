import {
    defineFormat,
    formatBlurValueForNumber,
    normalizeValueForNumber,
    type FormatState,
    type FormatInstance,
    type NormalizeState,
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
        normalize(_character: string, state: NormalizeState) {
            state.replace(
                normalizeValueForNumber(
                    {
                        rawValue: state.rawValue.slice(0, state.index + 1),
                    },
                    {
                        decimalSeparator,
                        decimalPlaces: includeCents ? 2 : 0,
                    }
                )
            );
        },
        format(character: string, state: FormatState) {
            const decimalIndex = state.normalized.indexOf(decimalSeparator);
            const integerEndIndex =
                decimalIndex === -1 ? state.normalized.length : decimalIndex;
            const isIntegerDigit =
                decimalIndex === -1 || state.index < decimalIndex;

            if (state.index === 0 && symbol !== '') {
                state.append(symbol);
            }

            if (character === decimalSeparator) {
                state.append(character);
                state.consume();
                return;
            }

            state.append(character);

            if (isIntegerDigit && thousandsSeparator !== '') {
                const remainingIntegerDigits =
                    integerEndIndex - state.index - 1;

                if (
                    remainingIntegerDigits > 0 &&
                    remainingIntegerDigits % 3 === 0
                ) {
                    state.append(thousandsSeparator);
                }
            }

            state.consume();
        },
        finalize(state) {
            if (!includeCents) return state.formattedValue;

            return formatBlurValueForNumber(state, {
                decimalSeparator,
                padDecimalPlaces: 2,
            });
        },
    })();
}
