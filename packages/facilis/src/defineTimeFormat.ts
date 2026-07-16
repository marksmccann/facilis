import defineSegmentedFormat, {
    type SegmentedFormatSegment,
} from './defineSegmentedFormat';
import type { Format } from './types';
import insertBeforeCharacter from './transforms/insertBeforeCharacter';
import rejectInvalidSegments from './transforms/rejectInvalidSegments';

/**
 * The canonical time patterns supported by the time format. Patterns always
 * use `:` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
export type TimeFormatPattern = 'HH:mm' | 'HH:mm:ss' | 'hh:mm' | 'hh:mm:ss';

/**
 * A rendered time separator.
 *
 * @since 0.1.0
 */
export type TimeFormatSeparator = ':' | '.';

/**
 * The configuration options for a time format.
 *
 * @since 0.1.0
 */
export type TimeFormatOptions = {
    /** The canonical pattern that defines the time parts to format. */
    pattern: TimeFormatPattern;

    /** The separator to render between time parts. The default is `:`. */
    separator?: TimeFormatSeparator;

    /**
     * Whether to insert a leading zero for safe single-digit time part values
     * while typing. The default is `false`.
     */
    insertLeadingZero?: boolean;

    /**
     * Whether to reject impossible hour, minute, and second values while
     * typing. The default is `false`.
     */
    strictTimeParts?: boolean;
};

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
    const {
        insertLeadingZero = false,
        pattern,
        separator = ':',
        strictTimeParts = false,
    } = options;
    const patternSegments = pattern.split(':');
    const leadingZeroRules = resolveLeadingZeroRules(patternSegments);

    return defineSegmentedFormat({
        matches: /\d/,
        segments: resolveTimeSegments(patternSegments, separator),
        normalize(value) {
            let normalized = value;

            if (insertLeadingZero) {
                normalized = insertBeforeCharacter(
                    normalized,
                    leadingZeroRules
                );
            }

            if (strictTimeParts) {
                normalized = rejectInvalidSegments(
                    normalized,
                    patternSegments,
                    isPossibleTimePart
                );
            }

            return normalized;
        },
    });
}
