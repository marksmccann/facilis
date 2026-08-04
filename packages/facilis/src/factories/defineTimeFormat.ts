import defineSegmentedFormat from './defineSegmentedFormat';
import type { SegmentedFormatSegment } from './defineSegmentedFormat';
import insertBeforeCharacter from '../helpers/insertBeforeCharacter';
import rejectInvalidSegments from '../helpers/rejectInvalidSegments';
import { reporter } from '../reporter';
import type { FormatFactoryOptions } from '../types/factory';
import type { Format } from '../types/format';

/**
 * The canonical time patterns supported by the time format.
 *
 * @private
 */
const TIME_PATTERNS = ['HH:mm', 'HH:mm:ss', 'hh:mm', 'hh:mm:ss'] as const;

/**
 * The separators supported when rendering formatted time values.
 *
 * @private
 */
const TIME_SEPARATORS = [':', '.'] as const;

/**
 * The canonical time patterns supported by the time format. Patterns always
 * use `:` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
export type TimeFormatPattern = (typeof TIME_PATTERNS)[number];

/**
 * A rendered time separator.
 *
 * @since 0.1.0
 */
export type TimeFormatSeparator = (typeof TIME_SEPARATORS)[number];

/**
 * The time-format configuration without factory hooks.
 *
 * @private
 */
type TimeFormatConfig = {
    /** The canonical pattern that defines the time segments to format. */
    pattern: TimeFormatPattern;

    /** The separator to render between time segments. The default is `:`. */
    separator?: TimeFormatSeparator;

    /**
     * Whether to insert a leading zero for safe single-digit time segment values
     * while typing. The default is `false`.
     */
    insertLeadingZero?: boolean;

    /**
     * Whether to reject impossible hour, minute, and second values while
     * typing. The default is `false`.
     */
    strictSegments?: boolean;
};

/**
 * The time-format configuration after defaults and validation have been applied.
 *
 * @private
 */
type ResolvedTimeFormatConfig = Required<TimeFormatConfig>;

/**
 * The public time-format options, including configuration and hooks.
 *
 * @since 0.1.0
 */
export type TimeFormatOptions = FormatFactoryOptions<
    TimeFormatConfig,
    ResolvedTimeFormatConfig
>;

/**
 * Applies time-format defaults and validates the supported option values.
 *
 * @private
 */
function resolveTimeFormatConfig(
    options: TimeFormatOptions
): ResolvedTimeFormatConfig {
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
        strictSegments: options.strictSegments ?? false,
    };
}

/**
 * Determines whether one time segment can still resolve to a possible
 * standalone segment value.
 *
 * @private
 */
function isPossibleTimePart(segment: string, value: string) {
    if (segment === 'HH') {
        if (value.length === 1) return /^[0-2]$/.test(value);
        return /^([0-1]\d|2[0-3])$/.test(value);
    }

    if (segment === 'hh') {
        if (value.length === 1) return /^[0-1]$/.test(value);
        return /^(0[1-9]|1[0-2])$/.test(value);
    }

    if (segment === 'mm' || segment === 'ss') {
        if (value.length === 1) return /^[0-5]$/.test(value);
        return /^[0-5]\d$/.test(value);
    }

    return true;
}

/**
 * Resolves the leading-zero insertion rules for time segments.
 *
 * @private
 */
function resolveLeadingZeroRules(segments: string[]) {
    const rules: { position: number; matches: RegExp; insert: string }[] = [];
    let position = 0;

    segments.forEach((segment) => {
        if (segment === 'HH') {
            rules.push({ position, matches: /^[3-9]$/, insert: '0' });
        }

        if (segment === 'hh') {
            rules.push({ position, matches: /^[2-9]$/, insert: '0' });
        }

        if (segment === 'mm' || segment === 'ss') {
            rules.push({ position, matches: /^[6-9]$/, insert: '0' });
        }

        position += segment.length;
    });

    return rules;
}

/**
 * Resolves the segmented display layout for one canonical time pattern.
 *
 * @private
 */
function resolveTimeSegments(
    patternSegments: string[],
    separator: TimeFormatSeparator
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
 * Creates a time format for numeric time input.
 *
 * @since 0.1.0
 */
export default function defineTimeFormat(options: TimeFormatOptions): Format {
    const resolvedConfig = resolveTimeFormatConfig(options);
    const { insertLeadingZero, pattern, separator, strictSegments } =
        resolvedConfig;
    const patternSegments = pattern.split(':');
    const leadingZeroRules = resolveLeadingZeroRules(patternSegments);
    const maxLength = patternSegments.join('').length;

    return defineSegmentedFormat({
        matches: /\d/,
        segments: resolveTimeSegments(patternSegments, separator),
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
                    isPossibleTimePart
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
