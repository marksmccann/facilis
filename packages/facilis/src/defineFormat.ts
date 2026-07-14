import type { Format, FormatDefinition, TextState } from './types';
import isAppendEdit from './runtime/isAppendEdit';
import isDeleteBackwardEdit from './runtime/isDeleteBackwardEdit';
import isInsertEdit from './runtime/isInsertEdit';
import resolveEditResult from './runtime/resolveEditResult';
import runAppend from './runtime/runAppend';
import runBlur from './runtime/runBlur';
import runDeleteBackward from './runtime/runDeleteBackward';
import runFormat from './runtime/runFormat';
import runInsert from './runtime/runInsert';
import resolveSelection from './selection/resolveSelection';

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
            const normalized = definition.normalize(current.value);
            const formatted = runFormat(definition, normalized);
            const selection = resolveSelection(definition, current);
            const editContext = {
                definition,
                previous,
                current,
                normalized,
                formatted,
            };
            let next: TextState = { value: formatted, ...selection };

            if (isAppendEdit(details, previous, current)) {
                const result = runAppend(editContext);
                next = resolveEditResult(result, previous, next);
            } else if (isInsertEdit(details, previous, current)) {
                const result = runInsert(editContext);
                next = resolveEditResult(result, previous, next);
            } else if (isDeleteBackwardEdit(details, previous)) {
                const result = runDeleteBackward(editContext);
                next = resolveEditResult(result, previous, next);
            }

            return next;
        },
        onBlur(current) {
            const normalized = definition.normalize(current.value);
            const formatted = runFormat(definition, normalized);
            const blurred = runBlur(definition, formatted);
            const selection = { selectionStart: null, selectionEnd: null };

            return { value: blurred, ...selection };
        },
    };
}
