import type { InputDetails, TextState } from '../types';

/**
 * Determines whether the selection is collapsed to one cursor position.
 *
 * @private
 */
function isCollapsed(previous: TextState) {
    return previous.selectionStart === previous.selectionEnd;
}

/**
 * Determines whether an input edit inserted text before the end of the value.
 *
 * @private
 */
export default function isInsertEdit(
    details: InputDetails,
    previous: TextState,
    current: TextState
): boolean {
    return (
        details.inputType?.startsWith('insert') === true &&
        isCollapsed(previous) &&
        previous.selectionStart !== null &&
        previous.selectionStart !== previous.value.length &&
        current.value.length > previous.value.length
    );
}
