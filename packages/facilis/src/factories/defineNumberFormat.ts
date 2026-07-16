import defineFormat from '../core/defineFormat';
import { resolveFormatFactoryEditHookContext } from './resolveFormatFactoryEdit';
import isDeleteOverFormatting from '../helpers/isDeleteOverFormatting';
import type { FormatFactoryOptions } from '../types/factory';
import type {
    FormatAppendHookContext,
    FormatDeleteHookContext,
    FormatInsertHookContext,
} from '../types/hooks';
import type { Format } from '../types/format';
import type { Selection, TextState } from '../types/input';

/**
 * The number-format configuration without factory hooks.
 *
 * @private
 */
type NumberFormatConfig = {
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
 * The number-format configuration after defaults have been applied.
 *
 * @private
 */
type ResolvedNumberFormatConfig = Required<
    Omit<NumberFormatConfig, 'max' | 'min'>
> &
    Pick<NumberFormatConfig, 'max' | 'min'>;

/**
 * The public number-format options, including configuration and hooks.
 *
 * @since 0.1.0
 */
export type NumberFormatOptions = FormatFactoryOptions<
    NumberFormatConfig,
    ResolvedNumberFormatConfig
>;

/**
 * Applies the default number-format options when an option is omitted.
 *
 * @private
 */
function resolveNumberFormatConfig(
    options: NumberFormatOptions = {}
): ResolvedNumberFormatConfig {
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
 * Filters raw text down to digits, decimal separators, and minus signs.
 *
 * @private
 */
function filterNumberCharacters(raw: string, decimalSeparator: string) {
    const filtered = Array.from(raw).filter(
        (character) =>
            /\d/.test(character) ||
            character === '-' ||
            character === decimalSeparator
    );

    return filtered.join('');
}

/**
 * Keeps the first decimal separator and removes any additional decimal
 * separators from a number-like string.
 *
 * @private
 */
function removeExtraDecimalSeparators(value: string, decimalSeparator: string) {
    let hasDecimalSeparator = false;

    return Array.from(value)
        .filter((character) => {
            if (character !== decimalSeparator) {
                return true;
            }

            if (hasDecimalSeparator) {
                return false;
            }

            hasDecimalSeparator = true;
            return true;
        })
        .join('');
}

/**
 * Removes unsupported minus signs. When negatives are supported, keeps one
 * leading minus sign and removes the rest.
 *
 * @private
 */
function normalizeNegativeSign(value: string, allowNegative: boolean) {
    const withoutSigns = value.replaceAll('-', '');

    if (!allowNegative || !value.startsWith('-')) {
        return withoutSigns;
    }

    return `-${withoutSigns}`;
}

/**
 * Limits the number of digits after the decimal separator.
 *
 * @private
 */
function limitDecimalPlaces(
    value: string,
    decimalPlaces: number,
    decimalSeparator: string
) {
    const separatorIndex = value.indexOf(decimalSeparator);

    if (separatorIndex === -1) {
        return value;
    }

    const limit = Math.max(0, decimalPlaces);
    const integerPart = value.slice(0, separatorIndex);
    const fractionStart = separatorIndex + decimalSeparator.length;
    const fractionPart = value.slice(fractionStart, fractionStart + limit);

    if (limit === 0) {
        return integerPart;
    }

    return `${integerPart}${decimalSeparator}${fractionPart}`;
}

/**
 * Trims unnecessary leading zeros from the integer portion of a number-like
 * string while preserving incomplete decimal values.
 *
 * @private
 */
function trimLeadingZeros(
    value: string,
    allowNegative: boolean,
    decimalSeparator: string
) {
    const sign = allowNegative && value.startsWith('-') ? '-' : '';
    const unsignedValue = sign ? value.slice(1) : value;
    const separatorIndex = unsignedValue.indexOf(decimalSeparator);
    const hasFraction = separatorIndex !== -1;
    let integerPart = unsignedValue;
    let fractionalPart = '';

    if (hasFraction) {
        integerPart = unsignedValue.slice(0, separatorIndex);
        fractionalPart = unsignedValue.slice(separatorIndex);
    }

    if (integerPart.length === 0) {
        return `${sign}${unsignedValue}`;
    }

    if (/^0+$/.test(integerPart)) {
        return `${sign}0${fractionalPart}`;
    }

    return `${sign}${integerPart.replace(/^0+/, '')}${fractionalPart}`;
}

/**
 * Clamps a number-like string to numeric bounds. Incomplete values such as
 * `-`, `.`, `-.`, and `12.` are returned unchanged.
 *
 * @private
 */
function clampNumber(
    value: string,
    decimalSeparator: string,
    min?: number,
    max?: number
) {
    if (
        value === '' ||
        value === '-' ||
        value === decimalSeparator ||
        value === `-${decimalSeparator}` ||
        value.endsWith(decimalSeparator)
    ) {
        return value;
    }

    const numericValue = Number(value.replace(decimalSeparator, '.'));

    if (!Number.isFinite(numericValue)) {
        return value;
    }

    if (min !== undefined && numericValue < min) {
        return String(min).replace('.', decimalSeparator);
    }

    if (max !== undefined && numericValue > max) {
        return String(max).replace('.', decimalSeparator);
    }

    return value;
}

/**
 * Inserts thousands separators into the whole portion of a number-like string.
 *
 * @private
 */
function insertThousandsSeparators(
    value: string,
    allowNegative: boolean,
    decimalSeparator: string,
    thousandsSeparator: string
) {
    if (!thousandsSeparator) {
        return value;
    }

    const integerStart = allowNegative && value.startsWith('-') ? 1 : 0;
    const separatorIndex = value.indexOf(decimalSeparator);
    const integerEnd = separatorIndex === -1 ? value.length : separatorIndex;
    let formatted = '';

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];
        const isIntegerDigit = index >= integerStart && index < integerEnd;
        const isFirstIntegerDigit = index === integerStart;
        const integerDigitsRemaining = integerEnd - index;

        if (
            /\d/.test(character) &&
            isIntegerDigit &&
            !isFirstIntegerDigit &&
            integerDigitsRemaining % 3 === 0
        ) {
            formatted += thousandsSeparator;
        }

        formatted += character;
    }

    return formatted;
}

