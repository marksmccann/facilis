import {
    defineFormat,
    formatBlurValueForNumber,
    normalizeValueForNumber,
    type FormatState,
    type FormatInstance,
    type NormalizeState,
} from 'facilis';

/**
 * The configuration options for a number format.
 *
 * @since 0.0.1
 */
export type NumberOptions = {
    /**
     * The maximum number of decimal places to preserve. The default is `0`,
     * which produces an integer-only format.
     */
    decimalPlaces?: number;

    /**
     * The minimum number of decimal places that should exist after blur. The
     * default is `0`, which leaves the fractional portion unchanged on blur.
     */
    padDecimalPlaces?: number;

    /**
     * The separator to use between the whole and fractional portions of the
     * formatted number value. The default is `'.'`.
     */
    decimalSeparator?: string;

    /**
     * The thousands separator to insert into the formatted integer portion.
     * The default is an empty string, which disables thousands separators.
     */
    thousandsSeparator?: string;

    /**
     * Whether to preserve a leading minus sign for negative values. The
     * default is `false`.
     */
    allowNegative?: boolean;

    /**
     * Whether to insert a leading zero on blur when the value contains a
     * decimal without an integer portion, such as converting `.5` to `0.5`.
     * The default is `false`.
     */
    insertLeadingZero?: boolean;

    /**
     * Whether to trim unnecessary leading zeros from the integer portion,
     * such as converting `00012` to `12`. The default is `false`.
     */
    trimLeadingZeros?: boolean;

    /**
     * The minimum numeric value allowed while typing. Values below this
     * boundary clamp to the minimum as soon as they resolve to a complete
     * number.
     */
    min?: number;

    /**
     * The maximum numeric value allowed while typing. Values above this
     * boundary clamp to the maximum as soon as they resolve to a complete
     * number.
     */
    max?: number;
};

/**
 * Applies the default number-format options when an option is omitted.
 */
function normalizeNumberOptions(options: NumberOptions = {}) {
    return {
        allowNegative: options.allowNegative ?? false,
        decimalPlaces: Math.max(0, options.decimalPlaces ?? 0),
        padDecimalPlaces: Math.max(0, options.padDecimalPlaces ?? 0),
        decimalSeparator: options.decimalSeparator ?? '.',
        insertLeadingZero: options.insertLeadingZero ?? false,
        max: options.max,
        min: options.min,
        thousandsSeparator: options.thousandsSeparator ?? '',
        trimLeadingZeros: options.trimLeadingZeros ?? false,
    };
}

/**
 * Creates a formatter for numeric input with optional decimal precision.
 *
 * @since 0.0.1
 */
export function number(options?: NumberOptions): FormatInstance {
    const numberOptions = normalizeNumberOptions(options);
    const {
        allowNegative,
        decimalPlaces,
        padDecimalPlaces,
        decimalSeparator,
        insertLeadingZero,
        max,
        min,
        thousandsSeparator,
        trimLeadingZeros,
    } = numberOptions;

    return defineFormat({
        name: 'number',
        normalize(_character: string, state: NormalizeState) {
            state.replace(
                normalizeValueForNumber(
                    {
                        rawValue: state.rawValue.slice(0, state.index + 1),
                    },
                    {
                        allowNegative,
                        decimalPlaces,
                        decimalSeparator,
                        max,
                        min,
                        trimLeadingZeros,
                    }
                )
            );
        },
        format(character: string, state: FormatState) {
            const isNegative = state.normalized.startsWith('-');
            const unsignedStartIndex = isNegative ? 1 : 0;
            const decimalIndex = state.normalized.indexOf(decimalSeparator);
            const integerEndIndex =
                decimalIndex === -1 ? state.normalized.length : decimalIndex;

            if (character === '-') {
                state.append(character);
                state.consume();
                return;
            }

            if (character === decimalSeparator) {
                state.append(character);
                state.consume();
                return;
            }

            const unsignedCharacterIndex = state.index - unsignedStartIndex;
            const integerDigitCount = integerEndIndex - unsignedStartIndex;
            const isIntegerDigit =
                decimalIndex === -1 || state.index < decimalIndex;

            state.append(character);

            if (isIntegerDigit && thousandsSeparator !== '') {
                const remainingIntegerDigits =
                    integerDigitCount - unsignedCharacterIndex - 1;

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
            return formatBlurValueForNumber(state, {
                decimalSeparator,
                insertLeadingZero,
                padDecimalPlaces,
            });
        },
    })();
}
