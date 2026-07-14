import { defineFormat, type Format } from 'facilis';
import {
    isAppendDuplicateFormattingAt,
    isAppendExpectedFormattingAt,
    isAppendFormatting,
    isDeleteBackwardOverFormatting,
    isInsertAtMaxLength,
} from 'facilis/guards';
import {
    insertBeforeCharacter,
    insertSeparators,
    rejectInvalidSegments,
} from 'facilis/transforms';
import { reporter } from './reporter';

/**
 * The canonical time patterns supported by the time format. Patterns always
 * use `:` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
const TIME_PATTERNS = ['HH:mm', 'HH:mm:ss', 'hh:mm', 'hh:mm:ss'] as const;

/**
 * The separators supported when rendering formatted time values.
 *
 * @since 0.1.0
 */
const TIME_SEPARATORS = [':', '.'] as const;

/**
 * A canonical time pattern.
 *
 * @since 0.1.0
 */
export type TimePattern = (typeof TIME_PATTERNS)[number];

/**
 * A rendered time separator.
 *
 * @since 0.1.0
 */
export type TimeSeparator = (typeof TIME_SEPARATORS)[number];

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
        strictTimeParts: options.strictTimeParts ?? false,
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
 * Resolves the normalized positions represented by the canonical separator.
 *
 * @private
 */
function resolveSeparatorPositions(pattern: TimePattern) {
    const positions: number[] = [];

    pattern.split('').forEach((character, index) => {
        if (character !== ':') return;
        positions.push(index);
    });

    return positions;
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
 * Creates a time format for numeric time input.
 *
 * @since 0.1.0
 */
export function time(options: TimeOptions): Format {
    const { insertLeadingZero, pattern, separator, strictTimeParts } =
        normalizeTimeOptions(options);
    const segments = pattern.split(':');
    const segmentLengths = segments.map((segment) => segment.length);
    const separatorPositions = resolveSeparatorPositions(pattern);
    const leadingZeroRules = resolveLeadingZeroRules(segments);
    const maxDigits = segmentLengths.reduce(
        (total, length) => total + length,
        0
    );

    return defineFormat({
        normalize(raw) {
            let digits = raw.replace(/\D/g, '');

            if (insertLeadingZero) {
                digits = insertBeforeCharacter(digits, leadingZeroRules);
            }

            if (strictTimeParts) {
                digits = rejectInvalidSegments(
                    digits,
                    segments,
                    isPossibleTimePart
                );
            }

            return digits.slice(0, maxDigits);
        },
        format(normalized) {
            return insertSeparators(normalized, {
                positions: separatorPositions,
                separator,
            });
        },
        edit: {
            append(context) {
                const { attempted, previous } = context;
                const expectedPosition = previous.length;
                const duplicatePosition = previous.length - separator.length;

                if (!isAppendFormatting(context)) {
                    return;
                }

                if (
                    separatorPositions.includes(expectedPosition) &&
                    isAppendExpectedFormattingAt(
                        context,
                        separator,
                        expectedPosition
                    )
                ) {
                    return attempted;
                }

                if (
                    separatorPositions.includes(duplicatePosition) &&
                    isAppendDuplicateFormattingAt(
                        context,
                        separator,
                        duplicatePosition
                    )
                ) {
                    return null;
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
