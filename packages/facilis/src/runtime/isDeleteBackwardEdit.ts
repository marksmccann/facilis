import type { InputDetails, TextState } from '../types';

/**
 * Determines whether an input edit deleted text backward from a collapsed cursor.
 *
 * @private
 */
export default function isDeleteBackwardEdit(
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
