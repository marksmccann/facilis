import { defineDateFormat, type Format } from 'facilis';

/**
 * Creates an expiration-date format for the common MM/YY card layout.
 *
 * @since 0.1.0
 */
export function expirationDate(): Format {
    return defineDateFormat({
        pattern: 'MM/YY',
    });
}
