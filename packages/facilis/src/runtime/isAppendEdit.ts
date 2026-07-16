import type { InputDetails, TextState } from '../types/input';

/**
 * Determines whether the selection is collapsed at the end of the value.
 *
 * @private
 */
function isCollapsedAtEnd(previous: TextState) {
    const { selectionStart, selectionEnd, value } = previous;
    return selectionStart === value.length && selectionEnd === value.length;
}

/**
 * Determines whether an input edit appended text to the end of the value.
 *
 * @private
 */
export default function isAppendEdit(
    details: InputDetails,
    previous: TextState,
    current: TextState
): boolean {
    return (
        details.inputType?.startsWith('insert') === true &&
        isCollapsedAtEnd(previous) &&
        current.value.startsWith(previous.value) &&
        current.value.length > previous.value.length
    );
}
