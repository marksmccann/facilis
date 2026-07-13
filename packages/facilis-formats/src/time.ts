import {
    defineFormat,
    isAppendDuplicateFormattingAt,
    isAppendExpectedFormattingAt,
    isAppendFormatting,
    isDeleteBackwardOverFormatting,
    isInsertAtMaxLength,
    type Format,
} from 'facilis';
import { reporter } from './reporter';

/**
 * The canonical time patterns supported by the time format. Patterns always
 * use `:` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
const TimePatterns = ['HH:mm', 'HH:mm:ss', 'hh:mm', 'hh:mm:ss'] as const;

/**
 * The separators supported when rendering formatted time values.
 *
 * @since 0.1.0
 */
const TimeSeparators = [':', '.'] as const;

/**
 * A canonical time pattern.
 *
 * @since 0.1.0
 */
export type TimePattern = (typeof TimePatterns)[number];

/**
 * A rendered time separator.
 *
 * @since 0.1.0
 */
export type TimeSeparator = (typeof TimeSeparators)[number];

/**
 * The configuration options for a time format.
 *
 * @since 0.1.0
 */
export type TimeOptions = {
    /**
     * The canonical pattern that defines the time parts to format.
     */
    pattern: TimePattern;

    /**
     * The separator to render between time parts. The default is `:`.
     */
    separator?: TimeSeparator;

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

    if (!TimePatterns.includes(options.pattern)) {
        reporter.fail('ERR10');
    }

    if (!TimeSeparators.includes(separator)) {
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
 * Determines whether one single-digit segment can be padded without blocking a
 * valid continuation path.
 *
 * @private
 */
function shouldInsertLeadingZero(segment: string, value: string) {
    if (segment === 'HH') return /^[3-9]$/.test(value);
    if (segment === 'hh') return /^[2-9]$/.test(value);
    if (segment === 'mm' || segment === 'ss') return /^[6-9]$/.test(value);
    return false;
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
 * Creates a time format for numeric time input.
 *
 * @since 0.1.0
 */
export function time(options: TimeOptions): Format {
    const { insertLeadingZero, pattern, separator, strictTimeParts } =
        normalizeTimeOptions(options);
    const segments = pattern.split(':');
    const segmentLengths = segments.map((segment) => segment.length);
    const maxDigits = segmentLengths.reduce(
        (total, length) => total + length,
        0
    );

    return defineFormat({
        normalize(raw) {
            const digits = raw.replace(/\D/g, '');
            let normalized = '';
            let digitIndex = 0;

            for (const segment of segments) {
                let segmentValue = '';

                while (
                    digitIndex < digits.length &&
                    segmentValue.length < segment.length
                ) {
                    const digit = digits[digitIndex];

                    if (
                        insertLeadingZero &&
                        segmentValue === '' &&
                        shouldInsertLeadingZero(segment, digit)
                    ) {
                        segmentValue = `0${digit}`;
                        digitIndex += 1;
                        break;
                    }

                    const nextSegmentValue = `${segmentValue}${digit}`;

                    if (
                        strictTimeParts &&
                        !isPossibleTimePart(segment, nextSegmentValue)
                    ) {
                        break;
                    }

                    segmentValue = nextSegmentValue;
                    digitIndex += 1;
                }

                normalized += segmentValue;

                if (segmentValue.length < segment.length) {
                    break;
                }
            }

            return normalized.slice(0, maxDigits);
        },
        format(normalized) {
            const parts: string[] = [];
            let index = 0;

            for (const length of segmentLengths) {
                const part = normalized.slice(index, index + length);

                if (part) {
                    parts.push(part);
                }

                index += length;
            }

            return parts.join(separator);
        },
        edit: {
            append(context) {
                const { attempted } = context;

                if (!isAppendFormatting(context)) {
                    return;
                }

                let position = 0;

                for (const length of segmentLengths.slice(0, -1)) {
                    position += length + separator.length;

                    if (
                        isAppendExpectedFormattingAt(
                            context,
                            separator,
                            position - separator.length
                        )
                    ) {
                        return attempted;
                    }

                    if (
                        isAppendDuplicateFormattingAt(
                            context,
                            separator,
                            position - separator.length
                        )
                    ) {
                        return null;
                    }
                }
            },
            insert(context) {
                if (isInsertAtMaxLength(context, maxDigits)) {
                    return null;
                }
            },
            deleteBackward(context) {
                const { cursor, previous } = context;

                if (isDeleteBackwardOverFormatting(context)) {
                    return {
                        value: previous,
                        selectionStart: cursor - 1,
                        selectionEnd: cursor - 1,
                    };
                }
            },
        },
    });
}
