import { defineDateFormat, type DateFormatOptions, type Format } from 'facilis';

/**
 * The configuration options for an expiration-date format.
 *
 * @since 0.1.0
 */
export type ExpirationDateOptions = Pick<DateFormatOptions, 'separator'> & {
    /** Whether to reject impossible month values while typing. */
    strictMonth?: boolean;
};

/**
 * Creates an expiration-date format for the common MM/YY card layout.
 *
 * @since 0.1.0
 */
export function expirationDate(options?: ExpirationDateOptions): Format {
    const { separator, strictMonth } = options || {};

    return defineDateFormat({
        pattern: 'MM/YY',
        separator,
        strictSegments: strictMonth,
    });
}
