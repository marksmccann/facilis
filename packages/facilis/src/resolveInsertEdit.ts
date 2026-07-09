import type {
    FormatDefinition,
    FormatInsertEdit,
    InputSnapshot,
} from './types';

function isCollapsed(input: InputSnapshot) {
    return input.selectionStart === input.selectionEnd;
}

export function resolveInsertSnapshot(
    inputType: string | null,
    rawText: string | null,
    previous: InputSnapshot
): InputSnapshot | null {
    if (!inputType?.startsWith('insert')) return null;
    if (rawText === null) return null;
    if (!isCollapsed(previous)) return null;
    if (previous.selectionStart === null) return null;
    if (previous.selectionStart === previous.value.length) return null;

    const at = previous.selectionStart;
    const selection = at + rawText.length;

    return {
        value:
            previous.value.slice(0, at) +
            rawText +
            previous.value.slice(at),
        selectionStart: selection,
        selectionEnd: selection,
    };
}

export default function resolveInsertEdit(
    inputType: string | null,
    definition: FormatDefinition,
    previous: InputSnapshot,
    current: InputSnapshot,
    previousValue: string,
    attemptedValue: string,
    formattedNextDisplay: string
): FormatInsertEdit | null {
    if (!inputType?.startsWith('insert')) return null;
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
        previousDisplay: previous.value,
        previousValue,
        attemptedDisplay: current.value,
        attemptedValue,
        formattedNextDisplay,
        text: definition.normalize(rawText),
        rawText,
        at,
        range: {
            start: at,
            end: at,
        },
    };
}
