import runFormat from './runFormat';
import runNormalize from './runNormalize';
import type { InputSnapshot, FormatDefinition } from './types';

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
 * Runs the live formatting pipeline for one current snapshot and returns the
 * next committed snapshot to apply.
 *
 * @private
 */
export default function runInputPipeline(
    definition: FormatDefinition,
    inputType: string | null,
    previous: InputSnapshot,
    current: InputSnapshot
): InputSnapshot {
    const { normalizedValue, rawToNormalized } = runNormalize(
        definition,
        inputType,
        previous,
        current
    );
    const { formattedValue, normalizedToFormatted } = runFormat(
        definition,
        normalizedValue
    );
    const normalizedSelectionStart = resolveSelectionBoundary(
        rawToNormalized,
        current.selectionStart
    );
    const normalizedSelectionEnd = resolveSelectionBoundary(
        rawToNormalized,
        current.selectionEnd
    );

    return {
        value: formattedValue,
        selectionStart: resolveSelectionBoundary(
            normalizedToFormatted,
            normalizedSelectionStart
        ),
        selectionEnd: resolveSelectionBoundary(
            normalizedToFormatted,
            normalizedSelectionEnd
        ),
    };
}
