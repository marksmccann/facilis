import defineFormat from './defineFormat';
import {
    isDeleteBackwardBeforeFormatting,
    isDeleteBackwardOverFormatting,
} from './guards';
import {
    resolveSelectionAtDeletedBoundary,
    resolveSelectionBeforeFormatting,
} from './selection';
import type {
    AppendEditContext,
    DeleteBackwardEditContext,
    Format,
    FormatEditResult,
    InsertEditContext,
} from './types';
import clampNumber from './transforms/clampNumber';
import filterNumberCharacters from './transforms/filterNumberCharacters';
import insertLeadingZero from './transforms/insertLeadingZero';
import insertThousandsSeparators from './transforms/insertThousandsSeparators';
import limitDecimalPlaces from './transforms/limitDecimalPlaces';
import normalizeNegativeSign from './transforms/normalizeNegativeSign';
import padDecimalPlaces from './transforms/padDecimalPlaces';
import removeExtraDecimalSeparators from './transforms/removeExtraDecimalSeparators';
import trimLeadingZeros from './transforms/trimLeadingZeros';

type NumberFormatBaseOptions = {
    decimalPlaces?: number;
    padDecimalPlaces?: number;
    decimalSeparator?: string;
    thousandsSeparator?: string;
    allowNegative?: boolean;
    insertLeadingZero?: boolean;
    trimLeadingZeros?: boolean;
    min?: number;
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
 * Describes the resolved value available to number-format lifecycle hooks.
 *
 * @since 0.1.0
 */
export type NumberFormatLifecycleContext = NormalizedNumberFormatOptions & {
    /**
     * The value resolved by the built-in number-format behavior for this stage.
     */
    resolved: string;
};

/**
 * Customizes number normalization after the built-in normalization pipeline has
 * resolved its value.
 *
 * @since 0.1.0
 */
export type NumberFormatNormalizeHook = (
    raw: string,
    context: NumberFormatLifecycleContext
) => string;

/**
 * Customizes number formatting after the built-in formatting pipeline has
 * resolved its value.
 *
 * @since 0.1.0
 */
export type NumberFormatFormatHook = (
    normalized: string,
    context: NumberFormatLifecycleContext
) => string;

/**
 * Customizes blur formatting after the built-in blur pipeline has resolved its
 * value.
 *
 * @since 0.1.0
 */
export type NumberFormatBlurHook = (
    formatted: string,
    context: NumberFormatLifecycleContext
) => string;

/**
 * Describes the resolved edit result available to number-format edit hooks.
 *
 * @since 0.1.0
 */
export type NumberFormatEditContext<TContext> = TContext &
    NormalizedNumberFormatOptions & {
        /**
         * The edit result resolved by the built-in number-format behavior.
         */
        resolved: FormatEditResult;
    };

/**
 * Customizes number-format edit behavior after the built-in edit behavior has
 * resolved its result.
 *
 * @since 0.1.0
 */
export type NumberFormatEditHooks = {
    /**
     * Handles text appended to the end of the value.
     */
    append?: (
        context: NumberFormatEditContext<AppendEditContext>
    ) => FormatEditResult;

    /**
     * Handles text inserted before the end of the value.
     */
    insert?: (
        context: NumberFormatEditContext<InsertEditContext>
    ) => FormatEditResult;

    /**
     * Handles backward deletion.
     */
    deleteBackward?: (
        context: NumberFormatEditContext<DeleteBackwardEditContext>
    ) => FormatEditResult;
};

/**
 * The configuration options for a number format.
 *
 * @since 0.1.0
 */
export type NumberFormatOptions = NumberFormatBaseOptions & {
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

    /**
     * Customizes the resolved normalized value.
     */
    normalize?: NumberFormatNormalizeHook;

    /**
     * Customizes the resolved formatted value.
     */
    format?: NumberFormatFormatHook;

    /**
     * Customizes the resolved blurred value.
     */
    blur?: NumberFormatBlurHook;

    /**
     * Customizes resolved edit behavior.
     */
    edit?: NumberFormatEditHooks;
};

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
 * Resolves the built-in backward-delete behavior for a number format.
 *
 * @private
 */
function resolveDeleteBackward(
    context: DeleteBackwardEditContext,
    options: NormalizedNumberFormatOptions
): FormatEditResult {
    const { cursor, formatted, previous, start } = context;
    const formatting = options.thousandsSeparator;

    // prettier-ignore
    const selectionBeforeFormatting = resolveSelectionBeforeFormatting({
        value: previous,
        position: cursor,
        formatting,
    });

    if (selectionBeforeFormatting && isDeleteBackwardOverFormatting(context)) {
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
                return options.normalize(raw, {
                    ...normalizedOptions,
                    resolved,
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
                return options.format(normalized, {
                    ...normalizedOptions,
                    resolved,
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
                return options.blur(formatted, {
                    ...normalizedOptions,
                    resolved,
                });
            }

            return resolved;
        },
        edit: {
            append(context) {
                if (options?.edit?.append) {
                    return options.edit.append({
                        ...context,
                        ...normalizedOptions,
                        resolved: undefined,
                    });
                }
            },
            insert(context) {
                if (options?.edit?.insert) {
                    return options.edit.insert({
                        ...context,
                        ...normalizedOptions,
                        resolved: undefined,
                    });
                }
            },
            deleteBackward(context) {
                const resolved = resolveDeleteBackward(
                    context,
                    normalizedOptions
                );

                if (options?.edit?.deleteBackward) {
                    return options.edit.deleteBackward({
                        ...context,
                        ...normalizedOptions,
                        resolved,
                    });
                }

                return resolved;
            },
        },
    });
}
