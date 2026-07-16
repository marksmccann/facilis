import type { FormatDefinition } from '../types/format';
import type { Selection, TextState } from '../types/input';
import runFormat from '../runtime/runFormat';

/**
 * Resolves one cursor boundary through a boundary lookup table.
 *
 * The incoming index represents a cursor position in the source text. The
 * boundary table translates that index into the matching cursor position in
 * the target text. Null selections remain null, and numeric indexes are
 * clamped to the available lookup range so stale or out-of-range selections
 * still resolve to a valid boundary when possible.
 *
 * @private
 */
function resolveBoundary(boundaries: number[], index: number | null) {
    if (index === null) return null;

    const lastIndex = boundaries.length - 1;
    const resolvedIndex = Math.max(0, Math.min(index, lastIndex));

    return boundaries[resolvedIndex] ?? null;
}

/**
 * Resolves both ends of a selection through the same boundary lookup table.
 *
 * @private
 */
function resolveBoundaries(
    selection: Selection,
    boundaries: number[]
): Selection {
    const start = selection.selectionStart;
    const end = selection.selectionEnd;
    const selectionStart = resolveBoundary(boundaries, start);
    const selectionEnd = resolveBoundary(boundaries, end);

    return { selectionStart, selectionEnd };
}

/**
 * Maps every possible cursor boundary in raw text to its corresponding
 * normalized boundary.
 *
 * The returned array is indexed by raw boundary. Each entry is the length of
 * the normalized text produced by the raw text up to that boundary. For
 * example, raw text of `(555` with a digit-only normalizer produces
 * `[0, 0, 1, 2, 3]`: the boundary after `(` still maps to normalized index
 * `0`, while each digit advances the normalized index.
 *
 * @private
 */
function mapRawToNormalized(
    raw: string,
    normalize: FormatDefinition['normalize']
) {
    return Array.from({ length: raw.length + 1 }, (_, index) => {
        const rawSegment = raw.slice(0, index);
        const normalizedBoundary = normalize(rawSegment).length;

        return normalizedBoundary;
    });
}

/**
 * Maps every possible cursor boundary in normalized text to its corresponding
 * formatted boundary.
 *
 * The returned array is indexed by normalized boundary. Each entry is the
 * formatted boundary that should represent that normalized boundary after
 * formatting. For example, formatting `555` as `(555` with a digit-only
 * normalizer produces `[1, 2, 3, 4]`: normalized boundary `0` lands after the
 * leading `(`, and each digit boundary lands after its formatted digit.
 *
 * @private
 */
function mapNormalizedToFormatted(
    normalized: string,
    formatted: string,
    normalize: FormatDefinition['normalize']
) {
    const total = normalized.length;
    const rawToNormalized = mapRawToNormalized(formatted, normalize);
    const boundaries = Array.from({ length: total + 1 }, (_, boundary) => {
        if (boundary === 0) {
            const firstSemanticIndex = rawToNormalized.findIndex(
                (normalizedBoundary) => normalizedBoundary > 0
            );

            return firstSemanticIndex === -1 ? 0 : firstSemanticIndex - 1;
        }

        if (boundary === total) {
            const formattedBoundary = rawToNormalized.findIndex(
                (normalizedBoundary) => normalizedBoundary >= boundary
            );
            const trailingText = formatted.slice(formattedBoundary);

            if (formattedBoundary !== -1 && normalize(trailingText) === '') {
                return formattedBoundary;
            }
        }

        let formattedBoundary = -1;

        rawToNormalized.forEach((normalizedBoundary, index) => {
            if (normalizedBoundary === boundary) {
                formattedBoundary = index;
            }
        });

        return formattedBoundary === -1 ? formatted.length : formattedBoundary;
    });

    return boundaries;
}

/**
 * Resolves a raw selection through the default normalized and formatted
 * boundary maps.
 *
 * @private
 */
export default function resolveSelection(
    definition: FormatDefinition,
    current: TextState
): Selection {
    const { normalize } = definition;
    const { value: raw, selectionStart, selectionEnd } = current;
    const normalized = normalize(raw);
    const formatted = runFormat(definition, normalized);

    // Attempt to derive the new selection when formatting changees the text.
    if (raw !== formatted) {
        const rawToNormalized = mapRawToNormalized(raw, normalize);
        // prettier-ignore
        const normalizedToFormatted = mapNormalizedToFormatted(normalized, formatted, normalize);
        const normalizedSelection = resolveBoundaries(current, rawToNormalized);

        return resolveBoundaries(normalizedSelection, normalizedToFormatted);
    }

    return { selectionStart, selectionEnd };
}
