import { defineFormat, type Format } from 'facilis';
import countFractionDigits from './internal/countFractionDigits';
import insertLeadingZeroOnBlur from './internal/insertLeadingZeroOnBlur';
import isDecimalSeparator from './internal/isDecimalSeparator';
import isDigit from './internal/isDigit';
import padDecimalPlacesOnBlur from './internal/padDecimalPlacesOnBlur';
import shouldInsertThousandsSeparator from './internal/shouldInsertThousandsSeparator';
import trimLeadingZerosInValue from './internal/trimLeadingZerosInValue';

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
 *
 * @private
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
 * Determines whether a character is a minus sign.
 *
 * @private
 */
function isNegativeSign(character: string) {
    return character === '-';
}

/**
 * Clamps a complete numeric value to the configured numeric bounds.
 *
 * @private
 */
function clampCompleteNumberValue(
    value: string,
    decimalSeparator: string,
    min?: number,
    max?: number
) {
    if (
        value.length === 0 ||
        value === '-' ||
        value.endsWith(decimalSeparator)
    ) {
        return value;
    }

    const numericValue = Number(value.replace(decimalSeparator, '.'));

    if (!Number.isFinite(numericValue)) {
        return value;
    }

    if (min !== undefined && numericValue < min) {
        return String(min);
    }

    if (max !== undefined && numericValue > max) {
        return String(max);
    }

    return value;
}

/**
 * Determines whether the current normalized value is complete enough to clamp.
 *
 * @private
 */
function shouldClampNumberValue(
    value: string,
    decimalPlaces: number,
    decimalSeparator: string
) {
    const shouldClampInteger = decimalPlaces === 0;
    const shouldClampDecimal =
        decimalPlaces > 0 &&
        value.includes(decimalSeparator) &&
        !value.endsWith(decimalSeparator);

    return shouldClampInteger || shouldClampDecimal;
}

/**
 * Creates a formatter for numeric input.
 *
 * @since 0.0.1
 */
export function number(options?: NumberOptions): Format {
    const {
        allowNegative,
        decimalSeparator,
        decimalPlaces,
        insertLeadingZero,
        max,
        min,
        padDecimalPlaces,
        thousandsSeparator,
        trimLeadingZeros,
    } = normalizeNumberOptions(options);

    return defineFormat({
        name: 'number',
        normalize(character, state) {
            // Allow a minus sign only when negative values are enabled and
            // the normalized value is still empty.
            if (
                allowNegative &&
                isNegativeSign(character) &&
                state.normalized.length === 0
            ) {
                state.append(character);

                return;
            }

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

                if (trimLeadingZeros) {
                    const trimmedValue = trimLeadingZerosInValue(
                        state.normalized,
                        decimalSeparator,
                        allowNegative
                    );

                    state.replace(trimmedValue);
                }

                if (
                    shouldClampNumberValue(
                        state.normalized,
                        decimalPlaces,
                        decimalSeparator
                    )
                ) {
                    const clampedValue = clampCompleteNumberValue(
                        state.normalized,
                        decimalSeparator,
                        min,
                        max
                    );

                    state.replace(clampedValue);
                }

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

                if (trimLeadingZeros) {
                    const trimmedValue = trimLeadingZerosInValue(
                        state.normalized,
                        decimalSeparator,
                        allowNegative
                    );

                    state.replace(trimmedValue);
                }
            }
        },
        format(character, state) {
            if (
                thousandsSeparator &&
                isDigit(character) &&
                shouldInsertThousandsSeparator(
                    state.normalized,
                    state.normalizedPosition,
                    decimalSeparator,
                    allowNegative
                )
            ) {
                state.append(thousandsSeparator);
            }

            state.append(character);
            state.advance();
        },
        blur(context) {
            let blurredValue = context.formattedValue;

            if (insertLeadingZero) {
                blurredValue = insertLeadingZeroOnBlur(
                    blurredValue,
                    decimalSeparator,
                    allowNegative
                );
            }

            return padDecimalPlacesOnBlur(
                blurredValue,
                decimalSeparator,
                padDecimalPlaces
            );
        },
    });
}
