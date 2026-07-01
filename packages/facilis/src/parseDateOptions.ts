import { reporter } from './reporter';

/**
 * The canonical date patterns currently supported by the date parser. These
 * patterns always use `/` as their separator, regardless of how the formatted
 * value may later be rendered.
 *
 * @since 0.0.1
 */
const DatePatterns = [
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
 * The separators that may be used when rendering a formatted date value.
 *
 * @since 0.0.1
 */
const DateSeparators = ['/', '-', '.'] as const;

/**
 * One approved canonical date pattern.
 *
 * @since 0.0.1
 */
export type DatePattern = (typeof DatePatterns)[number];

/**
 * One approved rendered date separator.
 *
 * @since 0.0.1
 */
export type DateSeparator = (typeof DateSeparators)[number];

/**
 * The explicit configuration object for one parsed date definition.
 *
 * @since 0.0.1
 */
export type ParseDateOptions = {
    /**
     * The date pattern string that defines the included segments and literals.
     */
    pattern: DatePattern;

    /**
     * The separator to use when rendering the formatted value. Patterns always
     * use `/` as their canonical separator.
     */
    separator?: DateSeparator;
};

/**
 * The normalized date options returned by `parseDateOptions`.
 *
 * @since 0.0.1
 */
export type ParsedDateOptions = Required<ParseDateOptions>;

/**
 * Validates one explicit date configuration object.
 *
 * @since 0.0.1
 */
export function parseDateOptions(options: ParseDateOptions): ParsedDateOptions {
    const propertyNames = Object.keys(options);
    const { pattern, separator } = options;
    const normalizedSeparator = separator ?? '/';

    if (!propertyNames.includes('pattern')) {
        reporter.fail('ERR05');
    }

    if (!DatePatterns.includes(pattern)) {
        reporter.fail('ERR07');
    }

    if (!DateSeparators.includes(normalizedSeparator)) {
        reporter.fail('ERR08');
    }

    return {
        pattern: pattern,
        separator: normalizedSeparator,
    };
}
