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
export type DatePattern = (typeof DATE_PATTERNS)[number];

/**
 * A rendered date separator.
 *
 * @since 0.1.0
 */
export type DateSeparator = (typeof DATE_SEPARATORS)[number];

/**
 * The configuration options for a date format.
 *
 * @since 0.1.0
 */
export type DateOptions = {
    /**
     * The canonical pattern that defines the date parts to format.
     */
    pattern: DatePattern;

    /**
     * The separator to render between date parts. The default is `/`.
     */
    separator?: DateSeparator;

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
 * Determines whether one single-digit segment can be padded without blocking a
 * valid continuation path.
 *
 * @private
 */
function shouldInsertLeadingZero(segment: string, value: string) {
    if (segment === 'MM') return /^[2-9]$/.test(value);
    if (segment === 'DD') return /^[4-9]$/.test(value);
    return false;
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
 * Creates a date format for numeric date input.
 *
 * @since 0.1.0
 */
export function date(options: DateOptions): Format {
    const { insertLeadingZero, pattern, separator, strictMonthAndDay } =
        normalizeDateOptions(options);
    const segments = pattern.split('/');
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

            for (const [segmentIndex, segment] of segments.entries()) {
                const hasFollowingSegment = segmentIndex < segments.length - 1;
                let segmentValue = '';

                while (
                    digitIndex < digits.length &&
                    segmentValue.length < segment.length
                ) {
                    const digit = digits[digitIndex];

                    if (
                        hasFollowingSegment &&
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
                        strictMonthAndDay &&
                        !isPossibleMonthOrDay(segment, nextSegmentValue)
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
