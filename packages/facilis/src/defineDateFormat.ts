import defineSegmentedFormat, {
    type SegmentedFormatSegment,
} from './defineSegmentedFormat';
import type { Format } from './types';
import insertBeforeCharacter from './transforms/insertBeforeCharacter';
import rejectInvalidSegments from './transforms/rejectInvalidSegments';

/** The canonical date patterns supported by date format definitions. */
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

/** The rendered separator supported by date format definitions. */
export type DateFormatSeparator = '/' | '-' | '.';

/** Defines date-specific formatting behavior. */
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

/** Creates a reusable date format from date-specific options. */
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
