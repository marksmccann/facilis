import type { TextState } from 'facilis';

/**
 * Creates a text-state object for expected values and exact input snapshots.
 *
 * @param value The text value for the state.
 * @param selectionStart The start of the text selection.
 * @param selectionEnd The end of the text selection.
 * @since 0.0.1
 */
export function textState(
    value: string,
    selectionStart: number | null = value.length,
    selectionEnd: number | null = selectionStart
): TextState {
    return {
        value,
        selectionStart,
        selectionEnd,
    };
}
