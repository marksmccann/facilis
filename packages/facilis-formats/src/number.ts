import { defineFormat, type Format } from 'facilis';
import {
    isDeleteBackwardBeforeFormatting,
    isDeleteBackwardOverFormatting,
} from 'facilis/guards';
import {
    resolveSelectionAtDeletedBoundary,
    resolveSelectionBeforeFormatting,
} from 'facilis/selection';
import {
    clampNumber,
    filterNumberCharacters,
    insertLeadingZero,
    insertThousandsSeparators,
    limitDecimalPlaces,
    normalizeNegativeSign,
    padDecimalPlaces,
    removeExtraDecimalSeparators,
    trimLeadingZeros,
} from 'facilis/transforms';

/**
 * The configuration options for a number format.
 *
 * @since 0.1.0
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
     * Whether to remove unnecessary leading zeros from the integer portion
     * while typing. The default is `false`.
     */
    trimLeadingZeros?: boolean;

    /**
     * The minimum complete numeric value to allow while typing.
     */
    min?: number;

    /**
     * The maximum complete numeric value to allow while typing.
     */
    max?: number;
};

/**
 * The complete number-format options after defaults have been applied.
 *
 * @private
 */
type NormalizedNumberOptions = Required<Omit<NumberOptions, 'max' | 'min'>> &
    Pick<NumberOptions, 'max' | 'min'>;

/**
 * Applies the default number-format options when an option is omitted.
 *
 * @private
 */
function normalizeNumberOptions(
    options: NumberOptions = {}
): NormalizedNumberOptions {
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
 * Creates a formatter for numeric input.
 *
 * @since 0.1.0
 */
export function number(options?: NumberOptions): Format {
    const normalizedOptions = normalizeNumberOptions(options);
    const {
        thousandsSeparator,
        decimalSeparator,
        allowNegative,
        decimalPlaces,
        trimLeadingZeros: shouldTrimLeadingZeros,
        padDecimalPlaces: decimalPlacesToPad,
        insertLeadingZero: shouldInsertLeadingZero,
        min,
        max,
    } = normalizedOptions;

    return defineFormat({
        normalize(raw) {
            let value = raw;

            value = filterNumberCharacters(value, {
                decimalSeparator,
            });

            value = removeExtraDecimalSeparators(value, {
                decimalSeparator,
            });

            value = normalizeNegativeSign(value, {
                allowNegative,
            });

            value = limitDecimalPlaces(value, {
                decimalPlaces,
                decimalSeparator,
            });

            if (shouldTrimLeadingZeros) {
                value = trimLeadingZeros(value, {
                    allowNegative,
                    decimalSeparator,
                });
            }

            return clampNumber(value, {
                decimalSeparator,
                max: max,
                min: min,
            });
        },
        format(normalized) {
            return insertThousandsSeparators(normalized, {
                allowNegative,
                decimalSeparator,
                thousandsSeparator,
            });
        },
        blur(formatted) {
            let value = formatted;

            if (shouldInsertLeadingZero) {
                value = insertLeadingZero(formatted, {
                    allowNegative,
                    decimalSeparator,
                });
            }

            value = padDecimalPlaces(value, {
                decimalPlaces: decimalPlacesToPad,
                decimalSeparator,
            });

            return value;
        },
        edit: {
            deleteBackward(context) {
                const { cursor, formatted, previous, start } = context;
                const formatting = thousandsSeparator;

                // prettier-ignore
                const selectionBeforeFormatting = resolveSelectionBeforeFormatting({
                    value: previous,
                    position: cursor,
                    formatting,
                });

                if (
                    selectionBeforeFormatting &&
                    isDeleteBackwardOverFormatting(context)
                ) {
                    return {
                        value: previous,
                        ...selectionBeforeFormatting,
                    };
                }

                if (isDeleteBackwardBeforeFormatting(context, formatting)) {
                    const selection = resolveSelectionAtDeletedBoundary({
                        previous,
                        formatted,
                        start,
                        normalize: context.normalize,
                    });

                    if (selection) {
                        return {
                            value: formatted,
                            ...selection,
                        };
                    }
                }
            },
        },
    });
}
