import type { FormatDefinition, InputSnapshot, Selection } from './types';

function resolveBoundary(boundaries: number[], index: number | null) {
    if (index === null) return null;

    const lastIndex = boundaries.length - 1;
    const resolvedIndex = Math.max(0, Math.min(index, lastIndex));

    return boundaries[resolvedIndex] ?? null;
}

function resolveBoundaries(
    selection: Selection,
    boundaries: number[]
): Selection {
    return {
        selectionStart: resolveBoundary(boundaries, selection.selectionStart),
        selectionEnd: resolveBoundary(boundaries, selection.selectionEnd),
    };
}

function mapDisplayToValueBoundaries(
    display: string,
    normalize: FormatDefinition['normalize']
) {
    const boundaries: number[] = [];

    for (let index = 0; index <= display.length; index += 1) {
        boundaries.push(normalize(display.slice(0, index)).length);
    }

    return boundaries;
}

function mapValueToDisplayBoundaries(
    value: string,
    display: string,
    normalize: FormatDefinition['normalize']
) {
    const boundaries: number[] = [];
    const displayToValue = mapDisplayToValueBoundaries(display, normalize);

    for (let index = 0; index <= value.length; index += 1) {
        boundaries.push(0);
    }

    for (const [displayBoundary, valueBoundary] of displayToValue.entries()) {
        if (valueBoundary <= value.length) {
            boundaries[valueBoundary] = displayBoundary;
        }
    }

    return boundaries;
}

/** Resolves a display selection through the default value-format boundary maps. */
export default function resolveSelection(
    definition: FormatDefinition,
    current: InputSnapshot,
    normalizedValue: string,
    formattedValue: string
): Selection {
    if (current.value === formattedValue) {
        return {
            selectionStart: current.selectionStart,
            selectionEnd: current.selectionEnd,
        };
    }

    const displayToValue = mapDisplayToValueBoundaries(
        current.value,
        definition.normalize
    );
    const valueToDisplay = mapValueToDisplayBoundaries(
        normalizedValue,
        formattedValue,
        definition.normalize
    );
    const valueSelection = resolveBoundaries(current, displayToValue);

    return resolveBoundaries(valueSelection, valueToDisplay);
}
