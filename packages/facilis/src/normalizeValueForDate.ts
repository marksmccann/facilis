/**
 * Normalizes one raw input value into its semantic date string by removing
 * non-numeric characters and trimming the value to the total digit length
 * allowed by the configured date pattern segments.
 *
 * @since 0.0.1
 */
export type NormalizeValueForDateOptions = {
    /**
     * Whether to reject impossible month and day values while typing. The
     * default is `false`.
     */
    strictMonthAndDay?: boolean;

    /**
     * The canonical date pattern segments in display order.
     */
    patternSegments: string[];

    /**
     * Whether to insert a leading zero for safe single-digit month and day
     * values while typing. The default is `false`.
     */
    insertLeadingZero?: boolean;
};

/**
 * Applies date-normalization defaults when one option is omitted.
 */
function normalizeOptions(options: NormalizeValueForDateOptions) {
    return {
        insertLeadingZero: options.insertLeadingZero ?? false,
        patternSegments: options.patternSegments,
    };
}

/**
 * Determines whether one partial segment can be safely padded with a leading
 * zero without blocking a valid continuation path.
 */
function shouldInsertLeadingZero(patternSegment: string, segmentValue: string) {
    if (patternSegment === 'MM') return /[2-9]/.test(segmentValue);
    if (patternSegment === 'DD') return /[4-9]/.test(segmentValue);
    return false;
}

/**
 * Normalizes one raw input value into its semantic date string by removing
 * non-numeric characters and trimming the value to the total digit length
 * allowed by the configured date pattern segments.
 *
 * @since 0.0.1
 */
export function normalizeValueForDate(
    rawValue: string,
    options: NormalizeValueForDateOptions
) {
    const { insertLeadingZero, patternSegments } = normalizeOptions(options);
    const patternEntries = patternSegments.entries();
    const rawDigits = rawValue.replace(/\D/g, '');
    let normalizedValue = '';
    let digitIndex = 0;

    for (const [segmentIndex, patternSegment] of patternEntries) {
        const hasFollowingSegment = segmentIndex < patternSegments.length - 1;
        const remainingDigits = rawDigits.slice(digitIndex).split('');
        let segmentValue = '';

        for (const nextDigit of remainingDigits) {
            // The end of current segment has been reached
            if (segmentValue.length >= patternSegment.length) {
                break;
            }

            // Check to see if this digit should be padded with a leading zero.
            // If so, exit to avoid adding this digit to the current segment.
            if (
                hasFollowingSegment &&
                insertLeadingZero &&
                shouldInsertLeadingZero(patternSegment, segmentValue)
            ) {
                break;
            }

            segmentValue += nextDigit;
            digitIndex += 1;
        }

        normalizedValue += segmentValue;
    }

    return normalizedValue;
}
