import type { Format, FormatDefinition } from '../types/format';
import type { TextState } from '../types/input';
import isAppendEdit from './isAppendEdit';
import isDeleteEdit from './isDeleteEdit';
import isInsertEdit from './isInsertEdit';
import resolveEditResult from './resolveEditResult';
import resolveSelection from './resolveSelection';
import runAppend from './runAppend';
import runBlur from './runBlur';
import runDelete from './runDelete';
import runFormat from './runFormat';
import runInsert from './runInsert';

/**
 * Creates a reusable format from a format definition.
 *
 * @since v0.1.0
 */
export default function defineFormat(definition: FormatDefinition): Format {
    return {
        formatValue(value) {
            const normalized = definition.normalize(value);
            const formatted = runFormat(definition, normalized);

            return runBlur(definition, formatted);
        },
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
            let next: TextState = { value: formatted, ...selection };
            const editContext = {
                definition,
                previous,
                current,
                normalized,
                formatted,
                resolved: next,
            };

            if (isAppendEdit(details, previous, current)) {
                const result = runAppend(editContext);
                next = resolveEditResult(result, previous, next);
            } else if (isInsertEdit(details, previous, current)) {
                const result = runInsert(editContext);
                next = resolveEditResult(result, previous, next);
            } else if (isDeleteEdit(details, previous)) {
                const result = runDelete(editContext);
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
