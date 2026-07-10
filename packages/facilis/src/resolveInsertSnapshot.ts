import type { InputDetails, TextState } from './types';

function isCollapsed(input: TextState) {
    return input.selectionStart === input.selectionEnd;
}

export default function resolveInsertSnapshot(
    details: InputDetails,
    previous: TextState
): TextState | null {
    if (!details.inputType?.startsWith('insert')) return null;
    if (details.data === null) return null;
    if (!isCollapsed(previous)) return null;
    if (previous.selectionStart === null) return null;
    if (previous.selectionStart === previous.value.length) return null;

    const at = previous.selectionStart;
    const selection = at + details.data.length;

    return {
        value:
            previous.value.slice(0, at) +
            details.data +
            previous.value.slice(at),
        selectionStart: selection,
        selectionEnd: selection,
    };
}
