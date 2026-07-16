import { defineSegmentedFormat, type Format } from 'facilis';

/**
 * Creates a phone-number format for 10-digit North American phone numbers.
 *
 * @since 0.1.0
 */
export function phoneNumber(): Format {
    return defineSegmentedFormat({
        matches: /\d/,
        segments: ['(', 3, ') ', 3, '-', 4],
    });
}
