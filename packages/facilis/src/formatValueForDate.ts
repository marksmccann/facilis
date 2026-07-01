/**
 * Formats one normalized date value by filling the configured pattern
 * segments in order and inserting the rendered separator only after the
 * preceding segment has been filled.
 *
 * @since 0.0.1
 */
export type FormatValueForDateOptions = {
    /**
     * The canonical date pattern segments in display order.
     */
    patternSegments: string[];

    /**
     * The rendered separator to place between completed segments.
     */
    separator: string;

    /**
     * Whether to insert a leading zero for safe single-digit month and day
     * values while formatting. The default is `false`.
     */
    insertLeadingZero?: boolean;
};

/**
 * Applies date-format defaults when one option is omitted.
 */
function normalizeOptions(options: FormatValueForDateOptions) {
    return {
        insertLeadingZero: options.insertLeadingZero ?? false,
        patternSegments: options.patternSegments,
        separator: options.separator,
    };
}

/**
 * Determines whether one partial segment should display with a leading zero.
 */
function shouldInsertLeadingZero(patternSegment: string, segmentValue: string) {
    if (patternSegment === 'MM') return /[2-9]/.test(segmentValue);
    if (patternSegment === 'DD') return /[4-9]/.test(segmentValue);
    return false;
}

/**
 * Formats one normalized date value by filling the configured pattern
 * segments in order and inserting the rendered separator only after the
 * preceding segment has been filled.
 *
 * @since 0.0.1
 */
export function formatValueForDate(
    normalizedValue: string,
    options: FormatValueForDateOptions
) {
    if (normalizedValue === '') return '';

    const { insertLeadingZero, patternSegments, separator } =
        normalizeOptions(options);
    const patternEntries = patternSegments.entries();
    let formattedValue = '';
    let digitIndex = 0;

    for (const [segmentIndex, patternSegment] of patternEntries) {
        const hasFollowingSegment = segmentIndex < patternSegments.length - 1;
        const remainingDigits = normalizedValue.slice(digitIndex).split('');
        let includeLeadingZero = false;
        let segmentValue = '';

        for (const nextDigit of remainingDigits) {
            // The end of current segment has been reached
            if (segmentValue.length >= patternSegment.length) break;

            // Check to see if this digit should be padded with a leading
            // zero. If so, exit this loop so that it can be added
            if (
                hasFollowingSegment &&
                insertLeadingZero &&
                shouldInsertLeadingZero(patternSegment, segmentValue)
            ) {
                includeLeadingZero = true;
                break;
            }

            segmentValue += nextDigit;
            digitIndex += 1;
        }

        // The segment has no more digits, stop formatting
        if (segmentValue === '') break;

        // If it's not the first segment, add the separator
        if (segmentIndex > 0) formattedValue += separator;

        // Add the segment (with leading zero if needed) to the formatted value
        const paddedSegmentValue = `${includeLeadingZero ? '0' : ''}${segmentValue}`;
        formattedValue += paddedSegmentValue;

        // The current segment is filled, move on to the next segment
        if (paddedSegmentValue.length < patternSegment.length) break;
    }

    return formattedValue;
}
