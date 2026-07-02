import type { FormatDefinition, Format } from './types';
import resolveSelectionBoundary from './resolveSelectionBoundary';
import runBlur from './runBlur';
import runFormat from './runFormat';
import runNormalize from './runNormalize';

/**
 * Creates a reusable format from a format definition.
 *
 * @since 0.0.1
 */
export function defineFormat(definition: FormatDefinition): Format {
    return {
        name: definition.name,
        onInput(input) {
            const { normalizedValue, rawToNormalized } = runNormalize(
                definition,
                input
            );
            const { formattedValue, normalizedToFormatted } = runFormat(
                definition,
                normalizedValue
            );
            const normalizedSelectionStart = resolveSelectionBoundary(
                rawToNormalized,
                input.selectionStart
            );
            const normalizedSelectionEnd = resolveSelectionBoundary(
                rawToNormalized,
                input.selectionEnd
            );

            return {
                formattedValue,
                selectionStart: resolveSelectionBoundary(
                    normalizedToFormatted,
                    normalizedSelectionStart
                ),
                selectionEnd: resolveSelectionBoundary(
                    normalizedToFormatted,
                    normalizedSelectionEnd
                ),
            };
        },
        onBlur(input) {
            const { normalizedValue } = runNormalize(definition, input);
            const { formattedValue } = runFormat(definition, normalizedValue);
            const { blurredValue } = runBlur(definition, formattedValue);

            return {
                formattedValue: blurredValue,
                selectionStart: null,
                selectionEnd: null,
            };
        },
    };
}
