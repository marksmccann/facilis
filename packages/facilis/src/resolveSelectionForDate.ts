import type { FormatSelectionContext, FormatSelectionResult } from './types';
import { resolveSelectionForCharacters } from './resolveSelectionForCharacters';

/**
 * The configuration options for date selection resolution.
 *
 * @since 0.0.1
 */
export type ResolveSelectionForDateOptions = {
    /**
     * Whether to insert a leading zero for safe single-digit month and day
     * values while formatting. The default is `false`.
     */
    insertLeadingZero?: boolean;

    /**
     * The canonical date pattern segments in display order.
     */
    patternSegments: string[];

    /**
     * The rendered separator to place between completed segments.
     */
    separator: string;
};

/**
 * Applies date-selection defaults when one option is omitted.
 */
function normalizeOptions(options: ResolveSelectionForDateOptions) {
    return {
        insertLeadingZero: options.insertLeadingZero ?? false,
        patternSegments: options.patternSegments,
        separator: options.separator,
    };
}

/**
 * Determines whether one partial segment should display with a leading zero.
 */
function shouldInsertLeadingZero(
    patternSegment: string,
    segmentValue: string,
    insertLeadingZero: boolean
) {
    if (!insertLeadingZero) return false;
    if (segmentValue.length !== 1) return false;
    if (patternSegment === 'MM') return /[2-9]/.test(segmentValue);
    if (patternSegment === 'DD') return /[4-9]/.test(segmentValue);
    return false;
}

/**
 * Counts how many numeric characters appear before one raw selection index.
 */
function countDigitsBeforeSelection(value: string, selectionIndex: number) {
    return value.slice(0, selectionIndex).replace(/\D/g, '').length;
}

/**
 * Maps each consumed normalized digit to the caret position it should produce
 * in the formatted date, including any inserted leading zero.
 */
function getDigitSelectionPositions(
    normalizedValue: string,
    options: ReturnType<typeof normalizeOptions>
) {
    const { insertLeadingZero, patternSegments, separator } = options;
    const positions: number[] = [];
    let digitIndex = 0;
    let formattedLength = 0;

    for (const [segmentIndex, patternSegment] of patternSegments.entries()) {
        const hasFollowingSegment = segmentIndex < patternSegments.length - 1;
        const remainingDigits = normalizedValue.slice(digitIndex).split('');
        let segmentValue = '';

        for (const nextDigit of remainingDigits) {
            if (segmentValue.length >= patternSegment.length) {
                break;
            }

            if (
                hasFollowingSegment &&
                shouldInsertLeadingZero(
                    patternSegment,
                    segmentValue,
                    insertLeadingZero
                )
            ) {
                break;
            }

            segmentValue += nextDigit;
            digitIndex += 1;
        }

        if (segmentValue === '') {
            break;
        }

        if (segmentIndex > 0) {
            formattedLength += separator.length;
        }

        const paddedSegmentValue = shouldInsertLeadingZero(
            patternSegment,
            segmentValue,
            insertLeadingZero
        )
            ? `0${segmentValue}`
            : segmentValue;
        const segmentEnd = formattedLength + paddedSegmentValue.length;

        if (paddedSegmentValue !== segmentValue) {
            positions.push(segmentEnd);
        } else {
            for (
                let segmentDigitIndex = 0;
                segmentDigitIndex < segmentValue.length;
                segmentDigitIndex += 1
            ) {
                positions.push(formattedLength + segmentDigitIndex + 1);
            }
        }

        formattedLength = segmentEnd;

        if (paddedSegmentValue.length < patternSegment.length) {
            break;
        }
    }

    return positions;
}

/**
 * Resolves the next selection range for a date value by preserving only the
 * typed date digits while ignoring rendered separators.
 *
 * @since 0.0.1
 */
export function resolveSelectionForDate(
    context: FormatSelectionContext,
    options: ResolveSelectionForDateOptions
): FormatSelectionResult {
    const normalizedOptions = normalizeOptions(options);
    const { insertLeadingZero } = normalizedOptions;

    if (!insertLeadingZero) {
        return resolveSelectionForCharacters(context, /\d/);
    }

    const digitSelectionPositions = getDigitSelectionPositions(
        context.normalizedValue,
        normalizedOptions
    );
    const maxDigitCount = context.normalizedValue.length;
    const selectionStartCount = Math.min(
        countDigitsBeforeSelection(context.rawValue, context.rawSelectionStart),
        maxDigitCount
    );
    const selectionEndCount = Math.min(
        countDigitsBeforeSelection(context.rawValue, context.rawSelectionEnd),
        maxDigitCount
    );

    return {
        selectionStart:
            selectionStartCount <= 0
                ? 0
                : (digitSelectionPositions[selectionStartCount - 1] ??
                  context.formattedValue.length),
        selectionEnd:
            selectionEndCount <= 0
                ? 0
                : (digitSelectionPositions[selectionEndCount - 1] ??
                  context.formattedValue.length),
    };
}
