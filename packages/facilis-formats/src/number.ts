import {
    defineNumberFormat,
    type Format,
    type NumberFormatOptions,
} from 'facilis';

/**
 * The configuration options for a number format.
 *
 * @since 0.1.0
 */
export type NumberOptions = NumberFormatOptions;

/**
 * Creates a formatter for numeric input.
 *
 * @since 0.1.0
 */
export function number(options?: NumberOptions): Format {
    return defineNumberFormat(options);
}