/**
 * Inserts a leading zero before a decimal-only number-like string.
 *
 * @private
 */
function insertLeadingZero(
    value: string,
    allowNegative: boolean,
    decimalSeparator: string
) {
    if (
        value.startsWith(decimalSeparator) &&
        /\d/.test(value.slice(decimalSeparator.length))
    ) {
        return `0${value}`;
    }

    if (
        allowNegative &&
        value.startsWith(`-${decimalSeparator}`) &&
        /\d/.test(value.slice(decimalSeparator.length + 1))
    ) {
        return `-0${value.slice(1)}`;
    }

    return value;
}

/**
 * Pads the fractional portion of a number-like string until it reaches the
 * requested width.
 *
 * @private
 */
function padDecimalPlaces(
    value: string,
    decimalPlaces: number,
    decimalSeparator: string
) {
    const places = Math.max(0, decimalPlaces);

    if (places <= 0) {
        return value;
    }

    if (value === '' || !/\d/.test(value)) {
        return value;
    }

    if (!value.includes(decimalSeparator)) {
        return `${value}${decimalSeparator}${'0'.repeat(places)}`;
    }

    const separatorIndex = value.indexOf(decimalSeparator);
    const fractionStart = separatorIndex + decimalSeparator.length;
    const fractionDigitCount = value.slice(fractionStart).length;

    if (fractionDigitCount >= places) {
        return value;
    }

    return `${value}${'0'.repeat(places - fractionDigitCount)}`;
}

/**
 * Resolves a collapsed selection to the start of formatting text immediately
 * before a display position.
 *
 * @private
 */
function resolveSelectionBeforeFormatting(
    value: string,
    position: number,
    formatting: string
): Selection | undefined {
    if (formatting === '' || position <= 0) {
        return;
    }

    const start = position - formatting.length;

    if (start < 0) {
        return;
    }

    if (value.slice(start, position) !== formatting) {
        return;
    }

    return {
        selectionStart: start,
        selectionEnd: start,
    };
}

/**
 * Resolves a collapsed selection at the normalized boundary before deleted text,
 * projected into the newly formatted display value.
 *
 * @private
 */
function resolveSelectionAtDeletedBoundary(
    previous: string,
    formatted: string,
    start: number,
    normalize: (raw: string) => string
): Selection {
    const normalizedBoundary = normalize(previous.slice(0, start)).length;

    for (let index = 0; index <= formatted.length; index += 1) {
        const displayBoundary = formatted.slice(0, index);

        if (normalize(displayBoundary).length === normalizedBoundary) {
            return {
                selectionStart: index,
                selectionEnd: index,
            };
        }
    }

    return {
        selectionStart: formatted.length,
        selectionEnd: formatted.length,
    };
}

/**
 * Determines whether a delete removed semantic text immediately before known
 * formatting text.
 *
 * @private
 */
