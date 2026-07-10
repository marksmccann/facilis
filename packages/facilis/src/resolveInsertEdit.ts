import type { InputDetails, InsertEditContext, TextState } from './types';

function isCollapsed(input: TextState) {
    return input.selectionStart === input.selectionEnd;
}

export default function resolveInsertEdit(
    details: InputDetails,
    previous: TextState,
    current: TextState,
    formatted: string
): InsertEditContext | null {
    if (!details.inputType?.startsWith('insert')) return null;
    if (!isCollapsed(previous)) return null;
    if (previous.selectionStart === null) return null;
    if (previous.selectionStart === previous.value.length) return null;
    if (current.value.length <= previous.value.length) return null;

    const at = previous.selectionStart;
    const rawText = current.value.slice(
        at,
        current.value.length - (previous.value.length - at)
    );

    return {
        intent: 'insert',
        previous: previous.value,
        attempted: current.value,
        formatted,
        cursor: at,
        start: at,
        end: at,
        inserted: rawText,
    };
}
