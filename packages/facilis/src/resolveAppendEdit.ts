import type { AppendEditContext, InputDetails, TextState } from './types';

function isCollapsedAtEnd(input: TextState) {
    return (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
    );
}

export default function resolveAppendEdit(
    details: InputDetails,
    previous: TextState,
    current: TextState,
    formatted: string
): AppendEditContext | null {
    if (!details.inputType?.startsWith('insert')) return null;
    if (!isCollapsedAtEnd(previous)) return null;
    if (!current.value.startsWith(previous.value)) return null;
    if (current.value.length <= previous.value.length) return null;

    const rawText = current.value.slice(previous.value.length);

    return {
        intent: 'append',
        previous: previous.value,
        attempted: current.value,
        formatted,
        cursor: previous.value.length,
        start: previous.value.length,
        end: previous.value.length,
        appended: rawText,
    };
}
