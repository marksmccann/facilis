import defineSegmentedFormat from './defineSegmentedFormat';
import type { SegmentedFormatOptions } from './defineSegmentedFormat';
import type { SegmentedFormatSegment } from './defineSegmentedFormat';
import { reporter } from '../reporter';
import type { FormatFactoryOptions } from '../types/factory';
import type { Format } from '../types/format';
import insertBeforeCharacter from '../transforms/insertBeforeCharacter';
import rejectInvalidSegments from '../transforms/rejectInvalidSegments';

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
 * The date-format options before defaults have been applied.
 *
 * @private
 */
type DateFormatBaseOptions = {
    /** The canonical pattern that defines the date parts to format. */
    pattern: DateFormatPattern;

    /** The separator to render between date parts. The default is `/`. */
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
    strictDateSegments?: boolean;
};

/**
 * The complete date-format options after defaults have been applied.
 *
 * @private
 */
type NormalizedDateFormatOptions = Required<DateFormatBaseOptions>;

/**
 * The configuration options for a date format.
 *
 * @since 0.1.0
 */
export type DateFormatOptions = FormatFactoryOptions<
    DateFormatBaseOptions,
    NormalizedDateFormatOptions
>;

/**
 * Applies date-format defaults and validates the supported option values.
 *
 * @private
 */
function normalizeDateFormatOptions(
    options: DateFormatOptions
): NormalizedDateFormatOptions {
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
        strictDateSegments: options.strictDateSegments ?? false,
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
    const normalizedOptions = normalizeDateFormatOptions(options);
    const { insertLeadingZero, pattern, separator, strictDateSegments } =
        normalizedOptions;
    const patternSegments = pattern.split('/');
    const leadingZeroRules = resolveLeadingZeroRules(patternSegments);
    const maxLength = patternSegments.join('').length;
    const segmentedOptions: SegmentedFormatOptions = {
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

            if (strictDateSegments) {
                normalized = rejectInvalidSegments(
                    normalized,
                    patternSegments,
                    isPossibleMonthOrDay
                );
            }

            normalized = normalized.slice(0, maxLength);

            if (options.normalize) {
                return options.normalize(normalized, {
                    ...normalizedOptions,
                    raw: context.raw,
                });
            }

            return normalized;
        },
    };

    if (options.format) {
        const format = options.format;
        segmentedOptions.format = (resolved, context) =>
            format(resolved, {
                ...normalizedOptions,
                normalized: context.normalized,
            });
    }

    if (options.blur) {
        const blur = options.blur;
        segmentedOptions.blur = (resolved, context) =>
            blur(resolved, {
                ...normalizedOptions,
                formatted: context.formatted,
            });
    }

    if (options.append) {
        const append = options.append;
        segmentedOptions.append = (next, context) =>
            append(next, {
                ...context,
                ...normalizedOptions,
            });
    }

    if (options.insert) {
        const insert = options.insert;
        segmentedOptions.insert = (next, context) =>
            insert(next, {
                ...context,
                ...normalizedOptions,
            });
    }

    if (options.delete) {
        const deleteHook = options.delete;
        segmentedOptions.delete = (next, context) =>
            deleteHook(next, {
                ...context,
                ...normalizedOptions,
            });
    }

    return defineSegmentedFormat(segmentedOptions);
}
