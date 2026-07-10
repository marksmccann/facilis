import type { Format, FormatDefinition } from './types';
import resolveAppendEdit from './resolveAppendEdit';
import resolveAppendSnapshot from './resolveAppendSnapshot';
import resolveDeleteBackwardEdit from './resolveDeleteBackwardEdit';
import resolveEditResult from './resolveEditResult';
import resolveInsertEdit from './resolveInsertEdit';
import resolveInsertSnapshot from './resolveInsertSnapshot';
import resolveSelection from './resolveSelection';
import runBlur from './runBlur';
import runFormat from './runFormat';

/** Creates a reusable format from a format definition. */
export default function defineFormat(definition: FormatDefinition): Format {
    return {
        onMount(current) {
            const normalized = definition.normalize(current.value);
            const formatted = runFormat(definition, normalized);
            const selection = resolveSelection(definition, current);

            return { value: formatted, ...selection };
        },
        onInput(details, previous, current) {
            const nextCurrent =
                resolveAppendSnapshot(details, previous) ??
                resolveInsertSnapshot(details, previous) ??
                current;
            const attemptedNormalized = definition.normalize(nextCurrent.value);
            const formatted = runFormat(definition, attemptedNormalized);
            const appendEdit = resolveAppendEdit(
                details,
                previous,
                nextCurrent,
                formatted
            );
            const appendResult = appendEdit
                ? definition.edit?.append?.(appendEdit)
                : undefined;
            const handledAppend = resolveEditResult(appendResult, previous);

            if (handledAppend) return handledAppend;

            const insertEdit = resolveInsertEdit(
                details,
                previous,
                nextCurrent,
                formatted
            );
            const insertResult = insertEdit
                ? definition.edit?.insert?.(insertEdit)
                : undefined;
            const handledInsert = resolveEditResult(insertResult, previous);

            if (handledInsert) return handledInsert;

            const deleteBackwardEdit = resolveDeleteBackwardEdit(
                details,
                previous,
                nextCurrent,
                formatted
            );
            const deleteBackwardResult = deleteBackwardEdit
                ? definition.edit?.deleteBackward?.(deleteBackwardEdit)
                : undefined;
            const handledDeleteBackward = resolveEditResult(
                deleteBackwardResult,
                previous
            );

            if (handledDeleteBackward) return handledDeleteBackward;

            const selection = resolveSelection(definition, nextCurrent);

            return {
                value: formatted,
                ...selection,
            };
        },
        onBlur(input) {
            const normalized = definition.normalize(input.value);
            const formatted = runFormat(definition, normalized);
            const blurred = runBlur(definition, formatted);
            const selection = { selectionStart: null, selectionEnd: null };

            return { value: blurred, ...selection };
        },
    };
}
