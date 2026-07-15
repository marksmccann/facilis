import {
    defineTimeFormat,
    type Format,
    type TimeFormatOptions,
    type TimeFormatPattern,
    type TimeFormatSeparator,
} from 'facilis';
import { reporter } from './reporter';

/**
 * The canonical time patterns supported by the time format. Patterns always
 * use `:` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
const TIME_PATTERNS = ['HH:mm', 'HH:mm:ss', 'hh:mm', 'hh:mm:ss'] as const;

/**
 * The separators supported when rendering formatted time values.
 *
 * @since 0.1.0
 */
const TIME_SEPARATORS = [':', '.'] as const;

/**
 * A canonical time pattern.
 *
 * @since 0.1.0
 */
export type TimePattern = TimeFormatPattern;

/**
 * A rendered time separator.
 *
 * @since 0.1.0
 */
export type TimeSeparator = TimeFormatSeparator;

/**
 * The configuration options for a time format.
 *
 * @since 0.1.0
 */
export type TimeOptions = TimeFormatOptions;

/**
 * The complete time-format options after defaults have been applied.
 *
 * @private
 */
type NormalizedTimeOptions = Required<TimeOptions>;

/**
 * Applies time-format defaults and validates the supported option values.
 *
 * @private
 */
function normalizeTimeOptions(options: TimeOptions): NormalizedTimeOptions {
    if (!options || !Object.hasOwn(options, 'pattern')) {
        reporter.fail('ERR09');
    }

    const separator = options.separator ?? ':';

    if (!TIME_PATTERNS.includes(options.pattern)) {
        reporter.fail('ERR10');
    }

    if (!TIME_SEPARATORS.includes(separator)) {
        reporter.fail('ERR11');
    }

    return {
        insertLeadingZero: options.insertLeadingZero ?? false,
        pattern: options.pattern,
        separator,
        strictTimeParts: options.strictTimeParts ?? false,
    };
}

/**
 * Creates a time format for numeric time input.
 *
 * @since 0.1.0
 */
export function time(options: TimeOptions): Format {
    return defineTimeFormat(normalizeTimeOptions(options));
}
