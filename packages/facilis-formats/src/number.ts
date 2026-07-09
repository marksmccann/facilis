import { defineFormat, type Format } from 'facilis';
import insertLeadingZeroOnBlur from './internal/insertLeadingZeroOnBlur';
import isDecimalSeparator from './internal/isDecimalSeparator';
import isDigit from './internal/isDigit';
import isNegativeSign from './internal/isNegativeSign';
import padDecimalPlacesOnBlur from './internal/padDecimalPlacesOnBlur';
import shouldInsertThousandsSeparator from './internal/shouldInsertThousandsSeparator';

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
};

type NormalizedNumberOptions = Required<NumberOptions>;

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
        thousandsSeparator: options.thousandsSeparator ?? '',
    };
}

function canAppendFractionDigit(
    value: string,
    decimalSeparator: string,
    decimalPlaces: number
) {
    const separatorIndex = value.indexOf(decimalSeparator);

    if (separatorIndex === -1) return true;

    const fractionStart = separatorIndex + decimalSeparator.length;
    return value.slice(fractionStart).length < decimalPlaces;
}

function normalizeNumberValue(
    input: string,
    { allowNegative, decimalPlaces, decimalSeparator }: NormalizedNumberOptions
) {
    let value = '';
    let hasDecimalSeparator = false;

    for (const character of input) {
        if (allowNegative && isNegativeSign(character) && value.length === 0) {
            value += character;
            continue;
        }

        if (isDigit(character)) {
            if (
                !canAppendFractionDigit(value, decimalSeparator, decimalPlaces)
            ) {
                continue;
            }

            value += character;
            continue;
        }

        if (
            decimalPlaces > 0 &&
            isDecimalSeparator(character, decimalSeparator) &&
            !hasDecimalSeparator
        ) {
            value += decimalSeparator;
            hasDecimalSeparator = true;
        }
    }

    return value;
}

function formatNumberValue(
    value: string,
    {
        allowNegative,
        decimalSeparator,
        thousandsSeparator,
    }: NormalizedNumberOptions
) {
    if (!thousandsSeparator) return value;

    let formattedValue = '';

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];

        if (
            isDigit(character) &&
            shouldInsertThousandsSeparator(
                value,
                index,
                decimalSeparator,
                allowNegative
            )
        ) {
            formattedValue += thousandsSeparator;
        }

        formattedValue += character;
    }

    return formattedValue;
}

function getPreviousThousandsSeparatorStart(
    displayValue: string,
    position: number,
    thousandsSeparator: string
) {
    if (!thousandsSeparator || position <= 0) {
        return null;
    }

    const separatorStart = position - thousandsSeparator.length;

    if (separatorStart < 0) {
        return null;
    }

    if (displayValue.slice(separatorStart, position) !== thousandsSeparator) {
        return null;
    }

    return separatorStart;
}

function getFirstDisplayBoundaryForValue(
    displayValue: string,
    valueBoundary: number,
    options: NormalizedNumberOptions
) {
    for (let index = 0; index <= displayValue.length; index += 1) {
        const displayBoundary = displayValue.slice(0, index);
        const normalizedBoundary = normalizeNumberValue(
            displayBoundary,
            options
        );

        if (normalizedBoundary.length === valueBoundary) {
            return index;
        }
    }

    return displayValue.length;
}

/**
 * Creates a formatter for numeric input.
 *
 * @since 0.0.1
 */
export function number(options?: NumberOptions): Format {
    const normalizedOptions = normalizeNumberOptions(options);

    return defineFormat({
        normalize(input) {
            return normalizeNumberValue(input, normalizedOptions);
        },
        format(value) {
            return formatNumberValue(value, normalizedOptions);
        },
        blur(formattedValue) {
            const value = normalizedOptions.insertLeadingZero
                ? insertLeadingZeroOnBlur(
                      formattedValue,
                      normalizedOptions.decimalSeparator,
                      normalizedOptions.allowNegative
                  )
                : formattedValue;

            return padDecimalPlacesOnBlur(
                value,
                normalizedOptions.decimalSeparator,
                normalizedOptions.padDecimalPlaces
            );
        },
        on: {
            deleteBackward(edit) {
                const separatorStart = getPreviousThousandsSeparatorStart(
                    edit.previousDisplay,
                    edit.at,
                    normalizedOptions.thousandsSeparator
                );

                if (
                    separatorStart !== null &&
                    edit.at < edit.previousDisplay.length
                ) {
                    return {
                        value: edit.previousDisplay,
                        selectionStart: separatorStart,
                        selectionEnd: separatorStart,
                    };
                }

                const deletedCharacter = edit.previousDisplay[edit.range.start];
                const nextCharacter = edit.previousDisplay.slice(
                    edit.at,
                    edit.at + normalizedOptions.thousandsSeparator.length
                );

                if (
                    normalizedOptions.thousandsSeparator &&
                    isDigit(deletedCharacter) &&
                    nextCharacter === normalizedOptions.thousandsSeparator
                ) {
                    const valueBoundary = normalizeNumberValue(
                        edit.previousDisplay.slice(0, edit.range.start),
                        normalizedOptions
                    ).length;
                    const selection = getFirstDisplayBoundaryForValue(
                        edit.formattedNextDisplay,
                        valueBoundary,
                        normalizedOptions
                    );

                    return {
                        value: edit.formattedNextDisplay,
                        selectionStart: selection,
                        selectionEnd: selection,
                    };
                }
            },
        },
    });
}
