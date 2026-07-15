import { defineSegmentedFormat, type Format } from 'facilis';

/**
 * Creates a Social Security number format.
 *
 * @since 0.1.0
 */
export function socialSecurityNumber(): Format {
    return defineSegmentedFormat({
        characters: 'digits',
        segments: [3, '-', 2, '-', 4],
    });
}
