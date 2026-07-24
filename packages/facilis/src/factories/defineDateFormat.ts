import defineSegmentedFormat from './defineSegmentedFormat';
import type { SegmentedFormatSegment } from './defineSegmentedFormat';
import insertBeforeCharacter from '../helpers/insertBeforeCharacter';
import rejectInvalidSegments from '../helpers/rejectInvalidSegments';
import { reporter } from '../reporter';
import type { FormatFactoryOptions } from '../types/factory';
import type { Format } from '../types/format';

/**
 * The canonical date patterns supported by the date format.
 *
 * @private
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
 * @private
 */
const DATE_SEPARATORS = ['/', '-', '.'] as const;

/**
 * The canonical date patterns supported by the date format. Patterns always
 * use `/` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
export type DateFormatPattern = (typeof DATE_PATTERNS)[number];

/**
 * A rendered date separator.
 *
 * @since 0.1.0
 */
export type DateFormatSeparator = (typeof DATE_SEPARATORS)[number];

/**
 * The date-format configuration without factory hooks.
 *
 * @private
 */
type DateFormatConfig = {
    /** The canonical pattern that defines the date segments to format. */
    pattern: DateFormatPattern;

    /** The separator to render between date segments. The default is `/`. */
    separator?: DateFormatSeparator;

    /**
     * Whether to insert a leading zero for safe single-digit month and day
     * values while typing. The default is `false`.
     */
    insertLeadingZero?: boolean;

    /**
     * Whether to reject impossible date segment values while typing. The
     * default is `false`.
     */
    strictSegments?: boolean;
};

/**
 * The date-format configuration after defaults and validation have been applied.
 *
 * @private
 */
type ResolvedDateFormatConfig = Required<DateFormatConfig>;

/**
 * The public date-format options, including configuration and hooks.
 *
 * @since 0.1.0
 */
export type DateFormatOptions = FormatFactoryOptions<
    DateFormatConfig,
    ResolvedDateFormatConfig
>;

/**
 * Applies date-format defaults and validates the supported option values.
 *
 * @private
 */
function resolveDateFormatConfig(
    options: DateFormatOptions
): ResolvedDateFormatConfig {
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
        strictSegments: options.strictSegments ?? false,
    };
}

/**
 * Determines whether one month or day segment can still resolve to a possible
 * standalone segment value.
 *
 * @private
 */
function isPossibleMonthOrDay(segment: string, value: string) {
    if (segment === 'MM') {
        if (value.length === 1) return /^[0-1]$/.test(value);
        return /^(0[1-9]|1[0-2])$/.test(value);
    }

    if (segment === 'DD') {
        if (value.length === 1) return /^[0-3]$/.test(value);
        return /^(0[1-9]|[1-2]\d|3[0-1])$/.test(value);
    }

    return true;
}

/**
 * Resolves the leading-zero insertion rules for month and day segments.
 *
 * @private
 */
function resolveLeadingZeroRules(segments: string[]) {
    const rules: { position: number; matches: RegExp; insert: string }[] = [];
    let position = 0;

    segments.slice(0, -1).forEach((segment) => {
        if (segment === 'MM') {
            rules.push({ position, matches: /^[2-9]$/, insert: '0' });
        }

        if (segment === 'DD') {
            rules.push({ position, matches: /^[4-9]$/, insert: '0' });
        }

        position += segment.length;
    });

    return rules;
}

/**
 * Resolves the segmented display layout for one canonical date pattern.
 *
 * @private
 */
function resolveDateSegments(
    patternSegments: string[],
    separator: DateFormatSeparator
) {
    const segments: SegmentedFormatSegment[] = [];

    patternSegments.forEach((segment, index) => {
        if (index > 0) {
            segments.push(separator);
        }

        segments.push(segment.length);
    });

    return segments;
}

/**
 * Creates a date format for numeric date input.
 *
 * @since 0.1.0
 */
export default function defineDateFormat(options: DateFormatOptions): Format {
    const resolvedConfig = resolveDateFormatConfig(options);
    const { insertLeadingZero, pattern, separator, strictSegments } =
        resolvedConfig;
    const patternSegments = pattern.split('/');
    const leadingZeroRules = resolveLeadingZeroRules(patternSegments);
    const maxLength = patternSegments.join('').length;

    return defineSegmentedFormat({
        matches: /\d/,
        segments: resolveDateSegments(patternSegments, separator),
        normalize(resolved, context) {
            let normalized = resolved;

            if (insertLeadingZero) {
                normalized = insertBeforeCharacter(
                    normalized,
                    leadingZeroRules
                );
            }

            if (strictSegments) {
                normalized = rejectInvalidSegments(
                    normalized,
                    patternSegments,
                    isPossibleMonthOrDay
                );
            }

            normalized = normalized.slice(0, maxLength);

            if (options.normalize) {
                return options.normalize(normalized, {
                    ...resolvedConfig,
                    raw: context.raw,
                });
            }

            return normalized;
        },
        format(resolved, context) {
            if (options.format) {
                return options.format(resolved, {
                    ...resolvedConfig,
                    normalized: context.normalized,
                });
            }

            return resolved;
        },
        blur(resolved, context) {
            if (options.blur) {
                return options.blur(resolved, {
                    ...resolvedConfig,
                    formatted: context.formatted,
                });
            }

            return resolved;
        },
        append(next, context) {
            if (options.append) {
                return options.append(next, {
                    ...context,
                    ...resolvedConfig,
                });
            }

            return next;
        },
        insert(next, context) {
            if (options.insert) {
                return options.insert(next, {
                    ...context,
                    ...resolvedConfig,
                });
            }

            return next;
        },
        delete(next, context) {
            if (options.delete) {
                return options.delete(next, {
                    ...context,
                    ...resolvedConfig,
                });
            }

            return next;
        },
    });
}
