import type {
    FormatDeleteBackwardEdit,
    InputSnapshot,
} from './types';

export default function resolveDeleteBackwardEdit(
    inputType: string | null,
    previous: InputSnapshot,
    current: InputSnapshot,
    previousValue: string,
    attemptedValue: string,
    formattedNextDisplay: string
): FormatDeleteBackwardEdit | null {
    if (inputType !== 'deleteContentBackward') return null;
    if (previous.selectionStart === null) return null;
    if (previous.selectionEnd === null) return null;
    if (previous.selectionStart !== previous.selectionEnd) return null;

    return {
        intent: 'deleteBackward',
        previousDisplay: previous.value,
        previousValue,
        attemptedDisplay: current.value,
        attemptedValue,
        formattedNextDisplay,
        at: previous.selectionStart,
        range: {
            start: Math.max(0, previous.selectionStart - 1),
            end: previous.selectionStart,
        },
    };
}
