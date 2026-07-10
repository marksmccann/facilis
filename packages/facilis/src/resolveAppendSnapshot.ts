import type { InputDetails, TextState } from './types';

function isCollapsedAtEnd(input: TextState) {
    return (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
    );
}

export default function resolveAppendSnapshot(
    details: InputDetails,
    previous: TextState
): TextState | null {
    if (!details.inputType?.startsWith('insert')) return null;
    if (details.data === null) return null;
    if (!isCollapsedAtEnd(previous)) return null;

    const selection = previous.value.length + details.data.length;

    return {
        value: previous.value + details.data,
        selectionStart: selection,
        selectionEnd: selection,
    };
}
