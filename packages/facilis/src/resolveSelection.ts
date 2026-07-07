import type { ResolveValueResult } from './resolveValue';
import type {
    FormatDefinition,
    InputSnapshot,
    Selection,
    SelectContext,
} from './types';

/**
 * Resolves one selection boundary through a boundary map while preserving
 * `null` selections and clamping out-of-range indexes to the last known
 * boundary.
 *
 * @private
 */
function resolveSelectionBoundary(
    boundaries: number[],
    index: number | null
): number | null {
    if (index === null) return null;
    const lastIndex = Math.min(index, boundaries.length - 1);
    return boundaries[lastIndex] ?? null;
}

/**
 * Resolves both selection boundaries through one boundary map while preserving
 * `null` selections and clamping out-of-range indexes to the last known
 * boundary.
 *
 * @private
 */
function resolveSelectionBoundaries(
    selection: Selection,
    boundaries: number[]
): Selection {
    const selectionStart = resolveSelectionBoundary(
        boundaries,
        selection.selectionStart
    );
    const selectionEnd = resolveSelectionBoundary(
        boundaries,
        selection.selectionEnd
    );

    return {
        selectionStart,
        selectionEnd,
    };
}

/**
 * Resolves the final formatted selection, including the default boundary-map
 * resolution and any optional format-specific override.
 *
 * @private
 */
export default function resolveSelection(
    definition: FormatDefinition,
    previous: InputSnapshot,
    current: InputSnapshot,
    value: ResolveValueResult
): Selection {
    const normalizedSelection = resolveSelectionBoundaries(
        current,
        value.rawToNormalized
    );
    const resolvedSelection = resolveSelectionBoundaries(
        normalizedSelection,
        value.normalizedToFormatted
    );
    const selectContext: SelectContext = {
        edit: value.edit,
        previous,
        current,
        normalizedValue: value.normalizedValue,
        formattedValue: value.formattedValue,
        resolvedSelection,
    };

    if (definition.select) {
        const selected = definition.select(selectContext);
        if (selected) return selected;
    }

    return resolvedSelection;
}
``;
