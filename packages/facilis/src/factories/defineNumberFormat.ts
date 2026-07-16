import defineFormat from './defineFormat';
import { resolveFormatFactoryEditHookContext } from './resolveFormatFactoryEdit';
import type { FormatFactoryOptions } from '../types/factory';
import isDeleteBeforeFormatting from '../guards/isDeleteBeforeFormatting';
import isDeleteOverFormatting from '../guards/isDeleteOverFormatting';
import resolveSelectionAtDeletedBoundary from '../selection/resolveSelectionAtDeletedBoundary';
import resolveSelectionBeforeFormatting from '../selection/resolveSelectionBeforeFormatting';
import type {
    FormatAppendHookContext,
    FormatDeleteHookContext,
    FormatInsertHookContext,
} from '../types/hooks';
import type { Format } from '../types/format';
import type { TextState } from '../types/input';
import clampNumber from '../transforms/clampNumber';
import filterNumberCharacters from '../transforms/filterNumberCharacters';
import insertLeadingZero from '../transforms/insertLeadingZero';
import insertThousandsSeparators from '../transforms/insertThousandsSeparators';
import limitDecimalPlaces from '../transforms/limitDecimalPlaces';
import normalizeNegativeSign from '../transforms/normalizeNegativeSign';
import padDecimalPlaces from '../transforms/padDecimalPlaces';
import removeExtraDecimalSeparators from '../transforms/removeExtraDecimalSeparators';
import trimLeadingZeros from '../transforms/trimLeadingZeros';

/**
 * The number-format options before defaults have been applied.
 *
 * @private
 */
type NumberFormatBaseOptions = {
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
type NormalizedNumberFormatOptions = Required<
    Omit<NumberFormatBaseOptions, 'max' | 'min'>
> &
    Pick<NumberFormatBaseOptions, 'max' | 'min'>;

/**
 * The configuration options for a number format.
 *
 * @since 0.1.0
 */
export type NumberFormatOptions = FormatFactoryOptions<
    NumberFormatBaseOptions,
    NormalizedNumberFormatOptions
>;

/**
 * Applies the default number-format options when an option is omitted.
 *
 * @private
 */
function normalizeNumberFormatOptions(
    options: NumberFormatOptions = {}
): NormalizedNumberFormatOptions {
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
 * Resolves the built-in delete behavior for a number format.
 *
 * @private
 */
function resolveDelete(
    context: FormatDeleteHookContext,
    options: NormalizedNumberFormatOptions
): TextState | undefined {
    const { cursor, formatted, previous, start } = context;
    const formatting = options.thousandsSeparator;

    // prettier-ignore
    const selectionBeforeFormatting = resolveSelectionBeforeFormatting({
        value: previous,
        position: cursor,
        formatting,
    });

    if (selectionBeforeFormatting && isDeleteOverFormatting(context)) {
        return {
            value: previous,
            ...selectionBeforeFormatting,
        };
    }

    if (isDeleteBeforeFormatting(context, formatting)) {
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
}

/**
 * Creates a formatter for numeric input.
 *
 * @since 0.1.0
 */
export default function defineNumberFormat(
    options?: NumberFormatOptions
): Format {
    const normalizedOptions = normalizeNumberFormatOptions(options);
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

            const resolved = clampNumber(value, {
                decimalSeparator,
                max,
                min,
            });

            if (options?.normalize) {
                return options.normalize(resolved, {
                    ...normalizedOptions,
                    raw,
                });
            }

            return resolved;
        },
        format(normalized) {
            const resolved = insertThousandsSeparators(normalized, {
                allowNegative,
                decimalSeparator,
                thousandsSeparator,
            });

            if (options?.format) {
                return options.format(resolved, {
                    ...normalizedOptions,
                    normalized,
                });
            }

            return resolved;
        },
        blur(formatted) {
            let value = formatted;

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

            value = clampNumber(value, {
                decimalSeparator,
                max,
                min,
            });

            value = insertThousandsSeparators(value, {
                allowNegative,
                decimalSeparator,
                thousandsSeparator,
            });

            if (shouldInsertLeadingZero) {
                value = insertLeadingZero(value, {
                    allowNegative,
                    decimalSeparator,
                });
            }

            const resolved = padDecimalPlaces(value, {
                decimalPlaces: decimalPlacesToPad,
                decimalSeparator,
            });

            if (options?.blur) {
                return options.blur(resolved, {
                    ...normalizedOptions,
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
                        normalizedOptions
                    ),
                });
            }
        },
        insert(context) {
            if (options?.insert) {
                return options.insert(context.resolved, {
                    ...resolveFormatFactoryEditHookContext(
                        context,
                        normalizedOptions
                    ),
                });
            }
        },
        delete(context) {
            const next =
                resolveDelete(context, normalizedOptions) ?? context.resolved;

            if (options?.delete) {
                return options.delete(next, {
                    ...resolveFormatFactoryEditHookContext(
                        context,
                        normalizedOptions
                    ),
                });
            }

            return next;
        },
    });
}
