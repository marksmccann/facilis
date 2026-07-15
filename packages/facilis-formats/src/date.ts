import {
    defineDateFormat,
    type DateFormatOptions,
    type DateFormatPattern,
    type DateFormatSeparator,
    type Format,
} from 'facilis';
import { reporter } from './reporter';

/**
 * The canonical date patterns supported by the date format. Patterns always
 * use `/` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
const DATE_PATTERNS = [
    'MM/DD/YY',
    'MM/DD/YYYY',
    'DD/MM/YY',
    'DD/MM/YYYY',
    'YY/MM/DD',
    'YYYY/MM/DD',
    'MM/YY',
    'MM/YYYY',
    'YY/MM',
    'YYYY/MM',
] as const;

/**
 * The separators supported when rendering formatted date values.
 *
 * @since 0.1.0
 */
const DATE_SEPARATORS = ['/', '-', '.'] as const;

/**
 * A canonical date pattern.
 *
 * @since 0.1.0
 */
export type DatePattern = DateFormatPattern;

/**
 * A rendered date separator.
 *
 * @since 0.1.0
 */
export type DateSeparator = DateFormatSeparator;

/**
 * The configuration options for a date format.
 *
 * @since 0.1.0
 */
export type DateOptions = DateFormatOptions;

/**
 * The complete date-format options after defaults have been applied.
 *
 * @private
 */
type NormalizedDateOptions = Required<DateOptions>;

/**
 * Applies date-format defaults and validates the supported option values.
 *
 * @private
 */
function normalizeDateOptions(options: DateOptions): NormalizedDateOptions {
    if (!options || !Object.hasOwn(options, 'pattern')) {
        reporter.fail('ERR05');
    }

    const separator = options.separator ?? '/';

    if (!DATE_PATTERNS.includes(options.pattern)) {
        reporter.fail('ERR07');
    }

    if (!DATE_SEPARATORS.includes(separator)) {
        reporter.fail('ERR08');
    }

    return {
        insertLeadingZero: options.insertLeadingZero ?? false,
        pattern: options.pattern,
        separator,
        strictMonthAndDay: options.strictMonthAndDay ?? false,
    };
}

/**
 * Creates a date format for numeric date input.
 *
 * @since 0.1.0
 */
export function date(options: DateOptions): Format {
    return defineDateFormat(normalizeDateOptions(options));
}
