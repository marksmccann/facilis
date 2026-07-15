import { defineSegmentedFormat, type Format } from 'facilis';

/**
 * The prefixes that identify the American Express card-number layout.
 *
 * @private
 */
const AMEX_PREFIXES = ['34', '37'];

/**
 * Tests whether the normalized value starts with an American Express prefix.
 *
 * @private
 */
function isAmex(value: string) {
    return AMEX_PREFIXES.includes(value.slice(0, 2));
}

/**
 * Creates a credit-card number format.
 *
 * @since 0.1.0
 */
export function creditCard(): Format {
    return defineSegmentedFormat({
        characters: 'digits',
        segments(normalized) {
            if (isAmex(normalized)) {
                return [4, ' ', 6, ' ', 5];
            }

            return [4, ' ', 4, ' ', 4, ' ', 4];
        },
    });
}
