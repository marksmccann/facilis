import { defineTextFormat, type Format, type TextFormatOptions } from 'facilis';

/**
 * The configuration options for a text format.
 *
 * @since 0.1.0
 */
export type TextOptions = TextFormatOptions;

/**
 * Creates a text format instance.
 *
 * @since 0.1.0
 */
export function text(options: TextOptions = {}): Format {
    return defineTextFormat(options);
}
