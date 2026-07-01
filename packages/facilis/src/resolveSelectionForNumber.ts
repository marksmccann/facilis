import type { FormatSelectionContext, FormatSelectionResult } from './types';
import { resolveSelectionForText } from './resolveSelectionForText';

/**
 * The configuration options for numeric selection resolution.
 *
 * @since 0.0.1
 */
export type ResolveSelectionForNumberOptions = {
    /**
     * The decimal separator to recognize in the numeric value. The default is
     * `'.'`.
     */
    decimalSeparator?: string;

    /**
     * Whether the selection logic should preserve a decimal separator. The
     * default is `false`.
     */
    allowDecimal?: boolean;

    /**
     * Whether the selection logic should preserve a leading minus sign. The
     * default is `false`.
     */
    allowNegative?: boolean;
};

/**
 * Applies the default numeric selection options when an option is omitted.
 */
function normalizeOptions(options: ResolveSelectionForNumberOptions = {}) {
    return {
        allowDecimal: options.allowDecimal ?? false,
        allowNegative: options.allowNegative ?? false,
        decimalSeparator: options.decimalSeparator ?? '.',
    };
}

/**
 * Creates the regular expression used to preserve meaningful numeric
 * characters while resolving selection.
 */
function createCharacterMatch(options: ResolveSelectionForNumberOptions = {}) {
    const { allowDecimal, allowNegative, decimalSeparator } =
        normalizeOptions(options);
    let characters = '\\d';

    if (allowDecimal) {
        characters += decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    if (allowNegative) {
        characters += '-';
    }

    return new RegExp(`[${characters}]`);
}

/**
 * Resolves the next selection range for a numeric value by preserving digits
 * and optional numeric punctuation based on the provided options.
 *
 * @since 0.0.1
 */
export function resolveSelectionForNumber(
    context: FormatSelectionContext,
    options?: ResolveSelectionForNumberOptions
): FormatSelectionResult {
    return resolveSelectionForText(context, {
        characterMatches: createCharacterMatch(options),
    });
}