function isDeleteBeforeFormatting(
    context: FormatDeleteHookContext,
    formatting: string
): boolean {
    const { normalized, previous, cursor } = context;

    return (
        formatting !== '' &&
        normalized.deleted !== '' &&
        previous.slice(cursor, cursor + formatting.length) === formatting
    );
}

/**
 * Resolves the built-in delete behavior for a number format.
 *
 * @private
 */
function resolveDelete(
    context: FormatDeleteHookContext,
    options: ResolvedNumberFormatConfig
): TextState | undefined {
    const { cursor, formatted, previous, start } = context;
    const formatting = options.thousandsSeparator;

    const selectionBeforeFormatting = resolveSelectionBeforeFormatting(
        previous,
        cursor,
        formatting
    );

    if (selectionBeforeFormatting && isDeleteOverFormatting(context)) {
        return {
            value: previous,
            ...selectionBeforeFormatting,
        };
    }

    if (isDeleteBeforeFormatting(context, formatting)) {
        const selection = resolveSelectionAtDeletedBoundary(
            previous,
            formatted,
            start,
            context.normalize
        );

        return {
            value: formatted,
            ...selection,
        };
    }
}

/**
 * Creates a formatter for numeric input.
 *
 * @since 0.1.0
 */
export default function defineNumberFormat(
    options?: NumberFormatOptions
): Format {
    const resolvedConfig = resolveNumberFormatConfig(options);
    const {
        allowNegative,
        decimalPlaces,
        decimalSeparator,
        insertLeadingZero: shouldInsertLeadingZero,
        max,
        min,
        padDecimalPlaces: decimalPlacesToPad,
        thousandsSeparator,
        trimLeadingZeros: shouldTrimLeadingZeros,
    } = resolvedConfig;

    return defineFormat({
        normalize(raw) {
            let value = raw;

            value = filterNumberCharacters(value, decimalSeparator);

            value = removeExtraDecimalSeparators(value, decimalSeparator);

            value = normalizeNegativeSign(value, allowNegative);

            value = limitDecimalPlaces(value, decimalPlaces, decimalSeparator);

            if (shouldTrimLeadingZeros) {
                value = trimLeadingZeros(
                    value,
                    allowNegative,
                    decimalSeparator
                );
            }

            const resolved = clampNumber(value, decimalSeparator, min, max);

            if (options?.normalize) {
                return options.normalize(resolved, {
                    ...resolvedConfig,
                    raw,
                });
            }

            return resolved;
        },
        format(normalized) {
            const resolved = insertThousandsSeparators(
                normalized,
                allowNegative,
                decimalSeparator,
                thousandsSeparator
            );

            if (options?.format) {
                return options.format(resolved, {
                    ...resolvedConfig,
                    normalized,
                });
            }

            return resolved;
        },
        blur(formatted) {
            let value = formatted;

            value = filterNumberCharacters(value, decimalSeparator);

            value = removeExtraDecimalSeparators(value, decimalSeparator);

            value = normalizeNegativeSign(value, allowNegative);

            value = limitDecimalPlaces(value, decimalPlaces, decimalSeparator);

            if (shouldTrimLeadingZeros) {
                value = trimLeadingZeros(
                    value,
                    allowNegative,
                    decimalSeparator
                );
            }

            value = clampNumber(value, decimalSeparator, min, max);

            value = insertThousandsSeparators(
                value,
                allowNegative,
                decimalSeparator,
                thousandsSeparator
            );

            if (shouldInsertLeadingZero) {
                value = insertLeadingZero(
                    value,
                    allowNegative,
                    decimalSeparator
                );
            }

            const resolved = padDecimalPlaces(
                value,
                decimalPlacesToPad,
                decimalSeparator
            );

            if (options?.blur) {
                return options.blur(resolved, {
                    ...resolvedConfig,
                    formatted,
                });
            }

            return resolved;
        },
        append(context) {
            if (options?.append) {
                return options.append(context.resolved, {
                    ...resolveFormatFactoryEditHookContext(
                        context,
                        resolvedConfig
                    ),
                });
            }
        },
        insert(context) {
            if (options?.insert) {
                return options.insert(context.resolved, {
                    ...resolveFormatFactoryEditHookContext(
                        context,
                        resolvedConfig
                    ),
                });
            }
        },
        delete(context) {
            const next =
                resolveDelete(context, resolvedConfig) ?? context.resolved;

            if (options?.delete) {
                return options.delete(next, {
                    ...resolveFormatFactoryEditHookContext(
                        context,
                        resolvedConfig
                    ),
                });
            }

            return next;
        },
    });
}
