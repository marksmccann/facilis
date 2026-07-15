import defineSegmentedFormat, {
    type SegmentedFormatSegment,
} from './defineSegmentedFormat';
import type { Format } from './types';
import insertBeforeCharacter from './transforms/insertBeforeCharacter';
import rejectInvalidSegments from './transforms/rejectInvalidSegments';

/**
 * The canonical date patterns supported by the date format. Patterns always
 * use `/` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
export type DateFormatPattern =
    | 'MM/DD/YY'
    | 'MM/DD/YYYY'
    | 'DD/MM/YY'
    | 'DD/MM/YYYY'
    | 'YY/MM/DD'
    | 'YYYY/MM/DD'
    | 'MM/YY'
    | 'MM/YYYY'
    | 'YY/MM'
    | 'YYYY/MM';

/**
 * A rendered date separator.
 *
 * @since 0.1.0
 */
export type DateFormatSeparator = '/' | '-' | '.';

/**
 * The configuration options for a date format.
 *
 * @since 0.1.0
 */
export type DateFormatOptions = {
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
     * Whether to reject impossible month and day values while typing. The
     * default is `false`.
     */
    strictMonthAndDay?: boolean;
};

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
    const {
        insertLeadingZero = false,
        pattern,
        separator = '/',
        strictMonthAndDay = false,
    } = options;
    const patternSegments = pattern.split('/');
    const leadingZeroRules = resolveLeadingZeroRules(patternSegments);

    return defineSegmentedFormat({
        characters: 'digits',
        segments: resolveDateSegments(patternSegments, separator),
        normalize(value) {
            let normalized = value;

            if (insertLeadingZero) {
                normalized = insertBeforeCharacter(
                    normalized,
                    leadingZeroRules
                );
            }

            if (strictMonthAndDay) {
                normalized = rejectInvalidSegments(
                    normalized,
                    patternSegments,
                    isPossibleMonthOrDay
                );
            }

            return normalized;
        },
    });
}
