import { defineSegmentedFormat, type Format } from 'facilis';

/**
 * The prefixes that identify the American Express card-number layout.
 *
 * @private
 */
const AMEX_PREFIXES = ['34', '37'];

/**
 * Creates a credit-card number format.
 *
 * @since 0.1.0
 */
export function creditCard(): Format {
    return defineSegmentedFormat({
        matches: /\d/,
        segments(normalized) {
            const prefix = normalized.slice(0, 2);

            if (AMEX_PREFIXES.includes(prefix)) {
                return [4, ' ', 6, ' ', 5];
            }

            return [4, ' ', 4, ' ', 4, ' ', 4];
        },
    });
}
