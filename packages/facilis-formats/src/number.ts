import { defineFormat, type Format } from 'facilis';

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
 * Determines whether a character is an ASCII digit.
 *
 * @private
 */
function isDigit(character: string) {
    return /\d/.test(character);
}

/**
 * Determines whether a character is the configured decimal separator.
 *
 * @private
 */
function isDecimalSeparator(character: string, decimalSeparator: string) {
    return character === decimalSeparator;
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
 * Counts the digits that currently exist after the decimal separator.
 *
 * @private
 */
function countFractionDigits(value: string, decimalSeparator: string) {
    const separatorIndex = value.indexOf(decimalSeparator);
    if (separatorIndex === -1) return 0;
    const startOfFraction = separatorIndex + decimalSeparator.length;
    return value.slice(startOfFraction).length;
}

/**
 * Inserts a leading zero before a decimal-only value when configured to do so.
 *
 * @private
 */
function insertLeadingZeroOnBlur(
    value: string,
    decimalSeparator: string,
    allowNegative: boolean
) {
    if (value.startsWith(decimalSeparator)) {
        return `0${value}`;
    }

    if (allowNegative && value.startsWith(`-${decimalSeparator}`)) {
        return `-0${value.slice(1)}`;
    }

    return value;
}

/**
 * Pads the fractional portion on blur until the configured width is reached.
 *
 * @private
 */
function padDecimalPlacesOnBlur(
    value: string,
    decimalSeparator: string,
    padDecimalPlaces: number
) {
    if (padDecimalPlaces <= 0) {
        return value;
    }

    if (!value.includes(decimalSeparator)) {
        return `${value}${decimalSeparator}${'0'.repeat(padDecimalPlaces)}`;
    }

    const fractionDigitCount = countFractionDigits(value, decimalSeparator);

    if (fractionDigitCount >= padDecimalPlaces) {
        return value;
    }

    return `${value}${'0'.repeat(padDecimalPlaces - fractionDigitCount)}`;
}

/**
 * Trims unnecessary leading zeros from the integer portion of a value.
 *
 * @private
 */
function trimLeadingZerosInValue(
    value: string,
    decimalSeparator: string,
    allowNegative: boolean
) {
    const sign = allowNegative && value.startsWith('-') ? '-' : '';
    const unsignedValue = sign ? value.slice(1) : value;
    const separatorIndex = unsignedValue.indexOf(decimalSeparator);
    const hasFraction = separatorIndex !== -1;
    const integerPart = hasFraction
        ? unsignedValue.slice(0, separatorIndex)
        : unsignedValue;
    const fractionalPart = hasFraction
        ? unsignedValue.slice(separatorIndex)
        : '';

    if (integerPart.length === 0) {
        return `${sign}${unsignedValue}`;
    }

    if (/^0+$/.test(integerPart)) {
        return `${sign}0${fractionalPart}`;
    }

    return `${sign}${integerPart.replace(/^0+/, '')}${fractionalPart}`;
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
        padDecimalPlaces,
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
