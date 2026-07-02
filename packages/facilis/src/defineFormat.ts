import type { FormatDefinition, Format } from './types';
import resolveLiteralDeletionSelection from './resolveLiteralDeletionSelection';
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
            const defaultSelectionStart = resolveSelectionBoundary(
                normalizedToFormatted,
                normalizedSelectionStart
            );
            const defaultSelectionEnd = resolveSelectionBoundary(
                normalizedToFormatted,
                normalizedSelectionEnd
            );
            const literalDeletionResult = resolveLiteralDeletionSelection(
                input,
                formattedValue
            );

            return {
                formattedValue:
                    literalDeletionResult?.formattedValue ?? formattedValue,
                selectionStart:
                    literalDeletionResult?.selectionStart ??
                    defaultSelectionStart,
                selectionEnd:
                    literalDeletionResult?.selectionEnd ??
                    defaultSelectionEnd,
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
