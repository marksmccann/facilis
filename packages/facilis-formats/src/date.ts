import { defineDateFormat, type DateFormatOptions, type Format } from 'facilis';

/**
 * The configuration options for a date format.
 *
 * @since 0.1.0
 */
export type DateOptions = DateFormatOptions;

/**
 * Creates a date format for numeric date input.
 *
 * @since 0.1.0
 */
export function date(options: DateOptions): Format {
    return defineDateFormat(options);
}
