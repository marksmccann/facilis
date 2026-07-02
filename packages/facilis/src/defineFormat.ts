import type { FormatDefinition, Format } from './types';
import runBlur from './runBlur';
import runFormat from './runFormat';
import runNormalize from './runNormalize';
import runInputPipeline from './runInputPipeline';

/**
 * Creates a reusable format from a format definition.
 *
 * @since 0.0.1
 */
export function defineFormat(definition: FormatDefinition): Format {
    return {
        name: definition.name,
        onMount(input) {
            return runInputPipeline(definition, null, input, input);
        },
        onInput(inputType, previous, current) {
            return runInputPipeline(definition, inputType, previous, current);
        },
        onBlur(input) {
            const { normalizedValue } = runNormalize(
                definition,
                null,
                input,
                input
            );
            const { formattedValue } = runFormat(definition, normalizedValue);
            const { blurredValue } = runBlur(definition, formattedValue);

            return {
                value: blurredValue,
                selectionStart: null,
                selectionEnd: null,
            };
        },
    };
}
