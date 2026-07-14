import { defineFormat, type Format } from 'facilis';
import {
    isAppendAtMaxLength,
    isAppendDuplicateFormatting,
    isAppendExpectedFormattingAt,
    isDeleteBackwardOverFormatting,
    isInsertAtMaxLength,
} from 'facilis/guards';
import { insertSeparators } from 'facilis/transforms';

/**
 * The prefixes that identify the American Express card-number layout.
 *
 * @private
 */
const AMEX_PREFIXES = ['34', '37'];

/**
 * The number of digits supported by the default card-number layout.
 *
 * @private
 */
const DIGIT_LIMIT = 16;

/**
 * The number of digits supported by the American Express card-number layout.
 *
 * @private
 */
const AMEX_DIGIT_LIMIT = 15;

/**
 * Tests whether the normalized value starts with an American Express prefix.
 *
 * @private
 */
function isAmex(value: string) {
    return AMEX_PREFIXES.includes(value.slice(0, 2));
}

/**
 * Resolves the maximum number of digits allowed for the active card layout.
 *
 * @private
 */
function resolveDigitLimit(value: string) {
    return isAmex(value) ? AMEX_DIGIT_LIMIT : DIGIT_LIMIT;
}

/**
 * Tests whether the current normalized digit position should be followed by a
 * separator.
 *
 * @private
 */
function isSeparatorBoundary(value: string) {
    if (!isAmex(value)) {
        return value.length > 0 && value.length % 4 === 0;
    }

    return value.length === 4 || value.length === 10;
}

/**
 * Creates a credit-card number format.
 *
 * @since 0.0.1
 */
export function creditCard(): Format {
    return defineFormat({
        normalize(raw) {
            const value = raw.replace(/\D/g, '');
            return value.slice(0, resolveDigitLimit(value));
        },
        format(normalized) {
            return insertSeparators(normalized, {
                positions: isAmex(normalized) ? [4, 11] : [4, 9, 14],
                separator: ' ',
            });
        },
        edit: {
            append(context) {
                const { normalized, previous, attempted } = context;
                const value = normalized.previous;
                const maxDigits = resolveDigitLimit(value);
                const position = previous.length;

                if (
                    isAppendDuplicateFormatting(context) ||
                    previous.endsWith(' ')
                ) {
                    return null;
                }

                if (
                    isAppendAtMaxLength(context, maxDigits) ||
                    normalized.appended !== '' ||
                    !isSeparatorBoundary(value)
                ) {
                    return;
                }

                if (isAppendExpectedFormattingAt(context, ' ', position)) {
                    return attempted;
                }

                return `${previous} `;
            },
            insert(context) {
                const value = context.normalized.previous;
                const maxDigits = resolveDigitLimit(value);

                if (isInsertAtMaxLength(context, maxDigits)) {
                    return null;
                }
            },
            deleteBackward(context) {
                const { cursor, previous } = context;

                if (isDeleteBackwardOverFormatting(context)) {
                    return {
                        value: previous,
                        selectionStart: cursor - 1,
                        selectionEnd: cursor - 1,
                    };
                }
            },
        },
    });
}
