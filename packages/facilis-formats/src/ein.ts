import { defineSegmentedFormat, type Format } from 'facilis';

/**
 * Creates an Employer Identification Number format.
 *
 * @since 0.1.0
 */
export function ein(): Format {
    return defineSegmentedFormat({
        characters: 'digits',
        segments: [2, '-', 7],
    });
}
