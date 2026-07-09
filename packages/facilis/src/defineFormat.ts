import type { Format, FormatDefinition, FormatHookResult } from './types';
import resolveAppendEdit, { resolveAppendSnapshot } from './resolveAppendEdit';
import resolveDeleteBackwardEdit from './resolveDeleteBackwardEdit';
import resolveInsertEdit, { resolveInsertSnapshot } from './resolveInsertEdit';
import resolveSelection from './resolveSelection';

function resolveHookResult(
    result: FormatHookResult,
    fallback: ReturnType<Format['onInput']>
): ReturnType<Format['onInput']> | undefined {
    if (result === undefined) return undefined;
    if (result === null) return fallback;

    if (typeof result === 'string') {
        return {
            value: result,
            selectionStart: result.length,
            selectionEnd: result.length,
        };
    }

    return result;
}

function formatValue(definition: FormatDefinition, value: string): string {
    return definition.format?.(value) ?? value;
}

/** Creates a reusable format from a format definition. */
export function defineFormat(definition: FormatDefinition): Format {
    return {
        onMount(input) {
            const normalizedValue = definition.normalize(input.value);
            const formattedValue = formatValue(definition, normalizedValue);
            const selection = resolveSelection(
                definition,
                input,
                normalizedValue,
                formattedValue
            );

            return {
                value: formattedValue,
                ...selection,
            };
        },
        onInput(type, previous, current, rawText = null) {
            const nextCurrent =
                resolveAppendSnapshot(type, rawText, previous) ??
                resolveInsertSnapshot(type, rawText, previous) ??
                current;
            const previousValue = definition.normalize(previous.value);
            const normalizedValue = definition.normalize(nextCurrent.value);
            const formattedNextDisplay = formatValue(
                definition,
                normalizedValue
            );
            const appendEdit = resolveAppendEdit(
                type,
                definition,
                previous,
                nextCurrent,
                previousValue,
                normalizedValue,
                formattedNextDisplay
            );
            const appendResult = appendEdit
                ? definition.on?.append?.(appendEdit)
                : undefined;
            const handledAppend = resolveHookResult(appendResult, previous);

            if (handledAppend) return handledAppend;

            const insertEdit = resolveInsertEdit(
                type,
                definition,
                previous,
                nextCurrent,
                previousValue,
                normalizedValue,
                formattedNextDisplay
            );
            const insertResult = insertEdit
                ? definition.on?.insert?.(insertEdit)
                : undefined;
            const handledInsert = resolveHookResult(insertResult, previous);

            if (handledInsert) return handledInsert;

            const deleteBackwardEdit = resolveDeleteBackwardEdit(
                type,
                previous,
                nextCurrent,
                previousValue,
                normalizedValue,
                formattedNextDisplay
            );
            const deleteBackwardResult = deleteBackwardEdit
                ? definition.on?.deleteBackward?.(deleteBackwardEdit)
                : undefined;
            const handledDeleteBackward = resolveHookResult(
                deleteBackwardResult,
                previous
            );

            if (handledDeleteBackward) return handledDeleteBackward;

            const formattedValue = formattedNextDisplay;
            const selection = resolveSelection(
                definition,
                nextCurrent,
                normalizedValue,
                formattedValue
            );

            return {
                value: formattedValue,
                ...selection,
            };
        },
        onBlur(input) {
            const normalizedValue = definition.normalize(input.value);
            const formattedValue = formatValue(definition, normalizedValue);

            return {
                value: formattedValue,
                selectionStart: null,
                selectionEnd: null,
            };
        },
    };
}
