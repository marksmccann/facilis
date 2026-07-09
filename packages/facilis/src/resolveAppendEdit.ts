import type {
    FormatAppendEdit,
    FormatDefinition,
    InputSnapshot,
} from './types';

function isCollapsedAtEnd(input: InputSnapshot) {
    return (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
    );
}

export function resolveAppendSnapshot(
    inputType: string | null,
    rawText: string | null,
    previous: InputSnapshot
): InputSnapshot | null {
    if (!inputType?.startsWith('insert')) return null;
    if (rawText === null) return null;
    if (!isCollapsedAtEnd(previous)) return null;

    const selection = previous.value.length + rawText.length;

    return {
        value: previous.value + rawText,
        selectionStart: selection,
        selectionEnd: selection,
    };
}

export default function resolveAppendEdit(
    inputType: string | null,
    definition: FormatDefinition,
    previous: InputSnapshot,
    current: InputSnapshot,
    previousValue: string,
    attemptedValue: string,
    formattedNextDisplay: string
): FormatAppendEdit | null {
    if (!inputType?.startsWith('insert')) return null;
    if (!isCollapsedAtEnd(previous)) return null;
    if (!current.value.startsWith(previous.value)) return null;
    if (current.value.length <= previous.value.length) return null;

    const rawText = current.value.slice(previous.value.length);

    return {
        intent: 'append',
        previousDisplay: previous.value,
        previousValue,
        attemptedDisplay: current.value,
        attemptedValue,
        formattedNextDisplay,
        text: definition.normalize(rawText),
        rawText,
        at: previous.value.length,
        range: {
            start: previous.value.length,
            end: previous.value.length,
        },
    };
}
