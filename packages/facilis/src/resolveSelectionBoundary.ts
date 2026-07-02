/**
 * Resolves one selection boundary through a boundary map while preserving
 * `null` selections and clamping out-of-range indexes to the last known
 * boundary.
 *
 * @private
 */
export default function resolveSelectionBoundary(
    boundaries: number[],
    index: number | null
): number | null {
    if (index === null) return null;
    const lastIndex = Math.min(index, boundaries.length - 1);
    return boundaries[lastIndex] ?? null;
}
