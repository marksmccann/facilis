import { defineTextFormat, type Format } from 'facilis';

/**
 * Creates a Vehicle Identification Number format.
 *
 * @since 0.1.0
 */
export function vin(): Format {
    return defineTextFormat({
        matches: /[A-HJ-NPR-Z0-9]/i,
        maxLength: 17,
        transform: 'uppercase',
    });
}
