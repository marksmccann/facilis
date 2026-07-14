/**
 * Determines whether a candidate segment value can be accepted.
 *
 * @since 0.1.0
 */
export type RejectInvalidSegmentsAccept = (
    segment: string,
    candidate: string,
    previous: string
) => boolean;

/**
 * Rejects the first character that would make one segment invalid and returns
 * the valid value prefix accepted before that character.
 *
 * @since 0.1.0
 */
export default function rejectInvalidSegments(
    value: string,
    segments: string[],
    accept: RejectInvalidSegmentsAccept
) {
    let normalized = '';
    let index = 0;

    for (const segment of segments) {
        let segmentValue = '';

        while (index < value.length && segmentValue.length < segment.length) {
            const candidate = `${segmentValue}${value[index]}`;

            if (!accept(segment, candidate, segmentValue)) {
                return `${normalized}${segmentValue}`;
            }

            segmentValue = candidate;
            index += 1;
        }

        normalized += segmentValue;

        if (segmentValue.length < segment.length) {
            return normalized;
        }
    }

    return normalized;
}
