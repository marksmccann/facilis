import type { FormatDefinition, Format, InputSnapshot } from './types';
import resolveSelection from './resolveSelection';
import resolveBlur from './resolveBlur';
import resolveValue from './resolveValue';

/**
 * Creates a reusable format from a format definition.
 *
 * @since 0.0.1
 */
export function defineFormat(definition: FormatDefinition): Format {
    return {
        name: definition.name,
        onMount(input) {
            const value = resolveValue(definition, null, input, input);
            const selection = resolveSelection(definition, input, input, value);

            return { value: value.formattedValue, ...selection };
        },
        onInput(type, ...inputs) {
            const value = resolveValue(definition, type, ...inputs);
            const selection = resolveSelection(definition, ...inputs, value);

            return { value: value.formattedValue, ...selection };
        },
        onBlur(input) {
            const value = resolveValue(definition, null, input, input);
            const blurred = resolveBlur(definition, value);
            const selection = { selectionStart: null, selectionEnd: null };

            return { value: blurred, ...selection };
        },
    };
}
