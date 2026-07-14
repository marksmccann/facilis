import type { FormatDefinition, Selection } from '../types';

/**
 * Options for resolving where a deletion boundary lands in formatted text.
 *
 * @since 0.1.0
 */
export type ResolveSelectionAtDeletedBoundaryOptions = {
    /**
     * The display value before the deletion.
     */
    previous: string;

    /**
     * The formatted display value after the deletion.
     */
    formatted: string;

    /**
     * The display index where the deletion started.
     */
    start: number;

    /**
     * Extracts the semantic value from display text.
     */
    normalize: FormatDefinition['normalize'];
};

/**
 * Resolves a collapsed selection at the normalized boundary before deleted text,
 * projected into the newly formatted display value.
 *
 * @since 0.1.0
 */
export default function resolveSelectionAtDeletedBoundary(
    options: ResolveSelectionAtDeletedBoundaryOptions
): Selection | undefined {
    const { previous, formatted, start, normalize } = options;
    const normalizedBoundary = normalize(previous.slice(0, start)).length;

    for (let index = 0; index <= formatted.length; index += 1) {
        const displayBoundary = formatted.slice(0, index);

        if (normalize(displayBoundary).length === normalizedBoundary) {
            return {
                selectionStart: index,
                selectionEnd: index,
            };
        }
    }

    return {
        selectionStart: formatted.length,
        selectionEnd: formatted.length,
    };
}
