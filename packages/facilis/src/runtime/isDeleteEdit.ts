import type { InputDetails, TextState } from '../types/input';

/**
 * Determines whether an input edit deleted text from a collapsed cursor.
 *
 * @private
 */
export default function isDeleteEdit(
    details: InputDetails,
    previous: TextState
): boolean {
    return (
        details.inputType === 'deleteContentBackward' &&
        previous.selectionStart !== null &&
        previous.selectionEnd !== null &&
        previous.selectionStart === previous.selectionEnd
    );
}
