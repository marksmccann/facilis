import { defineTimeFormat, type Format, type TimeFormatOptions } from 'facilis';

/**
 * The configuration options for a time format.
 *
 * @since 0.1.0
 */
export type TimeOptions = TimeFormatOptions;

/**
 * Creates a time format for numeric time input.
 *
 * @since 0.1.0
 */
export function time(options: TimeOptions): Format {
    return defineTimeFormat(options);
}
