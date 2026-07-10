import type {
    DeleteBackwardEditContext,
    InputDetails,
    TextState,
} from './types';

export default function resolveDeleteBackwardEdit(
    details: InputDetails,
    previous: TextState,
    current: TextState,
    formatted: string
): DeleteBackwardEditContext | null {
    if (details.inputType !== 'deleteContentBackward') return null;
    if (previous.selectionStart === null) return null;
    if (previous.selectionEnd === null) return null;
    if (previous.selectionStart !== previous.selectionEnd) return null;

    const deletedResolved = previous.value.slice(
        Math.max(0, previous.selectionStart - 1),
        previous.selectionStart
    );

    return {
        intent: 'deleteBackward',
        previous: previous.value,
        attempted: current.value,
        formatted,
        cursor: previous.selectionStart,
        start: Math.max(0, previous.selectionStart - 1),
        end: previous.selectionStart,
        deleted: deletedResolved,
    };
}
